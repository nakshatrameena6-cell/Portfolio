import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { features, bySlug } from "@/content/projects";
import { ProjectLinks, Pills, Facts, ProjectArt, authorshipLabel, fmtPeriod } from "@/components/bits";
import { Contact } from "@/components/Contact";

export const dynamicParams = false;

export function generateStaticParams() {
  return features.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  return { title: `${p.title}: case study`, description: `${p.kicker}. ${p.problem}` };
}

export default async function CaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p || !p.caseStudy) notFound();
  const c = p.caseStudy;

  const i = features.findIndex((f) => f.slug === p.slug);
  const next = features[(i + 1) % features.length]!;

  return (
    <>
      <main id="main" className="case">
        <header className="section case__head">
          <a href="/work/" className="case__back">
            <span aria-hidden="true">←</span> All projects
          </a>
          <h1 className="case__title">{p.title}</h1>
          <p className="case__kicker">{p.kicker}</p>
          <p className="case__meta">
            {authorshipLabel[p.authorship]}. {fmtPeriod(p.period.from, p.period.to)}. {p.status}
          </p>
          <Pills items={p.stack} />
        </header>

        <div className="section case__hero">
          <ProjectArt p={p} />
        </div>

        <article className="case__body">
          <section aria-labelledby="problem-h" data-reveal>
            <h2 id="problem-h">The problem</h2>
            <div className="case__col">
              <p className="case__lede">{c.problem}</p>
            </div>
          </section>

          <section aria-labelledby="approach-h" data-reveal>
            <h2 id="approach-h">The approach</h2>
            <div className="case__col">
              <p>{c.approach}</p>
              <Facts facts={p.facts} />
              <p className="case__note">{c.architectureNote}</p>
            </div>
          </section>

          <section aria-labelledby="dec-h">
            <h2 id="dec-h">Decisions that shaped it</h2>
            <div className="case__col">
              <ul className="case__list">
                {c.decisions.map((d) => (
                  <li key={d.title} data-reveal>
                    <h3>{d.title}</h3>
                    <p>{d.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section aria-labelledby="chal-h">
            <h2 id="chal-h">What was hard</h2>
            <div className="case__col">
              <ul className="case__list">
                {c.challenges.map((d) => (
                  <li key={d.title} data-reveal>
                    <h3>{d.title}</h3>
                    <p>{d.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section aria-labelledby="out-h">
            <h2 id="out-h">Where it landed</h2>
            <div className="case__col case__col--wide">
              <div className="case__out">
                {c.outcome.map((o, k) => (
                  <div key={k} className={k === 0 ? "case__shows" : "case__limits"} data-reveal>
                    <h3>{k === 0 ? "What it shows" : "Limits"}</h3>
                    <p>{o}</p>
                  </div>
                ))}
              </div>
              {c.reflection ? <blockquote className="case__reflection">{c.reflection}</blockquote> : null}
              <ProjectLinks p={p} caseStudy={false} />
            </div>
          </section>
        </article>

        <aside className="section case__next" aria-label="Next case study">
          <a href={`/work/${next.slug}/`} className="case__next-link">
            <span>Next project</span>
            <strong>
              {next.title} <span aria-hidden="true">→</span>
            </strong>
          </a>
        </aside>
      </main>
      <Contact />
    </>
  );
}
