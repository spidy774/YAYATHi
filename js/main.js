/* ============================================================
   SCOPE CLUB — GLOBAL MOTION + ATMOSPHERE
   Single source-of-truth for prefers-reduced-motion + touch detection.
   All effects degrade gracefully on touch / reduced-motion.
   ============================================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouchDevice = window.matchMedia("(hover: none)").matches;

/* ============================================================
   CURSOR-REACTIVE GRID + SOFT CURSOR GLOW
   Two separate layers driven by the same mouse position:
   1. #cursor-field — grid mask snaps to cursor position (CSS --mx/--my)
   2. #cursor-glow  — large soft radial that lerps toward the cursor
                      so it trails slightly, feeling like ambient light
                      rather than a tight spotlight.
   ============================================================ */
function initCursorField() {
  if (prefersReducedMotion || isTouchDevice) return;

  const field = document.getElementById("cursor-field");
  const glow = document.getElementById("cursor-glow");

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let mouseActive = false;

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;

    /* Grid mask: snap (already immediate via CSS var) */
    if (field) {
      field.style.setProperty("--mx", `${e.clientX}px`);
      field.style.setProperty("--my", `${e.clientY}px`);
    }

    if (!mouseActive) {
      mouseActive = true;
      if (glow) glow.classList.add("is-active");
    }
  });

  /* Lerp loop for the soft glow — trails the cursor gently */
  function lerpGlow() {
    if (mouseActive && glow) {
      const ease = 0.055;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      glow.style.setProperty("--gx", `${currentX.toFixed(1)}px`);
      glow.style.setProperty("--gy", `${currentY.toFixed(1)}px`);
    }
    requestAnimationFrame(lerpGlow);
  }
  lerpGlow();

  document.addEventListener("mouseleave", () => {
    mouseActive = false;
    if (glow) glow.classList.remove("is-active");
  });
}

/* ============================================================
   LIGHTWEIGHT PARTICLE CANVAS
   28 nodes on desktop. Very slow drift. Low opacity.
   Connection lines only between nearby nodes at very low alpha.
   Pauses when tab is hidden.
   ============================================================ */
