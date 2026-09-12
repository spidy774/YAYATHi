# SCOPE CLUB — FINAL SOURCE OF TRUTH FOR KIRO
## AWS CLOUD TREK 2026 Website

**Purpose:** This document is the final consolidated instruction/reference layer for Kiro.
Use it together with the existing `scope-site` project. Do not blindly merge every
reference code snippet. The Claude project is the implementation foundation; Grok is
the product/requirements layer; Gemini is a visual/content/reference layer; the
official AWS Cloud Trek problem statement is the workshop requirement layer; the
two assets in `01_USER_ASSETS` are real assets supplied by the project owner.

---

# 1. FINAL GOAL

Turn the existing SCOPE Club website from its current basic foundation into a
polished, distinctive **8.7–9.2/10** student-club website.

It must feel like a real technical club built by people who understand engineering,
not like an AI-generated neon template.

The site must remain:
- realistic
- fast
- responsive
- accessible
- maintainable
- static-S3 compatible
- easy to update with real team/event/resource assets
- faithful to SCOPE identity

Do not rebuild the whole project unnecessarily.

---

# 2. SOURCE / DECISION PRIORITY

When sources conflict, use this order:

1. Official AWS CLOUD TREK 2026 problem statement
2. Real assets/content explicitly supplied by the project owner
3. User-supplied SCOPE Club logo
4. User-supplied current AWS Cloud Trek 2026 poster
5. User-supplied final About SCOPE copy in this document
6. Project-provided Gemini links/content
7. Grok master specification
8. Gemini UI/code ideas
9. Claude existing implementation
10. Engineering judgment

Never fabricate:
- people
- names
- roles
- photographs
- events
- dates
- times
- locations
- statistics
- achievements
- resource URLs
- social URLs
- joining requirements
- contact details

If something is not actually supplied/verified, make the data structure ready for
it but do not create fake factual content.

---

# 3. FILES THAT WERE RECHECKED

The consolidated reference package was re-opened and checked.

## Correct master package

`SCOPE_Master_AI_Package.zip`

It contains:

```text
SCOPE_Master_Package/
├── 01_GROK_MASTER_SPEC/
│   └── GROK_MASTER_SPEC.md
├── 02_GEMINI_CODE/
│   ├── gemini_events.html
│   ├── gemini_file_1.html
│   ├── gemini_footer.html
│   └── gemini_team.html
├── 03_CLAUDE_CODEBASE/
│   └── scope-site/
│       ├── README.md
│       ├── index.html
│       ├── team.html
│       ├── events.html
│       ├── resources.html
│       ├── contact.html
│       ├── join.html
│       ├── css/styles.css
│       ├── js/data.js
│       ├── js/components.js
│       ├── js/main.js
│       ├── js/events.js
│       ├── js/team.js
│       ├── js/resources.js
│       ├── js/forms.js
│       ├── js/chatbot.js
│       ├── api/chat.js
│       ├── api/submit-form.js
│       └── assets/
│           ├── placeholder-avatar.svg
│           └── placeholder-banner.svg
├── 04_NEXT_CHAT_PROMPT/
│   └── START_HERE.md
└── README.md
```

The older `SCOPE_Club_All_AI_Claude_Gemini_Grok_Compilation.zip` was also checked.
It contains the Claude codebase only; it is not the complete combined package.
Use `SCOPE_Master_AI_Package.zip` / this final source-of-truth package instead.

---

# 4. OFFICIAL WORKSHOP REQUIREMENTS

The AWS Cloud Trek 2026 problem statement requires:

### Level 1
- Home
- About / Inside SCOPE
- What We Do
- Events
- Resources
- Contact
- navigation/menu
- clean layout
- SCOPE Club logo/banner
- local functionality

### Level 2
- responsive/mobile-friendly
- hover effects or animations
- event cards
- Instagram/LinkedIn links
- optional dark/light mode

### Level 3
- AWS account
- S3 bucket
- static website hosting
- upload website files
- permissions
- publish
- public AWS URL

The final site must satisfy the website requirements before deployment.

---

# 5. ACTUAL USER ASSETS — IMPORTANT

Two real assets are included in this package.

## Asset A — SCOPE Club logo

File:

