/* ============================================================
   TEAM PAGE — Board of Directors + domain teams
   Members without confirmed names/photos are not rendered publicly.
   The structure is data-ready for real member insertion in data.js.
   ============================================================ */

/* Domain descriptions for the team page structure */
const TEAM_DOMAIN_DESCRIPTIONS = {
  board: "Leads and oversees all SCOPE Club operations, events, and initiatives.",
  web: "Building web projects and exploring full-stack development across the club.",
  app: "Creating cross-platform mobile apps with Flutter, React Native, and Kotlin.",
  ml: "Exploring machine learning, deep learning, and AI projects from notebooks to deployments.",
  cloud: "AWS-powered projects, serverless infrastructure, and cloud-native development.",
  gamedev: "Game design, Unity/Godot projects, and game-jam style hackathons.",
  opensource: "Contributing to open-source repos, practising Git workflows, and building tools.",
};

function renderTeams() {
  const root = document.getElementById("teams-root");
  if (!root) return;

  const hasAnyMembers = SCOPE_TEAMS.some((t) => t.members && t.members.length > 0);

  if (!hasAnyMembers) {
    /* No confirmed member data yet — show intentional, well-structured placeholder */
    root.innerHTML = `
      <div class="team-coming-soon reveal">
        <div class="team-coming-icon" aria-hidden="true">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <h2 class="team-coming-heading">Team profiles coming soon</h2>
        <p class="team-coming-subtext">
          Confirmed member names, roles, and photos will appear here once supplied.<br>
          Follow us on
          <a href="https://www.instagram.com/mlrit_scope/" target="_blank" rel="noopener noreferrer">
            @mlrit_scope
          </a>
          for the latest updates.
        </p>
        <p class="team-coming-note">
          <span class="font-mono" style="color:var(--accent);">//</span>
          The section below shows SCOPE's current team structure and the domains we operate in.
        </p>
      </div>

      <div class="team-structure-section">
        <p class="eyebrow" style="margin-bottom:1.5rem;">// team structure</p>
        <div class="what-we-do-grid team-domain-grid">
          ${SCOPE_TEAMS.map((team) => {
      const desc = TEAM_DOMAIN_DESCRIPTIONS[team.id] ||
        "Domain team working on " + team.name.toLowerCase() + " projects and events.";
      const icon = team.isBoard ? "⚙️" :
        team.id === "web" ? "🌐" :
          team.id === "app" ? "📱" :
            team.id === "ml" ? "🧠" :
              team.id === "cloud" ? "☁️" :
                team.id === "gamedev" ? "🎮" :
                  team.id === "opensource" ? "🔓" : "👥";
      return `
              <div class="wwd-scene team-domain-card reveal"
                   tabindex="0"
                   role="group"
                   aria-label="${team.name} team">
                <div class="wwd-flipper">
                  <div class="wwd-face wwd-front">
                    <span class="wwd-icon" aria-hidden="true">${icon}</span>
                    <h3 class="wwd-title">${team.name}</h3>
                    <p class="wwd-desc">${desc}</p>
                    <span class="wwd-flip-hint" aria-hidden="true">tap for details →</span>
                  </div>
                  <div class="wwd-face wwd-back" aria-hidden="true">
                    <span class="wwd-back-icon" aria-hidden="true">${icon}</span>
                    <h3 class="wwd-back-title">${team.name}</h3>
                    <p style="font-size:0.82rem;color:var(--text-muted);margin:0 0 0.85em;line-height:1.55;">${desc}</p>
                    <p style="font-size:0.76rem;color:var(--text-faint);font-family:var(--font-mono);margin:0;">
                      ${team.isBoard ? "Oversees all domains" : "Recruiting members"}
                    </p>
                  </div>
                </div>
              </div>
            `;
    }).join("")}
        </div>
      </div>
    `;
    root.querySelectorAll(".reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("is-visible"), i * 55);
    });
    /* Init flip cards after render */
    if (typeof initWwdCards === "function") initWwdCards();
    return;
  }

  /* Render confirmed teams */
  root.innerHTML = SCOPE_TEAMS
    .filter((team) => team.members && team.members.length > 0)
    .map((team) => `
      <div class="team-section reveal">
        <h2 class="team-section-title">${team.name}</h2>
        <div class="grid${team.isBoard ? " board-grid" : ""}">
          ${team.members.map(memberCardHTML).join("")}
        </div>
      </div>
    `).join("");

  /* Staggered reveal */
  root.querySelectorAll(".reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("is-visible"), i * 60);
  });
}

document.addEventListener("DOMContentLoaded", renderTeams);
