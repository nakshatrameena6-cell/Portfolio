// Usage: node scripts/optimise-images.mjs <input> <output.webp> <width> [quality]
// Used once to turn genuine repository evidence into web-sized assets.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [input, output, width, quality = "80"] = process.argv.slice(2);
if (!input || !output || !width) {
  console.error("usage: optimise-images <input> <output.webp> <width> [quality]");
  process.exit(1);
}
mkdirSync(dirname(output), { recursive: true });
const info = await sharp(input)
  .resize({ width: Number(width), withoutEnlargement: true })
  .webp({ quality: Number(quality), effort: 5 })
  .toFile(output);
console.log(`${output}: ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} KB`);
