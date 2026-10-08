// Copies the music from the repository root into this engine's public/ folder, where Remotion reads it.
// The originals stay at the root (the website needs them there). public/ is ignored by git.
// Usage: node scripts/stage-audio.mjs music1.mp3 [music2.mp3 ...]
// This file is identical in content-ops/04_youtube/remotion and circle-of-silence/remotion.
import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkMp3, findRepoRoot } from "./validate-core.mjs";

const files = process.argv.slice(2);
if (!files.length) {
  console.error("FAIL: name at least one audio file, for example: node scripts/stage-audio.mjs music1.mp3");
  process.exit(1);
}
const root = findRepoRoot();
if (!root) {
  console.error("FAIL: could not find the repository root (the folder holding CNAME and .nojekyll)");
  process.exit(1);
}
const publicDir = join(dirname(dirname(fileURLToPath(import.meta.url))), "public");
mkdirSync(publicDir, { recursive: true });

let failed = false;
for (const file of files) {
  if (file !== basename(file) || !/^music[0-9]+\.mp3$/.test(file)) {
    console.error(`FAIL: "${file}" is not an allowed name (music1.mp3, music2.mp3 and so on)`);
    failed = true;
    continue;
  }
  const source = join(root, file);
  const problem = checkMp3(source);
  if (problem) {
    console.error(`FAIL: ${source}: ${problem}`);
    failed = true;
    continue;
  }
  copyFileSync(source, join(publicDir, file));
  console.log(`staged ${file} (${statSync(source).size} bytes) from the repository root`);
}
process.exit(failed ? 1 : 0);
