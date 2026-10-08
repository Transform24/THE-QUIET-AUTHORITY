// Renders one clip per verse. Arguments are fixed in package.json, never taken from user input.
// Usage: node scripts/render-clips.mjs <CompositionId> <data.json> <outDir> <filePrefix>
// Optional: BROWSER_EXECUTABLE=/path/to/chrome for machines that cannot download the browser.
// This file is identical in content-ops/04_youtube/remotion and circle-of-silence/remotion.
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";

const [id, dataPath, outDir, prefix] = process.argv.slice(2);
if (![id, dataPath, outDir, prefix].every((a) => typeof a === "string" && /^[A-Za-z0-9_./-]+$/.test(a))) {
  console.error("FAIL: usage: node scripts/render-clips.mjs <CompositionId> <data.json> <outDir> <filePrefix>");
  process.exit(1);
}
const count = JSON.parse(readFileSync(dataPath, "utf8")).length;
mkdirSync(outDir, { recursive: true });

const extra = process.env.BROWSER_EXECUTABLE
  ? [`--browser-executable=${process.env.BROWSER_EXECUTABLE}`, "--chrome-mode=headless-shell"]
  : [];
for (let i = 0; i < count; i++) {
  const n = String(i + 1).padStart(2, "0");
  const out = `${outDir}/${prefix}-${n}.mp4`;
  console.log(`Rendering clip ${n} of ${count}`);
  const result = spawnSync(
    "npx",
    ["remotion", "render", "src/index.js", id, out, `--props=${JSON.stringify({ verseIndex: i })}`, ...extra],
    { stdio: "inherit" }
  );
  if (result.status !== 0) {
    console.error(`FAIL: clip ${n} did not render`);
    process.exit(result.status || 1);
  }
}
console.log(`Done: ${count} clips in ${outDir}`);