`01_USER_ASSETS/branding/scope-club-logo.jpg`

This is the **real SCOPE Club logo** supplied by the project owner.

Use it for:
- navbar
- footer
- branding/identity areas
- hero where appropriate

Do NOT recreate the logo as text.

Do NOT replace it with `SCOPE.CLUB` text.

The logo's visual language includes:
- SCOPE CLUB wordmark
- School of Programming Excellence
- green
- cyan
- purple
- technical/computer symbol

If the implementation needs a transparent/optimized version, preserve the supplied
logo itself and create an optimized derivative only if useful. Do not redesign it.

Recommended final project location:

`assets/images/branding/scope-club-logo.jpg`

or an equivalent clean path.

---

## Asset B — current event poster

File:

`01_USER_ASSETS/events/aws-cloud-trek-2026-poster.jpg`

This is the **real current AWS Cloud Trek 2026 event poster supplied by the
project owner**.

Use it as the primary image for the current Active/Live event.

Visible event identity includes:
- AWS CLOUD TREK 2026
- Move beyond AI coding to agentic engineering
- A 2-day Bootcamp and Contest
- MLRIT
- AWS Student Builder Group at MLR Institute of Technology
- AWS / SCOPE Club branding

Do NOT replace this poster with an AI-generated event image.

Recommended final project location:

`assets/images/events/aws-cloud-trek-2026-poster.jpg`

---

# 6. FINAL ABOUT SCOPE COPY

Use this combined version. It merges the two supplied About drafts while removing
unnecessary repetition.

## About SCOPE Club

SCOPE Club is the official technical club of MLRIT.

Founded to build a strong coding culture on campus, SCOPE started with a simple mission — help students learn, collaborate, and grow beyond the classroom. What began as a community focused on programming and problem-solving has grown into one of the most active technical clubs at MLRIT.

Over the years, SCOPE has organized campus coding contests like SPLASH, game development hackathons such as GameHub 2.0, and major flagship events like ZENITH 24 – DataVoyage and ZENITH 25. The club has also expanded into cloud computing, hosting a two-day AWS Cloud Workshop in collaboration with AWS Cloud Club MLRIT, and built CodeStats — a coding assessment platform created by students, for students.

Today, SCOPE covers Web Development, App Development, Game Development, AI/ML, Open Source, and more. More than just events, SCOPE is a platform where seniors mentor juniors, students work on real projects, and a supportive technical community thrives beyond hostel boundaries.

At SCOPE, we don’t just learn technology — we build with it.


Do not rewrite this into exaggerated marketing claims.

---

# 7. PROJECT-PROVIDED GEMINI LINKS / CONTACT DETAILS

The Gemini reference files contain these project-provided links/details.

Preserve them in the appropriate footer/contact/social locations, subject to normal
link testing. Do not invent replacements.

### GitHub
`https://github.com/scopeclub`

### Instagram
`https://www.instagram.com/mlrit_scope/`

### LinkedIn
`https://www.linkedin.com/in/scope-club-mlrit/`

### X
`https://x.com/MlritScope`

### Email
`scopeclub@mlrinstitutions.ac.in`

### Maps
`https://maps.google.com/?q=MLR+Institute+of+Technology`

### Address
```text
MT 003-SCOPE CLUB, MLRIT,
Dundigal Police Station Road,
Hyderabad - 500 043, Telangana, India.
```

Important:
- These are the links/details found in the supplied Gemini reference.
- Do not invent additional social URLs.
- Do not create fake individual-member social URLs.
- If a link is unavailable/broken during QA, flag it rather than replacing it with
  an invented URL.

CodeStats is part of the desired SCOPE information architecture, but no concrete
CodeStats URL should be invented. Use the real URL only when supplied/verified.

---

# 8. CURRENT CLAUDE CODEBASE — WHAT IS ALREADY THERE

The current project is a vanilla HTML/CSS/JS architecture:

```text
index.html
team.html
events.html
resources.html
contact.html
join.html

css/styles.css

js/
  data.js
  components.js
  main.js
  events.js
  team.js
  resources.js
  forms.js
  chatbot.js

api/
  chat.js
  submit-form.js
```

Keep this architecture unless a specific change is clearly justified.

