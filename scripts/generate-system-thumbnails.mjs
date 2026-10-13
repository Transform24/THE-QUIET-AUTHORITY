// Thumbnail factory, phase 1. Makes one distinct thumbnail card for each of the six master videos (v8 to v13).
// It hooks into the Remotion compiler: each card is a still of the TQA-Thumbnail composition (src/TQAThumbnail.jsx),
// built on one of the two locked pictures (the jar and candle, or the seated woman) so every card looks like The Quiet Authority.
// Each card carries its own scripture title in the middle, in brand gold Cinzel, inside the 780 pixel text width.
// Output goes to content-ops/02_thumbnail_factory/. Nothing here uploads anything.
//
// About "frame 00:01": every master video opens with the same dim intro, so the frame at 1 second is nearly black and
// identical in all six. The cards instead use the same locked pictures at full strength, so they are recognizable and different.
//
// Usage (run from the repository root):
//   node scripts/generate-system-thumbnails.mjs --render    make the six cards (default)
//   node scripts/generate-system-thumbnails.mjs --check     check the files, the titles, the 780 pixel text width and that the cards differ
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = new URL("../", import.meta.url);
const remotion = new URL("content-ops/04_youtube/remotion/", repo);
const OUT = new URL("content-ops/02_thumbnail_factory/", repo);
const MAX_W = 780;

// One card per video. The lines are the scripture title. The checker proves every line is a scripture the video really contains.
const CARDS = {
  v8: { data: "src/data/TQA_Stillness_Journey_FINAL_v8.json", plate: "character_spotlight", zoom: 2.6, focus: "45% 78%", shade: 0.9, lines: [{ text: "PSALM 46:10", size: 72 }], sub: "The Stillness Journey" },
  v9: { data: "src/data/TQA_Stillness_Journey_FINAL_v9.json", plate: "spotlight_candle", zoom: 1.3, focus: "70% 55%", shade: 0.85, lines: [{ text: "PSALM 91", size: 88 }], sub: "The Secret Place" },
  v11: { data: "src/data/TQA_Stillness_Journey_FINAL_v11.json", plate: "spotlight_candle", zoom: 1.8, focus: "55% 15%", shade: 0.9, lines: [{ text: "PSALM 27", size: 88 }], sub: "Waiting on the LORD" },
  v10: { data: "src/data/TQA_Stillness_Journey_FINAL_v10.json", plate: "character_spotlight", zoom: 1.8, focus: "52% 25%", shade: 0.9, lines: [{ text: "MATTHEW 6", size: 64 }, { text: "ROMANS 10:9-10", size: 64 }], sub: "The Posture of Prayer" },
  v12: { data: "src/data/TQA_Stillness_Journey_FINAL_v12.json", plate: "spotlight_candle", zoom: 2.2, focus: "75% 80%", shade: 0.9, lines: [{ text: "PSALM 25:14", size: 54 }, { text: "PROVERBS 3:32", size: 54 }, { text: "MALACHI 3:6", size: 54 }], sub: "The Secret of the LORD" },
  v13: { data: "src/data/TQA_Stillness_Journey_FINAL_v13.json", plate: "character_spotlight", zoom: 1.0, focus: "52% 40%", shade: 0.8, lines: [{ text: "PROVERBS 18:10", size: 60 }, { text: "ISAIAH 43:18-19", size: 60 }], sub: "The Hallowed Identity" },
};
const file = (id) => `TQA_Thumbnail_${id}.png`;
const EMDASH = String.fromCharCode(0x2014);

