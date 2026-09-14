/* ============================================================
   SCOPE CLUB — HELP CHATBOT
   Supports two modes:

   OFFLINE MODE (default — works on pure S3 static hosting):
     Answers from the curated SCOPE knowledge base (SCOPE_KB).
     No API calls. No backend required.

   LIVE AI MODE (requires deployed backend):
     Set CHAT_API_URL to your deployed /api/chat endpoint.
     Calls the backend which proxies to AWS Bedrock / Anthropic.
     Falls back to offline KB if the backend is unreachable.
     Maintains conversation history for multi-turn context.

   HOW TO ENABLE LIVE AI:
     1. Deploy lambda/chat/index.js (AWS) or api/chat.js (Vercel).
     2. Replace the empty string below with your endpoint URL:
        const CHAT_API_URL = "https://your-api-gateway-url/chat";
     3. The status label updates automatically.

   SECURITY: No API keys are stored here. The key lives on the server.
   ============================================================ */

/* ── Live AI endpoint — leave empty string for offline-only mode ── */
const CHAT_API_URL = "";   /* e.g. "https://abc.execute-api.ap-south-1.amazonaws.com/chat" */

/* Whether to attempt the live AI backend first before KB fallback */
const AI_ENABLED = Boolean(CHAT_API_URL && CHAT_API_URL.trim().length > 0);

/* Max conversation turns to send to the AI (older turns are pruned) */
const MAX_HISTORY_TURNS = 10;

/* ============================================================
   CONVERSATION HISTORY
   Only used in live AI mode. Each entry: { role, content }
   ============================================================ */
let _conversation = [];

function addToHistory(role, content) {
  _conversation.push({ role, content });
  /* Keep only the last MAX_HISTORY_TURNS turns */
  if (_conversation.length > MAX_HISTORY_TURNS * 2) {
    _conversation = _conversation.slice(-MAX_HISTORY_TURNS * 2);
  }
}

/* ============================================================
   KNOWLEDGE BASE
   Each entry: { id, patterns: [string], response: string, link? }
   Patterns are lowercased keyword/phrase fragments matched
   against the lowercased user message.
   ============================================================ */
