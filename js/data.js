/* ============================================================
   SCOPE CLUB — CONTENT DATA
   All content verified against the project source-of-truth.
   Team photos/names are structural placeholders until real
   photos and confirmed names are supplied by the club.
   ============================================================ */

/* ---------- Social Links ---------- */
const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/mlrit_scope/",
  linkedin: "https://www.linkedin.com/in/scope-club-mlrit/",
  github: "https://github.com/scopeclub",
  x: "https://x.com/MlritScope",
  email: "scopeclub@mlrinstitutions.ac.in",
  maps: "https://maps.google.com/?q=MLR+Institute+of+Technology",
};

/* ---------- Contact ---------- */
const SCOPE_CONTACT = {
  email: "scopeclub@mlrinstitutions.ac.in",
  address: "MT 003-SCOPE CLUB, MLRIT,\nDundigal Police Station Road,\nHyderabad - 500 043, Telangana, India.",
  maps: "https://maps.google.com/?q=MLR+Institute+of+Technology",
};

/* ---------- Events ---------- */
/*
 * statusOverride: null = auto-computed from dates.
 * For AWS Cloud Trek 2026 (11–12 Sep 2026) we force "active"
 * so it shows as LIVE NOW during the submission/demo period
 * (current date in system is 12 Sep 2026).
 */
/*
 * screenshots: additional supplied images shown in the modal gallery.
 *   - Index 0 is used as the card "back face" on desktop hover when present.
 *   - All subsequent images appear in the modal gallery strip.
 *   - Add real paths here as images are supplied — never fabricate.
 * previewUrl: optional secondary image shown on card hover (back face).
 *   Leave null when no second image is available.
 */
