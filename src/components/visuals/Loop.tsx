/**
 * MedEx — the decision loop: capture, forecast, risk,
 * redistribution, human review, audit. The review node is the product.
 */
const stages = [
  { k: "Capture", d: "voice · photo · form" },
  { k: "Forecast", d: "demand with ranges" },
  { k: "Risk", d: "stock-out detection" },
  { k: "Redistribute", d: "OR-Tools proposal" },
  { k: "Review", d: "a person decides" },
  { k: "Audit", d: "every outcome recorded" },
] as const;

const CX = 360;
const CY = 330;
const R = 196;

export function Loop() {
  const pts = stages.map((s, i) => {
    const a = (i / stages.length) * Math.PI * 2 - Math.PI / 2;
    return { ...s, i, x: CX + Math.cos(a) * R, y: CY + Math.sin(a) * R, a };
  });
  return (
    <figure className="loop" data-reveal>
      <svg
        viewBox="0 0 720 660"
        role="img"
        aria-label="A ring of six stages: capture, forecast, risk, redistribute, review, audit. The review stage is highlighted: approve, modify, reject or escalate."
      >
        <circle cx={CX} cy={CY} r={R} className="loop__ring" />
        <circle cx={CX} cy={CY} r={R - 62} className="loop__ring loop__ring--inner" />
        {pts.map((p) => {
          const review = p.k === "Review";
          const lx = CX + Math.cos(p.a) * (R + 30);
          const ly = CY + Math.sin(p.a) * (R + 34);
          const c = Math.cos(p.a);
          const anchor = Math.abs(c) < 0.3 ? "middle" : c > 0 ? "start" : "end";
          const top = Math.sin(p.a) < -0.9;
          return (
            <g key={p.k}>
              <circle cx={p.x} cy={p.y} r={review ? 17 : 10} className={review ? "loop__node loop__node--key" : "loop__node"} />
              <text x={p.x} y={p.y + 4} textAnchor="middle" className={review ? "loop__num loop__num--key" : "loop__num"}>
                {p.i + 1}
              </text>
              <text x={lx} y={top ? ly - 18 : ly} textAnchor={anchor} className="loop__label">
                {p.k}
              </text>
              <text x={lx} y={(top ? ly - 18 : ly) + 18} textAnchor={anchor} className="loop__sub">
                {p.d}
              </text>
            </g>
          );
        })}
        <text x={CX} y={CY - 8} textAnchor="middle" className="loop__core">
          AI recommends.
        </text>
        <text x={CX} y={CY + 30} textAnchor="middle" className="loop__core loop__core--key">
          Humans decide.
        </text>
        <text x={CX} y={CY + 58} textAnchor="middle" className="loop__sub loop__sub--core">
          approve · modify · reject · escalate
        </text>
      </svg>
      <figcaption>
        The MedEx decision loop. &ldquo;AI recommends. Humans decide.&rdquo; is the project&apos;s guiding
        principle.
      </figcaption>
    </figure>
  );
}