`index.html` MUST remain at the root because the intended deployment is S3 static
website hosting.

---

# 9. CURRENT CODEBASE GAPS FOUND DURING RECHECK

The current Claude project is useful, but it is not final.

Known issues:

1. Navbar currently uses text branding rather than the supplied real SCOPE logo.
2. About / Inside SCOPE is not sufficiently represented.
3. Team data contains placeholder people and placeholder images.
4. Gemini team names/roles must not be blindly published; they need confirmation.
5. Event data contains sample/placeholder data.
6. Current event poster must be replaced by the supplied real poster.
7. Past event data from Gemini is useful reference material but must be treated as
   project-provided content and checked before final publication.
8. Placeholder event images exist.
9. Resources contain placeholder entries and empty URLs.
10. Social links in Claude data are empty.
11. Join fields are placeholder schema and must not be treated as official
    SCOPE requirements.
12. Contact submission backend is a placeholder and must not falsely claim delivery.
13. Chatbot backend is Vercel-oriented and needs AWS adaptation if kept.
14. S3 deployment itself is not part of the codebase and must be performed after
    local QA.
15. Existing design is functional but visually too generic/AI-template-like.

---

# 10. HOME PAGE FINAL STRUCTURE

Use this hierarchy:

```text
NAVBAR
↓
HERO
↓
ABOUT / INSIDE SCOPE
↓
WHAT WE DO
↓
ACTIVE / FEATURED EVENTS
↓
WHY JOIN SCOPE
↓
FEATURED RESOURCES / CODESTATS / TECH AREAS
↓
STRONG FINAL CTA
↓
FOOTER
```

## Hero

Use:
- real SCOPE logo
- strong headline
- concise real club description
- Join SCOPE CTA
- Explore Events CTA
- optional Resources/CodeStats CTA if verified

The existing phrase:

`Build. Break. Ship. That's SCOPE.`

may remain as a visual/brand line if it fits the composition.

Do not let it replace the real description of SCOPE.

---

# 11. WHAT WE DO

At minimum:

- Hackathons
- Coding Contests
- Projects

Verified additional areas can include:
- Web Development
- App Development
- Game Development
- AI/ML
- Open Source
- Mentorship
- Cloud Computing

Do not invent activities that are not supported by the supplied project material.

---

# 12. WHY JOIN SCOPE

Make this a persuasive section, but truthful.

Emphasize:
- practical skills
- mentorship
- collaboration
- real projects
- coding culture
- technical events
- learning by building
- growing beyond classroom boundaries

Avoid:
- guaranteed jobs
- guaranteed placements
- fake member counts
- fake hiring claims
- fake internship guarantees
- exaggerated statistics

---

# 13. EVENTS SYSTEM

Keep exactly:

```text
[ ACTIVE / LIVE ] [ UPCOMING ] [ PAST ]
```

The current AWS Cloud Trek 2026 poster supplied in this package should be used
for the current event.

For the current event, use the supplied poster and real event information from the
project materials. The poster indicates:
- AWS Cloud Trek 2026
- 11th & 12th September 2026
- 2-day Bootcamp and Contest
- agentic engineering theme
- MLRIT / AWS Student Builder Group / SCOPE Club branding

Do not create alternative dates.

### Event cards

Show:
- poster/image
- title
- status
- date
- time if known
- location if known
- concise description
- More Info

### LIVE treatment

Use:
- strong but restrained LIVE badge
- subtle pulse
- small active indicator

No aggressive flashing.

### Event modal

Must support:
- event image/poster
- title
- status
- date
- time
- location
- description
- gallery only if real images exist
- external link only if verified

Accessibility:
- `role="dialog"`
- `aria-modal="true"`
- labelled title
- close button
- Escape closes
- outside click closes
- focus trap
- restore focus to trigger
- body scroll lock
- keyboard accessible
- scrollable
- mobile-friendly

Avoid clickable `<div>` elements where a real `<button>` or `<a>` is appropriate.

---

# 14. VERIFIED/PROJECT-PROVIDED HISTORICAL EVENT CONTENT

The project materials contain:

### SPLASH
Campus coding competition focused on:
- logical thinking
- problem solving
- DSA
- algorithms
- programming speed
- competitive programming