const SCOPE_KB = [

  /* ── ABOUT ─────────────────────────────────────────────── */
  {
    id: "what-is-scope",
    patterns: ["what is scope", "about scope", "tell me about scope", "what does scope do",
      "what is scope club", "scope club", "who is scope", "scope stand for",
      "school of programming", "what is this club"],
    response: "SCOPE Club is the official technical club of MLR Institute of Technology (MLRIT), Hyderabad. SCOPE stands for School of Programming Excellence.\n\nFounded to build a strong coding culture on campus, SCOPE covers Web Development, App Development, Game Development, AI/ML, Cloud Computing, and Open Source. The club organises hackathons, coding contests, cloud workshops, and flagship events like ZENITH.\n\nAt SCOPE, we don't just learn technology — we build with it.",
  },
  {
    id: "scope-purpose",
    patterns: ["purpose of scope", "why does scope exist", "goal of scope", "mission",
      "what does scope help with", "how does scope help students"],
    response: "SCOPE's mission is to help students learn, collaborate, and grow beyond the classroom. It's a platform where seniors mentor juniors, students work on real projects, and a supportive technical community thrives.\n\nSCOPE provides practical skills, mentorship, coding culture, and real technical events — across Web, App, ML, Cloud, and more.",
  },
  {
    id: "scope-location",
    patterns: ["where is scope", "where is mlrit", "scope location", "address",
      "hyderabad", "dundigal", "mlr institute"],
    response: "SCOPE Club is based at MLR Institute of Technology (MLRIT).\n\n📍 MT 003-SCOPE CLUB, MLRIT,\nDundigal Police Station Road,\nHyderabad - 500 043, Telangana, India.\n\nOpen the Contact page for the full address and Google Maps link.",
    link: { label: "Contact Us →", href: "contact.html" },
  },
  {
    id: "scope-areas",
    patterns: ["what areas", "domains", "what does scope cover", "technical areas",
      "scope teams", "what can i learn", "web development", "app development",
      "game development", "ai ml", "cloud computing", "open source"],
    response: "SCOPE covers these technical areas:\n\n• Web Development\n• App Development\n• Game Development\n• AI / ML\n• Cloud Computing\n• Open Source\n• Competitive Programming\n• Mentorship\n\nMembers can join any domain team that matches their interests.",
  },

  /* ── EVENTS ─────────────────────────────────────────────── */
  {
    id: "events-general",
    patterns: ["events", "what events", "upcoming events", "past events", "active events",
      "any events", "event list", "show events", "see events"],
    response: "SCOPE has both active and past events. Right now AWS Cloud Trek 2026 is LIVE.\n\nOpen the Events page to browse Active, Upcoming, and Past events with full details.",
    link: { label: "View Events →", href: "events.html" },
  },
  {
    id: "aws-cloud-trek-2026",
    patterns: ["aws cloud trek 2026", "cloud trek 2026", "current event", "live event",
      "active event", "agentic", "agentic engineering", "bootcamp 2026",
      "aws 2026", "september 2026", "11th september", "12th september"],
    response: "🔴 LIVE NOW — AWS Cloud Trek 2026\n\n📅 11th & 12th September 2026\n📍 MLRIT, Hyderabad\n\nMove beyond AI coding to agentic engineering! A 2-day hands-on Bootcamp and Contest organised by the AWS Student Builder Group at MLRIT in collaboration with SCOPE Club.\n\nTopics include modern AI workflows, autonomous agent frameworks, and real-world AWS deployments.",
    link: { label: "See Event Details →", href: "events.html" },
  },
  {
    id: "zenith-25",
    patterns: ["zenith 25", "zenith '25", "zenith25", "december 2025", "cloud voyage",
      "flagship 2025", "zenith fest 2025"],
    response: "ZENITH '25 — SCOPE's Flagship Annual Technical Fest\n\n📅 18th–20th December 2025\n📍 MLRIT, Hyderabad\n\nThemed 'The Cloud Voyage', ZENITH '25 featured AWS Student Community Day with hands-on workshops, followed by a 2-day hackathon where teams built projects from given problem statements.",
    link: { label: "View Past Events →", href: "events.html?tab=past" },
  },
  {
    id: "aws-cloud-workshop-2025",
    patterns: ["aws cloud workshop", "aws workshop 2025", "cloud workshop", "october 2025",
      "aws cloud trek oct", "s3 ec2 workshop", "cloud club mlrit", "17 october",
      "18 october", "aws cloud trek 2025"],
    response: "AWS Cloud Trek — October 2025\n\n📅 17th–18th October 2025, 9:30 AM\n📍 MLRIT, Hyderabad\n\nA 2-day hands-on workshop by AWS Cloud Club MLRIT × SCOPE Club. Covered Amazon S3, EC2, application deployment, and custom domains. Participants received AWS Cloud Academy access, certificates, and swag kits.",
    link: { label: "View Past Events →", href: "events.html?tab=past" },
  },
  {
    id: "init-saga",
    patterns: ["init saga", "__init__", "init_saga", "init-saga", "april 2025",
      "hackathon 2025", "python init", "28 april", "29 april",
      "agriculture hackathon", "healthcare hackathon", "20000 prize", "rs 20000"],
    response: "__init__ Saga — April 2025\n\n📅 28th–29th April 2025, 9:30 AM\n📍 MLRIT, Hyderabad\n\nA 2-day hackathon inspired by Python's __init__ method. Themes: Agriculture & Food Tech, Healthcare & Well Being, Education & Learning, Travel & Tourism.\n\n💰 Prize pool: ₹20,000 + exciting prizes. Team size: 3–4.",
    link: { label: "View Past Events →", href: "events.html?tab=past" },
  },
  {
    id: "zenith-24",
    patterns: ["zenith 24", "zenith24", "datavoyage", "data voyage", "november 2024",
      "zenith 2024", "flagship 2024", "7 november", "9 november"],
    response: "ZENITH 24 — DataVoyage\n\n📅 7th–9th November 2024\n📍 MLRIT, Hyderabad\n\nSCOPE Club's 2024 flagship technical festival themed around data science and machine learning. Featured competitive programming, data challenges, and domain-specific workshops.",
    link: { label: "View Past Events →", href: "events.html?tab=past" },
  },
  {
    id: "splash",
    patterns: ["splash", "coding contest", "coding competition", "competitive programming",
      "dsa contest", "algorithms contest"],
    response: "SPLASH is SCOPE's campus coding competition focused on logical thinking, DSA, algorithms, and competitive programming speed.",
  },
  {
    id: "gamehub",
    patterns: ["gamehub", "game hub", "game development event", "game hackathon", "gamehub 2.0"],
    response: "GameHub 2.0 was SCOPE's game development hackathon where teams designed and built real games from scratch over a weekend.",
  },
  {
    id: "codestats",
    patterns: ["codestats", "code stats", "coding platform", "assessment platform",
      "coding practice", "scope platform"],
    response: "CodeStats is a coding assessment platform built by SCOPE Club members — for students. It was created as a student-made tool to support coding practice and skill assessment on campus.",
  },

  /* ── RESOURCES ──────────────────────────────────────────── */
  {
    id: "resources-general",
    patterns: ["resources", "learning resources", "study material", "where can i learn",
      "where are resources", "find resources", "tutorials", "docs", "documentation"],
    response: "SCOPE has a curated Resources page with free learning materials across all major domains.\n\nCategories include Python, Frontend, Backend, ML, Git, DevOps, AppDev, Android, iOS, GameDev, and OpenSource.\n\nOpen the Resources page and use the category filter to find what you need.",
    link: { label: "Browse Resources →", href: "resources.html" },
  },
  {
    id: "resources-python",
    patterns: ["python resources", "learn python", "python docs", "python tutorial", "automate boring stuff"],
    response: "For Python resources, open the Resources page and select the Python filter.\n\nYou'll find the official Python 3 Documentation and 'Automate the Boring Stuff with Python' — a free practical ebook.",
    link: { label: "Python Resources →", href: "resources.html?category=Python" },
  },
  {
    id: "resources-frontend",
    patterns: ["frontend resources", "web resources", "html css", "javascript resources",
      "mdn", "odin project", "css tricks", "learn frontend", "web development resources"],
    response: "For Frontend resources, open the Resources page and select Frontend.\n\nIncludes MDN Web Docs, The Odin Project, and CSS Tricks.",
    link: { label: "Frontend Resources →", href: "resources.html?category=Frontend" },
  },
  {
    id: "resources-backend",
    patterns: ["backend resources", "nodejs", "fastapi", "server resources", "api resources", "learn backend"],
    response: "For Backend resources, open the Resources page and select Backend.\n\nIncludes Node.js Documentation and FastAPI Documentation.",
    link: { label: "Backend Resources →", href: "resources.html?category=Backend" },
  },
  {
    id: "resources-ml",
    patterns: ["ml resources", "machine learning resources", "deep learning", "fastai",
      "kaggle", "ai resources", "data science resources", "learn ml"],
    response: "For ML resources, open the Resources page and select ML.\n\nIncludes fast.ai Practical Deep Learning and Kaggle Learn.",
    link: { label: "ML Resources →", href: "resources.html?category=ML" },
  },
  {
    id: "resources-git",
    patterns: ["git resources", "github resources", "version control", "pro git", "github skills", "learn git"],
    response: "For Git resources, open the Resources page and select Git.\n\nIncludes Pro Git Book (free online) and GitHub Skills.",
    link: { label: "Git Resources →", href: "resources.html?category=Git" },
  },
  {
    id: "resources-devops",
    patterns: ["devops resources", "aws resources", "docker resources", "cloud resources",
      "learn devops", "learn aws", "learn docker", "infrastructure"],
    response: "For DevOps resources, open the Resources page and select DevOps.\n\nIncludes AWS Documentation and Docker Official Docs.",
    link: { label: "DevOps Resources →", href: "resources.html?category=DevOps" },
  },
  {
    id: "resources-gamedev",
    patterns: ["game dev resources", "unity resources", "godot resources", "game resources",
      "learn game development", "game programming"],
    response: "For Game Dev resources, open the Resources page and select GameDev.\n\nIncludes Unity Learn (official tutorials) and the Godot Engine Documentation.",
    link: { label: "GameDev Resources →", href: "resources.html?category=GameDev" },
  },
  {
    id: "resources-opensource",
    patterns: ["open source resources", "first contribution", "good first issue",
      "contribute to open source", "learn open source", "opensource resources"],
    response: "For Open Source resources, open the Resources page and select OpenSource.\n\nIncludes First Contributions (beginner guide to PRs) and Good First Issues.",
    link: { label: "OpenSource Resources →", href: "resources.html?category=OpenSource" },
  },
  {
    id: "resources-appdev",
    patterns: ["app dev resources", "flutter", "react native", "mobile resources",
      "cross platform", "appdev", "mobile app"],
    response: "For App Development resources, open the Resources page and select AppDev.\n\nIncludes Flutter Documentation and React Native Documentation.",
    link: { label: "AppDev Resources →", href: "resources.html?category=AppDev" },
  },
  {
    id: "resources-android",
    patterns: ["android resources", "kotlin resources", "android development", "learn android", "learn kotlin"],
    response: "For Android resources, open the Resources page and select Android.\n\nIncludes the Android Developer Guides and Kotlin Documentation.",
    link: { label: "Android Resources →", href: "resources.html?category=Android" },
  },
  {
    id: "resources-ios",
    patterns: ["ios resources", "swift resources", "swiftui", "apple development", "learn ios", "learn swift"],
    response: "For iOS resources, open the Resources page and select iOS.\n\nIncludes the Swift Documentation and Apple Developer Documentation.",
    link: { label: "iOS Resources →", href: "resources.html?category=iOS" },
  },

  /* ── TEAM ───────────────────────────────────────────────── */
  {
    id: "team-general",
    patterns: ["team", "who runs scope", "scope members", "club members",
      "board of directors", "club head", "who leads", "team page",
      "meet the team", "club lead", "president", "secretary"],
    response: "SCOPE has a Board of Directors and domain teams covering Web, App, AI/ML, Cloud, Game Dev, and Open Source.\n\nTeam member profiles will be updated with confirmed names, roles, and photos.\n\nOpen the Team page to see the current structure.",
    link: { label: "Meet the Team →", href: "team.html" },
  },

  /* ── CONTACT ────────────────────────────────────────────── */
  {
    id: "contact-general",
    patterns: ["contact", "how to contact", "reach scope", "email scope",
      "get in touch", "contact details", "scope email", "write to scope",
      "message scope", "contact us"],
    response: "You can reach SCOPE Club at:\n\n📧 scopeclub@mlrinstitutions.ac.in\n\nOr open the Contact page to send a message directly.",
    link: { label: "Contact Us →", href: "contact.html" },
  },
  {
    id: "social-links",
    patterns: ["instagram", "linkedin", "twitter", "github", "social media",
      "follow scope", "scope instagram", "scope linkedin", "scope github",
      "scope twitter", "social links", "x scope"],
    response: "Find SCOPE on social media:\n\n📸 Instagram: @mlrit_scope\n💼 LinkedIn: SCOPE Club MLRIT\n🐦 X / Twitter: @MlritScope\n💻 GitHub: github.com/scopeclub\n\nAll links are in the footer of every page.",
  },

  /* ── JOIN ───────────────────────────────────────────────── */
  {
    id: "join-general",
    patterns: ["join scope", "how to join", "become a member", "apply",
      "membership", "enroll", "register", "sign up", "join the club",
      "how do i join", "can i join"],
    response: "SCOPE is open to all MLRIT students who want to build, learn, and grow — any year, any branch.\n\nOpen the Join Us page to express your interest. Fill in your name, email, year, domain of interest, and why you want to join.",
    link: { label: "Join SCOPE →", href: "join.html" },
  },
  {
    id: "why-join",
    patterns: ["why join", "benefits of joining", "why should i join",
      "what will i learn", "what do i get", "reason to join",
      "worth joining", "scope benefits"],
    response: "Why join SCOPE?\n\n→ Build real projects, not just theory\n→ Seniors who mentor without gatekeeping\n→ Hackathons, contests, and workshops all year\n→ Hands-on cloud and AWS experience\n→ A technical community across Web, App, ML, Cloud, and Game Dev\n→ Learn by doing — not just watching",
    link: { label: "Join SCOPE →", href: "join.html" },
  },

  /* ── NAVIGATION ─────────────────────────────────────────── */
  {
    id: "nav-home",
    patterns: ["home page", "go home", "main page", "homepage", "back to home"],
    response: "The Home page has an overview of SCOPE, the featured event, What We Do, and Why Join.",
    link: { label: "Go to Home →", href: "index.html" },
  },
  {
    id: "nav-events",
    patterns: ["where are events", "go to events", "events page", "find events"],
    response: "Open the Events page to browse Active, Upcoming, and Past events. Click 'More Info' for full event details and galleries.",
    link: { label: "Go to Events →", href: "events.html" },
  },
  {
    id: "nav-resources",
    patterns: ["where are resources", "go to resources", "resources page", "find resources"],
    response: "Open the Resources page and use the category filter to find curated learning materials.",
    link: { label: "Go to Resources →", href: "resources.html" },
  },
  {
    id: "nav-team",
    patterns: ["where is team", "go to team", "team page"],
    response: "Open the Team page to see SCOPE's Board and domain teams.",
    link: { label: "Go to Team →", href: "team.html" },
  },
  {
    id: "nav-contact",
    patterns: ["where is contact", "go to contact", "contact page", "find contact"],
    response: "Open the Contact page for the email address, physical address, social links, and message form.",
    link: { label: "Go to Contact →", href: "contact.html" },
  },
  {
    id: "nav-join",
    patterns: ["where is join", "go to join", "join page", "find join page"],
    response: "Open the Join Us page to express your interest in becoming a SCOPE member.",
    link: { label: "Go to Join Us →", href: "join.html" },
  },
];

