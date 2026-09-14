/**
 * SCOPE Club — Simple in-process rate limiter.
 *
 * This is a best-effort, per-Lambda-instance counter suitable for
 * low-to-moderate traffic. For strict enforcement across concurrent
 * Lambda instances use a shared store such as:
 *   - Amazon ElastiCache (Redis) via VPC
 *   - AWS DynamoDB with TTL attributes
 *   - Upstash Redis (serverless-friendly)
 *
 * Usage:
 *   const { checkRateLimit } = require("../shared/rateLimit");
 *
 *   const limited = checkRateLimit(ip);
 *   if (limited) return { statusCode: 429, ... };
 */

const buckets = new Map();

/**
 * @param {string} key      Typically the caller's IP address.
 * @param {number} limit    Max requests per window (default: 20).
 * @param {number} windowMs Window size in ms (default: 60 seconds).
 * @returns {boolean}       true if the caller should be rate-limited.
 */
function checkRateLimit(key, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const timestamps = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  buckets.set(key, timestamps);

  // Occasionally prune old entries to prevent unbounded memory growth
  if (buckets.size > 5000) {
    for (const [k, ts] of buckets) {
      if (ts.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }

  return timestamps.length > limit;
}

module.exports = { checkRateLimit };
