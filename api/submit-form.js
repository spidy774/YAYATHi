/**
 * SCOPE Club — /api/submit-form  (Vercel serverless function)
 *
 * Handles both Contact and Join Us form submissions.
 * Forwards the submission to the club email via the configured
 * email service.
 *
 * For AWS Lambda + SES deployment see lambda/contact/index.js.
 *
 * SETUP OPTIONS (choose one):
 *
 * Option A — Resend (simplest, free tier available):
 *   1. Sign up at resend.com, verify your sending domain.
 *   2. Add env var: RESEND_API_KEY
 *   3. Uncomment the Resend block below.
 *
 * Option B — SendGrid:
 *   1. Sign up at sendgrid.com, verify sender.
 *   2. Add env var: SENDGRID_API_KEY
 *   3. Uncomment the SendGrid block below.
 *
 * Option C — Formspree (no backend code needed):
 *   Point the HTML <form action="..."> to your Formspree endpoint.
 *   Remove this file entirely.
 *
 * ENVIRONMENT VARIABLES:
 *   EMAIL_SERVICE      "resend" | "sendgrid" | "none"  (default: "none")
 *   RESEND_API_KEY     API key from resend.com
 *   SENDGRID_API_KEY   API key from sendgrid.com
 *   FROM_EMAIL         Verified sender, e.g. noreply@scope-mlrit.com
 *   CONTACT_TO_EMAIL   Destination, default scopeclub@mlrinstitutions.ac.in
 */

"use strict";

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "scopeclub@mlrinstitutions.ac.in";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@scope-mlrit.com";
const SERVICE = process.env.EMAIL_SERVICE || "none";

/* ── Input validation ── */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function validate(body) {
  const { name, email, message } = body || {};
  if (!name || typeof name !== "string" || !name.trim())
    return "Name is required.";
  if (!email || !EMAIL_RE.test(String(email).trim()))
    return "A valid email address is required.";
  if (!message || typeof message !== "string" || !message.trim())
    return "Message is required.";
  if (message.length > 5000)
    return "Message is too long (max 5000 characters).";
  return null;
}

/* ── Simple rate limiter ── */
const _rl = new Map();
function limited(ip) {
  const now = Date.now();
  const ts = (_rl.get(ip) || []).filter((t) => now - t < 60_000);
  ts.push(now);
  _rl.set(ip, ts);
  return ts.length > 5;
}

/* ── Email helpers ── */
function buildSubject(body) {
  return body.formType === "join"
    ? `[SCOPE Join Application] ${body.name}`
    : `[SCOPE Contact] Message from ${body.name}`;
}

function buildText(body) {
  if (body.formType === "join") {
    return (
      `New SCOPE Club join application\n\n` +
      `Name:   ${body.name}\nEmail:  ${body.email}\n` +
      `Year:   ${body.year || "—"}\nDomain: ${body.domain || "—"}\n\n` +
      `Why join:\n${body.why || "—"}`
    );
  }
  return (
    `New SCOPE contact message\n\nName:  ${body.name}\nEmail: ${body.email}\n\n${body.message}`
  );
}

async function sendViaResend(subject, text, replyTo) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: replyTo,
      subject,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend API error ${res.status}`);
}

async function sendViaSendGrid(subject, text, replyTo) {
  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: TO_EMAIL }] }],
      from: { email: FROM_EMAIL },
      reply_to: { email: replyTo },
      subject,
      content: [{ type: "text/plain", value: text }],
    }),
  });
  if (!res.ok) throw new Error(`SendGrid API error ${res.status}`);
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Handler                                                              */
/* ═══════════════════════════════════════════════════════════════════ */
export default async function handler(req, res) {
  const allowedOrigin = process.env.ALLOWED_ORIGINS || "*";
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed." });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown";
  if (limited(ip)) return res.status(429).json({ success: false, error: "Too many requests." });

  const body = req.body || {};
  const error = validate(body);
  if (error) return res.status(400).json({ success: false, error });

  /* No email service configured */
  if (SERVICE === "none") {
    return res.status(503).json({
      success: false,
      error: "The contact form backend is not yet configured. Please email scopeclub@mlrinstitutions.ac.in directly.",
    });
  }

  const subject = buildSubject(body);
  const text = buildText(body);
  const replyTo = body.email.trim();

  try {
    if (SERVICE === "resend") await sendViaResend(subject, text, replyTo);
    if (SERVICE === "sendgrid") await sendViaSendGrid(subject, text, replyTo);
  } catch (err) {
    console.error("[api/submit-form.js] Send error:", err.message);
    return res.status(502).json({
      success: false,
      error: "Unable to deliver your message. Please email scopeclub@mlrinstitutions.ac.in directly.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Your message has been received. We'll reply to your email soon.",
  });
}
