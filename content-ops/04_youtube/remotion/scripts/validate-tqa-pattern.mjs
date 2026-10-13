// Checks tqa-pattern-blueprint.json and TQAPatternComposition.jsx before anything is rendered.
// Usage: node scripts/validate-tqa-pattern.mjs   (run from content-ops/04_youtube/remotion)
import { existsSync, readFileSync, statSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const bp = JSON.parse(read("src/data/tqa-pattern-blueprint.json"));
const jsx = read("src/TQAPatternComposition.jsx");
const errors = [];
const fail = (m) => errors.push(m);
const ok = [];

// 1. The timeline: 11,520 frames at 24 per second, five blocks end to end.
const FPS = 24;
if (bp.fps !== FPS) fail(`fps must be 24, found ${bp.fps}`);
if (bp.total_frames !== 11520) fail(`total_frames must be 11520, found ${bp.total_frames}`);
if (bp.width !== 1920 || bp.height !== 1080) fail(`size must be 1920 by 1080`);
const EDGES = { intro: [0, 360], block1: [360, 3240], block2: [3240, 6480], block3: [6480, 8640], outro: [8640, 11520] };
const ids = bp.timeline.map((b) => b.id);
if (JSON.stringify(ids) !== JSON.stringify(Object.keys(EDGES))) fail(`blocks must be ${Object.keys(EDGES).join(", ")}`);
for (const b of bp.timeline) {
  const [s, e] = EDGES[b.id] || [];
  if (b.start_frame !== s || b.end_frame !== e) fail(`${b.id} must run frames ${s} to ${e}, found ${b.start_frame} to ${b.end_frame}`);
}
if (bp.timeline.at(-1).end_frame !== bp.total_frames) fail("the last block must end at total_frames");
ok.push(`timeline: 5 blocks, 0 to ${bp.total_frames} frames at ${FPS} fps (${bp.total_frames / FPS} seconds)`);

// 2. Brand: three colors, Cinzel for headers, Jost for body text.
const BRAND = { black: "#0d0d0d", gold: "#c9a84c", cream: "#f5f0e8" };
for (const [k, v] of Object.entries(bp.colors)) if (BRAND[k] !== v.toLowerCase()) fail(`color ${k} ${v} is not the brand color`);
if (bp.fonts.header !== "Cinzel") fail("headers must use Cinzel");
if (bp.fonts.body !== "Jost") fail("body text must use Jost");
for (const hex of new Set(jsx.match(/#[0-9a-fA-F]{3,8}\b/g) || [])) fail(`layout uses ${hex}, which is not a brand color`);
for (const m of jsx.matchAll(/rgba?\(|hsla?\(/g)) fail(`layout uses ${m[0]}...), which blends colors outside the brand set`);
for (const m of jsx.matchAll(/fontFamily:\s*"([^"]+)"/g)) {
  for (const f of m[1].split(",")) {
    const name = f.trim().replace(/['"]/g, "").toLowerCase();
    if (!["cinzel", "jost", "serif", "sans-serif"].includes(name)) fail(`layout uses the font "${name}"`);
  }
}
if (!/header\(/.test(jsx) || !/body\(/.test(jsx)) fail("layout must style text with header() and body()");
ok.push("brand: #0d0d0d, #C9A84C and #F5F0E8 only, Cinzel headers, Jost body text");

// 3. The 780 pixel mobile safe column.
const MAX = bp.layout.text_max_width_px;
if (MAX > 780) fail(`text_max_width_px is ${MAX}, the limit is 780`);
const left = bp.layout.column_center_x - MAX / 2;
if (left < 0 || left + MAX > bp.width) fail("the text column runs off the screen");
for (const m of jsx.matchAll(/\b(?:width|maxWidth|MAX_W)\s*[:=]\s*(\d+)/g)) {
  if (Number(m[1]) > 780 && !/width:\s*"100%"/.test(m[0])) fail(`a text box is set to ${m[1]} pixels wide`);
}
if (!/width: MAX_W/.test(jsx) || !/maxWidth: MAX_W/.test(jsx)) fail("every text box must use width and maxWidth of MAX_W");
// width estimates (a little generous): Cinzel about 0.66 em a letter plus its letter spacing, Jost about 0.52 em a letter
const est = (t, px, ls, f) => t.length * (px * (f === "Cinzel" ? 0.66 : 0.52) + ls);
const intro = bp.timeline[0];
for (const l of intro.lines) if (est(l.text, l.size_px, l.letter_spacing_px, "Cinzel") > MAX) fail(`intro line "${l.text}" is about ${Math.round(est(l.text, l.size_px, l.letter_spacing_px, "Cinzel"))} pixels, over ${MAX}`);
const lines = (t, px) => Math.ceil((t.length * px * 0.52) / MAX);
ok.push(`layout: every text box held to ${MAX} pixels, centered at x ${bp.layout.column_center_x}`);

// 4. Scripture is KJV, word for word.
const KJV = {
  "PSALM 27:13": "I had fainted, unless I had believed to see the goodness of the LORD in the land of the living.",
  "PSALM 27:14": "Wait on the LORD: be of good courage, and he shall strengthen thine heart: wait, I say, on the LORD.",
  "PSALM 91:1": "He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.",
};
for (const [ref, text] of Object.entries(KJV)) if (bp.kjv[ref] !== text) fail(`${ref} in "kjv" does not match the KJV text`);
const byId = Object.fromEntries(bp.timeline.map((b) => [b.id, b]));
const verses = [[byId.block1.scripture, "PSALM 27:13"], [byId.block2.scripture, "PSALM 27:14"], [byId.block3.scripture, "PSALM 91:1"]];
for (const [s, ref] of verses) {
  if (s.ref !== ref) fail(`${ref}: the block shows "${s.ref}"`);
  if (s.text !== KJV[ref]) fail(`${ref}: the block text does not match the KJV text`);
}
ok.push("scripture: Psalm 27:13, Psalm 27:14 and Psalm 91:1 match the KJV texts held in this checker");

// 5. The words Grace gave, and the brand rules for words.
const WORDS = {
  b1: "God's pattern always begins when your human performance completely fails. Your exhaustion is not a sign of punishment; it is the threshold where His strength takes over.",
  b2: "To wait does not mean to sit in passive defeat. It means to bind your heart tightly to the consistency of God's track record. He is the same yesterday, today, and forever.",
  b3: "Because you stood still and believed through the fainting threshold of Psalm 27, you have naturally arrived at the habitation of quiet safety.",
};
if (byId.block1.reflection.text !== WORDS.b1) fail("block1 reflection text differs from the approved words");
if (byId.block2.reflection.text !== WORDS.b2) fail("block2 reflection text differs from the approved words");
if (byId.block3.transition.text !== WORDS.b3) fail("block3 transition text differs from the approved words");
const intro3 = intro.lines.map((l) => l.text).join(" ").toLowerCase();
if (intro3 !== "sanctuary grace ministry presents the quiet authority") fail(`the intro must read "Sanctuary Grace Ministry presents The Quiet Authority", found "${intro3}"`);
if (intro.lines.some((l) => /ministries/i.test(l.text))) fail('the intro must say "Ministry", singular');
const everyText = JSON.stringify(bp);
if (everyText.includes(String.fromCharCode(0x2014)) || everyText.includes(String.fromCharCode(0x2013))) fail("a long dash is in the blueprint");
if (/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(everyText)) fail("an emoji is in the blueprint");
const spoken = [...verses.map(([s]) => s.text), WORDS.b1, WORDS.b2, WORDS.b3, ...byId.outro.prayer.groups.map((g) => g.text)].join(" ");
if (spoken.includes("!")) fail("an exclamation point is in the words");
for (const w of ["burnout", "self-care", "mindfulness", "healing journey", "boundaries", "thriving", "wellness", "hustle", "hacks", "your truth", "you are enough"]) {
  if (spoken.toLowerCase().includes(w)) fail(`banned wording: ${w}`);
}
ok.push("words: approved text unchanged, no long dashes, emoji, exclamation points or banned wording");

// 6. Timing inside each block.
const CPS_CHECK = (typed, label, dur) => {
  const frames = Math.ceil((typed.text.length * FPS) / typed.chars_per_second);
  if (typed.type_frames !== frames) fail(`${label}: typing takes ${frames} frames, found ${typed.type_frames}`);
  if (typed.type_end !== typed.type_start + typed.type_frames) fail(`${label}: type_end is not type_start plus type_frames`);
  if (typed.chars_per_second < 4 || typed.chars_per_second > 9) fail(`${label}: typing speed ${typed.chars_per_second} letters a second is not calm`);
  if (typed.type_end > dur - 24 - 120) fail(`${label}: typing ends too close to the end of the block`);
};
for (const id of ["block1", "block2"]) {
  const b = byId[id];
  const dur = b.end_frame - b.start_frame;
  const vis = b.scripture.fade_in_start + b.scripture.fade_in_frames;
  if (b.pause_after_scripture_frames !== 96) fail(`${id}: the pause after the scripture must be 96 frames (4 seconds)`);
  if (b.reflection.type_start !== vis + b.pause_after_scripture_frames) fail(`${id}: typing must start exactly 4 seconds after the scripture is fully shown (frame ${vis + 96})`);
  CPS_CHECK(b.reflection, id, dur);
  // vertical room: scripture, then reflection, all inside the screen
  const scBottom = bp.layout.scripture_y + lines(b.scripture.text, 44) * 44 * 1.4;
  if (scBottom + 20 > bp.layout.reflection_y) fail(`${id}: the scripture (about ${Math.round(scBottom)}px) runs into the reflection at ${bp.layout.reflection_y}px`);
  const rBottom = bp.layout.reflection_y + lines(b.reflection.text, 32) * 32 * 1.45;
  if (rBottom > 1020) fail(`${id}: the reflection runs to about ${Math.round(rBottom)}px, past the bottom safe line`);
}
{
  const b = byId.block3;
  const dur = b.end_frame - b.start_frame;
  CPS_CHECK(b.transition, "block3", dur);
  if (b.pause_after_transition_frames !== 120) fail("block3: the pause before Psalm 91:1 must be 120 frames (5 seconds)");
  if (b.scripture.fade_in_start !== b.transition.type_end + 120) fail(`block3: Psalm 91:1 must begin exactly 5 seconds after the typing ends (frame ${b.transition.type_end + 120})`);
  if (b.scripture.fade_in_start + b.scripture.fade_in_frames > dur - 24) fail("block3: Psalm 91:1 is not fully shown before the block ends");
  const tBottom = bp.layout.transition_y + lines(b.transition.text, 34) * 34 * 1.45;
  if (tBottom + 20 > bp.layout.scripture3_ref_y) fail(`block3: the transition text (about ${Math.round(tBottom)}px) runs into Psalm 91:1`);
}
{
  const o = byId.outro;
  const p = o.prayer;
  if (p.duration_frames !== 2712) fail("the prayer section must last 2712 frames (1 minute 53 seconds)");
  if (p.start_frame + p.duration_frames !== o.end_frame) fail("the prayer section must end where the video ends");
  if (p.start_frame - o.start_frame !== p.groups[0].start) fail("the first prayer group must start when the prayer section starts");
  const dur = o.end_frame - o.start_frame;
  let prev = p.groups[0].start;
  for (const g of p.groups) {
    if (g.start !== prev) fail("the prayer groups must run one after another with no gap");
    if (g.end - g.start < 2 * p.crossfade_frames) fail("a prayer group is too short to fade in and out");
    prev = g.end;
  }
  if (prev !== dur) fail("the last prayer group must run to the end of the video");
  if (o.fade_out_frames !== bp.music.fade_out_frames || bp.music.fade_out_frames !== bp.background.fade_to_black_frames) fail("the picture and the music must fade out over the same frames");
  const lower = bp.layout.prayer_lower_third_y;
  if (lower < (bp.height * 2) / 3) fail(`the prayer starts at ${lower}px, above the lower third (${(bp.height * 2) / 3}px)`);
  for (const g of p.groups) if (lower + lines(g.text, 32) * 32 * 1.5 > 1050) fail("a prayer group runs past the bottom safe line");
  const vBottom = bp.layout.scripture3_y + lines(KJV["PSALM 91:1"], 44) * 44 * 1.4;
  if (vBottom + 10 > lower - 70) fail("Psalm 91:1 runs into the prayer heading");
  if (p.groups.map((g) => g.text).join(" ").includes("burnout")) fail("burnout is in the prayer");
  ok.push(`outro: prayer in the lower third for ${p.duration_frames} frames (${p.duration_frames / FPS} seconds), music and picture fade out together over ${o.fade_out_frames} frames`);
}
ok.push("blocks: 4 second pauses in blocks 1 and 2, 5 second pause in block 3, all typing finishes inside its block");

// 7. Files the render needs.
if (!existsSync(new URL("src/assets/tqa/light-stream-plate.jpg", root))) fail("src/assets/tqa/light-stream-plate.jpg is missing");
const music = new URL(bp.music.file, root);
if (/music[0-9]+\.mp3$/.test(bp.music.file)) fail("the temporary stand-in music1.mp3 must not be used. This video uses the Version 8 music");
if (bp.music.file !== "src/assets/tqa/tqa-music-v8-extended.m4a") fail("the music must be src/assets/tqa/tqa-music-v8-extended.m4a, the Version 8 music");
if (!existsSync(music) || statSync(music).size < 100000) fail(`${bp.music.file} is missing`);
else if (readFileSync(music).subarray(4, 8).toString("latin1") !== "ftyp") fail(`${bp.music.file} is not a real audio file`);
if (!/import musicTrack from "\.\/assets\/tqa\/tqa-music-v8-extended\.m4a"/.test(jsx) || /staticFile\(music\.file\)/.test(jsx)) fail("TQAPatternComposition.jsx must play the Version 8 music file and nothing from music1.mp3");
ok.push(`files: light stream picture and ${bp.music.file} present`);

if (errors.length) {
  console.error(`FAIL: ${errors.length} problem(s)`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log("OK: tqa-pattern-blueprint.json and TQAPatternComposition.jsx are valid");
ok.forEach((l) => console.log("    " + l));
