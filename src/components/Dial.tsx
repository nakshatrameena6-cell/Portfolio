/**
 * The nakṣatra dial: 27 ticks around a ring, one for each lunar mansion.
 * The first tick (Ashwini, the first nakṣatra) is marked in the accent colour.
 * It is the site's recurring mark: opening, about, contact, favicon.
 */
export function Dial({
  className = "",
  title,
  rotate = 0,
}: {
  className?: string;
  title?: string;
  rotate?: number;
}) {
  const ticks = Array.from({ length: 27 }, (_, i) => {
    const a = (i / 27) * Math.PI * 2 - Math.PI / 2;
    const long = i === 0;
    const r1 = long ? 78 : 86;
    return {
      i,
      x1: 100 + Math.cos(a) * r1,
      y1: 100 + Math.sin(a) * r1,
      x2: 100 + Math.cos(a) * 96,
      y2: 100 + Math.sin(a) * 96,
      long,
    };
  });
  return (
    <svg
      viewBox="0 0 200 200"
      className={`dial ${className}`}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "100px 100px" }}>
        <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1 3" />
        {ticks.map((t) => (
          <line
            key={t.i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.long ? "var(--dial-accent, var(--red))" : "currentColor"}
            strokeWidth={t.long ? 2 : 0.9}
            strokeLinecap="round"
          />
        ))}
      </g>
      {/* four-point star at the centre */}
      <path
        d="M100 84 C101.6 95 105 98.4 116 100 C105 101.6 101.6 105 100 116 C98.4 105 95 101.6 84 100 C95 98.4 98.4 95 100 84Z"
        fill="var(--dial-accent, var(--red))"
      />
    </svg>
  );
}
