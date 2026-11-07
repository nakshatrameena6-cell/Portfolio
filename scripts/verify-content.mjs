// Verifies the content model.
//
//   REPOS_DIR=/path/to/clones node scripts/verify-content.mjs
//
// Always checks internal consistency. With REPOS_DIR set (local clones of the
// source repositories) it also checks that every cited source path exists at HEAD.
// Source paths are kept in the data for traceability but are not shown in the UI.
// Requires Node >= 22.18 (native TypeScript type stripping).
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const { projects } = await import("../src/content/projects.ts");

let failures = 0;
const fail = (msg) => { failures++; console.error("✗", msg); };
const ok = (msg) => console.log("✓", msg);

for (const p of projects)
  if (p.tier === "feature" && !p.caseStudy) fail(`${p.slug}: feature without a case study`);
ok(`${projects.length} projects checked`);

const dir = process.env.REPOS_DIR;
if (!dir) {
  console.log("REPOS_DIR not set, skipped repository checks.");
  process.exit(failures ? 1 : 0);
}

const git = (repo, ...args) =>
  execFileSync("git", ["-C", join(dir, repo), ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

const seen = new Set();
const sources = projects.flatMap((p) => [
  ...p.facts.flatMap((f) => (f.src ? [f.src] : [])),
  ...(p.caseStudy ? [...p.caseStudy.decisions, ...p.caseStudy.challenges].map((d) => d.src) : []),
]);
for (const s of sources) {
  const key = `${s.repo}:${s.path}`;
  if (seen.has(key)) continue;
  seen.add(key);
  if (!existsSync(join(dir, s.repo))) { fail(`repo missing: ${s.repo}`); continue; }
  try { git(s.repo, "cat-file", "-e", `HEAD:${s.path}`); } catch { fail(`path not found: ${key}`); }
}
ok(`${seen.size} cited source paths checked`);
console.log(failures ? `\n${failures} problem(s)` : "\nAll content checks passed.");
process.exit(failures ? 1 : 0);
