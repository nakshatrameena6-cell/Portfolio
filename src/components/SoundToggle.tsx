"use client";

import { useSyncExternalStore } from "react";
import { getSound, getSoundServer, setSound, subscribeSound, unlockSound } from "@/lib/sound";

/** Sound on/off in the bar: four equaliser bars that dance when sound is on and flatten when off. */
export function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, getSound, getSoundServer);
  return (
    <button
      type="button"
      className="bar__sound"
      aria-pressed={on}
      aria-label="Sound effects"
      title={on ? "Sound on — click to mute" : "Sound off — click to turn on"}
      data-on={on}
      data-no-sfx
      onClick={() => {
        unlockSound();
        setSound(!on);
      }}
    >
      <span className="bar__eq" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
