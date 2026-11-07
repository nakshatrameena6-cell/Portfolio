"use client";

import { useState, type ReactNode } from "react";

export type IndexItem = {
  slug: string;
  title: string;
  kicker: string;
  when: string;
  stack: string[];
  preview: ReactNode;
};

/**
 * The home page's project index. A large type list; the row you point at (or focus
 * with the keyboard) lights up and its preview slides into the sticky panel
 * beside the list. Below 900px the panel is dropped and the rows stand alone.
 * Every row is a plain link to the case study.
 */
export function WorkIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="wix">
      <ul className="wix__list">
        {items.map((it, i) => (
          <li key={it.slug} data-reveal style={{ ["--d" as string]: i }}>
            <a
              href={`/work/${it.slug}/`}
              className="wix__row"
              data-active={active === i}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="wix__title">{it.title}</span>
              <span className="wix__kicker">{it.kicker}</span>
              <span className="wix__meta">
                {it.when}. {it.stack.slice(0, 3).join(", ")}
              </span>
              <span className="wix__go" aria-hidden="true">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="wix__stage" aria-hidden="true">
        {items.map((it, i) => (
          <div key={it.slug} className="wix__pv" data-active={active === i} inert>
            {it.preview}
          </div>
        ))}
      </div>
    </div>
  );
}
