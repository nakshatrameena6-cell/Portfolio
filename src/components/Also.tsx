import Image from "next/image";
import { supporting } from "@/content/projects";
import { Facts, ProjectLinks, StackLine, fmtPeriod } from "./bits";

/**
 * Supporting work as a typographic index. Native <details> rows: keyboard
 * and screen-reader accessible with no script. The ExamEye row carries the one
 * login screen capture.
 */
export function Also({ n = "02" }: { n?: string }) {
  return (
    <section id="also" className="section also" aria-labelledby="also-h">
      <header className="folio" data-reveal>
        <span>{n}</span>
        <h2 id="also-h">Also built</h2>
        <p>Smaller or earlier work, described by what the code does — and what it doesn&apos;t.</p>
      </header>

      <ol className="also__list">
        {supporting.map((p) => (
          <li key={p.slug} data-reveal>
            <details className="also__item">
              <summary>
                <span className="also__n">{p.n}</span>
                <span className="also__title">{p.title}</span>
                <span className="also__kicker">{p.kicker}</span>
                <span className="also__when">{fmtPeriod(p.period.from, p.period.to)}</span>
                <span className="also__plus" aria-hidden="true" />
              </summary>
              <div className="also__body">
                <div>
                  <p className="also__problem">{p.problem}</p>
                  <p>{p.summary}</p>
                  <p className="stage__status">
                    <b>Status.</b> {p.status}
                  </p>
                  <StackLine stack={p.stack} />
                  <Facts facts={p.facts} />
                  <ProjectLinks p={p} />
                </div>
                {p.slug === "examseye" ? (
                  <figure className="also__fig">
                    <Image
                      src="/evidence/examseye-login.webp"
                      alt="Login screen of the ExamEye prototype: a green panel headed 'AI-Powered Examination Monitoring' beside a sign-in form with Admin and Teacher demo-access buttons."
                      width={1600}
                      height={742}
                      sizes="(min-width: 900px) 40vw, 100vw"
                      loading="lazy"
                    />
                    <figcaption>
                      Login screen of the ExamEye prototype.
                    </figcaption>
                  </figure>
                ) : null}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