/* ── Suggested quick-chips shown in welcome state ── */
const CHAT_SUGGESTIONS = [
  { label: "About SCOPE", text: "What is SCOPE Club?" },
  { label: "Current events", text: "What events are happening?" },
  { label: "How to join", text: "How do I join SCOPE?" },
  { label: "Resources", text: "Where are the learning resources?" },
  { label: "Contact SCOPE", text: "How do I contact SCOPE?" },
];

/* ============================================================
   INTENT MATCHER — offline KB
   ============================================================ */
function matchIntent(raw) {
  const msg = raw.toLowerCase().trim();

  let best = null, bestScore = 0;
  for (const entry of SCOPE_KB) {
    for (const pattern of entry.patterns) {
      if (msg.includes(pattern)) {
        const score = pattern.length;
        if (score > bestScore) { bestScore = score; best = entry; }
      }
    }
  }

  if (!best) {
    const tokens = msg.split(/\s+/).filter(t => t.length > 2);
    let tokenBest = null, tokenBestScore = 0;
    for (const entry of SCOPE_KB) {
      let score = 0;
      for (const pattern of entry.patterns) {
        const pTokens = pattern.split(/\s+/);
        for (const pt of pTokens) { if (tokens.includes(pt)) score++; }
      }
      if (score > tokenBestScore) { tokenBestScore = score; tokenBest = entry; }
    }
    if (tokenBestScore >= 2) best = tokenBest;
  }

  return best;
}

