import type { Project } from "./types";

/**
 * Featured and supporting projects.
 * Period is shown at month level. No version-control details are published.
 */
export const projects: Project[] = [
  /* ─────────────────────────────  01  ───────────────────────────── */
  {
    slug: "suraksha",
    tier: "feature",
    n: "01",
    title: "Suraksha",
    kicker: "Threat detection with a safety-gated response layer",
    repo: "Cyber-threat-detection",
    period: { from: "2026-09-07", to: "2026-10-24" },
    authorship: "lead",
    problem:
      "A system that can detect an attack and also act on it is only as trustworthy as the limits on its actions. Suraksha treats the response, not the detection, as the hard part.",
    summary:
      "Telemetry arrives as events; rules and an Isolation Forest score them; related events are grouped into incidents; and before anything is blocked, suspended or isolated, ten sequential safety gates decide whether the system may act alone, must ask an analyst, or must stand down.",
    stack: ["Python", "FastAPI", "Pydantic", "SQLite", "scikit-learn", "pytest", "Vanilla JS dashboard"],
    status:
      "Course-scale prototype. Response actions are simulated; nothing enforces on a live network.",
    visual: "gates",
    facts: [
      { label: "Safety gates", value: "10", src: { repo: "Cyber-threat-detection", path: "backend/response/safety_gates.py" } },
      { label: "Response tiers", value: "3 (A, B, C)", src: { repo: "Cyber-threat-detection", path: "backend/response/policy_engine.py" } },
      { label: "API routes", value: "22", src: { repo: "Cyber-threat-detection", path: "backend/main.py" } },
      { label: "Test functions", value: "111", src: { repo: "Cyber-threat-detection", path: "tests/test_end_to_end.py" } },
    ],
    caseStudy: {
      problem:
        "Detection pipelines are easy to demo and hard to trust. The moment a system is allowed to block an address or isolate a host, a false positive stops being a chart artefact and becomes an outage. The brief Suraksha set itself: detect, correlate and respond, while making every automated action bounded, reversible and auditable.",
      approach:
        "The project started on paper: a PRD, requirements matrix, threat model, API specification and architecture document came before the pipeline code. Requirements carry REQ-* identifiers that map to modules and to tests. The pipeline itself is staged: normalise, score (rules plus an Isolation Forest), correlate into incidents, classify into a response tier, pass the gates, execute, verify, audit.",
      architectureNote:
        "The drawing is the response path only. Each gate is a separate check that can end the run; an action that clears all ten is executed and then verified by an independent component.",
      decisions: [
        {
          title: "Three response tiers",
          body: "Tier A only alerts. Tier B may take bounded actions such as blocking an IP or suspending a session, automatically, when confidence is at least 0.75 and every gate passes. Tier C (endpoint isolation, or anything touching a critical asset) always needs a human.",
          src: { repo: "Cyber-threat-detection", path: "backend/response/policy_engine.py" },
        },
        {
          title: "Low confidence fails closed",
          body: "Below 0.75 confidence the decision engine does not retry with softer wording or pick a smaller action: it escalates to Tier C and waits for an analyst.",
          src: { repo: "Cyber-threat-detection", path: "backend/response/decision_engine.py" },
        },
        {
          title: "Audit is a precondition, not a log line",
          body: "Gate 6 checks that the audit store is writable before an action runs. If it is not, the action is aborted. Nothing happens that cannot be recorded.",
          src: { repo: "Cyber-threat-detection", path: "backend/response/safety_gates.py" },
        },
        {
          title: "A hard cap on blast radius",
          body: "Gate 5 refuses further blocks or isolations once five are active, whatever the detector believes.",
          src: { repo: "Cyber-threat-detection", path: "backend/response/safety_gates.py" },
        },
        {
          title: "A global kill switch",
          body: "One switch halts all automated response. It is Gate 3 of the ten.",
          src: { repo: "Cyber-threat-detection", path: "backend/response/kill_switch.py" },
        },
      ],
      challenges: [
        {
          title: "Late, skewed and impossible timestamps",
          body: "Telemetry arrives out of order, in mixed time zones and sometimes from the future. Offsets are normalised to UTC, a five-minute lateness window protects state, timestamps more than 60 seconds ahead are clamped to ingestion time, and fallback timestamps are masked from off-hours features so they cannot manufacture alerts.",
          src: { repo: "Cyber-threat-detection", path: "backend/detection/normalizer.py" },
        },
        {
          title: "Correlating without over-merging",
          body: "Attacks spread across a /24 or /64 are grouped only when they also share a target, a category or an identity, so unrelated activity on the same subnet stays separate.",
          src: { repo: "Cyber-threat-detection", path: "backend/incidents/correlation.py" },
        },
        {
          title: "Metrics that disagree with themselves",
          body: "A single confusion matrix is derived once, and an invariant (TP + FP + TN + FN equals the number of unique events) is asserted so the prose, the table and the dashboard cannot drift apart.",
          src: { repo: "Cyber-threat-detection", path: "backend/evaluation/metrics.py" },
        },
        {
          title: "Refusing to invent benchmark numbers",
          body: "An adapter for CIC-IDS2017 and UNSW-NB15 exists. When the dataset files are not present locally it reports PENDING_LOCAL_DATA instead of a score.",
          src: { repo: "Cyber-threat-detection", path: "backend/evaluation/public_dataset_adapter.py" },
        },
      ],
      outcome: [
        "A working end-to-end system: ingestion API, SQLite persistence, incident queue, enforcement monitor, filterable audit trail, an attack simulator and an evaluation tab, backed by 111 test functions.",
        "The built-in benchmark is 33 hand-labelled events, and the system reports perfect precision and recall on it. That shows the pipeline logic is internally consistent. It is not evidence of real-world detection accuracy, and the public-dataset results are left pending rather than filled in.",
      ],
    },
  },

  /* ─────────────────────────────  02  ───────────────────────────── */
  {
    slug: "pandamind",
    tier: "feature",
    n: "02",
    title: "PandaMIND",
    kicker: "Synthetic-speech detection, tested against phone-line damage",
    repo: "truth-frame",
    period: { from: "2026-08-30", to: "2026-09-29" },
    authorship: "shared",
    problem:
      "Cloned voices travel over bad channels. A detector that works on clean studio audio can fail on an 8 kHz phone call or a WhatsApp voice note, so the evaluation has to include the damage.",
    summary:
      "An offline Python detector and scoring API for Hindi, Tamil, English and Hinglish speech, evaluated on clean audio and three degraded channels, with unseen text-to-speech generators kept out of training, plus a React workspace for uploading audio and reading the evidence behind a verdict.",
    stack: ["Python", "FastAPI", "NumPy", "Pydantic", "pytest", "Docker", "React", "TypeScript", "Vite", "Tailwind"],
    status:
      "Research-grade prototype on a small corpus (172 samples from 43 recordings). Not a production detector.",
    visual: "channels",
    facts: [
      { label: "Languages", value: "4 (hi, ta, en, Hinglish)", src: { repo: "truth-frame", path: "SPEC.md" } },
      { label: "Channels", value: "clean + 3 degraded", src: { repo: "truth-frame", path: "src/audio_detection/degradation/channels.py" } },
      { label: "Milestone reports", value: "M1 to M4", src: { repo: "truth-frame", path: "reports/m4/M4_REPORT.md" } },
      { label: "Test functions", value: "116", src: { repo: "truth-frame", path: "tests/test_m4_acceptance.py" } },
    ],
    caseStudy: {
      problem:
        "Synthetic-speech detectors are usually reported on clean audio. In practice the audio that matters arrives compressed through telephony codecs and messaging apps. PandaMIND's question: how does a detector behave when the speaker is unseen, the generator is unseen and the channel is bad, in languages that mainstream benchmarks under-represent?",
      approach:
        "Specification first, then a staged build. M1 froze the API contract behind a deterministic stub; M2 added a 10-dimensional waveform baseline; M3 the production pipeline with language detection, localisation and serving; M4 an independent acceptance pass. A versioned benchmark spec defines the languages, classes, generators, degradations and splits, so every later result is read against the same frame.",
      architectureNote:
        "Each clip is scored once clean and again after being pushed through the degradations the benchmark defines. The bands show the same procedural signal narrowing as bandwidth is lost.",
      decisions: [
        {
          title: "Contract before model",
          body: "M1 shipped the whole API with a scorer that hashes the audio bytes with SHA-256, and it was labelled in plain words as a stub that does not represent real detection performance. Clients could integrate before any model existed, without anyone mistaking the numbers for results.",
          src: { repo: "truth-frame", path: "src/audio_detection/api/stub.py" },
        },
        {
          title: "Held-out generators stay out of training",
          body: "Selected text-to-speech generators are forbidden in train and validation and allowed only in test; source and speaker groups are isolated across splits.",
          src: { repo: "truth-frame", path: "SPEC.md" },
        },
        {
          title: "Thresholds from validation only",
          body: "Platt calibration and the three operating points (0.1 %, 1 % and 5 % false-positive rate) were derived from the validation split alone; the test split was never consulted for tuning.",
          src: { repo: "truth-frame", path: "reports/m4/M4_REPORT.md" },
        },
        {
          title: "Freeze and hash before acceptance",
          body: "The manifest, model checkpoint and metrics code are recorded with SHA-256 digests before the acceptance run, so the evaluated artefacts can be checked later.",
          src: { repo: "truth-frame", path: "reports/m4/M4_REPORT.md" },
        },
        {
          title: "A verdict that carries its evidence",
          body: "The API response includes the verdict band and probability, scored segments, estimated bandwidth, codec chain and SNR, provenance fields and per-signal contributions. The React workspace renders this as a verdict, a probability scale and an evidence drawer.",
          src: { repo: "truth-frame", path: "src/pages/AnalyzePage.tsx" },
        },
      ],
      challenges: [
        {
          title: "Corpus integrity",
          body: "A remediation pass invalidated earlier synthetic relabelings and added permanent duplicate-content guards, so near-identical audio cannot sit on both sides of a split. This was done by the team, not by one person.",
          src: { repo: "truth-frame", path: "SPEC.md" },
        },
        {
          title: "Very little data",
          body: "The remediated corpus has 172 samples from 43 independent recordings, drawn from open-licensed and public-domain speech plus generated audio. Provenance and licences are documented for every source.",
          src: { repo: "truth-frame", path: "docs/corpus.md" },
        },
        {
          title: "Simulating the channel",
          body: "G.711 at 8 kHz, AMR-NB and a WhatsApp-style Opus path are reproduced by a degradation module so the same clip can be scored under each.",
          src: { repo: "truth-frame", path: "src/audio_detection/degradation/channels.py" },
        },
      ],
      outcome: [
        "M4 marks the milestone PASS against its own acceptance criteria, including 0.00 % EER on the cross-generator telecom slice and a p95 latency of 0.98 s for 60 seconds of audio.",
        "Read that result with its denominator: the held-out slice is 44 samples from a hand-built corpus. It is a release-gate result for this prototype, not a general accuracy claim.",
      ],
    },
  },

  /* ─────────────────────────────  03  ───────────────────────────── */
  {
    slug: "medex",
    tier: "feature",
    n: "03",
    title: "MedEx",
    kicker: "A supply-chain console where the AI recommends and a person decides",
    repo: "MedEx",
    period: { from: "2026-09-29", to: "2026-10-01" },
    authorship: "shared",
    problem:
      "Health facilities report stock late and on paper, so shortages are noticed after they happen and surplus cannot be moved to where it is needed.",
    summary:
      "A prototype that captures stock by voice, photo or form, forecasts demand, flags facilities close to stock-out, proposes redistribution, and puts every transfer in front of a reviewer who can approve, modify, reject or escalate it, with an audit trail.",
    stack: ["React", "TypeScript", "Vite", "Tailwind", "three.js", "MapLibre", "Recharts", "FastAPI", "SQLAlchemy", "OR-Tools", "Gemini API", "Playwright", "pytest"],
    status:
      "Prototype on seeded sample data; not deployed.",
    visual: "loop",
    facts: [
      { label: "Views", value: "10", src: { repo: "MedEx", path: "src/views/MapView.tsx" } },
      { label: "API modules", value: "12", src: { repo: "MedEx", path: "backend/app/api/v1/transfers.py" } },
      { label: "Optimiser", value: "OR-Tools", src: { repo: "MedEx", path: "backend/app/services/optimizer.py" } },
      { label: "Backend tests", value: "74 functions + UI spec", src: { repo: "MedEx", path: "tests/ui.spec.ts" } },
    ],
    caseStudy: {
      problem:
        "Medicine stock-outs are rarely a pure supply problem; they are a visibility problem. Each facility sees only its own shelves, reporting lags, and moving stock between facilities is a judgement call with real consequences. MedEx connects those steps (capture, forecast, risk, redistribution, review, audit) into a single decision-support flow.",
      approach:
        "The project sets its principle first (AI recommends, humans decide) and defines a prototype scope around one primary journey: from data capture to prediction, risk detection, redistribution, human approval and audit. A FastAPI backend exposes one module per stage; a React front end gives each stage a screen, including a district map and a scenario simulator.",
      architectureNote:
        "The loop is the product: a recommendation is never an action. Approve, modify, reject and escalate all lead to the same audit record.",
      decisions: [
        {
          title: "Recommendation is not execution",
          body: "Redistribution proposals are reviewed on a dedicated screen. A reviewer can approve, modify, reject or escalate; none of those paths skips the audit trail.",
          src: { repo: "MedEx", path: "src/features/transfers/TransferDecisionPanel.tsx" },
        },
        {
          title: "Optimisation kept separate from prediction",
          body: "Which facility is at risk is a forecasting question; which transfers are feasible is a constrained-optimisation one. Redistribution runs through Google OR-Tools in its own service.",
          src: { repo: "MedEx", path: "backend/app/services/optimizer.py" },
        },
        {
          title: "Federation, stated as a simulation",
          body: "Cross-state learning is demonstrated across three simulated nodes without pooling raw data. A production system would need stronger isolation and secure aggregation.",
          src: { repo: "MedEx", path: "backend/app/api/v1/federation.py" },
        },
        {
          title: "Scenario simulation",
          body: "Planners can test demand shocks before they happen, rather than only reacting to forecasts.",
          src: { repo: "MedEx", path: "backend/app/api/v1/scenario.py" },
        },
      ],
      challenges: [
        {
          title: "A wide surface",
          body: "Ten views, twelve API modules, a map, a 3D globe, a Gemini-backed copilot and two kinds of tests, in a short build. A written frontend audit and redesign plan in the docs shows the interface being reviewed against its own requirements.",
          src: { repo: "MedEx", path: "docs/FRONTEND_AUDIT_AND_PLAN.md" },
        },
        {
          title: "Many input modes",
          body: "Stock can be captured by voice, by photo or by structured entry, each with its own review step before data is accepted.",
          src: { repo: "MedEx", path: "src/features/capture/CaptureReview.tsx" },
        },
      ],
      outcome: [
        "A coherent prototype that walks the whole journey on seeded data: capture, forecast, risk queue, transfer review, scenario simulator, federation view and audit.",
        "BigQuery and Vertex AI are the intended data and ML platform; the working prototype runs on SQLAlchemy and sample data, so treat the cloud stack as design intent.",
      ],
    },
  },

  /* ─────────────────────────────  04  ───────────────────────────── */
  {
    slug: "museum-explorer",
    tier: "feature",
    n: "04",
    title: "Museum Artifact Explorer",
    kicker: "A database project in which the database enforces the rules",
    repo: "museum-artifact",
    period: { from: "2026-10-13", to: "2026-10-22" },
    authorship: "solo",
    problem:
      "Browse and curate museum artefacts across civilisations, with the database, not the application, deciding what is valid, what is remembered and who can read it.",
    summary:
      "A Flask application over PostgreSQL on Supabase, written in plain parameterised SQL: eight tables, a denormalised view, a deletion-audit trigger, row-level security on every table, and a test suite that runs in a throwaway schema.",
    stack: ["Python", "Flask", "PostgreSQL", "Supabase", "psycopg2", "HTML/CSS/JS", "pytest"],
    status: "Coursework project with a written report.",
    shot: { src: "/evidence/museum-er.webp", alt: "Entity-relationship diagram of the museum database: eight tables joined by one-to-many and many-to-many relationships.", w: 2200, h: 1513, caption: "The database's own ER diagram. Its column types still use SQLite notation; the live schema uses PostgreSQL identity columns." },
    facts: [
      { label: "Tables", value: "7 + audit log", src: { repo: "museum-artifact", path: "database.py" } },
      { label: "Also", value: "1 view · 1 trigger", src: { repo: "museum-artifact", path: "database.py" } },
      { label: "Security", value: "RLS on every table", src: { repo: "museum-artifact", path: "database.py" } },
      { label: "Tests", value: "16 functions", src: { repo: "museum-artifact", path: "test_app.py" } },
    ],
    caseStudy: {
      problem:
        "A database coursework project can be satisfied with tables and a few queries. This one sets a harder bar: make the schema itself responsible for integrity, history and access, so the application layer cannot get it wrong.",
      approach:
        "Design the relations first (civilisations, categories, artifacts, curators, exhibitions and a many-to-many join), then write the constraints, view, trigger and security policy into the schema, and only then build the Flask routes and templates over plain SQL. A generated ER diagram and a written normalisation argument (1NF to 3NF) are part of the deliverable.",
      architectureNote:
        "This is the project's own ER diagram. Its column types still use SQLite notation (INTEGER AUTOINCREMENT); the live schema uses PostgreSQL identity columns.",
      decisions: [
        {
          title: "Rules live in the schema",
          body: "Identity primary keys, foreign keys with cascades, a UNIQUE (name, civilization_id) pair, CHECK (discovery_year ≤ 2026), CHECK (end_date ≥ start_date): invalid rows are refused by the database whatever the application does.",
          src: { repo: "museum-artifact", path: "database.py" },
        },
        {
          title: "Deletes leave a trace",
          body: "An AFTER DELETE trigger calls a PL/pgSQL function, log_deleted_artifact(), that records the removed artefact in an audit table.",
          src: { repo: "museum-artifact", path: "database.py" },
        },
        {
          title: "Plain SQL, always parameterised",
          body: "psycopg2 with %s placeholders, no ORM and no SDK, with ILIKE search and explicit RETURNING id on inserts.",
          src: { repo: "museum-artifact", path: "database.py" },
        },
        {
          title: "Tests that cannot touch real data",
          body: "Each test run creates a uniquely named temporary schema, runs against it and drops it.",
          src: { repo: "museum-artifact", path: "test_app.py" },
        },
      ],
      challenges: [
        {
          title: "SQLite to PostgreSQL",
          body: "The project began on SQLite and was migrated to Supabase PostgreSQL. A database wrapper that intercepted lastrowid was replaced with explicit RETURNING id, and constraints were tightened during the move.",
          src: { repo: "museum-artifact", path: "REPORT.md" },
        },
        {
          title: "Connection failures that explain themselves",
          body: "A diagnostic script validates DATABASE_URL and connectivity so setup problems are reported in words rather than as a stack trace.",
          src: { repo: "museum-artifact", path: "check_env.py" },
        },
      ],
      outcome: [
        "Full create, read, update and delete on artefacts, with search, favourites and exhibitions, over a schema documented with an ER diagram, example queries, a normalisation argument and a final report (PDF included).",
        "Known limitations and future improvements are written down alongside the project.",
      ],
    },
  },

  /* ───────────────────────  Supporting work  ─────────────────────── */
  {
    slug: "truvision",
    tier: "support",
    n: "05",
    title: "Truvision",
    kicker: "Forensic scoring for images, audio, video, text and documents",
    repo: "Truvision",
    period: { from: "2026-06-19", to: "2026-07-24" },
    authorship: "solo",
    problem: "Is this file what it claims to be? A web tool that scores media for signs of manipulation and shows which checks fired.",
    summary:
      "React front end and a FastAPI/MongoDB backend with one router per media type. Image checks use error-level analysis with OpenCV and Pillow plus a PyTorch step; audio checks look at MFCCs, spectral flatness and pitch contour with librosa.",
    stack: ["React", "FastAPI", "MongoDB", "OpenCV", "PyTorch", "librosa"],
    status: "Working prototype.",
    facts: [],
  },
  {
    slug: "examseye",
    tier: "support",
    n: "06",
    title: "ExamEye",
    kicker: "An invigilation dashboard, as an interface prototype",
    repo: "Exam-invigilation",
    period: { from: "2026-07-22", to: "2026-07-23" },
    authorship: "shared",
    problem: "Give exam administrators one place to watch sessions, review flagged events and read reports.",
    summary:
      "A React, TypeScript and Tailwind front end with login roles, live monitoring, video upload and reports. The live view plays scripted demo feeds with simulated detection overlays. A YOLOv8 and IoU-tracker backend was written early on but is not part of the current build.",
    stack: ["React", "TypeScript", "Vite", "Tailwind", "Framer Motion"],
    status: "Interface prototype. Detection shown in the UI is simulated.",
    shot: { src: "/evidence/examseye-login.webp", alt: "Login screen of the ExamEye prototype with Admin and Teacher demo access.", w: 1600, h: 742 },
    facts: [],
  },
  {
    slug: "quanta",
    tier: "support",
    n: "07",
    title: "Quanta speed drill",
    kicker: "Adaptive placement-aptitude practice",
    repo: "GDG-Prompt-wars",
    period: { from: "2026-09-26", to: "2026-09-26" },
    authorship: "solo",
    problem: "Timed aptitude questions whose difficulty follows how the learner is doing.",
    summary:
      "A one-day build: React front end with an adaptive-difficulty engine, a FastAPI backend with a Gemini service, and Vercel deployment configuration.",
    stack: ["React", "Vite", "FastAPI", "Gemini API"],
    status: "One-day build.",
    facts: [],
  },
  {
    slug: "ocr-summariser",
    tier: "support",
    n: "08",
    title: "Text extractor & summariser",
    kicker: "Image in, text and summary out",
    repo: "OCR---Scanner",
    period: { from: "2026-04-21", to: "2026-06-12" },
    authorship: "solo",
    problem: "Pull text out of a photographed page and condense it to a chosen length.",
    summary:
      "Browser-side OCR with Tesseract.js, an Express server that calls the Claude API for short, medium or long summaries, drag-and-drop upload and a black-and-gold interface.",
    stack: ["JavaScript", "Tesseract.js", "Express", "Claude API"],
    status: "Small working tool.",
    facts: [],
  },
  {
    slug: "attendance",
    tier: "support",
    n: "09",
    title: "Attendance trackers",
    kicker: "Period-wise attendance for a classroom",
    repo: "attendance",
    period: { from: "2026-04-25", to: "2026-05-13" },
    authorship: "solo",
    problem: "Mark attendance for nine periods a day and copy the absentee list in one click.",
    summary:
      "Two iterations of the same idea on Supabase: a first minimal tracker (class-attendance), then a fuller one with a dashboard, trend chart, history and a SQL setup script. Vanilla HTML, CSS and JavaScript.",
    stack: ["JavaScript", "Supabase", "PostgreSQL"],
    status: "Working tools.",
    facts: [],
  },
  {
    slug: "star-mobiles",
    tier: "support",
    n: "10",
    title: "Star Mobiles",
    kicker: "A storefront site for a phone shop",
    repo: "star-mobiles",
    period: { from: "2026-10-05", to: "2026-10-09" },
    authorship: "lead",
    problem: "Show a phone shop's catalogue, services, hours and location, with a mobile action bar for phone visitors.",
    summary:
      "Next.js with per-device pages, accessories and services, store hours, a sitemap and robots file, and a set of reveal, marquee and cursor motion components.",
    stack: ["Next.js", "React", "TypeScript", "GSAP", "Motion"],
    status: "Built site.",
    facts: [],
  },
  {
    slug: "yola",
    tier: "support",
    n: "11",
    title: "YOLA",
    kicker: "Trip booking front end",
    repo: "yola-website",
    period: { from: "2026-07-16", to: "2026-07-17" },
    authorship: "solo",
    problem: "An adventure-trip booking flow: browse, filter, book, review bookings.",
    summary:
      "React 19, TypeScript and Tailwind v4 organised by feature (auth, trips, booking, dashboard), with TanStack Query over a mocked API layer and hand-built pointer-reactive interactions.",
    stack: ["React 19", "TypeScript", "Tailwind v4", "TanStack Query", "Zustand"],
    status: "Front end only; all data is mocked.",
    facts: [],
  },
];

export const features = projects.filter((p) => p.tier === "feature");
export const supporting = projects.filter((p) => p.tier === "support");
export const bySlug = (slug: string) => projects.find((p) => p.slug === slug);