function initParticleCanvas() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas || prefersReducedMotion || isTouchDevice) return;

  const ctx = canvas.getContext("2d");
  const COUNT = 28;
  const MAX_DIST = 140;
  const ACCENT = [61, 255, 168];
  const CYAN = [34, 211, 238];
  let W, H;
  let nodes = [];
  let paused = false;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeNode() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.1 + 0.5,
      col: Math.random() > 0.72 ? CYAN : ACCENT,
    };
  }

  function spawn() { resize(); nodes = Array.from({ length: COUNT }, makeNode); }

  function tick() {
    if (paused) { requestAnimationFrame(tick); return; }
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < -10) a.x = W + 10;
      if (a.x > W + 10) a.x = -10;
      if (a.y < -10) a.y = H + 10;
      if (a.y > H + 10) a.y = -10;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.11;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${a.col[0]},${a.col[1]},${a.col[2]},${alpha})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }

      /* Small, dim nodes */
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${a.col[0]},${a.col[1]},${a.col[2]},0.36)`;
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  document.addEventListener("visibilitychange", () => { paused = document.hidden; });
  window.addEventListener("resize", () => {
    resize();
    if (Math.abs(canvas.width - W) > 200 || Math.abs(canvas.height - H) > 200) spawn();
  });
  spawn();
  tick();
}

/* ============================================================
   SCROLL REVEALS
   ============================================================ */
function initScrollReveals() {
  const items = document.querySelectorAll(".reveal:not(.is-visible)");
  if (!items.length) return;

  if (prefersReducedMotion) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      let delay = 0;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("is-visible"), delay);
          delay += 50;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

function refreshScrollReveals() { initScrollReveals(); }

/* ============================================================
   CARD TILT — desktop pointer hover only
   ============================================================ */
function initCardTilt() {
  if (prefersReducedMotion || isTouchDevice) return;

  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".card.tilt");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--ry", `${px * 5}deg`);
    card.style.setProperty("--rx", `${-py * 5}deg`);
    card.style.setProperty("--ty", "-4px");
  });

  document.addEventListener("mouseleave", (e) => {
    const card = e.target.closest(".card.tilt");
    if (!card) return;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--ty", "0px");
  }, true);
}

/* ============================================================
   WWD CARD (Technical areas) — 3D TILT + FLIP
   Desktop: subtle 3D tilt, click flips.
   Touch: tap to flip.
   Keyboard: Enter/Space flips, Escape unflips.
   Uses a WeakSet to avoid re-attaching listeners to the same card.
   ============================================================ */
const _wwdInitialized = new WeakSet();

function initWwdCards() {
  const scenes = document.querySelectorAll(".wwd-scene");

  scenes.forEach((scene) => {
    if (_wwdInitialized.has(scene)) return;
    _wwdInitialized.add(scene);

    if (!isTouchDevice && !prefersReducedMotion) {
      scene.addEventListener("mousemove", (e) => {
        if (scene.classList.contains("is-flipped")) return;
        const rect = scene.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        scene.style.setProperty("--wwd-rx", `${-py * 8}deg`);
        scene.style.setProperty("--wwd-ry", `${px * 8}deg`);
      });

      scene.addEventListener("mouseleave", () => {
        if (!scene.classList.contains("is-flipped")) {
          scene.style.setProperty("--wwd-rx", "0deg");
          scene.style.setProperty("--wwd-ry", "0deg");
        }
      });
    }

    scene.addEventListener("click", (e) => {
      if (e.target.closest(".wwd-back-link")) return;
      toggleWwdFlip(scene);
    });

    scene.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleWwdFlip(scene);
      }
      if (e.key === "Escape" && scene.classList.contains("is-flipped")) {
        unflipWwd(scene);
      }
    });
  });
}

/* Global click-outside handler — registered once */
document.addEventListener("click", (e) => {
  if (!e.target.closest(".wwd-scene")) {
    document.querySelectorAll(".wwd-scene.is-flipped").forEach(unflipWwd);
  }
});

function toggleWwdFlip(scene) {
  const isFlipped = scene.classList.contains("is-flipped");
  document.querySelectorAll(".wwd-scene.is-flipped").forEach((s) => {
    if (s !== scene) unflipWwd(s);
  });
  if (isFlipped) unflipWwd(scene);
  else flipWwd(scene);
}

function flipWwd(scene) {
  scene.classList.add("is-flipped");
  scene.setAttribute("aria-pressed", "true");
  const back = scene.querySelector(".wwd-back");
  const front = scene.querySelector(".wwd-front");
  if (back) back.removeAttribute("aria-hidden");
  if (front) front.setAttribute("aria-hidden", "true");
  scene.style.setProperty("--wwd-rx", "0deg");
  scene.style.setProperty("--wwd-ry", "0deg");
  setTimeout(() => {
    const link = scene.querySelector(".wwd-back-link");
    if (link) link.focus({ preventScroll: true });
  }, 320);
}

function unflipWwd(scene) {
  scene.classList.remove("is-flipped");
  scene.setAttribute("aria-pressed", "false");
  const back = scene.querySelector(".wwd-back");
  const front = scene.querySelector(".wwd-front");
  if (back) back.setAttribute("aria-hidden", "true");
  if (front) front.removeAttribute("aria-hidden");
  scene.style.setProperty("--wwd-rx", "0deg");
  scene.style.setProperty("--wwd-ry", "0deg");
}

/* ============================================================
   MAGNETIC BUTTONS — desktop only
   ============================================================ */
function initMagneticButtons() {
  if (prefersReducedMotion || isTouchDevice) return;

  function attachMagnetic(btn) {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      btn.style.setProperty("--btn-x", `${Math.max(-30, Math.min(30, x * 0.28))}px`);
      btn.style.setProperty("--btn-y", `${Math.max(-30, Math.min(30, y * 0.28))}px`);
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.setProperty("--btn-x", "0px");
      btn.style.setProperty("--btn-y", "0px");
    });
    btn.addEventListener("mousedown", () => btn.classList.add("is-pressed"));
    btn.addEventListener("mouseup", () => btn.classList.remove("is-pressed"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("is-pressed"));
  }

  document.querySelectorAll(".btn-primary").forEach(attachMagnetic);

  const mo = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.matches && node.matches(".btn-primary")) attachMagnetic(node);
        node.querySelectorAll && node.querySelectorAll(".btn-primary").forEach(attachMagnetic);
      });
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });
}

/* ============================================================
   HERO PARALLAX — subtle vertical on scroll
   ============================================================ */
function initHeroParallax() {
  if (prefersReducedMotion || isTouchDevice) return;
  const hero = document.querySelector(".hero");
  if (!hero) return;

  let raf = null;
  window.addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const y = window.scrollY;
      if (y < window.innerHeight) hero.style.setProperty("--parallax-y", `${y * 0.15}px`);
      raf = null;
    });
  }, { passive: true });

  if (!document.getElementById("parallax-style")) {
    const s = document.createElement("style");
    s.id = "parallax-style";
    s.textContent = `.hero-content { transform: translateY(var(--parallax-y, 0px)); }`;
    document.head.appendChild(s);
  }
}

/* ============================================================
   NAV SCROLL STATE
   ============================================================ */
function initNavScroll() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;
  const update = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
  window.addEventListener("scroll", update, { passive: true });
  update();
}

/* ============================================================
   AMBIENT BLOBS — inject extra DOM elements
   #ambient-extra: purple mid-screen (already in CSS)
   #ambient-warm:  green mid-right balance (new)
   #cursor-glow:   soft lerp cursor glow (new)
   ============================================================ */
function initAmbientExtra() {
  /* Purple blob */
  if (!document.getElementById("ambient-extra")) {
    const el = document.createElement("div");
    el.id = "ambient-extra";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }

  /* Fourth warm-green orb (right-side balance) — static on reduced-motion */
  if (!document.getElementById("ambient-warm")) {
    const warm = document.createElement("div");
    warm.id = "ambient-warm";
    warm.setAttribute("aria-hidden", "true");
    document.body.appendChild(warm);
  }

  /* Cursor glow layer — only on desktop, only if not already injected */
  if (!isTouchDevice && !prefersReducedMotion && !document.getElementById("cursor-glow")) {
    const glow = document.createElement("div");
    glow.id = "cursor-glow";
    glow.setAttribute("aria-hidden", "true");
    document.body.appendChild(glow);
  }
}

/* ============================================================
   GALLERY LIGHTBOX
   Opens on click of .modal-screenshots img.
   Supports keyboard (←→ Esc), touch swipe, prev/next buttons.
   ============================================================ */
let _lightboxOpen = false;
let _lightboxImages = [];
let _lightboxIndex = 0;
let _lightboxKeyHandler = null;
let _lightboxTouchStartX = 0;

function initGalleryLightbox() {
  document.addEventListener("click", (e) => {
    const img = e.target.closest(".modal-screenshots img");
    if (!img) return;
    const gallery = img.closest(".modal-screenshots");
    if (!gallery) return;
    const imgs = Array.from(gallery.querySelectorAll("img"));
    _lightboxImages = imgs.map((i) => ({ src: i.src, alt: i.alt }));
    _lightboxIndex = imgs.indexOf(img);
    openLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const img = document.activeElement;
    if (!img || !img.matches || !img.matches(".modal-screenshots img")) return;
    const gallery = img.closest(".modal-screenshots");
    if (!gallery) return;
    const imgs = Array.from(gallery.querySelectorAll("img"));
    _lightboxImages = imgs.map((i) => ({ src: i.src, alt: i.alt }));
    _lightboxIndex = imgs.indexOf(img);
    openLightbox();
  });
}

function openLightbox() {
  if (_lightboxOpen) return;
  _lightboxOpen = true;

  const lb = document.createElement("div");
  lb.id = "scope-lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Image viewer");
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <button class="lb-close" aria-label="Close image viewer">&#215;</button>
    <button class="lb-prev"  aria-label="Previous image">&#8592;</button>
    <button class="lb-next"  aria-label="Next image">&#8594;</button>
    <div class="lb-img-wrap">
      <img class="lb-img" src="" alt="" />
    </div>
    <div class="lb-counter" aria-live="polite"></div>
  `;
  document.body.appendChild(lb);
  document.body.style.overflow = "hidden";

  updateLightbox();

  lb.querySelector(".lb-close").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-backdrop").addEventListener("click", closeLightbox);
  lb.querySelector(".lb-prev").addEventListener("click", (e) => { e.stopPropagation(); prevLightbox(); });
  lb.querySelector(".lb-next").addEventListener("click", (e) => { e.stopPropagation(); nextLightbox(); });

  const imgWrap = lb.querySelector(".lb-img-wrap");
  imgWrap.addEventListener("touchstart", (e) => {
    _lightboxTouchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  imgWrap.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - _lightboxTouchStartX;
    if (Math.abs(dx) > 50) { if (dx < 0) nextLightbox(); else prevLightbox(); }
  }, { passive: true });

  _lightboxKeyHandler = (e) => {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevLightbox();
    if (e.key === "ArrowRight") nextLightbox();
  };
  document.addEventListener("keydown", _lightboxKeyHandler);
  setTimeout(() => lb.querySelector(".lb-close").focus(), 40);
}