/* ============================================================
   LIVE AI — backend call with offline fallback
   ============================================================ */

/** Tracks whether the backend is known-unavailable in this session */
let _aiUnavailable = false;

/**
 * Try the live AI backend. Returns { reply, link: null } on success,
 * or null if the backend is unavailable (caller falls back to KB).
 */
async function callLiveAI(userText) {
  if (!AI_ENABLED || _aiUnavailable) return null;

  try {
    const payload = {
      message: userText,
      conversation: _conversation.slice(-MAX_HISTORY_TURNS * 2),
    };

    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000), /* 12 s timeout */
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const isServerError = response.status >= 500;
      if (isServerError) {
        /* Mark unavailable for this session to avoid repeated failures */
        _aiUnavailable = true;
      }
      /* Surface the server's user-facing error if present */
      const errMsg = data.error || (isServerError
        ? "SCOPE AI is temporarily unavailable."
        : "I couldn't process that request.");
      return { error: errMsg };
    }

    const data = await response.json();
    if (!data.success || !data.reply) {
      return { error: "SCOPE AI returned an empty response." };
    }

    return { reply: data.reply };

  } catch (err) {
    /* Network failure, timeout, CORS, etc. — fall back silently */
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      return { error: "SCOPE AI is taking too long. Showing offline answer instead." };
    }
    /* Network unreachable — mark unavailable and fall back quietly */
    _aiUnavailable = true;
    return null;
  }
}

