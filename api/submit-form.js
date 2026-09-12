/* ============================================================
   /api/submit-form — placeholder form handler.
   Wire this up to whatever you use to receive Contact/Join
   submissions: forward to email (e.g. via Resend/SendGrid), save
   to a sheet/database, or just proxy to a service like Formspree
   instead of writing this yourself. Until real logic is added,
   this returns success without sending anywhere — replace before
   launch so submissions aren't silently dropped.
   ============================================================ */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = req.body || {};
  if (!payload.email && !payload.name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // TODO: send `payload` somewhere real (email service, DB, Formspree proxy, etc.)
  console.log("Form submission received (not yet forwarded anywhere):", payload);

  return res.status(200).json({ ok: true });
}