### GameHub 2.0
Game-development-related hackathon/event from 2021–22.

### ZENITH 24 — DataVoyage
7–9 November 2024.

### ZENITH 25
18–20 December 2025.

### AWS Cloud Workshop
Two-day AWS workshop in October 2025 in collaboration with AWS Cloud Club MLRIT.
Project material references:
- Amazon S3
- EC2
- cloud infrastructure
- storage
- security
- application deployment
- custom domains

### CodeStats
Coding practice/assessment platform associated with SCOPE Club.

Use these only as supported project content. If a specific poster, description,
location or external URL is unavailable, do not fabricate it.

---

# 15. TEAM PAGE

Required structure:

```text
Board of Directors
↓
Team sections
↓
Member cards
```

The Gemini team reference contains a Board entry and a Team 2k27 set of names.
Those names MUST NOT automatically be treated as confirmed merely because Gemini
generated code for them.

Current implementation should therefore be:

- data-driven
- real-photo-ready
- easy to replace
- no generated faces
- no fake names in the public final version

Each confirmed member:
- real photo
- real name
- real role
- verified social links where available

Interaction:
- hover lift
- subtle glow
- slight image movement
- social icons reveal
- keyboard/focus equivalent
- mobile tap/focus equivalent

---

# 16. RESOURCES

Keep the filter system.

Reference categories:
- All
- AppDev
- Python
- Frontend
- Backend
- ML
- Git
- DevOps
- Android / Kotlin
- iOS / Swift

Card:
- title
- category
- resource type
- description
- Visit

Possible resource types:
- ebook
- documentation
- tutorial
- video
- GitHub

Only use actual resource links.

Never generate fake resource URLs.

---

# 17. CONTACT

Use:

`Get in Touch!`

Fields:
- Name
- Email
- Message
- Connect

Need:
- semantic labels
- validation
- loading
- success
- error
- keyboard accessibility
- mobile responsiveness

Do NOT show a fake success message.

The existing `api/submit-form.js` is only a placeholder. Either connect a real
backend/service or make the static-demo behavior transparent.

---

# 18. JOIN US

Make this feel like a real CTA/application experience.

Use:
- why join
- what members can learn/do
- real joining process only if verified
- application form only if verified

Never invent eligibility/application requirements.

The current Claude JOIN_FIELDS are placeholder schema and must not be treated as
official requirements.

---

# 19. FOOTER

Use the Gemini footer concept, but improve it.

Include where supported:
- real SCOPE logo
- MLRIT logo if a verified asset exists
- Instagram
- LinkedIn
- X
- GitHub
- CodeStats if a real URL exists
- official email
- official address
- navigation

The Gemini footer supplied:
- SCOPE logo path
- MLRIT logo path
- X: `https://x.com/MlritScope`
- Instagram: `https://www.instagram.com/mlrit_scope/`
- LinkedIn: `https://www.linkedin.com/in/scope-club-mlrit/`
- GitHub: `https://github.com/scopeclub`
- email: `scopeclub@mlrinstitutions.ac.in`
- Maps: `https://maps.google.com/?q=MLR+Institute+of+Technology`

Use these in the corresponding places.

---

# 20. SCOPE ATMOSPHERE SYSTEM — FINAL VISUAL DIRECTION

This is the major upgrade.

Do not make a generic cyberpunk page.

Create a lightweight living technical atmosphere.

## Layer A
Deep near-black technical background.

## Layer B
Very subtle animated green/cyan/purple ambient gradient.

## Layer C
Low-opacity technical grid.

## Layer D
Limited lightweight particle/node field.

## Layer E
Desktop cursor-following soft glow.

## Layer F
Nearby nodes subtly react to cursor.

## Layer G
Subtle hero parallax.

The atmosphere should communicate:

**"This feels like SCOPE."**

Not:

**"This website has random particles."**

---

# 21. CURSOR / INTERACTIVE MOTION

Desktop:
- cursor glow
- subtle particle/node response
- grid response
- hero parallax
- small card tilt
- magnetic buttons

Hover:
- image zoom
- card lift
- controlled glow
- social reveal

Scroll:
- section reveal
- subtle parallax
- stagger only when useful

Events:
- restrained LIVE pulse

