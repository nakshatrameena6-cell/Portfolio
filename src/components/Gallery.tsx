import { features, supporting } from "@/content/projects";
import { logos, logoGroups } from "@/content/logos";
import { Facts, Pills, ProjectArt, ProjectLinks, fmtPeriod } from "./bits";

/**
 * /work, part one: the four case studies as an uneven grid of cards. Each card
 * shows a crop of the project's capture or diagram; the title link covers the whole
 * card. Wide and narrow cards alternate by row.
 */
export function Gallery() {
  return (
    <section className="section gal" aria-label="Case studies">
      <ul className="gal__grid">
        {features.map((p, i) => (
          <li key={p.slug} className={`gal__card gal__card--${i % 4}`} data-reveal style={{ ["--d" as string]: i % 2 }}>
            <div className="gal__art" aria-hidden="true">
              <ProjectArt p={p} peek sizes="(min-width: 900px) 45vw, 100vw" />
            </div>
            <div className="gal__body">
              <h2 className="gal__title">
                <a href={`/work/${p.slug}/`} className="gal__link">
                  {p.title}
                </a>
              </h2>
              <p className="gal__kicker">{p.kicker}</p>
              <Pills items={p.stack.slice(0, 5)} label={`${p.title} stack`} />
              <p className="gal__when">{fmtPeriod(p.period.from, p.period.to)}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * /work, part two: smaller builds as native disclosure rows (keyboard and
 * screen-reader friendly with no script). A row opens to the problem, summary,
 * status, stack and links, plus a capture when there is one.
 */
export function MoreBuilds() {
  return (
    <section id="more" className="section more" aria-labelledby="more-h">
      <header className="shead" data-reveal>
        <h2 id="more-h">More builds</h2>
        <p>Smaller or earlier work, described by what the code does and what it does not.</p>
      </header>

      <ul className="more__list">
        {supporting.map((p) => (
          <li key={p.slug} data-reveal>
            <details className="more__item">
              <summary>
                <span className="more__title">{p.title}</span>
                <span className="more__kicker">{p.kicker}</span>
                <span className="more__when">{fmtPeriod(p.period.from, p.period.to)}</span>
                <span className="more__plus" aria-hidden="true" />
              </summary>
              <div className="more__body">
                <div>
                  <p className="more__problem">{p.problem}</p>
                  <p>{p.summary}</p>
                  <p className="more__status">
                    <b>Status:</b> {p.status}
                  </p>
                  <Pills items={p.stack} />
                  <Facts facts={p.facts} />
                  <ProjectLinks p={p} caseStudy={false} />
                </div>
                {p.shot ? (
                  <figure className="more__fig">
                    <ProjectArt p={p} />
                    <figcaption>Login screen of the prototype.</figcaption>
                  </figure>
                ) : null}
              </div>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** /work, part three: the technologies, by what they were used for. */
export function Toolbox() {
  return (
    <section id="tools" className="section tools" aria-labelledby="tools-h">
      <header className="shead" data-reveal>
        <h2 id="tools-h">Tools</h2>
        <p>Used in the code or dependencies of the projects above. Not a skill rating.</p>
      </header>

      <div className="tools__groups">
        {logoGroups.map((g) => (
          <div key={g} className="tools__group" data-reveal>
            <h3>{g}</h3>
            <ul>
              {logos
                .filter((l) => l.group === g)
                .map((l) => (
                  <li key={l.id}>
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                      <path d={l.path} fill="currentColor" />
                    </svg>
                    {l.name}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