/* ============================================================
   WIDGET
   ============================================================ */
let _chatBuilt = false;
let _chatOpen = false;

function buildChatWidget() {
  if (_chatBuilt) return;
  _chatBuilt = true;

  /* Status label reflects the configured mode */
  const modeLabel = AI_ENABLED
    ? `<span class="chat-mode-badge chat-mode-ai" aria-live="polite">// AI</span>`
    : `<span class="chat-mode-badge chat-mode-offline">// offline</span>`;

  const panel = document.createElement("div");
  panel.id = "chat-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "SCOPE Club Help");
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = `
    <div class="chat-header">
      <div style="display:flex;align-items:center;gap:0.55rem;">
        <span class="status-dot" aria-hidden="true"></span>
        <span>SCOPE Help</span>
        ${modeLabel}
      </div>
      <button id="chat-close" aria-label="Close help chat">&#215;</button>
    </div>
    <div class="chat-messages" id="chat-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>
    <div class="chat-suggestions" id="chat-suggestions" aria-label="Suggested questions"></div>
    <form class="chat-input-bar" id="chat-form" autocomplete="off">
      <label for="chat-input" class="visually-hidden">Ask about SCOPE</label>
      <input id="chat-input" type="text"
             placeholder="Ask about events, joining, resources…"
             aria-label="Ask about SCOPE" />
      <button type="submit" aria-label="Send message">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </form>
  `;
  document.body.appendChild(panel);

  /* Welcome message */
  const welcomeText = AI_ENABLED
    ? "Hi! I'm the SCOPE AI assistant. Ask me anything about SCOPE Club, events, resources, or how to join."
    : "Hi! I'm the SCOPE Help assistant. I can answer questions about SCOPE Club, events, resources, joining, and how to navigate the site.";
  appendBotMessage(welcomeText, null);
  renderSuggestions();

  document.getElementById("chat-close").addEventListener("click", closeChatWidget);

  document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    handleUserMessage(text);
  });

  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeChatWidget();
  });
}

