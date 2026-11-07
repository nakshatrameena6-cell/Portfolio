import type { Fact, Project } from "@/content/types";
import { repoUrl } from "@/content/site";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Month-level period: "Sep – Oct 2026", or "Sep 2026" when it sits in one month. */
export function fmtPeriod(from: string, to: string) {
  const f = new Date(`${from}T00:00:00Z`);
  const t = new Date(`${to}T00:00:00Z`);
  const fm = MONTHS[f.getUTCMonth()];
  const tm = MONTHS[t.getUTCMonth()];
  const yr = t.getUTCFullYear();
  return f.getUTCMonth() === t.getUTCMonth() && f.getUTCFullYear() === yr ? `${tm} ${yr}` : `${fm} – ${tm} ${yr}`;
}

export const authorshipLabel = {
  solo: "Solo",
  lead: "Lead author",
  shared: "Team project",
} as const;

export function Facts({ facts }: { facts: Fact[] }) {
  if (!facts.length) return null;
  return (
    <dl className="facts">
      {facts.map((f) => (
        <div key={f.label} className="facts__row">
          <dt>{f.label}</dt>
          <dd>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProjectLinks({ p }: { p: Project }) {
  return (
    <p className="links">
      {p.caseStudy ? (
        <a href={`/work/${p.slug}/`} className="links__primary">
          Read the case study <span aria-hidden="true">→</span>
        </a>
      ) : null}
      <a href={repoUrl(p.repo)} className="links__secondary">
        Source code <span aria-hidden="true">↗</span>
        <span className="sr-only"> (external link)</span>
      </a>
      {p.live ? (
        <a href={p.live} className="links__secondary">
          Live <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </p>
  );
}

export function StackLine({ stack }: { stack: string[] }) {
  return (
    <p className="stack">
      <span className="sr-only">Stack: </span>
      {stack.join(" · ")}
    </p>
  );
}
