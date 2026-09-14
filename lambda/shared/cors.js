/**
 * SCOPE Club — Shared CORS helper for Lambda functions.
 *
 * Usage:
 *   const { cors, corsHeaders, preflight } = require("../shared/cors");
 *
 *   exports.handler = async (event) => {
 *     if (event.httpMethod === "OPTIONS") return preflight();
 *     // ... your logic ...
 *     return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({...}) };
 *   };
 */

/**
 * Allowed origins. For production restrict this to your real domain(s).
 * Reads ALLOWED_ORIGINS env var as comma-separated list if set:
 *   e.g. ALLOWED_ORIGINS=https://scope.mlrinstitutions.ac.in,https://www.scope-mlrit.com
 */
function getAllowedOrigins() {
  const env = process.env.ALLOWED_ORIGINS;
  if (env) return env.split(",").map((o) => o.trim());
  // Fallback defaults — tighten before production
  return ["*"];
}

/**
 * Build CORS headers for a given request origin.
 * Returns "*" when ALLOWED_ORIGINS is "*" (dev/demo mode).
 * Returns the specific origin when it's on the allowlist, otherwise omits
 * the Access-Control-Allow-Origin header (browser will block the request).
 */
function buildCorsHeaders(requestOrigin) {
  const allowed = getAllowedOrigins();

  let allowOrigin;
  if (allowed.includes("*")) {
    allowOrigin = "*";
  } else if (requestOrigin && allowed.includes(requestOrigin)) {
    allowOrigin = requestOrigin;
  } else {
    // Unknown origin — return headers without Allow-Origin so browser blocks it.
    // The Lambda still responds 200 but the browser enforces the CORS policy.
    allowOrigin = null;
  }

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
  if (allowOrigin) {
    headers["Access-Control-Allow-Origin"] = allowOrigin;
  }
  return headers;
}

/**
 * Standard OPTIONS preflight response.
 */
function preflight(requestOrigin) {
  return {
    statusCode: 204,
    headers: buildCorsHeaders(requestOrigin),
    body: "",
  };
}

module.exports = { buildCorsHeaders, preflight };