const SCOPE_EVENTS = [
  {
    id: "aws-cloud-trek-2026",
    title: "AWS Cloud Trek 2026",
    statusOverride: "active",
    startAt: "2026-09-11T09:00:00+05:30",
    endAt: "2026-09-12T18:00:00+05:30",
    location: "MLRIT, Hyderabad",
    shortDescription:
      "Move beyond AI coding to agentic engineering — a 2-day Bootcamp and Contest hosted by AWS Student Builder Group at MLRIT & SCOPE Club.",
    fullDescription:
      "Move beyond AI coding to agentic engineering! AWS Cloud Trek 2026 is a 2-day hands-on bootcamp and contest organized by the AWS Student Builder Group at MLR Institute of Technology in collaboration with SCOPE Club. Dive deep into modern AI workflows, autonomous agent frameworks, and real-world application deployments. Learn directly from AWS practitioners, compete in a live challenge, and walk away with hands-on cloud skills.",
    bannerUrl: "assets/images/events/aws-cloud-trek-2026-poster.jpg",
    previewUrl: null,
    screenshots: [],
    externalUrl: "",
    tags: ["Cloud", "AWS", "AI", "Bootcamp"],
  },
  {
    id: "zenith-25",
    title: "ZENITH '25",
    statusOverride: "past",
    startAt: "2025-12-18T09:00:00+05:30",
    endAt: "2025-12-20T18:00:00+05:30",
    location: "MLRIT, Hyderabad",
    shortDescription:
      "SCOPE Club's flagship annual technical fest — The Cloud Voyage. Three days of hackathon, AWS workshops, speaker sessions, and discussion panels.",
    fullDescription:
      "Zenith '25 began with AWS Student Community Day, where AWS mentors conducted insightful sessions and hands-on workshops. These sessions provided strong exposure to cloud concepts and real-world applications. The next two days featured an intense hackathon, where students built projects based on given problem statements. It was a great blend of learning, innovation, and teamwork.",
    bannerUrl: "assets/images/events/zenith-25-poster.jpg",
    previewUrl: "assets/images/events/zenith-25-ss1.jpg",
    screenshots: [
      "assets/images/events/zenith-25-ss1.jpg",
      "assets/images/events/zenith-25-ss2.jpg",
      "assets/images/events/zenith-25-ss3.jpg",
    ],
    externalUrl: "",
    tags: ["Fest", "Hackathon", "AWS", "Cloud"],
  },
  {
    id: "aws-cloud-trek-oct-2025",
    title: "AWS Cloud Trek",
    statusOverride: "past",
    startAt: "2025-10-17T09:30:00+05:30",
    endAt: "2025-10-18T18:00:00+05:30",
    location: "MLRIT, Hyderabad",
    shortDescription:
      "A 2-day hands-on AWS workshop by AWS Cloud Club MLRIT × SCOPE Club covering S3, EC2, and custom domain deployments. AWS Cloud Academy access, participation certificates, and AWS swag kits.",
    fullDescription:
      "The AWS Cloud Club MLRIT, under the SCOPE Club, hosted a two-day hands-on AWS workshop on 17–18 October 2025. Participants gained practical experience with key AWS services like Amazon S3, EC2, and application deployment with custom domains. Attendees received AWS Cloud Academy resources and participation certificates, with top performers earning rewards and special recognition. This workshop aimed to boost cloud computing skills through industry-relevant, experiential learning.",
    bannerUrl: "assets/images/events/aws-cloud-workshop-2025-poster.jpg",
    previewUrl: "assets/images/events/aws-cloud-workshop-2025-ss1.jpg",
    screenshots: [
      "assets/images/events/aws-cloud-workshop-2025-ss1.jpg",
      "assets/images/events/aws-cloud-workshop-2025-ss2.jpg",
      "assets/images/events/aws-cloud-workshop-2025-ss3.jpg",
    ],
    externalUrl: "",
    tags: ["Cloud", "AWS", "Workshop"],
  },
  {
    id: "init-saga-2025",
    title: "__init__ Saga",
    statusOverride: "past",
    startAt: "2025-04-28T09:30:00+05:30",
    endAt: "2025-04-29T18:00:00+05:30",
    location: "MLRIT, Hyderabad",
    shortDescription:
      "SCOPE Presents: A 2-day hackathon across Agriculture, Healthcare, Education & Travel themes. Prize pool ₹20,000 + prizes. Inspired by the Python __init__ method.",
    fullDescription:
      "INIT SAGA is an exciting tech event designed to equip students with industry-relevant skills, foster innovation, and provide hands-on experience in real-world problem-solving. Inspired by the Python __init__ method — which signifies the beginning of an object's journey. The 2-day hackathon covered themes of Agriculture & Food Tech, Healthcare & Well Being, Education & Learning, and Travel & Tourism. Team size: 3–4. Prize pool: ₹20,000 + exciting prizes.",
    bannerUrl: "assets/images/events/init-saga-2025-poster.jpg",
    previewUrl: "assets/images/events/init-saga-2025-ss1.jpg",
    screenshots: [
      "assets/images/events/init-saga-2025-ss1.jpg",
      "assets/images/events/init-saga-2025-ss2.jpg",
      "assets/images/events/init-saga-2025-ss3.jpg",
    ],
    externalUrl: "",
    tags: ["Competition", "Hackathon", "Workshop"],
  },
  {
    id: "zenith-24",
    title: "ZENITH 24 — DataVoyage",
    statusOverride: "past",
    startAt: "2024-11-07T09:00:00+05:30",
    endAt: "2024-11-09T18:00:00+05:30",
    location: "MLRIT, Hyderabad",
    shortDescription:
      "SCOPE's 2024 flagship event themed around data — three days of data science, ML competitions, and technical challenges.",
    fullDescription:
      "ZENITH 24 – DataVoyage was SCOPE Club's 2024 flagship technical festival at MLRIT, held November 7–9, 2024. The event was themed around data science and machine learning, bringing together students for competitive programming, data challenges, and domain-specific workshops.",
    bannerUrl: "assets/images/events/zenith-24-ss1.jpg",
    previewUrl: "assets/images/events/zenith-24-ss2.jpg",
    screenshots: [
      "assets/images/events/zenith-24-ss1.jpg",
      "assets/images/events/zenith-24-ss2.jpg",
      "assets/images/events/zenith-24-ss3.jpg",
    ],
    externalUrl: "",
    tags: ["Fest", "ML", "Data Science"],
  },
];

