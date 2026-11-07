import type { Project } from "@/content/types";
import { features } from "@/content/projects";
import { Facts, ProjectLinks, StackLine, authorshipLabel, fmtPeriod } from "./bits";
import { Visual } from "./visuals/Visual";

/** Text column shared by every stage; the composition around it differs. */
function StageText({ p, level = 3 }: { p: Project; level?: 3 }) {
  const H = `h${level}` as "h3";
  return (
    <div className="stage__text">
      <p className="stage__meta" data-reveal>
        <span className="stage__n">{p.n}</span>
        <span>{fmtPeriod(p.period.from, p.period.to)}</span>
        <span>{authorshipLabel[p.authorship]}</span>
      </p>
      <H className="stage__title" data-reveal>
        {p.title}
      </H>
      <p className="stage__kicker" data-reveal>
        {p.kicker}
      </p>
      <p className="stage__problem" data-reveal>
        {p.problem}
      </p>
      <p className="stage__summary" data-reveal>
        {p.summary}
      </p>
      <div data-reveal>
        <Facts facts={p.facts} />
        <StackLine stack={p.stack} />
        <p className="stage__status">
          <b>Status.</b> {p.status}
        </p>
        <ProjectLinks p={p} />
      </div>
    </div>
  );
}

export function Work({ n = "01" }: { n?: string }) {
  const [suraksha, panda, medex, museum] = features;
  if (!suraksha || !panda || !medex || !museum) return null;

  return (
    <section id="selected" className="work" aria-labelledby="selected-h">
      <header className="section folio" data-reveal>
        <span>{n}</span>
        <h2 id="selected-h">Selected work</h2>
        <p>Four projects, in depth. Each has its own case study.</p>
      </header>

      {/* 01 — ink panel, sticky text beside the gate run */}
      <article className="stage stage--ink" aria-label={suraksha.title}>
        <div className="section stage__grid">
          <StageText p={suraksha} />
          <div className="stage__visual">{suraksha.visual && <Visual id={suraksha.visual} />}</div>
        </div>
      </article>

      {/* 02 — type-led spread: oversized word, waveforms run full width */}
      <article className="stage stage--type" aria-label={panda.title}>
        <div className="section">
          <p className="stage__ghost" aria-hidden="true">
            8&nbsp;kHz
          </p>
          <div className="stage__visual stage__visual--wide">{panda.visual && <Visual id={panda.visual} />}</div>
          <div className="stage__grid stage__grid--low">
            <StageText p={panda} />
          </div>
        </div>
      </article>

      {/* 03 — ring diagram on a tinted field, text to the right */}
      <article className="stage stage--ring" aria-label={medex.title}>
        <div className="section stage__grid stage__grid--flip">
          <div className="stage__visual">{medex.visual && <Visual id={medex.visual} />}</div>
          <StageText p={medex} />
        </div>
      </article>

      {/* 04 — a framed plate of the real ER diagram, offset */}
      <article className="stage stage--plate" aria-label={museum.title}>
        <div className="section">
          <div className="stage__plate">{museum.visual && <Visual id={museum.visual} />}</div>
          <div className="stage__grid stage__grid--offset">
            <StageText p={museum} />
          </div>
        </div>
      </article>
    </section>
  );
}
