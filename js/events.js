/* ============================================================
   EVENTS PAGE — tabs filter + accessible modal
   Modal shows: primary image, screenshot gallery, About section,
   verified event details. No content is fabricated.
   ============================================================ */

let _lastFocusedEl = null;
let _modalKeyHandler = null;

/* ============================================================
   RENDER GRID
   ============================================================ */
function renderEvents(status) {
  const grid = document.getElementById("events-grid");
  if (!grid) return;

  const visible = SCOPE_EVENTS.filter((e) => getEventStatus(e) === status);

  if (visible.length) {
    grid.innerHTML = visible.map(eventCardHTML).join("");
    /* Immediately visible — no scroll-reveal delay after a tab switch */
    grid.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  } else {
    const labels = {
      active: "active events",
      upcoming: "upcoming events",
      past: "past events",
    };
    grid.innerHTML = `
      <div class="empty-state" role="status">
        No ${labels[status] || status} right now — check back soon.
      </div>`;
  }
}

/* ============================================================
   TABS
   ============================================================ */
function initEventTabs() {
  const tabs = document.querySelectorAll(".tab[data-status]");
  if (!tabs.length) return;

  function selectTab(tab) {
    tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");
    renderEvents(tab.dataset.status);
    try { history.replaceState(null, "", `?tab=${tab.dataset.status}`); }
    catch (_) { /* Safari file:// safety */ }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      const list = Array.from(tabs);
      const idx = list.indexOf(tab);
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        list[(idx + 1) % list.length].focus();
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        list[(idx - 1 + list.length) % list.length].focus();
      }
    });
  });

  const params = new URLSearchParams(location.search);
  const initial = params.get("tab") || "active";
  const startTab = Array.from(tabs).find((t) => t.dataset.status === initial) || tabs[0];
  selectTab(startTab);
}

/* ============================================================
   MODAL — OPEN
   ============================================================ */
function openEventModal(eventId) {
  const event = SCOPE_EVENTS.find((e) => e.id === eventId);
  if (!event) return;

  _lastFocusedEl = document.activeElement;

  const backdrop = document.getElementById("event-modal-backdrop");
  const status = getEventStatus(event);

  /* ---- Date string ---- */
  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : start;
  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();
  let dateStr;
  if (sameMonth && start.getDate() !== end.getDate()) {
    dateStr = `${start.getDate()}–${end.getDate()} ${start.toLocaleString("en-IN", { month: "long" })} ${start.getFullYear()}`;
  } else {
    dateStr = start.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }

  /* ---- Status badge ---- */
  const badge =
    status === "active"
      ? `<span class="badge live"><span class="dot" aria-hidden="true"></span> LIVE NOW</span>`
      : status === "upcoming"
        ? `<span class="badge upcoming">UPCOMING</span>`
        : `<span class="badge past">PAST</span>`;

  /* ---- Tags ---- */
  const tagsHTML = (event.tags || [])
    .map((t) => `<span class="badge" style="color:var(--text-muted);border-color:var(--border-mid);">${t}</span>`)
    .join("");

  /* ---- Screenshot gallery ---- */
  /* Collect screenshots array, exclude any path that matches the banner */
  const galleryImages = [];
  const seen = new Set([event.bannerUrl]);

  (event.screenshots || []).forEach((src, i) => {
    if (src && !seen.has(src)) {
      seen.add(src);
      galleryImages.push({ src, alt: `${event.title} — photo ${i + 1}` });
    }
  });

  const screenshotsHTML =
    galleryImages.length > 0
      ? `<div class="modal-screenshots" aria-label="Event photos">
           ${galleryImages
        .map(
          (img) =>
            `<img src="${img.src}"
                       alt="${img.alt}"
                       loading="lazy"
                       tabindex="0"
                       role="button"
                       aria-label="View full size: ${img.alt}" />`
        )
        .join("")}
         </div>`
      : "";

  /* ---- External link ---- */
  const externalBtn = event.externalUrl
    ? `<div class="modal-actions">
         <a class="btn btn-primary"
            href="${event.externalUrl}"
            target="_blank"
            rel="noopener noreferrer">
           More Details ↗
         </a>
       </div>`
    : "";

  /* ---- Inject modal HTML ---- */
  backdrop.innerHTML = `
    <div class="modal"
         role="dialog"
         aria-modal="true"
         aria-labelledby="modal-event-title"
         tabindex="-1">

      <button class="modal-close"
              id="modal-close-btn"
              aria-label="Close event details">✕</button>

      <!-- Primary image -->
      <div class="modal-primary-media">
        <img src="${event.bannerUrl}"
             alt="${event.title} event poster"
             loading="eager" />
      </div>

      <div class="modal-body">

        <!-- Meta row -->
        <div class="card-meta" style="margin-bottom:0.9em;gap:0.6em;">
          ${badge}
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            ${dateStr}
          </span>
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${event.location}
          </span>
        </div>

        <!-- Title -->
        <h2 id="modal-event-title" style="margin-bottom:0.5em;">${event.title}</h2>

        <!-- Tags -->
        ${tagsHTML ? `<div class="modal-tags" aria-label="Event tags" style="margin-bottom:1.25em;">${tagsHTML}</div>` : ""}

        <!-- Screenshot gallery (only when real screenshots are supplied) -->
        ${galleryImages.length > 0 ? `<div class="modal-about" style="margin-top:1.25rem;padding-top:1.25rem;">
          <p class="modal-about-label">// event photos</p>
          <p class="gallery-hint" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Click any photo to view full size
          </p>
          ${screenshotsHTML}
        </div>` : ""}

        <!-- About section -->
        <div class="modal-about">
          <p class="modal-about-label">// about this event</p>
          <p>${event.fullDescription}</p>
        </div>

        <!-- External link -->
        ${externalBtn}

      </div>
    </div>
  `;

  /* Open + lock scroll */
  backdrop.classList.add("is-open");
  document.body.style.overflow = "hidden";

  /* Focus close button after paint */
  const modal = backdrop.querySelector(".modal");
  const closeBtn = backdrop.querySelector("#modal-close-btn");
  setTimeout(() => closeBtn && closeBtn.focus(), 40);

  /* Close handlers */
  closeBtn.addEventListener("click", closeEventModal, { once: true });
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeEventModal();
  });

  /* Keyboard: Escape + focus trap */
  _modalKeyHandler = function trapFocus(e) {
    if (e.key === "Escape") { closeEventModal(); return; }
    if (e.key !== "Tab") return;

    const focusable = modal.querySelectorAll(
      'button:not([disabled]), a[href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  };
  document.addEventListener("keydown", _modalKeyHandler);
}

/* ============================================================
   MODAL — CLOSE
   ============================================================ */
function closeEventModal() {
  const backdrop = document.getElementById("event-modal-backdrop");
  if (!backdrop) return;
  backdrop.classList.remove("is-open");
  document.body.style.overflow = "";
  if (_modalKeyHandler) {
    document.removeEventListener("keydown", _modalKeyHandler);
    _modalKeyHandler = null;
  }
  if (_lastFocusedEl) {
    _lastFocusedEl.focus();
    _lastFocusedEl = null;
  }
}

/* ============================================================
   DELEGATED MODAL TRIGGER
   Handles clicks on [data-open-modal] anywhere in the document,
   including the card back-face click trigger.
   ============================================================ */
function initEventModalDelegation() {
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-open-modal]");
    if (trigger) openEventModal(trigger.dataset.openModal);
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initEventTabs();
  initEventModalDelegation();
});
