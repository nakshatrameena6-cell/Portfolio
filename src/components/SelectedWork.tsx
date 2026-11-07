import { features } from "@/content/projects";
import { fmtPeriod, ProjectArt } from "./bits";
import { WorkIndex } from "./WorkIndex";

/** Home: the four case studies as an interactive index with a live preview. */
export function SelectedWork() {
  const items = features.map((p) => ({
    slug: p.slug,
    title: p.title,
    kicker: p.kicker,
    when: fmtPeriod(p.period.from, p.period.to),
    stack: p.stack,
    preview: <ProjectArt p={p} peek sizes="45vw" />,
  }));
  return (
    <section id="work" className="section work" aria-labelledby="work-h">
      <header className="shead" data-reveal>
        <h2 id="work-h">Selected work</h2>
        <p>
          Four projects with a full write-up each, and a longer list of smaller builds.
        </p>
      </header>

      <WorkIndex items={items} />

      <p className="work__all" data-reveal>
        <a href="/work/" className="btn">
          All projects <span aria-hidden="true">→</span>
        </a>
      </p>
    </section>
  );
}
