// Keeps the two Remotion engines identical and on-brand. Run from the repository root:
//   node scripts/check-remotion-sync.mjs
// 1. The shared files must be byte-for-byte the same in both engines.
// 2. The video components may only use the brand colors and the three brand fonts.
// Exits with an error if either check fails, so a drifting copy is caught before a render.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const A = "content-ops/04_youtube/remotion";
const B = "circle-of-silence/remotion";
const SHARED = [
  "src/ScriptureReveal.jsx",
  "src/revealTiming.mjs",
  "src/index.js",
  "scripts/validate-core.mjs",
  "scripts/stage-audio.mjs",
  "scripts/render-clips.mjs",
  "scripts/test-validator.mjs",
  ".gitignore",
];
const BRAND_COLORS = new Set(["#0d0d0d", "#c9a84c", "#f5f0e8"]);
const BRAND_FONTS = new Set(["cormorant garamond", "jost", "cinzel", "serif", "sans-serif"]);

const errors = [];
const sha = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

for (const file of SHARED) {
  const a = join(A, file);
  const b = join(B, file);
  if (!existsSync(a) || !existsSync(b)) errors.push(`${file}: missing from ${!existsSync(a) ? A : B}`);
  else if (sha(a) !== sha(b)) errors.push(`${file}: the two copies differ. Make one match the other.`);
}

// Every video component in the Psalm 91 engine may only use the brand colors and the three brand fonts.
for (const name of ["src/ScriptureReveal.jsx", "src/Journey.jsx"]) {
  const path = join(A, name);
  if (!existsSync(path)) continue;
  const label = name.replace("src/", "");
  const component = readFileSync(path, "utf8");
  for (const hex of new Set(component.match(/#[0-9a-fA-F]{3,8}\b/g) || [])) {
    if (!BRAND_COLORS.has(hex.toLowerCase())) errors.push(`${label} uses ${hex}, which is not #0d0d0d, #C9A84C or #F5F0E8`);
  }
  for (const m of component.matchAll(/fontFamily:\s*"([^"]+)"/g)) {
    for (const family of m[1].split(",")) {
      const font = family.trim().replace(/['"]/g, "").toLowerCase();
      if (!BRAND_FONTS.has(font)) errors.push(`${label} uses the font "${font}", which is not Cormorant Garamond, Jost or Cinzel`);
    }
  }
  for (const m of component.matchAll(/rgba?\(|hsla?\(/g)) errors.push(`${label} uses ${m[0]}...) which blends colors outside the brand set`);
}

if (errors.length) {
  console.error(`FAIL: ${errors.length} problem(s)`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log(`OK: ${SHARED.length} shared files identical in both engines, and the component uses only the brand colors and fonts`);
