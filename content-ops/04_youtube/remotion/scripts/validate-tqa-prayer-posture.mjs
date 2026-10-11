// Checks tqa-prayer-posture.json and TQAPrayerPostureComposition.jsx before anything is rendered.
// Usage: node scripts/validate-tqa-prayer-posture.mjs   (run from content-ops/04_youtube/remotion)
import { existsSync, readFileSync, statSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const bp = JSON.parse(read("src/data/tqa-prayer-posture.json"));
const jsx = read("src/TQAPrayerPostureComposition.jsx");
const errors = [];
const fail = (m) => errors.push(m);
const ok = [];

// 1. The timeline: 11,520 frames at 24 per second, five blocks end to end.
const FPS = 24;
if (bp.fps !== FPS) fail(`fps must be 24, found ${bp.fps}`);
if (bp.total_frames !== 11520) fail(`total_frames must be 11520, found ${bp.total_frames}`);
if (bp.width !== 1920 || bp.height !== 1080) fail("size must be 1920 by 1080");
const EDGES = { intro: [0, 360], block1: [360, 3240], block2: [3240, 6480], block3: [6480, 8640], outro: [8640, 11520] };
if (JSON.stringify(bp.timeline.map((b) => b.id)) !== JSON.stringify(Object.keys(EDGES))) fail(`blocks must be ${Object.keys(EDGES).join(", ")}`);
for (const b of bp.timeline) {
  const [s, e] = EDGES[b.id] || [];
  if (b.start_frame !== s || b.end_frame !== e) fail(`${b.id} must run frames ${s} to ${e}, found ${b.start_frame} to ${b.end_frame}`);
  if (!bp.plates[b.plate]) fail(`${b.id} uses a picture called "${b.plate}" that is not listed under plates`);
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

// 3. The 780 pixel mobile safe column, kept off the figure, the jar and the candle.
const MAX = bp.layout.text_max_width_px;
if (MAX > 780) fail(`text_max_width_px is ${MAX}, the limit is 780`);
for (const m of jsx.matchAll(/\b(?:width|maxWidth|MAX_W)\s*[:=]\s*(\d+)/g)) if (Number(m[1]) > 780) fail(`a text box is set to ${m[1]} pixels wide`);
if (!/maxWidth: MAX_W/.test(jsx) || !/Math\.min\(width, MAX_W\)/.test(jsx)) fail("every text box must be capped with MAX_W");
for (const [name, p] of Object.entries(bp.plates)) {
  if (p.column_width_px > MAX) fail(`${name}: the column is ${p.column_width_px}px, over ${MAX}`);
  const l = p.column_center_x - p.column_width_px / 2;
  const r = p.column_center_x + p.column_width_px / 2;
  if (l < 60 || r > bp.width - 60) fail(`${name}: the column runs from ${l} to ${r}, outside the 60px screen margin`);
  if (r > p.keep_clear_from_x) fail(`${name}: the column reaches ${r}px, onto the picture that starts at ${p.keep_clear_from_x}px`);
}
// width estimates (a little generous): Cinzel about 0.66 em a letter plus its letter spacing, Jost about 0.52 em a letter
const intro = bp.timeline[0];
for (const l of intro.lines) {
  const w = l.text.length * (l.size_px * 0.66 + l.letter_spacing_px);
  if (w > MAX) fail(`intro line "${l.text}" is about ${Math.round(w)} pixels, over ${MAX}`);
}
const lines = (t, px, width) => Math.ceil((t.length * px * 0.52) / width);
ok.push(`layout: every text box held to ${MAX} pixels or less, kept off the figure, jar and candle, 60px screen margins`);

// 4. Scripture is KJV, word for word.
const KJV = {
  "MATTHEW 6:7-8": "But when ye pray, use not vain repetitions, as the heathen do: for they think that they shall be heard for their much speaking. Be not ye therefore like unto them: for your Father knoweth what things ye have need of, before ye ask him.",
  "MATTHEW 6:6": "But thou, when thou prayest, enter into thy closet, and when thou hast shut thy door, pray to thy Father which is in secret; and thy Father which seeth in secret shall reward thee openly.",
  "MATTHEW 6:9": "After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.",
};
for (const [ref, text] of Object.entries(KJV)) if (bp.kjv[ref] !== text) fail(`${ref} in "kjv" does not match the KJV text`);
const byId = Object.fromEntries(bp.timeline.map((b) => [b.id, b]));
const verses = [[byId.block1, "MATTHEW 6:7-8"], [byId.block2, "MATTHEW 6:6"], [byId.block3, "MATTHEW 6:9"]];
for (const [b, ref] of verses) {
  if (b.scripture.ref !== ref) fail(`${b.id}: the block shows "${b.scripture.ref}", not ${ref}`);
  if (b.scripture.text !== KJV[ref]) fail(`${b.id}: the scripture text does not match the KJV text`);
}
ok.push("scripture: Matthew 6:7-8, Matthew 6:6 and Matthew 6:9 match the KJV texts held in this checker");

// 5. The words Grace gave, and the brand rules for words.
const WORDS = {
  block1: "You do not have to beg, scream, or repeat exhaustive religious formulas to move God's heart. He already intimately knows your needs and your heavy burdens before you speak. You can completely drop the pressure to perform.",
  block2: "True prayer begins by physically and mentally shutting out the chaotic noise and expectations of the world. When you close the door on the pressure to please others, you find an immediate, loving, private audience with your Father.",
  block3: "Communication settles into perfect alignment when you simply honor His unyielding identity. When you acknowledge Him as a holy, sovereign Father, your perspective shifts instantly from panic to protection.",
};
const PRAYER = "Father, I thank You that You are my Anchor of Faithfulness. Forgive me for the times I have slipped into performative noise, thinking I had to scream or use the perfect words to be heard. I choose right now to shut the door on the frantic demands of this world and rest in the secret place of Your presence. Thank You that You intimately know my needs before I even speak. Settle my mind, clear away the weight of heavy burdens, and teach me to walk out into the marketplace with Your unshakeable peace. I lean entirely on Your blueprint, not my own strength. In Jesus' name, Amen.";
for (const id of Object.keys(WORDS)) if (byId[id].reflection.text !== WORDS[id]) fail(`${id} reflection text differs from the approved words`);
const prayerText = byId.outro.prayer.groups.map((g) => g.text).join(" ");
if (prayerText !== PRAYER) fail("the prayer groups, read in order, do not match the approved prayer word for word");
const introText = intro.lines.map((l) => l.text).join(" ").toLowerCase();
if (introText !== "sanctuary grace ministry presents the quiet authority") fail(`the intro must read "Sanctuary Grace Ministry presents The Quiet Authority", found "${introText}"`);
if (intro.lines.some((l) => /ministries/i.test(l.text))) fail('the intro must say "Ministry", singular');
const everyText = JSON.stringify(bp);
if (everyText.includes("—") || everyText.includes("–")) fail("a long dash is in the blueprint");
if (/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(everyText)) fail("an emoji is in the blueprint");
const spoken = [...verses.map(([b]) => b.scripture.text), ...Object.values(WORDS), prayerText].join(" ");
if (spoken.includes("!")) fail("an exclamation point is in the words");
for (const w of ["burnout", "self-care", "mindfulness", "healing journey", "boundaries", "thriving", "wellness", "hustle", "hacks", "your truth", "you are enough"]) {
  if (spoken.toLowerCase().includes(w)) fail(`banned wording: ${w}`);
}
ok.push("words: approved text unchanged, no long dashes, emoji, exclamation points or banned wording");

// 6. Timing inside each block.
for (const [b] of verses) {
  const dur = b.end_frame - b.start_frame;
  const w = bp.plates[b.plate].column_width_px;
  const s = b.scripture;
  const vis = s.fade_in_start + s.fade_in_frames;
  const r = b.reflection;
  if (b.pause_after_scripture_frames !== 96) fail(`${b.id}: the pause after the scripture must be 96 frames (4 seconds)`);
  if (r.type_start !== vis + 96) fail(`${b.id}: typing must start exactly 4 seconds after the scripture is fully shown (frame ${vis + 96})`);
  const need = Math.ceil((r.text.length * FPS) / r.chars_per_second);
  if (r.type_frames !== need) fail(`${b.id}: typing takes ${need} frames, found ${r.type_frames}`);
  if (r.type_end !== r.type_start + r.type_frames) fail(`${b.id}: type_end is not type_start plus type_frames`);
  if (r.chars_per_second < 4 || r.chars_per_second > 9) fail(`${b.id}: typing speed ${r.chars_per_second} letters a second is not calm`);
  if (r.type_end > dur - 24 - 120) fail(`${b.id}: typing ends too close to the end of the block`);
  const scBottom = b.scripture_y + lines(s.text, 40, w) * 40 * 1.38;
  if (scBottom + 20 > b.reflection_y) fail(`${b.id}: the scripture (about ${Math.round(scBottom)}px) runs into the reflection at ${b.reflection_y}px`);
  const rBottom = b.reflection_y + lines(r.text, 32, w) * 32 * 1.45;
  if (rBottom > 1020) fail(`${b.id}: the reflection runs to about ${Math.round(rBottom)}px, past the bottom safe line`);
  if (rBottom > bp.layout.prayer_lower_third_y - 10 && b.id === "block3") fail("block3: the reflection reaches the prayer area");
  if (s.fade_in_start + s.fade_in_frames > dur) fail(`${b.id}: the scripture is not fully shown before the block ends`);
}
if (!byId.block3.keep_scripture_through_end) fail("block3 must keep Matthew 6:9 on screen into the outro");
{
  const o = byId.outro;
  const p = o.prayer;
  const dur = o.end_frame - o.start_frame;
  const w = bp.plates[o.plate].column_width_px;
  if (o.plate !== byId.block3.plate) fail("the outro must use the same picture as block 3, so Matthew 6:9 does not jump");
  if (p.duration_frames !== 2712) fail("the prayer section must last 2712 frames (1 minute 53 seconds)");
  if (p.start_frame + p.duration_frames !== o.end_frame) fail("the prayer section must end where the video ends");
  if (p.start_frame - o.start_frame !== p.groups[0].start) fail("the first prayer group must start when the prayer section starts");
  let prev = p.groups[0].start;
  for (const g of p.groups) {
    if (g.start !== prev) fail("the prayer groups must run one after another with no gap");
    if (g.end - g.start < 2 * p.crossfade_frames) fail("a prayer group is too short to fade in and out");
    prev = g.end;
    const bottom = bp.layout.prayer_lower_third_y + lines(g.text, 32, w) * 32 * 1.5;
    if (bottom > 1050) fail(`a prayer group runs to about ${Math.round(bottom)}px, past the bottom safe line`);
  }
  if (prev !== dur) fail("the last prayer group must run to the end of the video");
  if (o.fade_out_frames !== bp.music.fade_out_frames || bp.music.fade_out_frames !== bp.background.fade_to_black_frames) fail("the picture and the music must fade out over the same frames");
  if (bp.layout.prayer_lower_third_y < (bp.height * 2) / 3) fail(`the prayer starts at ${bp.layout.prayer_lower_third_y}px, above the lower third (${(bp.height * 2) / 3}px)`);
  const vBottom = byId.block3.scripture_y + lines(KJV["MATTHEW 6:9"], 40, w) * 40 * 1.38;
  if (vBottom + 10 > bp.layout.prayer_lower_third_y) fail("Matthew 6:9 runs into the prayer");
  ok.push(`outro: prayer in the lower third for ${p.duration_frames} frames (${p.duration_frames / FPS} seconds) in ${p.groups.length} groups, music and picture fade out together over ${o.fade_out_frames} frames`);
}
ok.push("blocks: 4 second pause after each scripture, all typing finishes inside its block");

// 7. Files the render needs.
for (const [name, p] of Object.entries(bp.plates)) {
  if (!existsSync(new URL(p.image, root)) || statSync(new URL(p.image, root)).size < 20000) fail(`${name}: ${p.image} is missing`);
  const base = p.image.split("/").pop();
  if (!jsx.includes(base)) fail(`the layout does not import ${base}`);
}
const music = new URL(`../../../${bp.music.file}`, root);
if (!existsSync(music) || statSync(music).size < 100000) fail(`${bp.music.file} is missing from the repository root`);
else {
  const head = readFileSync(music).subarray(0, 4);
  if (!(head.toString("latin1").startsWith("ID3") || (head[0] === 0xff && (head[1] & 0xe0) === 0xe0))) fail(`${bp.music.file} is not real MP3 audio`);
}
ok.push(`files: both pictures and ${bp.music.file} present`);

if (errors.length) {
  console.error(`FAIL: ${errors.length} problem(s)`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log("OK: tqa-prayer-posture.json and TQAPrayerPostureComposition.jsx are valid");
ok.forEach((l) => console.log("    " + l));
