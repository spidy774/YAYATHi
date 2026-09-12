/* ============================================================
   /api/chat — Vercel serverless function.
   Deploy this file at api/chat.js in a Vercel project (or adapt
   the handler body to Netlify Functions / AWS Lambda — the
   Anthropic call itself is identical).

   SETUP:
   1. In the Vercel dashboard: Project Settings → Environment
      Variables → add ANTHROPIC_API_KEY (server-side only, never
      exposed to the browser).
   2. Deploy. Vercel auto-detects anything in /api as a function.
   3. The chat widget (js/chatbot.js) already POSTs to /api/chat.

   This function grounds the bot in the club's own real data
   (team/events/resources) so it can't invent facts about SCOPE
   Club — replace the placeholder text below with the same
   verified content used in js/data.js once that's finalized.
   ============================================================ */

const SYSTEM_PROMPT = `You are the SCOPE Club help assistant on the club's website.
Only answer questions about SCOPE Club: events, joining, resources, and general club info.
If you don't know something from the information below, say so plainly and point the
person to the Contact page — never invent facts, names, dates, or links.

CLUB INFO (verified — replace/expand this block with real content):
- SCOPE Club is an engineering/technology student club.
- Pages: Home, Team, Events, Resources, Contact Us, Join Us.
- To join, visit the Join Us page and complete the application.
- Events are shown on the Events page under Active/Upcoming/Past tabs.
- Resource categories: AppDev, Python, Frontend, Backend, ML, Git, DevOps, Android (Kotlin), iOS (Swift).
`;

// Simple in-memory rate limit per serverless instance (best-effort only —
// use a real store like Upstash/Redis if you need this enforced across
// all instances / restarts).
const requestLog = new Map();
const RATE_LIMIT = 10; // requests
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = requestLog.get(ip) || [];
  const recent = entry.filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests — please wait a moment." });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  // Cap history sent to the model to keep requests small and cheap
  const trimmed = messages.slice(-12);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", errText);
      return res.status(502).json({ error: "Upstream chat service error" });
    }

    const data = await response.json();
    const reply = data.content
      ?.filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return res.status(200).json({ reply: reply || "Sorry, I couldn't generate a reply." });
  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
