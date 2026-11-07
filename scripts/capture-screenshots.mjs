// Captures a real screenshot of a running project and writes it as an optimised WebP
// to public/projects/<slug>.webp, then prints the `shot` entry to paste into
// src/content/projects.ts. Cards, previews and case studies then show the capture
// instead of the drawn diagram.
//
//   1. Start the project locally (its own dev server).
//   2. npm i -D playwright && npx playwright install chromium     (once)
//   3. node scripts/capture-screenshots.mjs <slug> <url> [--width 1600 --height 900 --wait 1500]
//
// Example: node scripts/capture-screenshots.mjs suraksha http://localhost:5173
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const [slug, url, ...rest] = process.argv.slice(2);
if (!slug || !url) {
  console.error("usage: node scripts/capture-screenshots.mjs <slug> <url> [--width 1600] [--height 900] [--wait 1500]");
  process.exit(1);
}
const opt = (name, fallback) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? Number(rest[i + 1]) : fallback;
};
const width = opt("width", 1600);
const height = opt("height", 900);
const wait = opt("wait", 1500);

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("playwright is not installed. Run: npm i -D playwright && npx playwright install chromium");
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(wait);
const png = await page.screenshot({ type: "png" });
await browser.close();

mkdirSync("public/projects", { recursive: true });
const out = `public/projects/${slug}.webp`;
const info = await sharp(png).webp({ quality: 82 }).toFile(out);
console.log(`wrote ${out} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)\n`);
console.log("Add to the project in src/content/projects.ts:\n");
console.log(
  `  shot: { src: "/projects/${slug}.webp", alt: "DESCRIBE WHAT THE SCREENSHOT SHOWS", w: ${info.width}, h: ${info.height} },`,
);
