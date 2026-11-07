"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The site's whole motion runtime, in one place.
 *
 *  1. Reveal — elements marked `data-reveal` fade/rise once when they enter the
 *     viewport (one shared IntersectionObserver, disconnected on cleanup).
 *  (The opening name is its own WebGL component: SilkLettering.tsx.)
 *
 * Everything else (progress line, plate parallax) is CSS scroll-driven animation
 * in globals.css, so there are no scroll listeners at all.
 */
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.setAttribute("data-in", ""));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).setAttribute("data-in", "");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
