/* ============================================================
   SCOPE CLUB — CINEMATIC ATMOSPHERIC DEPTH SYSTEM
   ──────────────────────────────────────────────────────────
   Inspired by volumetric clouds + light shafts from the
   floating island reference, translated into SCOPE's
   cloud computing / engineering identity.

   Features:
   • Multi-layer atmospheric gradients (far/mid/near)
   • Volumetric ray layer (subtle diagonal light shafts)
   • Scroll-based parallax (each layer moves at different speed)
   • Cursor-reactive local illumination (subtle glow follows cursor)
   • Fade-in on load (no hard flash)
   • Respects prefers-reduced-motion
   • Mobile-optimized (no cursor effects, reduced intensity)
   ============================================================ */

(function initAtmosphericDepth() {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const container = document.querySelector(".atmos-depth");
  if (!container) return;

  const isMobile = window.matchMedia("(hover: none)").matches;

  /* Trigger CSS fade-in after first paint */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => container.classList.add("is-ready"));
  });

  /* ============================================================
     SCROLL-BASED LAYERED PARALLAX
     Each atmosphere layer moves at a different speed as user
     scrolls, creating the illusion of depth. The far layer
     moves slowest, near layer moves fastest.
     ============================================================ */
  const layers = {
    far:  document.querySelector(".atmos-far"),
    mid:  document.querySelector(".atmos-mid"),
    near: document.querySelector(".atmos-near"),
    rays: document.querySelector(".atmos-rays"),
  };

  let scrollRAF = null;

  function updateParallax() {
    const scrollY = window.scrollY;
    const maxScroll = window.innerHeight * 1.5; /* only affect hero region */

    if (scrollY > maxScroll) return;

    /* Each layer moves at different rate — far slowest, near fastest */
    const farShift  = scrollY * 0.08;
    const midShift  = scrollY * 0.14;
    const nearShift = scrollY * 0.22;
    const raysShift = scrollY * 0.18;

    if (layers.far)  layers.far.style.transform  = `translateY(${farShift}px)`;
    if (layers.mid)  layers.mid.style.transform  = `translateY(${midShift}px)`;
    if (layers.near) layers.near.style.transform = `translateY(${nearShift}px)`;
    if (layers.rays) layers.rays.style.transform = `translateY(${raysShift}px)`;
  }

  window.addEventListener("scroll", () => {
    if (scrollRAF) return;
    scrollRAF = requestAnimationFrame(() => {
      updateParallax();
      scrollRAF = null;
    });
  }, { passive: true });

  /* Initial call */
  updateParallax();

  /* ============================================================
     CURSOR-REACTIVE LOCAL ILLUMINATION
     When the user moves the cursor, a very subtle local glow
     appears in the atmospheric layers. Think: "the environment
     reacts to your presence."

     Mobile: disabled (no cursor).
     ============================================================ */
  if (!isMobile) {
    const glowLayer = document.createElement("div");
    glowLayer.className = "atmos-cursor-glow";
    glowLayer.style.cssText = `
      position: fixed;
      width: 520px;
      height: 520px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(61,255,168,0.028) 0%, transparent 62%);
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.6s ease;
      filter: blur(28px);
      mix-blend-mode: screen;
      will-change: transform, opacity;
    `;
    container.appendChild(glowLayer);

    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let currentX = cursorX;
    let currentY = cursorY;
    let isActive = false;

    window.addEventListener("mousemove", (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      if (!isActive) {
        isActive = true;
        glowLayer.style.opacity = "1";
      }
    });

    document.addEventListener("mouseleave", () => {
      isActive = false;
      glowLayer.style.opacity = "0";
    });

    /* Lerp loop — glow trails cursor gently */
    function lerpGlow() {
      if (isActive) {
        const ease = 0.065;
        currentX += (cursorX - currentX) * ease;
        currentY += (cursorY - currentY) * ease;
        glowLayer.style.transform = `translate(${currentX - 260}px, ${currentY - 260}px)`;
      }
      requestAnimationFrame(lerpGlow);
    }
    lerpGlow();
  }

  /* ============================================================
     VISIBILITY PAUSE
     Pause any future updates when the tab is hidden (battery).
     The CSS animations continue automatically; this is for
     any future JS-driven effects.
     ============================================================ */
  let paused = false;
  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
  });

})();
