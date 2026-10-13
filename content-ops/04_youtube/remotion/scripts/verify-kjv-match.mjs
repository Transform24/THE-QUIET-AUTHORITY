// Word for word KJV audit for one TQA video. Compares every scripture in the video's data file with
//   1. the wording held in src/data/kjv-registry.json, and
//   2. the King James Version text fetched live from bible-api.com (whitespace tidied, nothing else changed).
// It also checks that the name of the LORD is printed in capitals wherever the KJV prints it so, and that no lowercase "lord" drifts in.
// Usage (run from content-ops/04_youtube/remotion):  node scripts/verify-kjv-match.mjs TQA_Stillness_Journey_FINAL_v14
import { readFileSync } from "node:fs";

const NAME = process.argv[2] || "TQA_Stillness_Journey_FINAL_v14";
const root = new URL("../", import.meta.url);
const bp = JSON.parse(readFileSync(new URL(`src/data/${NAME}.json`, root), "utf8"));
const reg = JSON.parse(readFileSync(new URL("src/data/kjv-registry.json", root), "utf8")).verses;
const tidy = (s) => s.replace(/\s+/g, " ").trim();
const errors = [];
const lines = [];
const fail = (m) => errors.push(m);

const scriptures = [...bp.teaching_blocks.map((b) => b.scripture), bp.closing.scripture];
const apiName = (ref) => ref.toLowerCase().replace(/^(\w+) /, (m, b) => (b === "psalm" ? "psalms " : m)).replace(/ /g, "+");

for (const s of scriptures) {
  let live = null;
  try {
    const r = await fetch(`https://bible-api.com/${apiName(s.ref)}?translation=kjv`);
    const d = await r.json();
    if (d.translation_id !== "kjv") throw new Error("not the KJV translation");
    live = tidy(d.text);
  } catch (e) { fail(`${s.ref}: could not fetch the live KJV (${e.message})`); }
  const inVideo = tidy(s.text);
  const inReg = reg[s.ref] ? tidy(reg[s.ref].text) : null;
  const matchReg = inReg === inVideo;
  const matchLive = live === inVideo;
  if (!matchReg) fail(`${s.ref}: the video wording differs from the registry`);
  if (live !== null && !matchLive) fail(`${s.ref}: the video wording differs from the live KJV.\n    video: ${inVideo}\n    KJV:   ${live}`);
  const lordVideo = inVideo.match(/\bLORD\b/g)?.length || 0;
  const lordLive = live ? (live.match(/\bLORD\b/g)?.length || 0) : lordVideo;
  const lowerDrift = inVideo.match(/\b(lord|Lord|lORD|LOrd)\b/g) || [];
  if (lordVideo !== lordLive) fail(`${s.ref}: LORD appears ${lordVideo} time(s) in the video and ${lordLive} in the KJV`);
  lines.push({ ref: s.ref, text: inVideo, registry: matchReg, live: live === null ? "not fetched" : matchLive, LORD_capitals: lordVideo, other_lord_forms: lowerDrift });
}

// The three phrases Grace named, checked against the video text itself.
// Phrases Grace named for Week 7 (v14). Other videos are checked word for word against the live KJV and the registry only.
const PHRASES = NAME.endsWith("v14") ? [
  ["PSALM 46:1", "a very present help"],
  ["PSALM 46:7", "The LORD of hosts is with us"],
  ["PSALM 84:11", "them that walk uprightly"],
] : [];
const phraseResults = PHRASES.map(([ref, phrase]) => {
  const s = scriptures.find((x) => x.ref === ref);
  const ok = !!s && s.text.includes(phrase);
  if (!ok) fail(`${ref}: the exact KJV phrase "${phrase}" is not in the video text`);
  return { ref, phrase, found: ok };
});

// Every other text field: the name of the LORD must never be lowercase "lord", and "LORD" must never be mixed case.
const fields = [];
bp.teaching_blocks.forEach((b, i) => fields.push([`reflection ${i + 1}`, b.reflection]));
fields.push(["prayer", bp.closing.prayer], ...bp.closing.prayer_beats.map((t, i) => [`prayer line ${i + 1}`, t]));
const drift = [];
for (const [where, t] of fields) {
  for (const m of t.matchAll(/\b(lord|lORD|LOrd|Lord)\b/g)) drift.push(`${where}: "${m[0]}"`);
}
const lordInOwnWords = fields.filter(([, t]) => /\bLORD\b/.test(t)).map(([w]) => w);
if (drift.length) fail(`LORD is not in capitals in the video's own words: ${drift.join(", ")}`);

console.log(JSON.stringify({ video: NAME, scriptures: lines, phrases: phraseResults, lord_in_reflections_and_prayer_capitals_ok: drift.length === 0, fields_using_LORD: lordInOwnWords }, null, 2));
if (errors.length) { console.error(`FAIL: ${errors.length} problem(s)`); errors.forEach((e) => console.error("  - " + e)); process.exit(1); }
console.log(`OK: ${NAME}: ${scriptures.length} scriptures match the registry and the live KJV word for word, the three named phrases are present, and LORD is in capitals everywhere.`);