function getEventStatus(event) {
  if (event.statusOverride) return event.statusOverride;
  const now = new Date();
  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : start;
  if (now >= start && now <= end) return "active";
  if (now < start) return "upcoming";
  return "past";
}

/* ---------- Team ---------- */
/*
 * No confirmed team member names or photos have been supplied.
 * The structure below is data-ready for real insertion.
 * Do NOT show "Full Name" cards publicly — the team.js renderer
 * hides placeholder members.
 */
const SCOPE_TEAMS = [
  {
    id: "board",
    name: "Board of Directors",
    isBoard: true,
    members: [],   /* Add confirmed members when available */
  },
  {
    id: "web",
    name: "Web Development",
    isBoard: false,
    members: [],
  },
  {
    id: "app",
    name: "App Development",
    isBoard: false,
    members: [],
  },
  {
    id: "ml",
    name: "AI / ML",
    isBoard: false,
    members: [],
  },
  {
    id: "cloud",
    name: "Cloud Computing",
    isBoard: false,
    members: [],
  },
  {
    id: "gamedev",
    name: "Game Development",
    isBoard: false,
    members: [],
  },
  {
    id: "opensource",
    name: "Open Source",
    isBoard: false,
    members: [],
  },
];

/* ---------- Resources ---------- */
/*
 * Only real, verified URLs are included.
 * All links below point to official documentation / well-known free resources.
 */
