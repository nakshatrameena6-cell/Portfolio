import { logos, type Logo } from "@/content/logos";

function Mark({ l }: { l: Logo }) {
  return (
    <li className="marq__item">
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
        <path d={l.path} fill="currentColor" />
      </svg>
      <span>{l.name}</span>
    </li>
  );
}

/**
 * A slow strip of the technologies used across the projects. Every one appears in
 * a repository's code or dependencies. The second copy is for the loop only and is
 * hidden from assistive tech; under reduced motion the strip stops and wraps.
 */
export function Marquee() {
  return (
    <section className="marq" aria-label="Technologies used across the projects">
      <div className="marq__row">
        <ul className="marq__track">
          {logos.map((l) => (
            <Mark key={l.id} l={l} />
          ))}
        </ul>
        <ul className="marq__track marq__track--dup" aria-hidden="true">
          {logos.map((l) => (
            <Mark key={l.id} l={l} />
          ))}
        </ul>
      </div>
    </section>
  );
}
