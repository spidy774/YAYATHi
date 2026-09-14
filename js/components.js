/* ============================================================
   SCOPE CLUB — SHARED COMPONENTS
   Nav + footer injected once. Must be served over HTTP/HTTPS
   (any static host including S3) — not from file://.
   ============================================================ */

const NAV_ITEMS = [
  { href: "index.html", label: "Home" },
  { href: "index.html#about", label: "About" },
  { href: "team.html", label: "Team" },
  { href: "events.html", label: "Events" },
  { href: "resources.html", label: "Resources" },
  { href: "contact.html", label: "Contact" },
  { href: "join.html", label: "Join Us" },
];

function renderNav(currentPage) {
  const links = NAV_ITEMS.map((item) => {
    /* Strip hash for aria-current comparison — we only mark the top-level page active */
    const pageHref = item.href.split("#")[0];
    const isCurrent = pageHref === currentPage && !item.href.includes("#");
    return `<li><a href="${item.href}"${isCurrent ? ' aria-current="page"' : ""}>${item.label}</a></li>`;
  }).join("");

  return `
    <nav class="site-nav" aria-label="Main navigation">
      <div class="container nav-inner">
        <a href="index.html" class="brand" aria-label="SCOPE Club — Home">
          <img src="assets/images/branding/scope-club-logo.jpg"
               alt="SCOPE Club logo"
               class="brand-logo"
               width="120" height="40" />
        </a>
        <ul class="nav-links" id="nav-links" role="list">${links}</ul>
        <a href="join.html" class="btn btn-primary nav-cta" aria-label="Join SCOPE Club">Join Us</a>
        <button class="nav-toggle" id="nav-toggle"
                aria-expanded="false" aria-controls="nav-links"
                aria-label="Toggle navigation menu">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>
      </div>
    </nav>
  `;
}

function renderFooter() {
  const year = new Date().getFullYear();
  return `
    <footer class="site-footer" aria-label="Site footer">
      <div class="container">
        <div class="footer-grid">

          <div class="footer-brand">
            <a href="index.html" aria-label="SCOPE Club — Home">
              <img src="assets/images/branding/scope-club-logo.jpg"
                   alt="SCOPE Club"
                   class="footer-logo"
                   width="130" height="44"
                   loading="lazy" />
            </a>
            <p class="footer-tagline">
              Official technical club of MLRIT.<br>
              School of Programming Excellence.
            </p>
            <nav class="footer-socials" aria-label="Social media links">
              <a href="${SOCIAL_LINKS.instagram}" target="_blank" rel="noopener noreferrer"
                 aria-label="Instagram — @mlrit_scope" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="${SOCIAL_LINKS.linkedin}" target="_blank" rel="noopener noreferrer"
                 aria-label="LinkedIn" title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="${SOCIAL_LINKS.github}" target="_blank" rel="noopener noreferrer"
                 aria-label="GitHub — scopeclub" title="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </a>
              <a href="${SOCIAL_LINKS.x}" target="_blank" rel="noopener noreferrer"
                 aria-label="X (Twitter) — @MlritScope" title="X / Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </nav>
          </div>

          <div class="footer-nav-col">
            <h3 class="footer-heading">Navigate</h3>
            <ul role="list">
              <li><a href="index.html">Home</a></li>
              <li><a href="team.html">Team</a></li>
              <li><a href="events.html">Events</a></li>
              <li><a href="resources.html">Resources</a></li>
            </ul>
          </div>

          <div class="footer-nav-col">
            <h3 class="footer-heading">Club</h3>
            <ul role="list">
              <li><a href="contact.html">Contact Us</a></li>
              <li><a href="join.html">Join SCOPE</a></li>
              <li><a href="https://github.com/scopeclub" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>

          <div class="footer-contact-col">
            <h3 class="footer-heading">Contact</h3>
            <p style="margin:0 0 0.5em;">
              <a href="mailto:scopeclub@mlrinstitutions.ac.in" class="footer-email">
                scopeclub@mlrinstitutions.ac.in
              </a>
            </p>
            <address style="font-style:normal;font-size:0.85rem;color:var(--text-faint);line-height:1.7;">
              MT 003-SCOPE CLUB, MLRIT,<br>
              Dundigal Police Station Road,<br>
              Hyderabad - 500 043,<br>
              Telangana, India.
            </address>
          </div>

        </div>

        <div class="footer-bottom">
          <span>© ${year} SCOPE Club — MLR Institute of Technology. All rights reserved.</span>
          <span class="footer-mlrit">Official technical club of MLRIT</span>
        </div>
      </div>
    </footer>
  `;
}

function mountLayout(currentPage) {
  document.getElementById("nav-root").innerHTML = renderNav(currentPage);
  document.getElementById("footer-root").innerHTML = renderFooter();

  /* Mobile nav toggle */
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    /* Close mobile menu on Escape */
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        links.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }
}

/* ============================================================
   CARD RENDERERS
   ============================================================ */

/* ---------- Event card — with CSS flip on desktop hover ----------
 *
 * Structure:
 *   .event-card-scene          — perspective container, aria group
 *     .event-card-flipper      — rotates on hover
 *       .event-card-face.event-card-front   — always visible (front)
 *       .event-card-face.event-card-back    — revealed on hover (back)
 *
 * When event.previewUrl is set, the back face shows that image.
 * When it is null, the back face shows a "click for details" panel.
 * On touch devices and prefers-reduced-motion the back is hidden;
 * all detail is accessible via the modal.
 */
