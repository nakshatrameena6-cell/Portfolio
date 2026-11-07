import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { features, bySlug } from "@/content/projects";
import { ProjectLinks, StackLine, Facts, authorshipLabel, fmtPeriod } from "@/components/bits";
import { Visual } from "@/components/visuals/Visual";
import { Contact } from "@/components/Contact";

export const dynamicParams = false;

export function generateStaticParams() {
  return features.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  return { title: `${p.title} — case study`, description: `${p.kicker}. ${p.problem}` };
}

const toc = [
  ["problem", "Problem"],
  ["approach", "Approach"],
  ["architecture", "Architecture"],
  ["decisions", "Decisions"],
  ["challenges", "Challenges"],
  ["outcome", "Outcome"],
] as const;

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
          <p className="stage__meta">
            <span className="stage__n">{p.n}</span>
            <span>Case study</span>
            <span>{fmtPeriod(p.period.from, p.period.to)}</span>
          </p>
          <h1 className="case__title">{p.title}</h1>
          <p className="case__kicker">{p.kicker}</p>

          <div className="case__meta">
            <div>
              <h2 className="case__label">Authorship</h2>
              <p>{authorshipLabel[p.authorship]}</p>
            </div>
            <div>
              <h2 className="case__label">Status</h2>
              <p>{p.status}</p>
            </div>
            <div>
              <h2 className="case__label">Stack</h2>
              <StackLine stack={p.stack} />
            </div>
          </div>
        </header>

        <div className="section case__grid">
          <nav className="case__toc" aria-label="On this page">
            <ol>
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="case__body">
            <section id="problem" aria-labelledby="problem-h" data-reveal>
              <h2 id="problem-h">Problem</h2>
              <p className="case__lede">{c.problem}</p>
            </section>

            <section id="approach" aria-labelledby="approach-h" data-reveal>
              <h2 id="approach-h">Approach</h2>
              <p>{c.approach}</p>
              <Facts facts={p.facts} />
            </section>

            <section id="architecture" aria-labelledby="arch-h">
              <h2 id="arch-h">Architecture</h2>
              <p data-reveal>{c.architectureNote}</p>
              <div className={`case__visual case__visual--${p.visual}`}>{p.visual && <Visual id={p.visual} />}</div>
            </section>

            <section id="decisions" aria-labelledby="dec-h">
              <h2 id="dec-h">Key decisions</h2>
              <ol className="case__list">
                {c.decisions.map((d, k) => (
                  <li key={d.title} data-reveal>
                    <span className="case__num">{String(k + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{d.title}</h3>
                      <p>{d.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="challenges" aria-labelledby="chal-h">
              <h2 id="chal-h">Challenges</h2>
              <ol className="case__list">
                {c.challenges.map((d, k) => (
                  <li key={d.title} data-reveal>
                    <span className="case__num">{String(k + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{d.title}</h3>
                      <p>{d.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="outcome" aria-labelledby="out-h">
              <h2 id="out-h">Outcome</h2>
              {c.outcome.map((o, k) => (
                <div key={k} className={k === 0 ? "case__out" : "case__out case__out--limits"} data-reveal>
                  <h3>{k === 0 ? "What it shows" : "Limits"}</h3>
                  <p>{o}</p>
                </div>
              ))}
              {c.reflection ? <blockquote className="case__reflection">{c.reflection}</blockquote> : null}
              <ProjectLinks p={{ ...p, caseStudy: undefined }} />
            </section>
          </div>
        </div>

        <aside className="section case__next" aria-label="Next case study">
          <p>Next</p>
          <a href={`/work/${next.slug}/`}>
            <span className="case__next-n">{next.n}</span>
            {next.title} <span aria-hidden="true">→</span>
          </a>
          <p className="case__fine">
            <a href="/work/">All projects</a>
          </p>
        </aside>
      </main>
      <Contact />
    </>
  );
}
