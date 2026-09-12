/* ============================================================
   SCOPE CLUB — FORMS
   Validation + honest fallback behaviour for Contact and Join.

   The form backend (/api/submit-form) is NOT wired up in the
   static S3 build. When no backend is reachable, the form shows
   a clear fallback message with a direct email link rather than
   pretending the submission succeeded.

   To connect a real backend:
     1. Deploy api/submit-form.js as a Lambda + API Gateway endpoint.
     2. Replace the FORM_ENDPOINT constant below with your real URL.
     3. Remove the STATIC_DEMO_MODE flag.
   ============================================================ */

const FORM_ENDPOINT = "/api/submit-form";  /* Relative — update for production Lambda URL */
const STATIC_DEMO_MODE = true;              /* Set to false when a real backend is deployed */

/* ---------- Validation ---------- */
function validateNativeField(def, input) {
  const value = (input.value || "").trim();
  if (def.required && !value) return `${def.label} is required.`;
  if (def.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Enter a valid email address.";
  }
  return null;
}

/* ---------- Status helper ---------- */
function setFormStatus(statusEl, mode, message) {
  if (!statusEl) return;
  statusEl.className = `form-status is-visible ${mode}`;
  statusEl.textContent = message;
}

function clearFormStatus(statusEl) {
  if (!statusEl) return;
  statusEl.className = "form-status";
  statusEl.textContent = "";
}

/* ---------- Main initialiser ---------- */
/*
 * fieldDefs: array of { id, label, type, required }
 *   - id must match the HTML element's id attribute
 * statusEl: the .form-status div
 * noteEl:   optional fallback note paragraph (shown on static demo)
 */
function initNativeForm(formEl, fieldDefs, statusEl, noteEl) {
  if (!formEl) return;

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearFormStatus(statusEl);
    if (noteEl) noteEl.style.display = "none";

    let hasError = false;
    const payload = {};

    /* Validate all fields */
    fieldDefs.forEach((def) => {
      const input = formEl.querySelector(`#${def.id}`);
      const wrapper = input ? input.closest(".field") : null;
      const errEl = wrapper ? wrapper.querySelector(".field-error") : null;

      if (!input) return;
      const error = validateNativeField(def, input);

      if (wrapper) wrapper.classList.toggle("has-error", Boolean(error));
      if (errEl) errEl.textContent = error || "";
      if (error) hasError = true;

      payload[def.id] = (input.value || "").trim();
    });

    if (hasError) {
      setFormStatus(statusEl, "error", "Please fill in all required fields correctly.");
      /* Focus first error field */
      const firstErr = formEl.querySelector(".has-error input, .has-error textarea, .has-error select");
      if (firstErr) firstErr.focus();
      return;
    }

    /* Static demo — no backend available */
    if (STATIC_DEMO_MODE) {
      setFormStatus(statusEl, "error",
        "This form is in demo mode — no backend is connected yet.");
      if (noteEl) noteEl.style.display = "block";
      return;
    }

    /* Live submission */
    const submitBtn = formEl.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;
    setFormStatus(statusEl, "loading", "Sending…");

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setFormStatus(statusEl, "success",
        "Thanks — we received your message and will be in touch.");
      formEl.reset();

      /* Clear inline errors */
      formEl.querySelectorAll(".has-error").forEach((el) => {
        el.classList.remove("has-error");
        const err = el.querySelector(".field-error");
        if (err) err.textContent = "";
      });

    } catch (err) {
      setFormStatus(statusEl, "error",
        "Something went wrong. Please try again or email us directly.");
      if (noteEl) noteEl.style.display = "block";
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  /* Real-time clear error on input */
  fieldDefs.forEach((def) => {
    const input = formEl.querySelector(`#${def.id}`);
    if (!input) return;
    input.addEventListener("input", () => {
      const wrapper = input.closest(".field");
      if (wrapper && wrapper.classList.contains("has-error")) {
        const error = validateNativeField(def, input);
        wrapper.classList.toggle("has-error", Boolean(error));
        const errEl = wrapper.querySelector(".field-error");
        if (errEl) errEl.textContent = error || "";
      }
    });
  });
}

/* ---------- Legacy renderField (kept for compatibility) ---------- */
function renderField(field) {
  const inputEl =
    field.type === "textarea"
      ? `<textarea id="${field.id}" name="${field.id}" rows="4"></textarea>`
      : field.type === "select"
        ? `<select id="${field.id}" name="${field.id}">
           <option value="">Select…</option>
           ${(field.options || []).map((o) => `<option value="${o}">${o}</option>`).join("")}
         </select>`
        : `<input type="${field.type}" id="${field.id}" name="${field.id}" />`;

  return `
    <div class="field" data-field="${field.id}">
      <label for="${field.id}">${field.label}${field.required ? " *" : ""}</label>
      ${inputEl}
      <div class="field-error" role="alert"></div>
    </div>
  `;
}

/* ---------- Legacy initFormValidationAndSubmit (kept for compatibility) ---------- */
function initFormValidationAndSubmit(formEl, fields, statusEl) {
  const defs = fields.map((f) => ({ id: f.id, label: f.label, type: f.type, required: f.required }));
  initNativeForm(formEl, defs, statusEl, null);
}
