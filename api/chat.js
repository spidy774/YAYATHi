/**
 * SCOPE Club — /api/chat  (Vercel serverless function)
 *
 * This is the Vercel-hosted version of the chat backend.
 * For AWS Lambda deployment, see lambda/chat/index.js instead.
 *
 * The function calls the Anthropic API (Claude) to power the SCOPE
 * AI assistant. The API key is stored as a server-side environment
 * variable — it is NEVER exposed to the browser.
 *
 * SETUP (Vercel):
 *   1. Push this project to GitHub.
 *   2. Import at vercel.com → Project Settings → Environment Variables.
 *   3. Add: ANTHROPIC_API_KEY  (server-side only)
 *   4. Deploy. The function is available at /api/chat automatically.
 *
 * REQUEST:
 *   POST /api/chat
 *   Content-Type: application/json
 *   { "message": "...", "conversation": [{ "role": "user"|"assistant", "content": "..." }] }
 *
 * RESPONSE:
 *   200  { "success": true,  "reply": "..." }
 *   4xx  { "success": false, "error": "..." }
 *   5xx  { "success": false, "error": "..." }
 */

"use strict";

/* ── System prompt — mirrors lambda/chat/index.js ── */
const SYSTEM_PROMPT = `You are the SCOPE Club help assistant embedded in the SCOPE Club website.

SCOPE Club is the official technical student club of MLR Institute of Technology (MLRIT), Hyderabad.
SCOPE stands for School of Programming Excellence.

YOUR JOB:
- Answer questions about SCOPE Club, its events, resources, how to join, and how to navigate the site.
- Be concise, technically accurate, and friendly — you are speaking to engineering students.
- Never invent facts, names, dates, URLs, statistics, or achievements not listed below.
- If you genuinely don't know something, say so plainly and direct the user to contact the club directly.

VERIFIED CLUB INFORMATION:
- Founded to build a strong coding culture at MLRIT.
- Technical areas: Web Development, App Development, AI/ML, Cloud Computing, Game Development, Open Source.
- The club runs hackathons, coding contests, cloud workshops, and flagship events.
- Past events: ZENITH '25 (Dec 2025), AWS Cloud Workshop (Oct 2025), __init__ Saga (Apr 2025, ₹20,000 prize), ZENITH 24 – DataVoyage (Nov 2024).
- Current active event: AWS Cloud Trek 2026 — 11–12 September 2026, MLRIT Hyderabad. 2-day bootcamp and contest on agentic engineering, run by AWS Student Builder Group × SCOPE Club.
- Contact: scopeclub@mlrinstitutions.ac.in
- Instagram: @mlrit_scope  |  LinkedIn: SCOPE Club MLRIT  |  GitHub: github.com/scopeclub  |  X: @MlritScope
- Location: MT 003-SCOPE CLUB, MLRIT, Dundigal Police Station Road, Hyderabad - 500 043, Telangana, India.

SITE NAVIGATION:
- Home (index.html) — overview, hero event, About section, What We Do, Why Join
- Events (events.html) — Active / Upcoming / Past tabs
- Resources (resources.html) — curated learning links by category
- Team (team.html) — team structure (profiles coming soon)
- Contact (contact.html) — email, address, social links, contact form
- Join Us (join.html) — application form for MLRIT students

DO NOT invent team member names, statistics, partnerships, or links not listed above.
`;

/* ── Simple in-memory rate limiter ── */
const _rateLimitMap = new Map();
function isRateLimited(ip, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const hits = (_rateLimitMap.get(ip) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  _rateLimitMap.set(ip, hits);
  return hits.length > limit;
}

/* ── Input validation ── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function validateBody(body) {
  if (!body || typeof body !== "object") return "Request body must be a JSON object.";
  const { message, conversation } = body;
  if (typeof message !== "string" || !message.trim()) return "message must be a non-empty string.";
  if (message.length > 1000) return "message must be 1000 characters or fewer.";
  if (conversation !== undefined) {
    if (!Array.isArray(conversation)) return "conversation must be an array.";
    if (conversation.length > 40) return "conversation history too long (max 40 turns).";
    for (const t of conversation) {
      if (typeof t.role !== "string" || typeof t.content !== "string") {
        return "Each conversation turn needs role (string) and content (string).";
      }
    }
  }
  return null; // valid
}

export default async function handler(req, res) {
  /* CORS headers — tighten ALLOWED_ORIGINS in production */
  const allowedOrigin = process.env.ALLOWED_ORIGINS || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed." });

  /* Rate limit */
  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ success: false, error: "Too many requests — please wait a moment." });
  }

  /* Validate */
  const validationError = validateBody(req.body);
  if (validationError) return res.status(400).json({ success: false, error: validationError });

  /* Build messages */
  const history = (req.body.conversation || []).slice(-10);
  const messages = [
    ...history.map((t) => ({ role: t.role, content: t.content })),
    { role: "user", content: req.body.message.trim() },
  ];

  /* Call Anthropic */
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({
      success: false,
      error: "SCOPE AI is not configured on this server.",
    });
  }

  let reply;
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[api/chat.js] Anthropic error:", response.status, text);
      return res.status(502).json({ success: false, error: "Unable to reach SCOPE AI right now." });
    }

    const data = await response.json();
    reply = data.content
      ?.filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!reply) throw new Error("Empty model response.");
  } catch (err) {
    console.error("[api/chat.js] Handler error:", err.message);
    return res.status(500).json({
      success: false,
      error: "SCOPE AI is temporarily unavailable. Please try again shortly.",
    });
  }

  return res.status(200).json({ success: true, reply });
}
