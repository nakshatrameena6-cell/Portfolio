/**
 * Suraksha — the ten pre-execution safety gates, in the order and with the names
 * used in backend/response/safety_gates.py. An action must clear every gate.
 */
const gates = [
  ["Authorization", "Is the role allowed to execute responses at all?"],
  ["Policy", "Is the action known, and is it below Tier C?"],
  ["Kill switch", "Has automated response been halted?"],
  ["Target scope", "Is the target valid and not a critical asset?"],
  ["Blast radius", "Fewer than five active blocks or isolations?"],
  ["Audit persistence", "Can the audit store be written right now?"],
  ["Pre-state capture", "Is a snapshot ready so the action can be rolled back?"],
  ["Idempotency", "Already done? Then succeed without repeating it."],
  ["Timeout", "Is execution time-boxed?"],
  ["Verifier", "Is an independent verifier available to check the result?"],
] as const;

const tiers = [
  ["A", "Alert only"],
  ["B", "Bounded action, automatic"],
  ["C", "Analyst approval required"],
] as const;

export function Gates() {
  return (
    <figure className="gates" data-reveal>
      <ul className="gates__tiers" aria-label="Response tiers">
        {tiers.map(([k, v]) => (
          <li key={k}>
            <span className="gates__tier">Tier {k}</span> {v}
          </li>
        ))}
      </ul>
      <ol className="gates__list">
        {gates.map(([name, q], i) => (
          <li key={name} style={{ ["--i" as string]: i }}>
            <span className="gates__n">{String(i + 1).padStart(2, "0")}</span>
            <span className="gates__name">{name}</span>
            <span className="gates__q">{q}</span>
          </li>
        ))}
      </ol>
      <figcaption>
        Gate names and order as implemented. The questions are paraphrased from the code.
      </figcaption>
    </figure>
  );
}
