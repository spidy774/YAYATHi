/**
 * SCOPE Club — Contact Form Lambda Handler
 * Route: POST /contact  (via API Gateway)
 *
 * Architecture:
 *   Browser → API Gateway → THIS Lambda → Amazon SES → club inbox
 *
 * The Lambda uses the IAM execution role to call SES — no SMTP
 * credentials or API keys are stored in environment variables.
 *
 * Environment variables (set in Lambda configuration):
 *   SES_REGION        AWS region where SES is configured, e.g. ap-south-1
 *   SES_FROM_EMAIL    Verified SES sender address, e.g. noreply@scope-mlrit.com
 *                     (must be verified in SES before use)
 *   CONTACT_TO_EMAIL  Destination address, e.g. scopeclub@mlrinstitutions.ac.in
 *   ALLOWED_ORIGINS   Comma-separated allowed origins (same as chat Lambda)
 *
 * SES SETUP CHECKLIST (see DEPLOY.md for full instructions):
 *   1. Request SES production access (exit sandbox) or add verified addresses.
 *   2. Verify SES_FROM_EMAIL in the SES console.
 *   3. Attach the ses:SendEmail IAM policy to the Lambda execution role.
 */

"use strict";

const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const { buildCorsHeaders, preflight } = require("../shared/cors");
const { validateContactBody }         = require("../shared/validate");
const { checkRateLimit }              = require("../shared/rateLimit");

/* ── SES client (created once, reused across warm invocations) ── */
const sesClient = new SESClient({
  region: process.env.SES_REGION || "ap-south-1",
});

const FROM_EMAIL = process.env.SES_FROM_EMAIL  || "";
const TO_EMAIL   = process.env.CONTACT_TO_EMAIL || "scopeclub@mlrinstitutions.ac.in";

/* ── Simple HTML email template ── */
function buildEmailBody(fields) {
  const { name, email, message, formType, year, domain, why } = fields;

  if (formType === "join") {
    return {
      subject: `[SCOPE Join Application] ${name}`,
      text:
        `New SCOPE Club join application\n\n` +
        `Name:    ${name}\n` +
        `Email:   ${email}\n` +
        `Year:    ${year || "(not provided)"}\n` +
        `Domain:  ${domain || "(not provided)"}\n` +
        `Why:     ${why || "(not provided)"}\n`,
      html:
        `<h2>New SCOPE Club Join Application</h2>` +
        `<table><tbody>` +
        `<tr><th>Name</th><td>${escHtml(name)}</td></tr>` +
        `<tr><th>Email</th><td>${escHtml(email)}</td></tr>` +
        `<tr><th>Year</th><td>${escHtml(year || "—")}</td></tr>` +
        `<tr><th>Domain</th><td>${escHtml(domain || "—")}</td></tr>` +
        `<tr><th>Why join</th><td style="white-space:pre-wrap">${escHtml(why || "—")}</td></tr>` +
        `</tbody></table>`,
    };
  }

  return {
    subject: `[SCOPE Contact] Message from ${name}`,
    text:
      `New message via the SCOPE Club contact form\n\n` +
      `Name:    ${name}\n` +
      `Email:   ${email}\n\n` +
      `Message:\n${message}`,
    html:
      `<h2>New SCOPE Club Contact Message</h2>` +
      `<table><tbody>` +
      `<tr><th>Name</th><td>${escHtml(name)}</td></tr>` +
      `<tr><th>Email</th><td>${escHtml(email)}</td></tr>` +
      `</tbody></table>` +
      `<h3>Message</h3>` +
      `<p style="white-space:pre-wrap">${escHtml(message)}</p>`,
  };
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ═══════════════════════════════════════════════════════════════════ */
/* Lambda Handler                                                       */
/* ═══════════════════════════════════════════════════════════════════ */
exports.handler = async (event) => {
  const requestOrigin = event.headers?.origin || event.headers?.Origin || "";
  const corsHeaders   = buildCorsHeaders(requestOrigin);

  /* ── CORS preflight ── */
  if (event.httpMethod === "OPTIONS" || event.requestContext?.http?.method === "OPTIONS") {
    return preflight(requestOrigin);
  }

  /* ── Only accept POST ── */
  const method = event.httpMethod || event.requestContext?.http?.method;
  if (method !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: "Method not allowed." }),
    };
  }

  /* ── Rate limiting ── */
  const ip = event.requestContext?.identity?.sourceIp
    || event.requestContext?.http?.sourceIp
    || "unknown";

  if (checkRateLimit(ip, 5, 60_000)) {
    return {
      statusCode: 429,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: "Too many requests — please wait a moment before trying again.",
      }),
    };
  }

  /* ── Parse + validate body ── */
  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : (event.body || {});
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: "Request body must be valid JSON." }),
    };
  }

  const validation = validateContactBody(body);
  if (!validation.ok) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: validation.error }),
    };
  }

  /* ── Guard: SES_FROM_EMAIL must be configured ── */
  if (!FROM_EMAIL) {
    console.error("[contact/index.js] SES_FROM_EMAIL env var is not set.");
    return {
      statusCode: 503,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: "Contact form is not yet configured. Please email scopeclub@mlrinstitutions.ac.in directly.",
      }),
    };
  }

  /* ── Build and send email via SES ── */
  const { subject, text, html } = buildEmailBody(body);

  const sendCommand = new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: { ToAddresses: [TO_EMAIL] },
    ReplyToAddresses: [body.email.trim()],
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Text: { Data: text,  Charset: "UTF-8" },
        Html: { Data: html,  Charset: "UTF-8" },
      },
    },
  });

  try {
    await sesClient.send(sendCommand);
  } catch (err) {
    console.error("[contact/index.js] SES send error:", err.name, err.message);
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: "Unable to deliver your message right now. Please email scopeclub@mlrinstitutions.ac.in directly.",
      }),
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({
      success: true,
      message: "Your message has been received. We'll reply to your email soon.",
    }),
  };
};
