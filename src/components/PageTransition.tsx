"use client";

import { useEffect } from "react";
import { Dial } from "./Dial";
import { sfx } from "@/lib/sound";

export type CurtainLabel = { index: string; title: string };
const KEY = "nsv-curtain";

/**
 * Page transition — a curtain that wipes up over the current page carrying the
 * destination's number and name, the browser navigates underneath, then the
 * curtain lifts off the top of the new page. The idea is borrowed from
 * Shreekumar B's Portfolio-X2; this version is plain CSS clip-path plus a small
 * script, because this site is a static multi-page export (full page loads).
 *
 * State lives in `html[data-curtain]`: "cover" (leaving), "hold" (just arrived,
 * still covered), "reveal" (lifting). The head script in layout.tsx sets "hold"
 * before first paint so the new page never flashes uncovered.
 */
export function PageTransition({ labels }: { labels: Record<string, CurtainLabel> }) {
  useEffect(() => {
    const root = document.documentElement;
    const curtain = document.getElementById("curtain");
    if (!curtain) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const norm = (p: string) => p.replace(/\/+$/, "") || "/";
    const labelFor = (path: string): CurtainLabel => labels[norm(path)] ?? { index: "", title: "" };
    // The label travels as CSS custom properties (drawn with ::before), not DOM text, so React
    // hydration can never discard it and the new page has it from first paint.
    const paint = (l: CurtainLabel) => {
      root.style.setProperty("--curtain-i", JSON.stringify(l.index ? `Project ${l.index}` : "Nakshatra S.V"));
      root.style.setProperty("--curtain-t", JSON.stringify(l.title));
    };
    let leaving = false;

    /* Arriving: wait for fonts (max 700 ms), then lift the curtain. */
    let liftTimer = 0;
    if (root.dataset.curtain === "hold") {
      const fonts = document.fonts?.ready ?? Promise.resolve();
      Promise.race([fonts, new Promise((r) => window.setTimeout(r, 700))]).then(() => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            root.dataset.curtain = "reveal";
            sfx.chime();
            liftTimer = window.setTimeout(() => root.removeAttribute("data-curtain"), 900); // safety net
          }),
        );
      });
    }
    const onEnd = (e: TransitionEvent) => {
      if (e.target === curtain && e.propertyName === "clip-path" && root.dataset.curtain === "reveal") {
        window.clearTimeout(liftTimer);
        root.removeAttribute("data-curtain");
      }
    };
    curtain.addEventListener("transitionend", onEnd);

    /* Leaving: intercept plain clicks on internal links to a different page. */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (reduce.matches || leaving) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (norm(url.pathname) === norm(window.location.pathname)) return; // same page: let hash links scroll
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return; // files such as images
      e.preventDefault();
      leaving = true;
      const label = labelFor(url.pathname);
      paint(label);
      try {
        sessionStorage.setItem(KEY, JSON.stringify(label));
      } catch {
        /* private mode: navigation still works, the new page just won't hold the curtain */
      }
      sfx.swoosh();
      root.dataset.curtain = "cover";
      let went = false;
      const go = () => {
        if (went) return;
        went = true;
        window.location.assign(url.href);
      };
      curtain.addEventListener("transitionend", go, { once: true });
      window.setTimeout(go, 700);
    };
    document.addEventListener("click", onClick);

    /* Back/forward cache can restore a page frozen mid-cover. */
    const onShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        leaving = false;
        root.removeAttribute("data-curtain");
      }
    };
    window.addEventListener("pageshow", onShow);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("pageshow", onShow);
      curtain.removeEventListener("transitionend", onEnd);
      window.clearTimeout(liftTimer);
    };
  }, [labels]);

  return (
    <div id="curtain" className="curtain" aria-hidden="true">
      <div className="curtain__top">
        <span className="curtain__meta" />
        <Dial className="curtain__dial" />
      </div>
      <p className="curtain__title" />
    </div>
  );
}
