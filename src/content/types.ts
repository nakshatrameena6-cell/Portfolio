/**
 * Content model. Every factual claim on the site should be traceable to a file
 * of a public repository. `scripts/verify-content.mjs`
 * checks that each `Source` path exists in the cloned repository.
 */

/** A pointer to evidence inside one of Nakshatra's public repositories. */
export type Source = {
  repo: string;
  /** Path inside the repo. Used by scripts/verify-content.mjs; not shown in the UI. */
  path: string;
};

export type Fact = { label: string; value: string; src?: Source };

export type Decision = { title: string; body: string; src: Source };

export type Authorship = "solo" | "lead" | "shared";

export type VisualId = "gates" | "channels" | "loop" | "schema";

export type CaseStudy = {
  problem: string;
  approach: string;
  /** Plain-language caption that sits next to the architecture drawing. */
  architectureNote: string;
  decisions: Decision[];
  challenges: Decision[];
  /** What the repository demonstrates — including its limits. */
  outcome: string[];
  /** Optional first-person reflection; left empty until the author supplies one. */
  reflection?: string;
};

export type Project = {
  slug: string;
  tier: "feature" | "support";
  /** Display ordinal, e.g. "01". */
  n: string;
  title: string;
  kicker: string;
  repo: string;
  period: { from: string; to: string };
  authorship: Authorship;
  problem: string;
  summary: string;
  stack: string[];
  /** Honest one-line status — what the project is and is not. */
  status: string;
  live?: string;
  facts: Fact[];
  visual?: VisualId;
  caseStudy?: CaseStudy;
};

export type CapabilityGroup = {
  id: string;
  title: string;
  blurb: string;
  items: { name: string; seenIn: string[] }[];
};
