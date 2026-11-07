"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Dial } from "./Dial";
import { SoundToggle } from "./SoundToggle";
import { site } from "@/content/site";
import { sfx } from "@/lib/sound";

const chapters = [
  { id: "top", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

/** A separate page, listed after the home chapters. */
const projectsLink = { href: "/work/", label: "All projects" } as const;

/**
 * Site navigation: a fixed glass top bar and a full-screen index sheet.
 *
 * The sheet's motion follows Shreekumar B's portfolio menu: the panel is revealed by a
 * clip-path wipe (top edge fixed, bottom edge drops; 0.45s ease-in-out), and each link
 * rises out of its own mask with a stagger (0.15s delay + 0.07s per item). Closing
 * reverses it. All of that is CSS (see `.sheet` in globals.css), driven by `data-open`.
 * Focus is trapped while open, Escape closes, scroll is locked.
 *
 * Links use "/#id" so it works from the Projects and case-study pages too.
 */
export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const onProjects = pathname.startsWith("/work");
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!onHome) return;
    const els = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onHome]);

  // While open: Escape closes, Tab stays inside (toggle + sheet links), background scroll is locked.
  useEffect(() => {
    if (!open) return;
    const focusables = () =>
      [toggleRef.current, ...Array.from(sheetRef.current?.querySelectorAll<HTMLElement>("a[href]") ?? [])].filter(
        (el): el is HTMLElement => el !== null,
      );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        sfx.menuClose();
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      const first = list[0];
      const last = list[list.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Plain anchors: this is a static multi-page export, so cross-page links are ordinary navigations.
  const href = (id: string) => (onHome ? `#${id}` : id === "top" ? "/" : `/#${id}`);
  const close = () => {
    setOpen(false);
    sfx.menuClose();
  };
  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) sfx.menuOpen();
    else sfx.menuClose();
  };
  const rows = chapters.length + 1; // chapters + "All projects"

  return (
    <>
      <header className="bar">
        <a href={onHome ? "#top" : "/"} className="bar__brand" aria-label="Nakshatra S.V, home">
          <Dial className="bar__dial" />
          <span>N.S.V</span>
        </a>
        <div className="bar__actions">
          <SoundToggle />
          <button
            ref={toggleRef}
            type="button"
            className="bar__toggle"
            aria-expanded={open}
            aria-controls="index-sheet"
            data-no-sfx
            onClick={toggle}
          >
            <span key={open ? "close" : "index"} className="bar__label">
              {open ? "Close" : "Index"}
            </span>
            <span className="bar__icon" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <div
        id="index-sheet"
        ref={sheetRef}
        className="sheet"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Index"
        inert={!open}
      >
        <nav aria-label="Sections" className="sheet__nav">
          <ol>
            {chapters.map((c, i) => (
              <li key={c.id} style={{ ["--i" as string]: i }}>
                <a
                  href={href(c.id)}
                  ref={i === 0 ? firstLinkRef : undefined}
                  onClick={close}
                  aria-current={onHome && active === c.id ? "location" : undefined}
                >
                  {c.label}
                </a>
              </li>
            ))}
            <li style={{ ["--i" as string]: chapters.length }}>
              <a href={projectsLink.href} onClick={close} aria-current={onProjects ? "page" : undefined}>
                {projectsLink.label}
              </a>
            </li>
          </ol>
        </nav>

        <ul className="sheet__foot" aria-label="Contact">
          {site.email ? (
            <li style={{ ["--i" as string]: rows }}>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
          ) : null}
          {site.linkedin ? (
            <li style={{ ["--i" as string]: rows + 1 }}>
              <a href={site.linkedin}>
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </>
  );
}
