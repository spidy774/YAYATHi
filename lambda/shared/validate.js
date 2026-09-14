/**
 * SCOPE Club — Shared input validation helpers.
 * Used by both the chat and contact Lambda handlers.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validate the chat request body.
 * Returns { ok: true } or { ok: false, error: string }.
 */
function validateChatBody(body) {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const { message, conversation } = body;

  if (typeof message !== "string" || message.trim().length === 0) {
    return { ok: false, error: "message must be a non-empty string." };
  }
  if (message.length > 1000) {
    return { ok: false, error: "message must be 1000 characters or fewer." };
  }

  if (conversation !== undefined) {
    if (!Array.isArray(conversation)) {
      return { ok: false, error: "conversation must be an array." };
    }
    if (conversation.length > 40) {
      return { ok: false, error: "conversation history too long (max 40 turns)." };
    }
    for (const turn of conversation) {
      if (typeof turn.role !== "string" || typeof turn.content !== "string") {
        return { ok: false, error: "Each conversation turn must have role and content strings." };
      }
      if (!["user", "assistant"].includes(turn.role)) {
        return { ok: false, error: "conversation roles must be 'user' or 'assistant'." };
      }
    }
  }

  return { ok: true };
}

/**
 * Validate the contact/join form request body.
 * Returns { ok: true } or { ok: false, error: string }.
 */
function validateContactBody(body) {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const { name, email, message } = body;

  if (typeof name !== "string" || name.trim().length === 0) {
    return { ok: false, error: "name is required." };
  }
  if (name.length > 200) {
    return { ok: false, error: "name too long (max 200 characters)." };
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return { ok: false, error: "A valid email address is required." };
  }
  if (email.length > 320) {
    return { ok: false, error: "email too long." };
  }

  if (typeof message !== "string" || message.trim().length === 0) {
    return { ok: false, error: "message is required." };
  }
  if (message.length > 5000) {
    return { ok: false, error: "message too long (max 5000 characters)." };
  }

  return { ok: true };
}

module.exports = { validateChatBody, validateContactBody };
