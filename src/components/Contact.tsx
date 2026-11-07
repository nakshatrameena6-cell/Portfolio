import { Dial } from "./Dial";
import { site } from "@/content/site";

/**
 * Contact. One large address, two secondary pills, a quiet footer line. Only
 * channels set in src/content/site.ts render.
 */
export function Contact() {
  return (
    <footer id="contact" className="contact" aria-labelledby="contact-h">
      <Dial className="contact__dial" />
      <div className="section contact__inner">
        <h2 id="contact-h" className="contact__h" data-reveal>
          Questions about any of this work are welcome.
        </h2>

        {site.email ? (
          <p data-reveal>
            <a href={`mailto:${site.email}`} className="contact__mail">
              {site.email}
            </a>
          </p>
        ) : null}

        <p className="contact__pills" data-reveal>
          {site.linkedin ? (
            <a href={site.linkedin} className="btn btn--ghost">
              LinkedIn <span aria-hidden="true">↗</span>
              <span className="sr-only"> (external link)</span>
            </a>
          ) : null}
          <a href={site.github} className="btn btn--ghost">
            GitHub <span aria-hidden="true">↗</span>
            <span className="sr-only"> (external link)</span>
          </a>
        </p>

        <div className="contact__foot">
          <p>
            &copy; 2026 {site.name}
          </p>
          <a href="#top" className="contact__top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