Resources:
- smooth filtering

Modal:
- smooth open/close

---

# 22. MOBILE MOTION

No cursor-only features.

On touch:
- reduce background motion
- use tap/focus states
- keep card interactions usable
- preserve readable content

Reduced motion:
- disable/reduce parallax
- disable tilt
- reduce transition distance
- keep all information usable

---

# 23. PERFORMANCE RULES

Do NOT use:
- giant looping background video
- heavy Three.js/WebGL
- hundreds of DOM particle elements
- unnecessary animation libraries
- huge dependencies

Prefer:
- CSS gradients
- CSS grid
- lightweight canvas/JS where appropriate
- requestAnimationFrame
- IntersectionObserver
- capped particles
- lazy-loaded images
- explicit image dimensions/aspect ratios
- pause expensive animation when not visible
- mobile fallback

Measure rather than claiming "zero performance impact."

---

# 24. DESIGN SYSTEM

Use the logo as the source of visual language.

### Primary
SCOPE neon green.

### Secondary
Cyan.

### Rare accent
Purple.

### Neutrals
Near-black, off-white, muted gray/green.

Do NOT make every component green.

Typography:
- strong display heading
- readable body font
- monospace for technical labels/meta

Avoid:
- gamer UI
- crypto aesthetic
- random cyberpunk
- excessive glassmorphism
- giant text everywhere
- excessive rounded rectangles
- excessive green glow

---

# 25. ASSET ARCHITECTURE

Use:

```text
assets/
└── images/
    ├── branding/
    │   ├── scope-club-logo.jpg
    │   └── mlrit-logo.*
    ├── team/
    ├── events/
    │   └── aws-cloud-trek-2026-poster.jpg
    ├── resources/
    └── gallery/
```

Keep all content paths data-driven.

Team/event/resource images should be replaceable through `data.js`.

Use:
- descriptive filenames
- `alt`
- `loading="lazy"` below the fold
- width/height/aspect ratio where useful
- object-fit
- graceful missing-image handling

Never use AI-generated faces.

---

# 26. CHATBOT

The chatbot is an optional differentiator, not something that should block the
core workshop submission.

If kept:

```text
Browser
  ↓
S3 static website
  ↓
API Gateway
  ↓
Lambda
  ↓
AI provider
```

Never put API keys in:
- HTML
- CSS
- browser JS
- public JSON
- Git

If the backend cannot be reliably completed, keep the core website fully functional
without it and show a graceful unavailable state.

---

# 27. AWS / S3

Keep:

```text
index.html
team.html
events.html
resources.html
contact.html
join.html
css/
js/
assets/
```

Static frontend must not require a Node server.

Deployment workflow:

```text
Build locally
↓
Test locally
↓
Fix all errors
↓
S3 bucket
↓
Static website hosting
↓
Upload files
↓
Configure required permissions
↓
Publish
↓
Test public AWS URL
```

Do not change this workflow unnecessarily.

---

# 28. KIRO IMPLEMENTATION ORDER

## Phase 1 — Audit
Inspect everything before modifying.

## Phase 2 — Foundation
- real SCOPE logo
- design tokens
- navbar
- footer
- About/Inside SCOPE

## Phase 3 — Atmosphere
- gradient
- grid
- nodes
- cursor glow
- parallax
- performance controller
- mobile fallback
- reduced motion

## Phase 4 — Home
- hero
- About
- What We Do
- events preview
- Why Join
- CTA

## Phase 5 — Content
- final About copy
- real event poster
- project-provided links
- verified content
- remove fake data

## Phase 6 — Events
- Active
- Upcoming
- Past
- cards
- LIVE treatment
- modal
- accessibility
- mobile

## Phase 7 — Team
- board
- teams
- real photos
- verified names/roles
- social interactions

## Phase 8 — Resources
- categories
- filter
- cards
- real links

## Phase 9 — Contact / Join
- forms
- truthful states
- verified requirements only

## Phase 10 — Chatbot
Only if reliable.

## Phase 11 — QA
Desktop/tablet/mobile/accessibility/performance.

## Phase 12 — AWS
Deploy only after the local site is stable.

---

# 29. FINAL QA — DO NOT SKIP

