/**
 * PandaMIND — one procedural "speech-like" signal, narrowed the way each of the
 * benchmark's four channels narrows speech. It is an ILLUSTRATION of the
 * degradation idea, generated here; it is not project data.
 */

const X0 = 150; // left gutter for labels
const W = 1000;
const H = 60;
const GAP = 8;
const N = 900;

// Small deterministic PRNG so server and client render identical paths.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const base = (() => {
  const r = rng(27);
  const phase = [r() * 6, r() * 6, r() * 6];
  return Array.from({ length: N }, (_, i) => {
    const t = i / N;
    const env =
      Math.pow(Math.sin(Math.PI * ((t * 7.3) % 1)), 1.4) * (0.55 + 0.45 * Math.sin(t * 9 + 1));
    const carrier =
      Math.sin(i * 0.9 + phase[0]!) * 0.55 + Math.sin(i * 2.3 + phase[1]!) * 0.3 + Math.sin(i * 5.1 + phase[2]!) * 0.15;
    return env * carrier;
  });
})();

type Channel = { id: string; label: string; rate: string; hold: number; levels: number; smooth: number };
const channels: Channel[] = [
  { id: "clean", label: "Clean", rate: "16 kHz PCM", hold: 1, levels: 0, smooth: 0 },
  { id: "g711", label: "G.711", rate: "8 kHz", hold: 2, levels: 24, smooth: 1 },
  { id: "amr", label: "AMR-NB", rate: "8 kHz", hold: 3, levels: 12, smooth: 2 },
  { id: "opus", label: "WhatsApp Opus", rate: "16 kHz", hold: 2, levels: 40, smooth: 2 },
];

function pathFor(c: Channel) {
  const out: number[] = [];
  for (let i = 0; i < N; i++) {
    const j = Math.floor(i / c.hold) * c.hold;
    let v = base[j]!;
    if (c.smooth) {
      let acc = 0;
      let n = 0;
      for (let k = -c.smooth; k <= c.smooth; k++) {
        const idx = Math.min(N - 1, Math.max(0, j + k));
        acc += base[idx]!;
        n++;
      }
      v = acc / n;
    }
    if (c.levels) v = Math.round(v * c.levels) / c.levels;
    out.push(v);
  }
  const mid = H / 2;
  return out
    .map((v, i) => `${i === 0 ? "M" : "L"}${(X0 + (i / (N - 1)) * W).toFixed(1)} ${(mid - v * (H * 0.46)).toFixed(1)}`)
    .join("");
}

const paths = channels.map((c) => ({ ...c, d: pathFor(c) }));

export function Channels() {
  return (
    <figure className="channels" data-reveal>
      <div className="channels__plot">
        <svg
          viewBox={`0 0 ${X0 + W} ${H * paths.length + GAP * (paths.length - 1)}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="Four stacked waveforms of the same signal: clean, G.711, AMR-NB and WhatsApp Opus, each progressively coarser."
        >
          {paths.map((p, i) => (
            <g key={p.id} transform={`translate(0 ${i * (H + GAP)})`}>
              <line x1={X0} x2={X0 + W} y1={H / 2} y2={H / 2} className="channels__axis" />
              <path d={p.d} className={`channels__wave channels__wave--${p.id}`} pathLength={1} />
            </g>
          ))}
        </svg>
        <ul className="channels__labels" aria-hidden="true">
          {paths.map((p) => (
            <li key={p.id}>
              <b>{p.label}</b>
              <span>{p.rate}</span>
            </li>
          ))}
        </ul>
      </div>
      <ol className="channels__legend" aria-label="Bands, top to bottom">
        {paths.map((p) => (
          <li key={p.id}>
            <b>{p.label}</b> <span>{p.rate}</span>
          </li>
        ))}
      </ol>
      <figcaption>
        Illustration: one procedural signal, coarsened the way each channel coarsens speech. The waveform is
        illustrative, not project data.
      </figcaption>
    </figure>
  );
}