function renderSuggestions() {
  const bar = document.getElementById("chat-suggestions");
  if (!bar) return;
  bar.innerHTML = CHAT_SUGGESTIONS.map(s =>
    `<button class="chat-chip" type="button" aria-label="Ask: ${s.text}">${s.label}</button>`
  ).join("");
  bar.querySelectorAll(".chat-chip").forEach((btn, i) => {
    btn.addEventListener("click", () => {
      hideSuggestions();
      handleUserMessage(CHAT_SUGGESTIONS[i].text);
    });
  });
}

function hideSuggestions() {
  const bar = document.getElementById("chat-suggestions");
  if (bar) bar.style.display = "none";
}

/* ── Main message handler — async, supports live AI + KB fallback ── */
async function handleUserMessage(text) {
  appendUserMessage(text);
  hideSuggestions();

  const typingEl = appendTyping();

  /* ── Try live AI first ── */
  if (AI_ENABLED) {
    /* Optimistically add to history; remove on failure */
    addToHistory("user", text);
    const aiResult = await callLiveAI(text);

    if (aiResult && aiResult.reply) {
      typingEl.remove();
      addToHistory("assistant", aiResult.reply);
      updateModeLabel(true);
      appendBotMessage(aiResult.reply, null);
      return;
    }

    if (aiResult && aiResult.error) {
      /* Server returned a user-facing error — show it, then KB fallback */
      typingEl.remove();
      /* Pop the user turn we added since we're going to offline KB */
      _conversation.pop();
      updateModeLabel(false);
      appendBotMessage(aiResult.error + "\n\nHere's what I found in my local knowledge base:", null);
      /* Fall through to KB match below */
      const match = matchIntent(text);
      if (match) {
        appendBotMessage(match.response, match.link || null);
      }
      return;
    }

    /* null = silent network failure, fall through to KB */
    _conversation.pop();
    updateModeLabel(false);
  }

  /* ── Offline KB fallback ── */
  setTimeout(() => {
    typingEl.remove();
    const match = matchIntent(text);
    if (match) {
      appendBotMessage(match.response, match.link || null);
    } else {
      appendBotMessage(
        "I can help with verified information about SCOPE — events, resources, how to join, and contact info. Try one of the suggestions below.",
        null
      );
      renderSuggestions();
      const sugBar = document.getElementById("chat-suggestions");
      if (sugBar) sugBar.style.display = "flex";
    }
  }, 380);
}

