import { Dial } from "./Dial";
import { PrismaticSlats } from "./PrismaticSlats";
import { SilkLettering } from "./SilkLettering";
import { site } from "@/content/site";

const syllables = ["NAK", "SHA", "TRA"] as const;

/**
 * Opening. Two parts:
 *  1. The hero — exactly one viewport tall: a top line, the name, a scroll cue.
 *     The name is set as three stacked syllables on phones and one line on wide
 *     screens; the letters are rendered as rippling silk (see SilkLettering.tsx). The
 *     accessible name is a single visually-hidden string.
 *  2. The intro band — gloss, introduction and a count — which starts below the fold
 *     so the first screen stays a clean composition.
 */
export function Opening() {
  let k = 0;
  return (
    <>
      <div className="hero">
        <div className="hero__bg" aria-hidden="true" />
        <PrismaticSlats />
        <div className="hero__scrim" aria-hidden="true" />

        <section id="top" className="open" aria-labelledby="name">
          <p className="open__meta">
            <span>Portfolio · Edition 2026</span>
            <span>BE Computer Science and Engineering</span>
          </p>

          <h1 id="name" className="open__name">
            <span className="sr-only">{site.name}</span>
            <span className="open__syls" aria-hidden="true">
              {syllables.map((syl) => (
                <span key={syl} className="open__syl">
                  {[...syl].map((ch) => (
                    <span key={k} data-glyph className="glyph" style={{ ["--k" as string]: k++ }}>
                      {ch}
                    </span>
                  ))}
                </span>
              ))}
            </span>
            <SilkLettering />
          </h1>

          <a className="open__cue" href="#intro">
            <span className="open__cue-line" aria-hidden="true" />
            Scroll
          </a>
        </section>
      </div>

      <section id="intro" className="intro" aria-label="Introduction">
        <div className="open__foot">
          <div className="open__gloss">
            <Dial className="open__dial" />
            <p>
              <i lang="sa">{site.gloss.term}</i> — {site.gloss.meaning}.
            </p>
          </div>

          <p className="open__intro">
            {site.role} at {site.institution}. Builds software that has to be trusted — and keeps the receipts.
          </p>

          <p className="open__count">
            <span className="open__big">4</span> case studies and a handful of smaller builds.{" "}
            <a href="#work">Selected work&nbsp;↓</a>
          </p>
        </div>
      </section>
    </>
  );
}
