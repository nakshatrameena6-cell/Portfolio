/**
 * Sound kit — synthesized with the Web Audio API, so nothing is downloaded.
 *
 * Design
 *  - One bus: master gain → gentle compressor → speakers, with a short synthesized room
 *    reverb on a send, so every effect sounds like it belongs to the same space.
 *  - Pitched events draw from a pentatonic scale, so any two notes can overlap without clashing.
 *  - Every effect is rate-limited by key, and all levels are deliberately quiet.
 *  - Browsers only allow audio after a user gesture. The context is created lazily on the
 *    first pointer/key/touch gesture, so there are never autoplay warnings in the console.
 *  - The preference is stored in localStorage (`nsv-sound`). Sound is ON by default
 *    (`DEFAULT_ON`) and can be switched off from the bar at any time.
 */

const DEFAULT_ON = true;
const STORAGE_KEY = "nsv-sound";

let ctx: AudioContext | null = null;
let enabled = DEFAULT_ON;
let unlocked = false;
const listeners = new Set<() => void>();
const lastAt: Record<string, number> = {};

export const subscribeSound = (cb: () => void): (() => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
export const getSound = (): boolean => enabled;
export const getSoundServer = (): boolean => DEFAULT_ON;
const emit = () => listeners.forEach((l) => l());

/** Restore the saved preference (call once on the client). */
export function initSound(): void {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    enabled = saved === null ? DEFAULT_ON : saved !== "0";
  } catch {
    /* storage blocked: keep the default */
  }
  // A previous page in this tab may already have been interacted with.
  if (typeof navigator !== "undefined" && navigator.userActivation?.hasBeenActive) unlocked = true;
  emit();
}

export function setSound(on: boolean): void {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
  emit();
  if (on) sfx.chime();
}

/** Called from the first user gesture: audio is allowed from now on. */
export function unlockSound(): void {
  if (unlocked && ctx) {
    if (ctx.state === "suspended") void ctx.resume();
    return;
  }
  unlocked = true;
  if (!enabled) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    /* no Web Audio */
  }
}

/* ───────────── plumbing ───────────── */

// C major pentatonic from C5: any two notes sound fine together.
const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];
const note = (i: number): number => SCALE[((i % SCALE.length) + SCALE.length) % SCALE.length] ?? 523.25;

type Bus = { c: AudioContext; dry: GainNode; verb: ConvolverNode };
let bus: Bus | null = null;

function impulse(c: AudioContext, seconds: number, decay: number): AudioBuffer {
  const len = Math.ceil(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

function getBus(c: AudioContext): Bus {
  if (bus && bus.c === c) return bus;
  const master = c.createGain();
  master.gain.value = 0.8;
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -22;
  comp.ratio.value = 3;
  comp.attack.value = 0.004;
  comp.release.value = 0.2;
  master.connect(comp).connect(c.destination);
  const dry = c.createGain();
  dry.connect(master);
  const verb = c.createConvolver();
  verb.buffer = impulse(c, 1.4, 2.6);
  const wet = c.createGain();
  wet.gain.value = 0.3;
  verb.connect(wet).connect(master);
  bus = { c, dry, verb };
  return bus;
}

function route(c: AudioContext, node: AudioNode, room = 0.25): void {
  const b = getBus(c);
  node.connect(b.dry);
  if (room > 0) {
    const send = c.createGain();
    send.gain.value = room;
    node.connect(send).connect(b.verb);
  }
}

/** Returns a running context if sound is on, unlocked, and this key is not rate-limited. */
function audio(key: string, gap = 80): AudioContext | null {
  if (!enabled || !unlocked || typeof window === "undefined") return null;
  const now = performance.now();
  if (now - (lastAt[key] ?? -1e9) < gap) return null;
  lastAt[key] = now;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function noiseSource(c: AudioContext, seconds: number): AudioBufferSourceNode {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  return src;
}

type ToneOpts = { type?: OscillatorType; gain?: number; dur?: number; room?: number; glideTo?: number; bell?: boolean; at?: number };

/** One tuned voice: fast attack, exponential decay. `bell` adds an inharmonic partial for a glassy strike. */
function tone(c: AudioContext, freq: number, o: ToneOpts = {}): void {
  const { type = "sine", gain = 0.04, dur = 0.4, room = 0.3, glideTo, bell = false, at = 0 } = o;
  const t = c.currentTime + at;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t + dur * 0.8);
  osc.connect(g);
  osc.start(t);
  osc.stop(t + dur + 0.02);
  if (bell) {
    const g2 = c.createGain();
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.linearRampToValueAtTime(gain * 0.35, t + 0.004);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.5);
    const o2 = c.createOscillator();
    o2.frequency.value = freq * 2.76;
    o2.connect(g2);
    o2.start(t);
    o2.stop(t + dur * 0.5 + 0.02);
    route(c, g2, room);
  }
  route(c, g, room);
}

/** A very short filtered-noise tick: the "contact" of a key or switch. */
function tap(c: AudioContext, o: { freq?: number; gain?: number; dur?: number; at?: number } = {}): void {
  const { freq = 3600, gain = 0.03, dur = 0.016, at = 0 } = o;
  const t = c.currentTime + at;
  const src = noiseSource(c, dur + 0.01);
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.value = freq;
  f.Q.value = 1.4;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g);
  route(c, g, 0.1);
  src.start(t);
  src.stop(t + dur + 0.02);
}