function eventCardHTML(event) {
  const status = getEventStatus(event);
  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : start;

  /* Multi-day date string */
  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();
  let dateStr;
  if (sameMonth && start.getDate() !== end.getDate()) {
    dateStr = `${start.getDate()}–${end.getDate()} ${start.toLocaleString("en-IN", { month: "short" })}, ${start.getFullYear()}`;
  } else {
    dateStr = start.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  const badge =
    status === "active"
      ? `<span class="badge live"><span class="dot" aria-hidden="true"></span> LIVE NOW</span>`
      : status === "upcoming"
        ? `<span class="badge upcoming">UPCOMING</span>`
        : `<span class="badge past">PAST</span>`;

  const calIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
  const pinIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;

  const hasPreview = Boolean(event.previewUrl);

  /* Back-face HTML */
  const backContent = hasPreview
    ? `<img class="event-card-back-img"
            src="${event.previewUrl}"
            alt="${event.title} — secondary image"
            loading="lazy" />
       <div class="event-card-back-overlay">
         <p class="event-card-back-title">${event.title}</p>
         <p class="event-card-back-hint">Click for full details →</p>
       </div>`
    : `<div class="event-card-no-preview-msg">
         <p style="margin:0 0 0.5em;font-size:1.6rem;" aria-hidden="true">🔍</p>
         <p style="margin:0;font-weight:600;color:var(--text);font-family:var(--font-display);">${event.title}</p>
         <p style="margin:0.4em 0 0;font-size:0.8rem;color:var(--accent);font-family:var(--font-mono);">Click for full details →</p>
       </div>`;

  return `
    <div class="event-card-scene reveal"
         data-has-preview="${hasPreview}"
         data-status="${status}"
         role="group"
         aria-label="${event.title} — ${status} event">

      <div class="event-card-flipper">

        <!-- FRONT FACE -->
        <article class="event-card-face event-card-front card"
                 data-event-id="${event.id}">
          <div class="card-media poster-media">
            <img src="${event.bannerUrl}"
                 alt="${event.title} event poster"
                 loading="lazy" />
          </div>
          <div class="card-body">
            <div class="card-meta">
              ${badge}
              <span>${calIcon} ${dateStr}</span>
              <span>${pinIcon} ${event.location}</span>
            </div>
            <h3 class="card-title">${event.title}</h3>
            <p class="card-desc">${event.shortDescription}</p>
            ${hasPreview
      ? `<span class="event-flip-hint" aria-hidden="true">⟳ hover to preview</span>`
      : ""}
            <button class="btn btn-sm"
                    style="margin-top:0.9em;"
                    data-open-modal="${event.id}"
                    aria-haspopup="dialog"
                    aria-label="Open full details for ${event.title}">
              More Info
            </button>
          </div>
        </article>

        <!-- BACK FACE (desktop hover only — aria-hidden, all info in modal) -->
        <div class="event-card-face event-card-back ${hasPreview ? "" : "event-card-no-preview"}"
             aria-hidden="true">
          ${backContent}
          <!-- Clickable overlay so clicking the back face also opens the modal -->
          <button class="event-card-back-click-trigger"
                  data-open-modal="${event.id}"
                  aria-label="Open details for ${event.title}"
                  style="position:absolute;inset:0;width:100%;height:100%;background:transparent;border:none;cursor:pointer;z-index:2;"></button>
        </div>

      </div>
    </div>
  `;
}

/* ---------- Resource card — button always at bottom ---------- */
function resourceCardHTML(resource) {
  const typeIcons = {
    documentation: "📄",
    ebook: "📚",
    tutorial: "🎓",
    video: "▶️",
    github: "🔗",
  };
  const icon = typeIcons[resource.type] || "🔗";

  return `
    <article class="card resource-card reveal">
      <div class="card-body">
        <div class="card-meta">
          <span class="badge cat-badge">${resource.category}</span>
          <span class="res-type">${icon} ${resource.type}</span>
        </div>
        <h3 class="card-title">${resource.title}</h3>
        <p class="card-desc">${resource.description}</p>
        <a class="btn btn-sm"
           href="${resource.visitUrl}"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="Visit ${resource.title} — opens in new tab">
          Visit →
        </a>
      </div>
    </article>
  `;
}

/* ---------- Member card ---------- */
function memberCardHTML(member) {
  /* Map known social keys to readable labels and SVG icons */
  const SOCIAL_META = {
    github: { label: "GitHub", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>` },
    linkedin: { label: "LinkedIn", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>` },
    instagram: { label: "Instagram", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>` },
    x: { label: "X / Twitter", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
    twitter: { label: "Twitter", icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
  };

  const socials = Object.entries(member.socials || {})
    .filter(([, url]) => url)
    .map(([key, url]) => {
      const meta = SOCIAL_META[key.toLowerCase()] || { label: key, icon: "" };
      return `<a href="${url}" target="_blank" rel="noopener noreferrer"
                 aria-label="${meta.label}" title="${meta.label}">${meta.icon}</a>`;
    })
    .join("");

  const imgEl =
    member.photoUrl && !member.photoUrl.includes("placeholder")
      ? `<img src="${member.photoUrl}" alt="${member.name}" loading="lazy" />`
      : `<div class="avatar-placeholder" aria-hidden="true">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
         </div>`;

  return `
    <article class="card member-card tilt reveal" tabindex="0">
      <div class="member-photo">${imgEl}</div>
      <div class="card-body member-info">
        <h3 class="card-title member-name">${member.name}</h3>
        <p class="card-desc member-role">${member.role}</p>
        ${socials ? `<div class="member-socials" aria-label="Social links for ${member.name}">${socials}</div>` : ""}
      </div>
    </article>
  `;
}
