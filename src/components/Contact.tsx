import { Dial } from "./Dial";
import { site } from "@/content/site";

/**
 * 03 — Contact. Only verified channels render. `email` and `linkedin` in
 * src/content/site.ts are null until the owner supplies them.
 */
export function Contact() {
  const handle = site.github.replace("https://", "");
  return (
    <footer id="contact" className="contact" aria-labelledby="contact-h">
      <Dial className="contact__dial" />
      <div className="section contact__inner">
        <header className="folio" data-reveal>
          <span>03</span>
          <h2 id="contact-h">Contact</h2>
        </header>

        <p className="contact__lede" data-reveal>
          Questions about any of this work are welcome. Email is the quickest way to get in touch.
        </p>

        <ul className="contact__links" data-reveal>
          <li>
            <a href={site.github} className="contact__big">
              {handle} <span aria-hidden="true">↗</span>
              <span className="sr-only"> (external link)</span>
            </a>
          </li>
          {site.email ? (
            <li>
              <a href={`mailto:${site.email}`} className="contact__big">
                {site.email}
              </a>
            </li>
          ) : null}
          {site.linkedin ? (
            <li>
              <a href={site.linkedin} className="contact__big">
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </li>
          ) : null}
        </ul>

        <div className="contact__foot">
          <p>
            Set in Fraunces, Instrument Sans and JetBrains Mono.
          </p>
          <a href="#top" className="contact__top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