### Brand
[ ] Real SCOPE logo in navbar
[ ] Real SCOPE logo in footer
[ ] no fake SCOPE.CLUB text replacing logo
[ ] logo not distorted

### Workshop requirements
[ ] Home
[ ] About/Inside SCOPE
[ ] What We Do
[ ] Events
[ ] Resources
[ ] Contact
[ ] menu
[ ] responsive
[ ] animations/hover
[ ] event cards
[ ] Instagram
[ ] LinkedIn
[ ] S3-ready

### Home
[ ] cinematic hero
[ ] real identity
[ ] About
[ ] What We Do
[ ] Why Join
[ ] event preview
[ ] CTA

### Atmosphere
[ ] animated gradient
[ ] subtle grid
[ ] lightweight nodes
[ ] cursor glow
[ ] cursor interaction
[ ] parallax
[ ] no excessive motion
[ ] mobile fallback
[ ] reduced motion

### Events
[ ] Active/Live
[ ] Upcoming
[ ] Past
[ ] current AWS Cloud Trek poster
[ ] cards
[ ] LIVE badge
[ ] modal
[ ] Escape
[ ] outside click
[ ] focus trap
[ ] focus restoration
[ ] mobile modal

### Team
[ ] board
[ ] teams
[ ] real-photo-ready
[ ] no generated faces
[ ] no fake public names
[ ] social reveal
[ ] mobile equivalent

### Resources
[ ] filters
[ ] cards
[ ] categories
[ ] real links only

### Contact
[ ] validation
[ ] loading
[ ] truthful success/error

### Join
[ ] no fake requirements
[ ] useful CTA
[ ] mobile-friendly

### Footer
[ ] SCOPE logo
[ ] MLRIT logo if supplied
[ ] Instagram
[ ] LinkedIn
[ ] X
[ ] GitHub
[ ] CodeStats only if URL exists
[ ] email
[ ] address

### Technical
[ ] no console errors
[ ] no broken images
[ ] no broken internal links
[ ] no placeholder.com URLs
[ ] no fake URLs
[ ] no fake content
[ ] no API keys in frontend
[ ] no horizontal overflow
[ ] keyboard navigation
[ ] reduced motion
[ ] mobile
[ ] tablet
[ ] desktop
[ ] fast loading
[ ] S3-compatible

---

# 30. FINAL PLACEHOLDER CHECKLIST

Before public deployment, explicitly list anything still needing real information:

[ ] real team photos
[ ] confirmed team names
[ ] confirmed team roles
[ ] verified individual social URLs
[ ] remaining real event posters
[ ] remaining event dates/times/locations
[ ] remaining event descriptions
[ ] real resource links
[ ] CodeStats URL if required
[ ] verified Join requirements
[ ] verified form destination
[ ] chatbot backend configuration if used
[ ] MLRIT logo asset if not supplied

Do not hide placeholders.

---

# 31. MOST IMPORTANT DESIGN PHILOSOPHY

Premium does NOT mean:
- more gradients
- more particles
- more glass
- more animations
- more shadows

Premium means:
- authentic content
- real assets
- strong hierarchy
- intentional spacing
- excellent typography
- restrained motion
- fast interactions
- accessibility
- responsive design
- consistency
- polish

The real SCOPE logo and real event poster are the visual anchors.

The atmosphere system should enhance them.

The result should feel like:

**"A serious technical student club built by students who know how to build."**

Not:

**"An AI-generated website template with neon effects."**

---

# 32. FINAL INSTRUCTION TO KIRO

Do not start by rewriting everything.

FIRST:
1. Inspect the complete existing project.
2. Inspect the supplied reference package.
3. Inspect the supplied SCOPE logo and AWS Cloud Trek poster.
4. Compare the existing code against this source of truth.
5. Produce a concise audit.
6. Create/update the Kiro requirements/design/tasks.
7. Then implement in phases.
8. After every major phase, test before continuing.
9. Do a visual QA pass and improve the weakest 20%.
10. Remove all fake/placeholder public content that has not been verified.
11. Confirm S3 compatibility.
12. Only then prepare for AWS deployment.

Do not call the project complete just because it runs.

It must be:
**functional + authentic + visually distinctive + responsive + accessible +
performant + S3 deployable.**