const SCOPE_RESOURCES = [
  /* Python */
  {
    id: "r-py-1",
    title: "Python Official Documentation",
    category: "Python",
    type: "documentation",
    description: "The official Python 3 docs — language reference, stdlib, tutorials, and more.",
    visitUrl: "https://docs.python.org/3/",
  },
  {
    id: "r-py-2",
    title: "Automate the Boring Stuff with Python",
    category: "Python",
    type: "ebook",
    description: "Free online book covering practical Python programming for real-world automation tasks.",
    visitUrl: "https://automatetheboringstuff.com/",
  },
  /* Frontend */
  {
    id: "r-fe-1",
    title: "MDN Web Docs",
    category: "Frontend",
    type: "documentation",
    description: "Mozilla's comprehensive web platform reference — HTML, CSS, JavaScript, and APIs.",
    visitUrl: "https://developer.mozilla.org/",
  },
  {
    id: "r-fe-2",
    title: "The Odin Project",
    category: "Frontend",
    type: "tutorial",
    description: "Free full-stack web development curriculum built on open-source projects and real coding.",
    visitUrl: "https://www.theodinproject.com/",
  },
  {
    id: "r-fe-3",
    title: "CSS Tricks",
    category: "Frontend",
    type: "tutorial",
    description: "In-depth CSS guides, flexbox and grid references, and frontend techniques.",
    visitUrl: "https://css-tricks.com/",
  },
  /* Backend */
  {
    id: "r-be-1",
    title: "Node.js Documentation",
    category: "Backend",
    type: "documentation",
    description: "Official Node.js API documentation — runtime, modules, streams, and more.",
    visitUrl: "https://nodejs.org/en/docs",
  },
  {
    id: "r-be-2",
    title: "FastAPI Documentation",
    category: "Backend",
    type: "documentation",
    description: "Official docs for FastAPI, the modern Python web framework for building APIs.",
    visitUrl: "https://fastapi.tiangolo.com/",
  },
  /* ML */
  {
    id: "r-ml-1",
    title: "fast.ai Practical Deep Learning",
    category: "ML",
    type: "tutorial",
    description: "Top-down, practical deep learning course — free, accessible, and hands-on.",
    visitUrl: "https://course.fast.ai/",
  },
  {
    id: "r-ml-2",
    title: "Kaggle Learn",
    category: "ML",
    type: "tutorial",
    description: "Free micro-courses on Python, ML, deep learning, and data visualization with real datasets.",
    visitUrl: "https://www.kaggle.com/learn",
  },
  /* Git */
  {
    id: "r-git-1",
    title: "Pro Git Book",
    category: "Git",
    type: "ebook",
    description: "The entire Pro Git book — free to read online. Everything from basics to advanced internals.",
    visitUrl: "https://git-scm.com/book/en/v2",
  },
  {
    id: "r-git-2",
    title: "GitHub Skills",
    category: "Git",
    type: "tutorial",
    description: "Interactive, project-based GitHub courses covering repos, pull requests, actions, and more.",
    visitUrl: "https://skills.github.com/",
  },
  /* DevOps */
  {
    id: "r-devops-1",
    title: "AWS Documentation",
    category: "DevOps",
    type: "documentation",
    description: "Official AWS service documentation — start with EC2, S3, IAM, and Lambda.",
    visitUrl: "https://docs.aws.amazon.com/",
  },
  {
    id: "r-devops-2",
    title: "Docker Official Docs",
    category: "DevOps",
    type: "documentation",
    description: "Get started with Docker — containers, images, compose, and deployment.",
    visitUrl: "https://docs.docker.com/",
  },
  /* AppDev */
  {
    id: "r-app-1",
    title: "Flutter Documentation",
    category: "AppDev",
    type: "documentation",
    description: "Official Flutter docs for building natively compiled apps for mobile, web, and desktop.",
    visitUrl: "https://docs.flutter.dev/",
  },
  {
    id: "r-app-2",
    title: "React Native Documentation",
    category: "AppDev",
    type: "documentation",
    description: "Official React Native docs for building cross-platform mobile apps with JavaScript.",
    visitUrl: "https://reactnative.dev/docs/getting-started",
  },
  /* Android */
  {
    id: "r-android-1",
    title: "Android Developer Guides",
    category: "Android",
    type: "documentation",
    description: "Official Android development documentation, Kotlin guides, and architecture patterns.",
    visitUrl: "https://developer.android.com/guide",
  },
  {
    id: "r-android-2",
    title: "Kotlin Documentation",
    category: "Android",
    type: "documentation",
    description: "Official Kotlin language reference, tour, and coroutines guide.",
    visitUrl: "https://kotlinlang.org/docs/home.html",
  },
  /* iOS */
  {
    id: "r-ios-1",
    title: "Swift Documentation",
    category: "iOS",
    type: "documentation",
    description: "Official Swift programming language guide, API design guidelines, and SwiftUI tutorials.",
    visitUrl: "https://swift.org/documentation/",
  },
  {
    id: "r-ios-2",
    title: "Apple Developer Documentation",
    category: "iOS",
    type: "documentation",
    description: "Official Apple developer docs covering SwiftUI, UIKit, Xcode, and frameworks.",
    visitUrl: "https://developer.apple.com/documentation/",
  },
];

const RESOURCE_CATEGORIES = [
  "All", "AppDev", "Python", "Frontend", "Backend", "ML", "Git", "DevOps", "Android", "iOS",
];

/* ---------- Join ---------- */
const JOIN_FIELDS = [
  { id: "name", label: "Full name", type: "text", required: true },
  { id: "email", label: "College email", type: "email", required: true },
  {
    id: "year", label: "Year of study", type: "select", required: true,
    options: ["1st Year", "2nd Year", "3rd Year", "4th Year"]
  },
  {
    id: "domain", label: "Domain of interest", type: "select", required: true,
    options: ["Web Development", "App Development", "AI / ML", "Cloud Computing",
      "Game Development", "Open Source", "Not sure yet"]
  },
  { id: "why", label: "Why do you want to join SCOPE?", type: "textarea", required: true },
];
