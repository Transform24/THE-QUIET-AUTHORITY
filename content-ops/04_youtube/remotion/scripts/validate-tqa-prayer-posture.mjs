// Checks the TQA video standard (version 2) before anything is rendered.
// Reads src/data/TQA_Stillness_Journey_FINAL_v10.json, src/tqaStandard.mjs, src/data/kjv-registry.json and the layout file.
// Usage: node scripts/validate-tqa-prayer-posture.mjs   (run from content-ops/04_youtube/remotion)
import { existsSync, readFileSync, statSync } from "node:fs";
import { RULES, FPS, PUSH, buildTimeline } from "../src/tqaStandard.mjs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const NAME = process.argv[2] || "TQA_Stillness_Journey_FINAL_v10";
const bp = JSON.parse(read(`src/data/${NAME}.json`));
const reg = JSON.parse(read("src/data/kjv-registry.json")).verses;
const jsx = read(`src/${NAME}.jsx`);
const errors = [];
const MASTER = "TQA_Stillness_Journey_FINAL_v10";
const EXCEPTION = bp.layout_exception || null;
const ALLOWED_EXCEPTIONS = { TQA_Stillness_Journey_FINAL_v8: "line_push", TQA_Stillness_Journey_FINAL_v9: "line_push", TQA_Stillness_Journey_FINAL_v11: "line_push", TQA_Stillness_Journey_FINAL_v12: "line_push", TQA_Stillness_Journey_FINAL_v13: "line_push" };
const cut = (text, name) => {
  const x = text.split(name).join("X");
  const i = x.indexOf("// PRAYER-BEGIN");
  const j = x.indexOf("// PRAYER-END");
  return i < 0 || j < 0 ? null : { outside: x.slice(0, i) + x.slice(j), inside: x.slice(i, j) };
};
if (EXCEPTION && ALLOWED_EXCEPTIONS[NAME] !== EXCEPTION) errors.push(`${NAME} is not allowed the layout exception "${EXCEPTION}". Only the prayer page of ${Object.keys(ALLOWED_EXCEPTIONS).join(", ")} may differ.`);
if (!EXCEPTION && ALLOWED_EXCEPTIONS[NAME]) errors.push(`${NAME} must declare its layout exception "${ALLOWED_EXCEPTIONS[NAME]}"`);
if (NAME !== MASTER) {
  const mine = cut(read(`src/${NAME}.jsx`), NAME);
  const master = cut(read(`src/${MASTER}.jsx`), MASTER);
  if (!mine || !master) errors.push("the layout files must mark the prayer page with PRAYER-BEGIN and PRAYER-END");
  else if (mine.outside !== master.outside) errors.push(`${NAME}.jsx must match the standard layout in ${MASTER}.jsx everywhere outside the prayer page`);
  else if (!EXCEPTION && mine.inside !== master.inside) errors.push(`${NAME}.jsx may only change the prayer page when it declares a layout exception`);
}
const fail = (m) => errors.push(m);
const ok = [];
const warn = [];

if (bp.standard_version !== 2) fail("standard_version must be 2");
if (bp.fps !== FPS) fail("fps must be 24");
if (bp.width !== 1920 || bp.height !== 1080) fail("size must be 1920 by 1080");