/** Dynamically update the mode badge after a backend failure */
function updateModeLabel(isAI) {
  const badge = document.querySelector(".chat-mode-badge");
  if (!badge) return;
  if (isAI) {
    badge.textContent = "// AI";
    badge.className = "chat-mode-badge chat-mode-ai";
  } else {
    badge.textContent = "// offline";
    badge.className = "chat-mode-badge chat-mode-offline";
  }
}

/* ── DOM helpers ── */
function appendUserMessage(text) {
  const list = document.getElementById("chat-messages");
  const el = document.createElement("div");
  el.className = "chat-bubble user";
  el.textContent = text;
  list.appendChild(el);
  list.scrollTop = list.scrollHeight;
}

function appendBotMessage(text, link) {
  const list = document.getElementById("chat-messages");
  const el = document.createElement("div");
  el.className = "chat-bubble bot";

  const para = document.createElement("p");
  para.style.cssText = "margin:0;white-space:pre-line;";
  para.textContent = text;
  el.appendChild(para);

  if (link) {
    const a = document.createElement("a");
    a.href = link.href;
    a.textContent = link.label;
    a.className = "chat-link-btn";
    a.setAttribute("aria-label", link.label);
    a.addEventListener("click", closeChatWidget);
    el.appendChild(a);
  }

  list.appendChild(el);
  list.scrollTop = list.scrollHeight;
  return el;
}

function appendTyping() {
  const list = document.getElementById("chat-messages");
  const el = document.createElement("div");
  el.className = "chat-bubble bot typing";
  el.setAttribute("aria-label", "SCOPE is typing");
  el.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
  list.appendChild(el);
  list.scrollTop = list.scrollHeight;
  return el;
}

/* ── Open / Close ── */
function openChatWidget() {
  if (!_chatBuilt) buildChatWidget();
  const panel = document.getElementById("chat-panel");
  const launcher = document.getElementById("chat-launcher");
  if (!panel) return;
  _chatOpen = true;
  panel.style.display = "flex";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
    });
  });
  if (launcher) launcher.setAttribute("aria-expanded", "true");
  setTimeout(() => {
    const inp = document.getElementById("chat-input");
    if (inp) inp.focus();
  }, 280);
}

function closeChatWidget() {
  const panel = document.getElementById("chat-panel");
  const launcher = document.getElementById("chat-launcher");
  if (!panel) return;
  _chatOpen = false;
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    if (!panel.classList.contains("is-open")) panel.style.display = "";
  }, 300);
  if (launcher) {
    launcher.setAttribute("aria-expanded", "false");
    launcher.focus();
  }
}

/* ── Launcher ── */
document.addEventListener("DOMContentLoaded", () => {
  const launcher = document.createElement("button");
  launcher.id = "chat-launcher";
  launcher.setAttribute("aria-label", AI_ENABLED ? "Open SCOPE AI assistant" : "Open SCOPE help chat");
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "chat-panel");
  launcher.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  `;
  document.body.appendChild(launcher);
  launcher.addEventListener("click", () => {
    if (_chatOpen) closeChatWidget();
    else openChatWidget();
  });
});
