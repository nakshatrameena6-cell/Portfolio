import { features } from "@/content/projects";
import { fmtPeriod } from "./bits";

/**
 * 01 — the landing page's compact index of the four case studies. The full
 * compositions, smaller builds and technology matrix live on /work.
 */
export function WorkTeaser() {
  return (
    <section id="work" className="section teaser" aria-labelledby="work-h">
      <header className="folio" data-reveal>
        <span>01</span>
        <h2 id="work-h">Selected work</h2>
        <p>Four projects in depth. Each has its own case study.</p>
      </header>

      <ol className="teaser__list">
        {features.map((p) => (
          <li key={p.slug} data-reveal>
            <a href={`/work/${p.slug}/`} className="teaser__item">
              <span className="teaser__n">{p.n}</span>
              <span className="teaser__title">{p.title}</span>
              <span className="teaser__kicker">{p.kicker}</span>
              <span className="teaser__when">{fmtPeriod(p.period.from, p.period.to)}</span>
              <span className="teaser__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ol>

      <p className="teaser__all" data-reveal>
        <a href="/work/" className="links__primary">
          All projects <span aria-hidden="true">→</span>
        </a>
        <span>Case studies, smaller builds, and the technologies used.</span>
      </p>
    </section>
  );
}
