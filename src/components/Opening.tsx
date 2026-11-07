import { PrismaticSlats } from "./PrismaticSlats";
import { SilkLettering } from "./SilkLettering";
import { site } from "@/content/site";

const syllables = ["NAK", "SHA", "TRA"] as const;

/**
 * Hero: exactly one screen. The name is the only large thing on it, set as rippling
 * silk (SilkLettering.tsx) over the slat background, with one line and two
 * actions underneath. Everything else starts below the fold.
 *
 * The name is three stacked syllables on phones and one line on wide screens. The
 * accessible name is a single visually-hidden string.
 */
export function Opening() {
  let k = 0;
  return (
    <div className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <PrismaticSlats />
      <div className="hero__scrim" aria-hidden="true" />

      <section id="top" className="open" aria-labelledby="name">
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

        <div className="open__base">
          <p className="open__line">Computer science undergraduate building AI-assisted tools for education.</p>
          <p className="open__actions">
            <a href="/work/" className="btn">
              View projects <span aria-hidden="true">→</span>
            </a>
            <a href="#contact" className="btn btn--ghost">
              Get in touch
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
