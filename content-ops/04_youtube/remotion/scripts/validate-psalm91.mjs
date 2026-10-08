// Checks psalm91.json before anything is rendered. Exits with an error if anything is off.
// Usage: node scripts/validate-psalm91.mjs [path-to-json]
import { readFileSync, statSync } from "node:fs";
import { FPS, totalFrames, verseFrames } from "../src/psalm91Timing.mjs";

const path = process.argv[2] || "src/data/psalm91.json";
const errors = [];
const fail = (message) => errors.push(message);

if (statSync(path).size > 100_000) fail("file is larger than 100 KB");

let verses;
try {
  verses = JSON.parse(readFileSync(path, "utf8"));
} catch (e) {
  console.error(`FAIL: ${path} is not valid JSON (${e.message})`);
  process.exit(1);
}

const KEYS = ["verse_marker", "line_1", "line_2", "text_color", "badge_color", "reveal_speed_ms"];
const COLORS = new Set(["#F5F0E8", "#C9A84C", "#C1593C"]); // cream, gold, terra on the black background
const EM_DASH = String.fromCharCode(0x2014); // written by code so this file holds no em dash itself
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;

if (!Array.isArray(verses)) fail("top level must be an array");
else {
  if (verses.length !== 16) fail(`expected 16 verses, found ${verses.length}`);
  verses.forEach((v, i) => {
    const where = `verse ${i + 1}`;
    if (typeof v !== "object" || v === null) return fail(`${where}: not an object`);
    const extra = Object.keys(v).filter((k) => !KEYS.includes(k));
    const missing = KEYS.filter((k) => !(k in v));
    if (extra.length) fail(`${where}: unexpected keys ${extra.join(", ")}`);
    if (missing.length) return fail(`${where}: missing keys ${missing.join(", ")}`);
    if (v.verse_marker !== `PSALM 91:${i + 1}`) fail(`${where}: marker is "${v.verse_marker}", expected "PSALM 91:${i + 1}"`);
    for (const k of ["verse_marker", "line_1", "line_2"]) {
      if (typeof v[k] !== "string" || !v[k].trim()) fail(`${where}: ${k} must be non-empty text`);
      else {
        if (v[k].includes(EM_DASH)) fail(`${where}: ${k} contains an em dash`);
        if (EMOJI.test(v[k])) fail(`${where}: ${k} contains an emoji`);
        if (/[<>{}`]/.test(v[k])) fail(`${where}: ${k} contains markup characters`);
        if (v[k].length > 120) fail(`${where}: ${k} is longer than 120 characters`);
      }
    }
    for (const k of ["text_color", "badge_color"]) {
      if (!COLORS.has(v[k])) fail(`${where}: ${k} "${v[k]}" is not one of ${[...COLORS].join(", ")}`);
    }
    if (!Number.isInteger(v.reveal_speed_ms) || v.reveal_speed_ms < 20 || v.reveal_speed_ms > 300) {
      fail(`${where}: reveal_speed_ms must be a whole number from 20 to 300`);
    }
  });
}

if (errors.length) {
  console.error(`FAIL: ${errors.length} problem(s) in ${path}`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

const secs = (n) => (n / FPS).toFixed(1);
console.log(`OK: ${verses.length} verses, ${secs(totalFrames(verses))} seconds in total at ${FPS} fps`);
console.log(`    shortest clip ${secs(Math.min(...verses.map((v) => verseFrames(v))))}s, longest ${secs(Math.max(...verses.map((v) => verseFrames(v))))}s`);