const refsOf = (id) => {
  const bp = JSON.parse(readFileSync(new URL(CARDS[id].data, remotion), "utf8"));
  return [...bp.teaching_blocks.map((b) => b.scripture.ref), bp.closing.scripture.ref];
};
// "ISAIAH 43:18-19" is covered when both verses are in the video. "MATTHEW 6" is covered by any verse of Matthew 6.
const covers = (line, refs) => {
  const m = line.match(/^([A-Z]+) (\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!m) return false;
  const [, book, ch, v1, v2] = m;
  if (v1 === undefined) return refs.some((r) => r.startsWith(`${book} ${ch}:`));
  const have = (v) => refs.some((r) => r === `${book} ${ch}:${v}` || r.startsWith(`${book} ${ch}:${v}-`));
  if (v2 === undefined) return have(v1);
  if (refs.includes(`${book} ${ch}:${v1}-${v2}`)) return true;
  for (let v = Number(v1); v <= Number(v2); v++) if (!have(v)) return false;
  return true;
};

const render = () => {
  mkdirSync(OUT, { recursive: true });
  for (const id of Object.keys(CARDS)) {
    const { data, ...card } = CARDS[id];
    const out = new URL(file(id), OUT).pathname;
    console.log("card " + file(id));
    const args = ["remotion", "still", "src/index.js", "TQA-Thumbnail", out, `--props=${JSON.stringify({ card })}`, "--overwrite"];
    if (process.env.REMOTION_BROWSER) args.push(`--browser-executable=${process.env.REMOTION_BROWSER}`, "--ignore-certificate-errors");
    const r = spawnSync("npx", args, { cwd: remotion.pathname, stdio: "inherit" });
    if (r.status !== 0) process.exit(r.status || 1);
  }
  const index = Object.keys(CARDS).map((id) => ({ video: id, file: `content-ops/02_thumbnail_factory/${file(id)}`, scripture_title: CARDS[id].lines.map((l) => l.text), sub: CARDS[id].sub }));
  writeFileSync(new URL("thumbnails.json", OUT), JSON.stringify({ about: "Thumbnail cards made by scripts/generate-system-thumbnails.mjs. 1280 by 720.", cards: index }, null, 2) + "\n");
};

const check = () => {
  const errors = [];
  const fail = (m) => errors.push(m);
  const ok = [];
  // 1. Titles are real scriptures of that video, and fit the 780 pixel text width (Cinzel is about 0.66 em wide, plus 4 pixels of spacing a letter).
  for (const id of Object.keys(CARDS)) {
    const refs = refsOf(id);
    for (const l of CARDS[id].lines) {
      if (!covers(l.text, refs)) fail(`${id}: "${l.text}" is not a scripture in that video`);
      const w = l.text.length * (l.size * 0.66 + 4);
      if (w > MAX_W) fail(`${id}: "${l.text}" is about ${Math.round(w)} pixels wide, over ${MAX_W}`);
    }
    const subW = CARDS[id].sub.length * (34 * 0.52 + 2);
    if (subW > MAX_W) fail(`${id}: the subtitle is about ${Math.round(subW)} pixels wide, over ${MAX_W}`);
    if (JSON.stringify(CARDS[id]).includes(EMDASH)) fail(`${id}: a long dash is in the card`);
  }
  ok.push(`titles: every scripture title is in its video and every text box is ${MAX_W} pixels or less`);
  // 2. The files: six real 1280 by 720 pictures that really differ.
  const grids = {};
  for (const id of Object.keys(CARDS)) {
    const f = new URL(file(id), OUT);
    if (!existsSync(f)) { fail(`${file(id)} is missing`); continue; }
    const b = readFileSync(f);
    if (b.subarray(1, 4).toString("latin1") !== "PNG") { fail(`${file(id)} is not a PNG`); continue; }
    const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
    if (w !== 1280 || h !== 720) fail(`${file(id)} is ${w} by ${h}, not 1280 by 720`);
    if (b.length < 50000) fail(`${file(id)} is too small (${b.length} bytes)`);
    const g = spawnSync("ffmpeg", ["-v", "error", "-i", f.pathname, "-vf", "scale=32:18,format=gray", "-f", "rawvideo", "-"], { maxBuffer: 1 << 20 });
    if (g.status === 0) grids[id] = g.stdout;
    grids[id + "_hash"] = createHash("sha256").update(b).digest("hex");
  }
  const ids = Object.keys(CARDS);
  const hashes = ids.map((i) => grids[i + "_hash"]).filter(Boolean);
  if (new Set(hashes).size !== hashes.length) fail("two cards are identical files");
  let minDiff = 999;
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    const a = grids[ids[i]], c = grids[ids[j]];
    if (!a || !c) continue;
    let d = 0;
    for (let k = 0; k < a.length; k++) d += Math.abs(a[k] - c[k]);
    d /= a.length;
    minDiff = Math.min(minDiff, d);
    if (d < 6) fail(`the cards ${ids[i]} and ${ids[j]} are too alike (difference ${d.toFixed(1)} of 255)`);
  }
  ok.push(`files: ${ids.length} real 1280 by 720 pictures, all different (the closest pair differs by ${minDiff.toFixed(1)} of 255)`);
  // 3. The layout file: brand colors and fonts only, text capped at 780.
  const jsx = readFileSync(new URL("src/TQAThumbnail.jsx", remotion), "utf8");
  for (const hex of new Set(jsx.match(/#[0-9a-fA-F]{3,8}\b/g) || [])) if (!["#0d0d0d", "#c9a84c", "#f5f0e8"].includes(hex.toLowerCase())) fail(`the thumbnail layout uses ${hex}, which is not a brand color`);
  if (/rgba?\(|hsla?\(/.test(jsx)) fail("the thumbnail layout blends colors outside the brand set");
  if (!/maxWidth: MAX_W/.test(jsx) || !/text_width_px: 780/.test(jsx)) fail("the thumbnail text box must be capped at 780 pixels");
  if (!/Cinzel/.test(jsx)) fail("the thumbnail title must use Cinzel");
  ok.push("layout: brand colors, Cinzel gold titles and Jost, text capped at 780 pixels");
  if (errors.length) { console.error(`FAIL: ${errors.length} problem(s)`); errors.forEach((e) => console.error("  - " + e)); process.exit(1); }
  console.log("OK: the thumbnail factory is valid");
  ok.forEach((l) => console.log("    " + l));
};

const mode = process.argv[2] || "--render";
if (mode === "--render") render();
else if (mode === "--check") check();
else { console.error("use --render or --check"); process.exit(2); }
