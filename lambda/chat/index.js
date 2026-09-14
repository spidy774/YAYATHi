/**
 * SCOPE Club — Chat Lambda Handler
 * Route: POST /chat  (via API Gateway HTTP API or REST API)
 *
 * Architecture:
 *   Browser → CloudFront/S3 (static site)
 *           → API Gateway → THIS Lambda → AWS Bedrock (Claude)
 *
 * The Lambda uses the IAM execution role to call Bedrock — NO API keys
 * are stored in environment variables or code. Attach the required IAM
 * policy (see lambda/DEPLOY.md) to the Lambda execution role.
 *
 * Environment variables (set in Lambda configuration):
 *   BEDROCK_REGION   AWS region where Bedrock is enabled, e.g. us-east-1
 *   BEDROCK_MODEL_ID Bedrock model ID, e.g. anthropic.claude-3-5-sonnet-20241022-v2:0
 *   ALLOWED_ORIGINS  Comma-separated allowed origins, e.g. https://scope-mlrit.com
 *                    Defaults to "*" (restrict before production)
 */

"use strict";

const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");

const { buildCorsHeaders, preflight } = require("../shared/cors");
const { validateChatBody }            = require("../shared/validate");
const { checkRateLimit }              = require("../shared/rateLimit");

/* ── Bedrock client (created once, reused across warm invocations) ── */
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || "us-east-1",
});

/* ── Model config ── */
const MODEL_ID   = process.env.BEDROCK_MODEL_ID
  || "anthropic.claude-3-5-sonnet-20241022-v2:0";
const MAX_TOKENS = 500;

/* ── System prompt — grounded in verified SCOPE data ── */
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
- Events (events.html) — Active / Upcoming / Past tabs with event cards and modals
- Resources (resources.html) — curated learning links by category
- Team (team.html) — team structure (profiles coming soon)
- Contact (contact.html) — email, address, social links, contact form
- Join Us (join.html) — application form for MLRIT students

DO NOT:
- Invent team member names, board members, or roles.
- State any specific statistics (member counts, placement figures, etc.) not listed above.
- Suggest that the club has partnerships, certifications, or sponsors beyond what is stated.
- Provide external links except the verified social links listed above.
`;

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

  /* ── Rate limiting by source IP ── */
  const ip = event.requestContext?.identity?.sourceIp
    || event.requestContext?.http?.sourceIp
    || "unknown";

  if (checkRateLimit(ip, 20, 60_000)) {
    return {
      statusCode: 429,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: "Too many requests — please wait a moment and try again.",
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

  const validation = validateChatBody(body);
  if (!validation.ok) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: validation.error }),
    };
  }

  /* ── Build Bedrock messages array ── */
  const history = (body.conversation || []).slice(-10); // last 10 turns max
  const messages = [
    ...history.map((turn) => ({ role: turn.role, content: turn.content })),
    { role: "user", content: body.message.trim() },
  ];

  /* ── Call Bedrock ── */
  const bedrockPayload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: MAX_TOKENS,
    system: SYSTEM_PROMPT,
    messages,
  };

  let reply;
  try {
    const command  = new InvokeModelCommand({
      modelId:     MODEL_ID,
      contentType: "application/json",
      accept:      "application/json",
      body:        JSON.stringify(bedrockPayload),
    });

    const response     = await bedrockClient.send(command);
    const responseBody = JSON.parse(Buffer.from(response.body).toString("utf-8"));

    reply = responseBody.content
      ?.filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!reply) throw new Error("Empty response from model.");
  } catch (err) {
    /* Log the error server-side but never expose internal details to the client */
    console.error("[chat/index.js] Bedrock error:", err.name, err.message);

    const isServiceError = err.name === "ServiceUnavailableException"
      || err.name === "ThrottlingException"
      || err.$metadata?.httpStatusCode >= 500;

    return {
      statusCode: isServiceError ? 503 : 502,
      headers: corsHeaders,
      body: JSON.stringify({
        success: false,
        error: isServiceError
          ? "SCOPE AI is temporarily unavailable. Please try again shortly."
          : "Unable to get a response from SCOPE AI right now.",
      }),
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ success: true, reply }),
  };
};
