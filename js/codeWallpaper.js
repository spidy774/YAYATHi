/* ============================================================
   SCOPE CLUB — LIVE CODE WALLPAPER
   ──────────────────────────────────────────────────────────
   Concept: SCOPE = School Of Programming Excellence.

   Visual layers (all on one canvas, back to front):
   1. Column rain  — programming keywords/symbols fall in columns
   2. SCOPE flash  — every ~10s the S·C·O·P·E letters ignite
                     in neon-green across every column they occupy
   3. Pinned mark  — faint S·C·O·P·E vertical stack, right edge,
                     pulses brighter during flash
   4. Hero banner  — during flash, "S C O P E" assembles letter
                     by letter near the top of the viewport like
                     a compiler output line

   Design rules:
   · Monospace font — this is code, not decoration
   · Low base opacity (0.52) — content always wins
   · No horizontal drift — pure vertical rain
   · Pauses when browser tab is hidden
   · Entirely disabled under prefers-reduced-motion
   · Lighter on mobile (fewer columns, lower canvas opacity)
   · Canvas fades in over 2.4s on load (no hard flash)
   ============================================================ */

(function scopeWallpaper() {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const canvas = document.getElementById("code-wallpaper");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  /* ── Trigger CSS fade-in after first paint ── */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => canvas.classList.add("is-ready"));
  });

  /* ── Brand colours ── */
  const GREEN = [61, 255, 168];
  const CYAN = [34, 211, 238];
  const PURPLE = [167, 139, 250];
  const DIM = [140, 190, 165];

  /* ── Programming vocabulary ──
     Single chars and SCOPE letters appear at higher frequency
     via repetition in the array.
  ── */
  const TOKENS = [
    /* Core keywords */
    "function", "const", "let", "class", "import", "export", "return",
    "async", "await", "for", "while", "if", "else", "try", "catch",
    "new", "this", "extends", "static", "yield", "from", "in", "of",
    "def", "lambda", "print", "range", "True", "False", "None", "self",
    "pass", "with", "map", "filter", "reduce", "type", "interface",
    /* Operators & symbols */
    "=>", "{}", "[]", "()", "//", "/*", "*/", "&&", "||",
    "===", "!==", "??", "::", "++", "--", "+=", "->", "...",
    /* AWS / Cloud */
    "lambda", "s3", "ec2", "iam", "deploy", "cloud", "bucket",
    "region", "stack", "vpc", "api", "cdk", "sam", "bedrock",
    /* Git */
    "git", "push", "pull", "merge", "commit", "fork", "branch", "diff",
    /* ML */
    "train", "model", "loss", "epoch", "batch", "tensor", "fit", "predict",
    /* Web */
    "render", "useState", "useEffect", "fetch", "json",
    "props", "state", "router", "hook", "ref",
    /* SCOPE letters — high frequency */
    "S", "S", "S", "S", "C", "C", "C", "C", "O", "O", "O", "O",
    "P", "P", "P", "P", "E", "E", "E", "E",
    /* Punctuation noise */
    "{", "}", "[", "]", "(", ")", ";", ":", ".", "<", ">",
    "{", "}", "[", "]", "(", ")", ";", ":", ".", "<", ">",
    "#", "@", "$", "=>", "//", "**", "~~",
    "0", "1", "0", "1",
  ];

  const SCOPE_SET = new Set(["S", "C", "O", "P", "E"]);
  function randToken() {
    return TOKENS[Math.floor(Math.random() * TOKENS.length)];
  }

  /* ── Layout ── */
  const FS = 12;
  const FONT = `${FS}px "IBM Plex Mono","Courier New",monospace`;
  const mobile = window.matchMedia("(hover:none)").matches;
  const COL_W = mobile ? 92 : 70;
  const V_MIN = mobile ? 0.3 : 0.45;
  const V_MAX = mobile ? 0.65 : 0.95;

  let W, H, numCols, cols;

  /* ── Flash state ── */
  let flashActive = false;
  let flashTimer = 0;
  let lastFlashMs = -20000;
  const FLASH_FRAMES = 110;
  const FLASH_GAP_MIN = 9000;
  const FLASH_GAP_MAX = 17000;
  let nextGap = FLASH_GAP_MIN + Math.random() * (FLASH_GAP_MAX - FLASH_GAP_MIN);

  /* ── Banner state (assembles during flash) ── */
  /* Letters appear one at a time, then fade together */
  const BANNER_LETTERS = ["S", "C", "O", "P", "E"];
  let bannerProgress = 0;   /* 0–5: how many letters visible */
  let bannerAlpha = 0;

  /* ── Column factory ── */
  function makeCol(i) {
    const slotW = W / numCols;
    return {
      x: slotW * i + slotW * 0.5,
      y: -(Math.random() * H * 1.6),
      vy: V_MIN + Math.random() * (V_MAX - V_MIN),
      token: randToken(),
      ttl: Math.floor(5 + Math.random() * 20),
      tier: randTier(),
      alpha: 0.06 + Math.random() * 0.20,
    };
  }

  function randTier() {
    const r = Math.random();
    if (r < 0.09) return "green";
    if (r < 0.05) return "cyan";
    if (r < 0.03) return "purple";
    return "dim";
  }

  function initCols() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    numCols = Math.max(6, Math.floor(W / COL_W));
    cols = Array.from({ length: numCols }, (_, i) => makeCol(i));
  }

  /* ── Visibility / resize ── */
  let paused = false;
  document.addEventListener("visibilitychange", () => { paused = document.hidden; });
  let resizeT;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(initCols, 220);
  });

  /* ── Main render loop ── */
  function frame(ts) {
    requestAnimationFrame(frame);
    if (paused) return;

    /* ── Flash trigger ── */
    if (!flashActive && ts - lastFlashMs > nextGap) {
      flashActive = true;
      flashTimer = FLASH_FRAMES;
      bannerProgress = 0;
      bannerAlpha = 0;
      lastFlashMs = ts;
      nextGap = FLASH_GAP_MIN + Math.random() * (FLASH_GAP_MAX - FLASH_GAP_MIN);
    }
    if (flashActive) {
      flashTimer--;
      /* Assemble banner: reveal one letter every 12 frames */
      const revealAt = Math.floor((FLASH_FRAMES - flashTimer) / 12);
      bannerProgress = Math.min(BANNER_LETTERS.length, revealAt);
      /* Alpha: ramp up then ramp down */
      const t = flashTimer / FLASH_FRAMES;
      bannerAlpha = Math.sin(t * Math.PI) * 0.82;
      if (flashTimer <= 0) {
        flashActive = false;
        bannerProgress = 0;
        bannerAlpha = 0;
      }
    }

    /* ── Trail clear (ghost effect) ── */
    ctx.fillStyle = "rgba(4,7,10,0.19)";
    ctx.fillRect(0, 0, W, H);

    ctx.font = FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    /* ── Column rain ── */
    for (const c of cols) {
      c.y += c.vy;
      c.ttl -= 1;
      if (c.ttl <= 0) {
        c.token = randToken();
        c.ttl = Math.floor(5 + Math.random() * 20);
      }
      if (c.y > H + 20) {
        c.y = -(FS * (1 + Math.random() * 8));
        c.vy = V_MIN + Math.random() * (V_MAX - V_MIN);
        c.token = randToken();
        c.ttl = Math.floor(5 + Math.random() * 20);
        c.tier = randTier();
        c.alpha = 0.06 + Math.random() * 0.20;
      }

      /* Colour logic */
      let [r, g, b] = DIM;
      let a = c.alpha;

      if (c.tier === "green") { [r, g, b] = GREEN; }
      if (c.tier === "cyan") { [r, g, b] = CYAN; }
      if (c.tier === "purple") { [r, g, b] = PURPLE; }

      /* Flash — SCOPE letters ignite */
      const isScope = SCOPE_SET.has(c.token);
      if (flashActive && isScope) {
        [r, g, b] = GREEN;
        a = 0.45 + Math.sin((flashTimer / FLASH_FRAMES) * Math.PI) * 0.45;
      }

      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.shadowBlur = 0;

      if ((flashActive && isScope) || c.tier === "green") {
        ctx.shadowColor = `rgba(${GREEN[0]},${GREEN[1]},${GREEN[2]},0.45)`;
        ctx.shadowBlur = 7;
      } else if (c.tier === "cyan") {
        ctx.shadowColor = `rgba(${CYAN[0]},${CYAN[1]},${CYAN[2]},0.35)`;
        ctx.shadowBlur = 5;
      }

      ctx.fillText(c.token, c.x, c.y);
    }

    /* ── Pinned S·C·O·P·E vertical mark (right edge) ── */
    drawPinnedMark();

    /* ── Hero banner (assembles letter by letter during flash) ── */
    if (flashActive || bannerAlpha > 0.02) {
      drawHeroBanner();
    }

    /* Reset context */
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
  }

  /* ── Pinned vertical word mark ── */
  function drawPinnedMark() {
    const pinX = W - 20;
    const startY = 70;
    const step = 20;
    const letters = ["S", "C", "O", "P", "E"];

    ctx.font = `700 13px "IBM Plex Mono","Courier New",monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const t = flashActive ? flashTimer / FLASH_FRAMES : 0;
    const pulse = flashActive ? 0.38 + Math.sin(t * Math.PI) * 0.42 : 0.08;

    letters.forEach((l, i) => {
      ctx.globalAlpha = pulse;
      ctx.fillStyle = `rgb(${GREEN[0]},${GREEN[1]},${GREEN[2]})`;
      ctx.shadowColor = flashActive
        ? `rgba(${GREEN[0]},${GREEN[1]},${GREEN[2]},0.7)`
        : "transparent";
      ctx.shadowBlur = flashActive ? 12 : 0;
      ctx.fillText(l, pinX, startY + i * step);
    });

    /* Wrapping brackets */
    ctx.globalAlpha = pulse * 0.5;
    ctx.shadowBlur = 0;
    ctx.font = `700 11px "IBM Plex Mono","Courier New",monospace`;
    ctx.fillText("{", pinX, startY - step);
    ctx.fillText("}", pinX, startY + letters.length * step);
  }

  /* ── Hero banner: "S C O P E" assembles at top of screen ── */
  function drawHeroBanner() {
    if (bannerProgress === 0 && bannerAlpha < 0.02) return;

    const letters = ["S", "C", "O", "P", "E"];
    const bannerY = 48;                  /* near top of viewport */
    /* Spread letters evenly across 40% of viewport width, centred */
    const spread = Math.min(W * 0.38, 340);
    const startX = W / 2 - spread / 2;
    const letterSp = spread / (letters.length - 1);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    letters.forEach((l, i) => {
      if (i >= bannerProgress) return;  /* not yet assembled */

      /* Stagger reveal: each letter slightly offset in alpha */
      const revealFrac = Math.min(1, (bannerProgress - i) / 1.2);
      const a = bannerAlpha * revealFrac;
      if (a < 0.01) return;

      const size = 22 + Math.floor(i === 0 || i === 4 ? 2 : 0); /* S and E slightly bigger */
      ctx.font = `700 ${size}px "IBM Plex Mono","Courier New",monospace`;
      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${GREEN[0]},${GREEN[1]},${GREEN[2]})`;
      ctx.shadowColor = `rgba(${GREEN[0]},${GREEN[1]},${GREEN[2]},0.6)`;
      ctx.shadowBlur = 16;
      ctx.fillText(l, startX + i * letterSp, bannerY);

      /* Subtitle "School Of Programming Excellence" fades in last */
      if (i === 4 && bannerProgress >= 5) {
        ctx.font = `400 10px "IBM Plex Mono","Courier New",monospace`;
        ctx.globalAlpha = a * 0.65;
        ctx.fillStyle = `rgb(${GREEN[0]},${GREEN[1]},${GREEN[2]})`;
        ctx.shadowBlur = 4;
        ctx.fillText("School Of Programming Excellence", W / 2, bannerY + 28);
      }
    });
  }

  /* ── Boot ── */
  initCols();
  setTimeout(() => requestAnimationFrame(frame), 350);

})();