// 1. Brand
const BRAND = { black: "#0d0d0d", gold: "#c9a84c", cream: "#f5f0e8" };
for (const [k, v] of Object.entries(bp.colors)) if (BRAND[k] !== v.toLowerCase()) fail(`color ${k} ${v} is not the brand color`);
if (bp.fonts.header !== "Cinzel") fail("headers must use Cinzel");
if (bp.fonts.body !== "Jost") fail("body text must use Jost");
for (const hex of new Set(jsx.match(/#[0-9a-fA-F]{3,8}\b/g) || [])) fail(`layout uses ${hex}, which is not a brand color`);
for (const m of jsx.matchAll(/rgba?\(|hsla?\(/g)) fail(`layout uses ${m[0]}...), which is outside the brand set`);
for (const m of jsx.matchAll(/fontFamily:\s*"([^"]+)"/g)) {
  for (const f of m[1].split(",")) {
    const name = f.trim().replace(/['"]/g, "").toLowerCase();
    if (!["cinzel", "jost", "serif", "sans-serif"].includes(name)) fail(`layout uses the font "${name}"`);
  }
}
ok.push("brand: #0d0d0d, #C9A84C and #F5F0E8 only, Cinzel headers, Jost body text");

if (EXCEPTION === "line_push") {
  const inside = cut(jsx, NAME).inside;
  if (!/body\(36/.test(inside)) fail("the pushed prayer lines must use body(), which is Jost");
  if (!/spring\(/.test(inside)) fail("the pushed prayer lines must use a spring");
  if (!/box\(/.test(inside)) fail("the pushed prayer lines must sit in a box(), which is capped at 780 pixels");
  if (/fontFamily|position:\s*"absolute"/.test(inside)) fail("the prayer page must not set its own font or positioning outside box(), header() and body()");
}

// 2. Safe column
const MAX = bp.layout.text_max_width_px;
if (MAX > 780) fail(`text_max_width_px is ${MAX}, the limit is 780`);
for (const m of jsx.matchAll(/\b(?:width|maxWidth|MAX_W)\s*[:=]\s*(\d+)/g)) if (Number(m[1]) > 780) fail(`a text box is set to ${m[1]} pixels wide`);
if (!/maxWidth: MAX_W/.test(jsx) || !/Math\.min\(width, MAX_W\)/.test(jsx)) fail("every text box must be capped with MAX_W");
for (const [name, p] of Object.entries(bp.plates)) {
  if (p.column_width_px > MAX) fail(`${name}: the column is ${p.column_width_px}px, over ${MAX}`);
  const l = p.column_center_x - p.column_width_px / 2;
  const r = p.column_center_x + p.column_width_px / 2;
  if (l < 60 || r > bp.width - 60) fail(`${name}: the column runs outside the 60px screen margin`);
  if (r > p.keep_clear_from_x) fail(`${name}: the column reaches ${r}px, onto the picture that starts at ${p.keep_clear_from_x}px`);
}
const linesOf = (t, px, width) => Math.ceil((t.length * px * 0.52) / width);
for (const l of bp.intro.lines) {
  const w = l.text.length * (l.size_px * 0.66 + l.letter_spacing_px);
  if (w > MAX) fail(`intro line "${l.text}" is about ${Math.round(w)} pixels, over ${MAX}`);
}
ok.push(`layout: every text box held to ${MAX} pixels or less, kept off the figure, jar and candle`);

// 3. Timeline from the shared rules
const tl = buildTimeline(bp);
const ids = tl.items.map((i) => i.id).join(",");
const wantIds = ["intro", ...bp.teaching_blocks.map((_, i) => `block${i + 1}`), "closing", "prayer", "thanks"].join(",");
if (ids !== wantIds) fail(`order must be ${wantIds}`);
let prev = 0;
for (const it of tl.items) {
  if (it.start_frame !== prev) fail(`${it.id} does not start where the one before ends`);
  prev = it.end_frame;
}
if (prev !== tl.total_frames) fail("the last item must end at total_frames");
for (const it of tl.items) if (!it.plate || !bp.plates[it.plate]) fail(`${it.id} uses a picture that is not listed under plates`);
if (bp.teaching_blocks.length < 1) fail("at least one teaching block is needed");
if (tl.total_frames > bp.music.duration_frames) fail(`the video (${tl.total_frames} frames) is longer than the music (${bp.music.duration_frames} frames)`);
const secs = tl.total_frames / FPS;
ok.push(`timeline: ${tl.items.length} parts, ${tl.total_frames} frames, ${Math.floor(secs / 60)}:${String(Math.round(secs % 60)).padStart(2, "0")} at ${FPS} fps`);

// 4. Pace rules
if (RULES.scripture_words_per_minute > 90) fail("scripture must reveal at 90 words a minute or slower");
if (RULES.block_fade_in_frames > 24 || RULES.block_fade_out_frames > 24) fail("scene dissolves must stay at 1 second or less");
if (RULES.hold_after_reflection_frames > 192) fail("the hold after a reflection must stay at 8 seconds or less");
if (RULES.pause_after_scripture_frames !== 96) fail("the pause after each scripture must be 4 seconds");
if (RULES.prayer_frames !== 2712) fail("the prayer must last 1 minute 53 seconds");
if (RULES.total_frames !== 11520) fail("every TQA video is exactly 8 minutes, 11520 frames");
if (RULES.music_fade_out_frames !== RULES.picture_fade_out_frames) fail("the picture and the music must fade out over the same frames");
for (const it of tl.items.filter((i) => i.type === "teaching")) {
  const w = bp.plates[it.plate].column_width_px;
  const b = it.block;
  if (it.type_end + RULES.hold_after_reflection_frames !== it.frames) fail(`${it.id}: the block must hold ${RULES.hold_after_reflection_frames} frames after typing`);
  const bottom = bp.layout.top_y + 40 + 26 + linesOf(b.scripture.text, 40, w) * 40 * 1.38 + 44 + linesOf(b.reflection, 32, w) * 32 * 1.45;
  if (bottom > 1020) fail(`${it.id}: the text runs to about ${Math.round(bottom)}px, past the bottom safe line`);
}
{
  const c = tl.items.find((i) => i.id === "closing");
  const pr = tl.items.find((i) => i.id === "prayer");
  const th = tl.items.find((i) => i.id === "thanks");
  const w = bp.plates[c.plate].column_width_px;
  if (tl.total_frames !== RULES.total_frames) fail(`the video must be exactly ${RULES.total_frames} frames (8:00), found ${tl.total_frames}`);
  if (th.frames < RULES.min_thanks_frames) fail(`the words fill too much of the 8 minutes: the thank you page would be only ${th.frames} frames`);
  if (EXCEPTION ? pr.frames < RULES.prayer_frames : pr.frames !== RULES.prayer_frames) fail("the prayer page must last 1 minute 53 seconds, or longer when it is pushed line by line");
  const vBottom = bp.layout.top_y + 40 + 26 + linesOf(c.block.scripture.text, 40, w) * 40 * 1.38;
  if (vBottom > 1020) fail("the closing scripture runs past the bottom safe line");
  let prevEnd = 0;
  for (const g of EXCEPTION ? [] : pr.groups) {
    if (g.start !== prevEnd) fail("prayer groups must run with no gap");
    prevEnd = g.end;
    if (g.end - g.start < 2 * RULES.prayer_crossfade_frames) fail("a prayer group is too short to fade in and out");
    if (g.text.length < 60) fail(`a prayer group is only ${g.text.length} letters, too short to stand alone`);
    if (bp.layout.prayer_page_y + 80 + linesOf(g.text, 36, w) * 36 * 1.5 > 1020) fail("a prayer group runs past the bottom safe line");
  }
  if (!EXCEPTION && prevEnd !== RULES.prayer_frames) fail("the last prayer group must run to the end of the prayer page");
  if (pr.groups.map((g) => g.text).join(" ") !== bp.closing.prayer) fail("the prayer groups, read in order, differ from the prayer");
  if (EXCEPTION === "line_push") {
    const beats = bp.closing.prayer_beats || [];
    if (beats.length !== 4) fail("the pushed prayer needs exactly 4 beats");
    if (beats.join(" ") !== bp.closing.prayer) fail("the 4 beats, read in order, differ from the prayer");
    const lines = pr.push;
    if (!lines || !lines.length) fail("the pushed prayer has no lines");
    else {
      const wpx = bp.plates[pr.plate].column_width_px;
      for (const l of lines) if (l.text.length * 36 * 0.52 > wpx) fail(`a pushed line "${l.text}" is about ${Math.round(l.text.length * 36 * 0.52)} pixels, over the ${wpx} pixel column`);
      if (lines[0].start < RULES.block_fade_in_frames) fail("the first pushed line must wait for the page to fade in");
      for (let i = 1; i < lines.length; i++) if (lines[i].start <= lines[i - 1].start) fail("pushed lines must arrive one after another");
      const rest = pr.frames - lines[lines.length - 1].start;
      if (rest < PUSH.rest_at_end_frames) fail(`the last pushed line leaves only ${rest} frames of rest`);
      const room = Math.floor((bp.layout.push_bottom_y - bp.layout.push_top_y) / 54);
      const last = lines[lines.length - 1];
      const tail = lines.filter((l) => last.slot - l.slot < room);
      if (!tail.some((l) => l.beat === 3 && l.first)) fail("the final beat must be fully on screen at the end");
      if (bp.layout.push_bottom_y + 54 > 1050) fail("the pushed lines run past the bottom safe line");
    }
  }
  if (!/Amen\.$/.test(bp.closing.prayer)) fail("the prayer must end with Amen.");
  ok.push(EXCEPTION ? `layout exception: ${EXCEPTION} on the prayer page only, brand rules unchanged` : "layout exception: none");
  ok.push(`closing: Romans scripture page, then the prayer on its own page for ${pr.frames} frames, then the thank you page for the rest (${(th.frames / FPS).toFixed(1)} seconds)`);
}
if (bp.closing.scripture.ref !== "ROMANS 10:9-10") fail("the closing scripture is Romans 10:9-10 in the standard");
ok.push(`pace: ${RULES.scripture_words_per_minute} words a minute, 4 second pause, 8 second hold, 1 second dissolves, prayer on its own page 1:53, exactly 8:00, music and picture fade out together`);

// 5. Thank you page
if (bp.thanks.heading !== "Thank you for watching.") fail('the thank you page must open with "Thank you for watching."');
if (!bp.thanks.lines.length || !bp.thanks.link) fail("the thank you page needs its lines and link");
ok.push("thanks page: present, wording from Version 8");

// 6. Scripture is KJV and listed in the registry
const shown = [...bp.teaching_blocks.map((b) => b.scripture), bp.closing.scripture];
for (const s of shown) {
  const r = reg[s.ref];
  if (!r) { fail(`${s.ref} is not in src/data/kjv-registry.json. Add it with its exact KJV wording first.`); continue; }
  if (r.text !== s.text) fail(`${s.ref} does not match the KJV wording held in the registry`);
  if (!r.verified) warn.push(`CHECK: ${s.ref} is not yet matched to a KJV source in this repository. Confirm it against your KJV.`);
}
ok.push(`scripture: ${shown.map((s) => s.ref).join(", ")} match the registry`);

// 7. Words
const spokenParts = [...shown.map((s) => s.text), ...bp.teaching_blocks.map((b) => b.reflection), bp.closing.prayer, bp.thanks.heading, ...bp.thanks.lines];
const everyText = JSON.stringify(bp);
if (everyText.includes(String.fromCharCode(0x2014)) || everyText.includes(String.fromCharCode(0x2013))) fail("a long dash is in the blueprint");
if (/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(everyText)) fail("an emoji is in the blueprint");
if (/[\u2014\u2013]/.test(jsx)) fail("a long dash is in the layout file");
if (spokenParts.join(" ").includes("!")) fail("an exclamation point is in the words");
for (const w of ["burnout", "self-care", "mindfulness", "healing journey", "boundaries", "thriving", "wellness", "hustle", "hacks", "your truth", "you are enough"]) {
  if (spokenParts.join(" ").toLowerCase().includes(w)) fail(`banned wording: ${w}`);
}
const intro = bp.intro.lines.map((l) => l.text).join(" ").toLowerCase();
if (intro !== "sanctuary grace ministry presents the quiet authority") fail("the intro must read Sanctuary Grace Ministry presents The Quiet Authority");
ok.push("words: no long dashes, emoji, exclamation points or banned wording");

// 8. Files
for (const [name, p] of Object.entries(bp.plates)) {
  if (!existsSync(new URL(p.image, root)) || statSync(new URL(p.image, root)).size < 20000) fail(`${name}: ${p.image} is missing`);
  if (!jsx.includes(p.image.split("/").pop())) fail(`the layout does not import ${p.image.split("/").pop()}`);
}
const music = new URL(bp.music.file, root);
if (bp.music.file.endsWith("music1.mp3")) fail("the stand-in music1.mp3 must not be used");
if (!existsSync(music) || statSync(music).size < 1000000) fail(`${bp.music.file} is missing`);
else if (readFileSync(music).subarray(4, 8).toString("latin1") !== "ftyp") fail(`${bp.music.file} is not real audio`);
if (!jsx.includes(bp.music.file.split("/").pop())) fail("the layout does not import the music file");
ok.push("files: both pictures and the Version 8 music present");

if (errors.length) {
  console.error(`FAIL: ${errors.length} problem(s)`);
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}
console.log("OK: TQA standard v2 is valid");
ok.forEach((l) => console.log("    " + l));
warn.forEach((l) => console.log("    " + l));