function updateLightbox() {
  const lb = document.getElementById("scope-lightbox");
  if (!lb) return;
  const imgEl = lb.querySelector(".lb-img");
  const counter = lb.querySelector(".lb-counter");
  const data = _lightboxImages[_lightboxIndex];
  imgEl.src = data.src;
  imgEl.alt = data.alt;
  counter.textContent = `${_lightboxIndex + 1} / ${_lightboxImages.length}`;
  const showNav = _lightboxImages.length > 1;
  lb.querySelector(".lb-prev").style.display = showNav ? "" : "none";
  lb.querySelector(".lb-next").style.display = showNav ? "" : "none";
}

function prevLightbox() {
  _lightboxIndex = (_lightboxIndex - 1 + _lightboxImages.length) % _lightboxImages.length;
  updateLightbox();
}

function nextLightbox() {
  _lightboxIndex = (_lightboxIndex + 1) % _lightboxImages.length;
  updateLightbox();
}

function closeLightbox() {
  const lb = document.getElementById("scope-lightbox");
  if (lb) lb.remove();
  document.body.style.overflow = "";
  if (_lightboxKeyHandler) {
    document.removeEventListener("keydown", _lightboxKeyHandler);
    _lightboxKeyHandler = null;
  }
  _lightboxOpen = false;
}

