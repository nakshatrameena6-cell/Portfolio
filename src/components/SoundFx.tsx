"use client";

import { useEffect } from "react";
import { initSound, sfx, unlockSound } from "@/lib/sound";

/**
 * Wires the sound kit to the page (renders nothing):
 *  - restores the saved on/off preference;
 *  - unlocks audio on the first real user gesture (browsers require one);
 *  - plays a soft tick for clicks on links/buttons and a glassy note when a mouse
 *    hovers them. Elements marked `data-no-sfx` skip only the click tick (they play their own sound).
 * The effects that belong to specific components (menu, curtain, silk) are triggered there.
 */
export function SoundFx() {
  useEffect(() => {
    initSound();

    const unlock = () => unlockSound();
    const gestureOpts = { passive: true, capture: true } as const;
    window.addEventListener("pointerdown", unlock, gestureOpts);
    window.addEventListener("keydown", unlock, gestureOpts);
    window.addEventListener("touchend", unlock, gestureOpts);

    const interactive = (e: Event) =>
      e.target instanceof Element ? e.target.closest("a[href], button, summary") : null;

    const onClick = (e: MouseEvent) => {
      const el = interactive(e);
      if (el && !el.closest("[data-no-sfx]")) sfx.click();
    };
    let last: Element | null = null;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = interactive(e);
      if (!el) {
        last = null;
        return;
      }
      if (el === last) return;
      last = el;
      sfx.hover();
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("pointerover", onOver, true);

    return () => {
      window.removeEventListener("pointerdown", unlock, gestureOpts);
      window.removeEventListener("keydown", unlock, gestureOpts);
      window.removeEventListener("touchend", unlock, gestureOpts);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointerover", onOver, true);
    };
  }, []);

  return null;
}