/** Filtered noise whose centre frequency glides: the whoosh of a wipe or a breath of wind. */
function sweep(c: AudioContext, o: { from: number; to: number; dur: number; gain: number; q?: number; at?: number; peak?: number; room?: number }): void {
  const { from, to, dur, gain, q = 0.9, at = 0, peak = 0.35, room = 0.3 } = o;
  const t = c.currentTime + at;
  const src = noiseSource(c, dur + 0.05);
  const f = c.createBiquadFilter();
  f.type = "bandpass";
  f.Q.value = q;
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + dur * peak);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g);
  route(c, g, room);
  src.start(t);
  src.stop(t + dur + 0.06);
}

/**
 * A water droplet / bubble: a sine whose pitch climbs quickly while it decays — the way a real
 * air bubble in water "bloops". Small, high drops use a small rise; big plops start low and rise more.
 */
function bubble(c: AudioContext, o: { freq: number; gain?: number; dur?: number; rise?: number; at?: number; room?: number }): void {
  const { freq, gain = 0.03, dur = 0.12, rise = 2.2, at = 0, room = 0.55 } = o;
  const t = c.currentTime + at;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * rise, t + dur * 0.55);
  osc.connect(g);
  osc.start(t);
  osc.stop(t + dur + 0.02);
  route(c, g, room);
}

/* ───────────── the effects ───────────── */

let hoverStep = 0;

export const sfx = {
  /** Any link or button press. */
  click(): void {
    const c = audio("click", 60);
    if (!c) return;
    tap(c, { freq: 3800, gain: 0.032 });
    tone(c, note(5), { gain: 0.012, dur: 0.09, room: 0.15 });
  },

  /** Hovering an interactive element: a soft, glassy note that walks up and down the scale. */
  hover(): void {
    const c = audio("hover", 110);
    if (!c) return;
    hoverStep = (hoverStep + 1) % 7;
    tone(c, note(2 + (hoverStep % 5)), { gain: 0.014, dur: 0.3, room: 0.45, bell: true });
  },

  /** Index sheet opening: a rising wipe, then one soft note per link, timed to the stagger. */
  menuOpen(): void {
    const c = audio("menu", 200);
    if (!c) return;
    sweep(c, { from: 260, to: 2600, dur: 0.5, gain: 0.07, q: 0.8 });
    tone(c, 110, { type: "sine", gain: 0.05, dur: 0.35, glideTo: 70, room: 0.1 });
    for (let i = 0; i < 5; i++) tone(c, note(i), { gain: 0.016, dur: 0.5, room: 0.5, bell: true, at: 0.17 + i * 0.07 });
  },

  /** Index sheet closing: the wipe, falling. */
  menuClose(): void {
    const c = audio("menu", 200);
    if (!c) return;
    sweep(c, { from: 2400, to: 240, dur: 0.38, gain: 0.05, q: 0.8, peak: 0.2 });
    tone(c, note(1), { gain: 0.014, dur: 0.3, glideTo: note(0), room: 0.4 });
  },

  /** Page-change curtain wiping in. */
  swoosh(): void {
    const c = audio("swoosh", 300);
    if (!c) return;
    sweep(c, { from: 380, to: 3200, dur: 0.46, gain: 0.07, q: 0.7 });
    tone(c, 130, { gain: 0.05, dur: 0.4, glideTo: 60, room: 0.1 });
  },

  /** Two glassy notes: the curtain lifting / sound switched on. */
  chime(): void {
    const c = audio("chime", 400);
    if (!c) return;
    tone(c, note(4), { gain: 0.04, dur: 0.7, room: 0.55, bell: true });
    tone(c, note(6), { gain: 0.032, dur: 0.8, room: 0.55, bell: true, at: 0.1 });
  },

  /**
   * Moving across the name: it is water. A few droplets and a faint trickle of flow; the faster
   * you move, the more drops and the louder they are.
   */
  ripple(amp: number): void {
    const c = audio("ripple", 140);
    if (!c) return;
    const a = Math.min(1, Math.max(0.15, amp));
    const drops = 1 + Math.round(a * 3);
    for (let i = 0; i < drops; i++) {
      bubble(c, {
        freq: 520 + Math.random() * 1500,
        gain: 0.012 + 0.02 * a,
        dur: 0.07 + Math.random() * 0.09,
        rise: 1.5 + Math.random() * 1.2,
        at: i * (0.02 + Math.random() * 0.05),
      });
    }
    sweep(c, { from: 650, to: 1500, dur: 0.34, gain: 0.011 * a + 0.003, q: 1.3, peak: 0.4, room: 0.6 });
  },

  /** Clicking or tapping the name: a drop lands — a low plop, a small splash, then a few drips. */
  splash(): void {
    const c = audio("splash", 160);
    if (!c) return;
    bubble(c, { freq: 230, gain: 0.07, dur: 0.3, rise: 3.1, room: 0.5 });
    bubble(c, { freq: 480, gain: 0.034, dur: 0.18, rise: 2.4, at: 0.03, room: 0.55 });
    // the splash itself: a short burst of bright noise
    const src = noiseSource(c, 0.2);
    const f = c.createBiquadFilter();
    f.type = "highpass";
    f.frequency.value = 2400;
    const g = c.createGain();
    const t = c.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.04, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    src.connect(f).connect(g);
    route(c, g, 0.5);
    src.start(t);
    src.stop(t + 0.2);
    // trailing drips
    for (let i = 0; i < 3; i++) {
      bubble(c, {
        freq: 1100 + Math.random() * 1500,
        gain: 0.018 - i * 0.004,
        dur: 0.09 + Math.random() * 0.06,
        rise: 1.4 + Math.random() * 0.8,
        at: 0.14 + i * (0.1 + Math.random() * 0.12),
        room: 0.65,
      });
    }
  },
} as const;