/* ============================================================
   EVENT CARD SUBTLE TILT
   Only applies to no-preview cards (preview cards flip on hover).
   ============================================================ */
function initEventCardTilt() {
  if (prefersReducedMotion || isTouchDevice) return;

  document.addEventListener("mousemove", (e) => {
    const scene = e.target.closest(".event-card-scene");
    if (!scene || scene.dataset.hasPreview === "true") return;
    const front = scene.querySelector(".event-card-front");
    if (!front) return;
    const rect = scene.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    front.style.setProperty("--evt-rx", `${-py * 4}deg`);
    front.style.setProperty("--evt-ry", `${px * 4}deg`);
  });

  document.addEventListener("mouseleave", (e) => {
    const scene = e.target.closest(".event-card-scene");
    if (!scene || scene.dataset.hasPreview === "true") return;
    const front = scene.querySelector(".event-card-front");
    if (front) {
      front.style.setProperty("--evt-rx", "0deg");
      front.style.setProperty("--evt-ry", "0deg");
    }
  }, true);
}

/* ============================================================
   RESOURCE CARD TILT
   ============================================================ */
function initResourceCardTilt() {
  if (prefersReducedMotion || isTouchDevice) return;

  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".resource-card");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--res-rx", `${-py * 6}deg`);
    card.style.setProperty("--res-ry", `${px * 6}deg`);
  });

  document.addEventListener("mouseleave", (e) => {
    const card = e.target.closest(".resource-card");
    if (!card) return;
    card.style.setProperty("--res-rx", "0deg");
    card.style.setProperty("--res-ry", "0deg");
  }, true);
}

/* ============================================================
   FILTER ANIMATION — smooth card grid transitions
   ============================================================ */
function initFilterAnimation() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip[data-category], .tab[data-status]");
    if (!btn || prefersReducedMotion) return;
    const gridId = btn.dataset.status !== undefined ? "events-grid" : "resources-grid";
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.style.transition = "none";
    grid.style.opacity = "0";
    grid.style.transform = "translateY(8px)";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        grid.style.transition = "opacity 220ms ease, transform 220ms ease";
        grid.style.opacity = "1";
        grid.style.transform = "none";
      });
    });
  });
}

/* ============================================================
   INIT ALL
   ============================================================ */
function initMotion() {
  initAmbientExtra();   /* inject DOM blobs first so cursor-glow exists */
  initCursorField();    /* drives grid mask + glow lerp */
  initParticleCanvas();
  initScrollReveals();
  initCardTilt();
  initWwdCards();
  initMagneticButtons();
  initHeroParallax();
  initNavScroll();
  initGalleryLightbox();
  initEventCardTilt();
  initResourceCardTilt();
  initFilterAnimation();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMotion);
} else {
  initMotion();
}
