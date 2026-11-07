import type { CapabilityGroup } from "./types";

/**
 * Technologies grouped by what they were used for. An item appears only if it
 * is imported or declared in code or dependencies of the repositories in
 * `seenIn`. No proficiency scores: the evidence is where it was used.
 */
export const capabilities: CapabilityGroup[] = [
  {
    id: "systems",
    title: "Back ends and data",
    blurb: "APIs with schemas, persistence and tests behind them.",
    items: [
      { name: "FastAPI", seenIn: ["Suraksha", "PandaMIND", "MedEx", "Truvision", "Quanta speed drill"] },
      { name: "Flask", seenIn: ["Museum Artifact Explorer"] },
      { name: "Express", seenIn: ["Text extractor & summariser"] },
      { name: "Pydantic", seenIn: ["Suraksha", "PandaMIND", "MedEx"] },
      { name: "PostgreSQL & Supabase", seenIn: ["Museum Artifact Explorer", "Attendance trackers"] },
      { name: "SQLite", seenIn: ["Suraksha"] },
      { name: "SQLAlchemy", seenIn: ["MedEx"] },
      { name: "MongoDB", seenIn: ["Truvision"] },
    ],
  },
  {
    id: "signals",
    title: "Applied ML and signals",
    blurb: "Models and measurement where the answer has to be checked.",
    items: [
      { name: "Isolation Forest", seenIn: ["Suraksha"] },
      { name: "Calibration & operating points", seenIn: ["PandaMIND"] },
      { name: "Audio features (MFCC, pitch)", seenIn: ["Truvision", "PandaMIND"] },
      { name: "Error-level image analysis", seenIn: ["Truvision"] },
      { name: "Constrained optimisation (OR-Tools)", seenIn: ["MedEx"] },
      { name: "PyTorch", seenIn: ["PandaMIND", "Truvision"] },
    ],
  },
  {
    id: "llm",
    title: "Language-model APIs and OCR",
    blurb: "Hosted models used as components, behind a server.",
    items: [
      { name: "Gemini API", seenIn: ["MedEx", "Quanta speed drill", "EasyGrade", "FoundersConnect"] },
      { name: "Claude API", seenIn: ["Text extractor & summariser"] },
      { name: "Tesseract.js", seenIn: ["Text extractor & summariser"] },
    ],
  },
  {
    id: "interface",
    title: "Interfaces",
    blurb: "From a single HTML file to a mapped, animated console.",
    items: [
      { name: "React", seenIn: ["MedEx", "PandaMIND", "ExamEye", "YOLA", "Truvision", "Quanta speed drill"] },
      { name: "Next.js", seenIn: ["Star Mobiles", "GraphX", "EasyGrade"] },
      { name: "TypeScript", seenIn: ["MedEx", "PandaMIND", "ExamEye", "YOLA", "Star Mobiles"] },
      { name: "Tailwind CSS", seenIn: ["MedEx", "PandaMIND", "ExamEye", "YOLA"] },
      { name: "three.js", seenIn: ["MedEx"] },
      { name: "MapLibre & Leaflet", seenIn: ["MedEx"] },
      { name: "Recharts", seenIn: ["MedEx"] },
      { name: "GSAP & Motion", seenIn: ["MedEx", "Star Mobiles", "ExamEye"] },
      { name: "Vanilla JS", seenIn: ["Attendance trackers", "Suraksha", "Text extractor & summariser"] },
    ],
  },
  {
    id: "practice",
    title: "Ways of working",
    blurb: "Habits that show up across the projects.",
    items: [
      { name: "Specs and requirement matrices before code", seenIn: ["Suraksha", "PandaMIND", "MedEx"] },
      { name: "pytest", seenIn: ["Suraksha", "PandaMIND", "Museum Artifact Explorer", "MedEx"] },
      { name: "Playwright", seenIn: ["MedEx"] },
      { name: "Docker", seenIn: ["PandaMIND", "Truvision", "MedEx"] },
      { name: "Audit trails and human approval", seenIn: ["Suraksha", "MedEx"] },
      { name: "Written reports and ER diagrams", seenIn: ["Museum Artifact Explorer", "PandaMIND"] },
    ],
  },
];
