import Image from "next/image";
import type { Fact, Project } from "@/content/types";
import { repoUrl } from "@/content/site";
import { Visual } from "./visuals/Visual";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Month-level period: "Sep to Oct 2026", or "Sep 2026" when it sits in one month. */
export function fmtPeriod(from: string, to: string) {
  const f = new Date(`${from}T00:00:00Z`);
  const t = new Date(`${to}T00:00:00Z`);
  const fm = MONTHS[f.getUTCMonth()];
  const tm = MONTHS[t.getUTCMonth()];
  const yr = t.getUTCFullYear();
  return f.getUTCMonth() === t.getUTCMonth() && f.getUTCFullYear() === yr ? `${tm} ${yr}` : `${fm} to ${tm} ${yr}`;
}

export const authorshipLabel = {
  solo: "Solo project",
  lead: "Lead author",
  shared: "Team project",
} as const;

export function Facts({ facts }: { facts: Fact[] }) {
  if (!facts.length) return null;
  return (
    <dl className="facts">
      {facts.map((f) => (
        <div key={f.label} className="facts__row">
          <dd>{f.value}</dd>
          <dt>{f.label}</dt>
        </div>
      ))}
    </dl>
  );
}

export function ProjectLinks({ p, caseStudy = true }: { p: Project; caseStudy?: boolean }) {
  return (
    <p className="links">
      {caseStudy && p.caseStudy ? (
        <a href={`/work/${p.slug}/`} className="btn">
          Read the case study <span aria-hidden="true">→</span>
        </a>
      ) : null}
      <a href={repoUrl(p.repo)} className="btn btn--ghost">
        Source code <span aria-hidden="true">↗</span>
        <span className="sr-only"> (external link)</span>
      </a>
      {p.live ? (
        <a href={p.live} className="btn btn--ghost">
          Live site <span aria-hidden="true">↗</span>
        </a>
      ) : null}
    </p>
  );
}

/** Technologies as pills. */
export function Pills({ items, label = "Stack" }: { items: string[]; label?: string }) {
  return (
    <ul className="pills" aria-label={label}>
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

/**
 * What a project looks like: its real capture when one exists, otherwise the
 * diagram drawn for it. `peek` crops it to a fixed frame for cards and previews.
 */
export function ProjectArt({ p, peek = false, sizes }: { p: Project; peek?: boolean; sizes?: string }) {
  if (p.shot) {
    return (
      <figure className={`art art--shot ${peek ? "art--peek" : ""}`}>
        <Image src={p.shot.src} alt={peek ? "" : p.shot.alt} width={p.shot.w} height={p.shot.h} sizes={sizes ?? "(min-width: 900px) 50vw, 100vw"} loading="lazy" />
        {!peek && p.shot.caption ? <figcaption>{p.shot.caption}</figcaption> : null}
      </figure>
    );
  }
  if (!p.visual) return null;
  return (
    <div className={`art art--${p.visual} ${peek ? "art--peek" : ""}`}>
      <Visual id={p.visual} />
    </div>
  );
}
