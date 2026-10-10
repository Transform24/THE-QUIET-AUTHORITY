// Checks the intro and closing prayer in src/data/journey.json, and reports the length of the long journey.
// Usage: node scripts/validate-journey.mjs
import { readFileSync } from "node:fs";
import { INTRO_FRAMES, VERSE_REST_FRAMES, PRAYER_REST_FRAMES } from "../src/journeyTiming.mjs";
import { schedule, wordsOf } from "../src/revealTiming.mjs";
import { schedulePrayerText } from "../src/journeyTiming.mjs";

const journey = JSON.parse(readFileSync(new URL("../src/data/journey.json", import.meta.url), "utf8"));
const verses = JSON.parse(readFileSync(new URL("../src/data/psalm91.json", import.meta.url), "utf8"));
const errors = [];
const BRAND = new Set(["#0d0d0d", "#c9a84c", "#f5f0e8"]);
const BANNED = ["burnout", "self-care", "manifest", "your truth", "you are enough", "best life"];

const all = JSON.stringify(journey);
if (all.includes("—")) errors.push("an em dash is in journey.json");
if (/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(all)) errors.push("an emoji is in journey.json");
if (/<[a-z][\s\S]*>/i.test(all)) errors.push("markup is in journey.json");
for (const w of BANNED) if (all.toLowerCase().includes(w)) errors.push(`banned wording: ${w}`);
if (journey.intro.ministry !== "SANCTUARY GRACE MINISTRY") errors.push('the intro must read exactly "SANCTUARY GRACE MINISTRY" (singular)');
for (const c of [journey.prayer.text_color, journey.prayer.badge_color]) if (!BRAND.has(c.toLowerCase())) errors.push(`${c} is not a brand color`);

const p = schedulePrayerText(journey.prayer);
const wpm = Math.round((p.words.length / p.readingMs) * 60000);
if (wpm < 90 || wpm > 135) errors.push(`prayer reading pace is ${wpm} words a minute`);

const verseTotal = verses.reduce((s, v) => s + schedule(v).revealEndFrame + VERSE_REST_FRAMES, 0);
const prayer = p.revealEndFrame + PRAYER_REST_FRAMES;
const total = INTRO_FRAMES + verseTotal + prayer;

if (errors.length) {
  console.error(`FAIL: ${errors.length} problem(s)`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log("OK: journey.json is clean");
console.log(`    intro ${INTRO_FRAMES} frames, 16 verses ${verseTotal} frames (4 second rests), prayer ${prayer} frames (${p.words.length} words, ${wpm} wpm)`);
console.log(`    total ${total} frames = ${(total / 30).toFixed(1)} seconds`);
