// Pinterest Idea Pin factory. Makes one vertical pin (1080 by 1920) for each of the six master videos.
// Step 1: for each video it tries a grid of crops of the video's locked plate (the jar and candle, or the seated woman)
//         and keeps the sharpest crop (highest edge detail, measured as the variance of a Laplacian filter).
//         Two videos on the same plate never get the same crop, so the pins stay easy to tell apart.
// Step 2: it overlays the scripture title in the middle in brand gold Cinzel (text inside 780 pixels).
// Step 3: it saves the pins and pins.json (title, description, destination link) in content-ops/03_pinterest_pins/.
// The scripture titles come from content-ops/02_thumbnail_factory/thumbnails.json, so they match the thumbnail cards.
// Nothing here uploads, posts or reads a secret. Grace pins by hand.
//
// Usage (run from the repository root):
//   node scripts/generate-pinterest-idea-pins.mjs --render    choose the sharpest crops and make the six pins (default)
//   node scripts/generate-pinterest-idea-pins.mjs --check     check the files, the titles, the 780 pixel text width and the wording
//   node scripts/generate-pinterest-idea-pins.mjs --staged    make the local-only pin for a staged video (workflows/output/local-staging.json) into pins-staged.json
//                                                             The public pins.json and the live gate are not touched.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const repo = new URL("../", import.meta.url);
const remotion = new URL("content-ops/04_youtube/remotion/", repo);
const OUT = new URL("content-ops/03_pinterest_pins/", repo);
const THUMBS = new URL("content-ops/02_thumbnail_factory/thumbnails.json", repo);
const W = 1080, H = 1920, MAX_W = 780, SRC_W = 1920, SRC_H = 1080;
const EMDASH = String.fromCharCode(0x2014);

// The locked plate for each video (the same plates the thumbnail cards use) and the title size that fits 780 pixels.
const PLATES = { v8: "character_spotlight", v9: "spotlight_candle", v11: "spotlight_candle", v10: "character_spotlight", v12: "spotlight_candle", v13: "character_spotlight" };
const PLATE_FILE = { spotlight_candle: "light-stream-plate.jpg", character_spotlight: "character-spotlight-plate.jpg" };
const SIZES = { v8: 84, v9: 96, v11: 96, v10: 70, v12: 62, v13: 66 };
const ZOOMS = { spotlight_candle: [1, 1.4], character_spotlight: [1, 1.4, 1.8] };
// On the seated woman plate only the centre crop keeps her whole, so videos on that plate differ by zoom instead. The candle plate may use any crop.
const FOCI = { spotlight_candle: [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100], character_spotlight: [50] };
// Pixels to move the title down so it sits below the head of the seated woman.
const OFFSETS = { v8: 120, v9: 0, v11: 0, v10: 200, v12: 0, v13: 260 };
const file = (id) => `TQA_IdeaPin_${id}.png`;

// The part of the plate that the render really shows for a given horizontal focus and zoom (same math as the browser).
const visible = (px, z) => {
  const scale = H / SRC_H; // object-fit cover: the plate is scaled to the pin height
  const imgW = SRC_W * scale;
  const left = (W - imgW) * (px / 100);
  const ox = W * (px / 100), oy = H / 2;
  const a = ox - ox / z, b = ox + (W - ox) / z;
  const c = oy - oy / z, d = oy + (H - oy) / z;
  return { x: (a - left) / scale, w: (b - a) / scale, y: c / scale, h: (d - c) / scale };
};

const plateSrc = (plate) => new URL("src/assets/tqa/" + PLATE_FILE[plate], remotion).pathname;

// Variance of a Laplacian over a 540 by 960 grayscale version of the crop. Higher means sharper.
const sharpness = (plate, r) => {
  const w = 540, h = 960;
  const vf = `crop=${r.w.toFixed(2)}:${r.h.toFixed(2)}:${r.x.toFixed(2)}:${r.y.toFixed(2)},scale=${w}:${h}:flags=lanczos,format=gray`;
  const p = spawnSync("ffmpeg", ["-v", "error", "-i", plateSrc(plate), "-vf", vf, "-frames:v", "1", "-f", "rawvideo", "-"], { maxBuffer: 1 << 24 });
  if (p.status !== 0) throw new Error("ffmpeg could not read the plate: " + p.stderr);
  const g = p.stdout;
  let sum = 0, sum2 = 0, n = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x;
    const lap = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - w] - g[i + w];
    sum += lap; sum2 += lap * lap; n++;
  }
  const mean = sum / n;
  return sum2 / n - mean * mean;
};

const cards = () => JSON.parse(readFileSync(THUMBS, "utf8")).cards;

const render = () => {
  mkdirSync(OUT, { recursive: true });
  const used = new Set();
  const index = [];
  for (const c of cards()) {
    const id = c.video, plate = PLATES[id];
    const scored = [];
    for (const z of ZOOMS[plate]) for (const f of FOCI[plate]) scored.push({ z, f, score: sharpness(plate, visible(f, z)) });
    scored.sort((a, b) => b.score - a.score);
    const pick = scored.find((s) => !used.has(plate + s.z + s.f));
    used.add(plate + pick.z + pick.f);
    // Neighbouring crops overlap heavily, so also block the nearest focus on each side for the same plate and zoom.
    for (const d of [-12.5, 12.5]) used.add(plate + pick.z + (pick.f + d));
    const card = {
      plate, zoom: pick.z, focus: `${pick.f}% 50%`, shade: 0.88, offset: OFFSETS[id],
      lines: c.scripture_title.map((t) => ({ text: t, size: SIZES[id] })), sub: c.sub,
    };
    const out = new URL(file(id), OUT).pathname;
    console.log(`pin ${file(id)}: plate ${plate}, focus ${pick.f}%, zoom ${pick.z}, sharpness ${pick.score.toFixed(1)}`);
    const args = ["remotion", "still", "src/index.js", "TQA-IdeaPin", out, `--props=${JSON.stringify({ card })}`, "--overwrite"];
    if (process.env.REMOTION_BROWSER) args.push(`--browser-executable=${process.env.REMOTION_BROWSER}`, "--ignore-certificate-errors");
    const r = spawnSync("npx", args, { cwd: remotion.pathname, stdio: "inherit" });
    if (r.status !== 0) process.exit(r.status || 1);
    const title = `${c.scripture_title.map((t) => t[0] + t.slice(1).toLowerCase()).join(" and ")} (KJV) | The Quiet Authority`;
    index.push({
      video: id, file: `content-ops/03_pinterest_pins/${file(id)}`, plate, focus: card.focus, zoom: card.zoom, sharpness: Math.round(pick.score * 10) / 10,
      scripture_title: c.scripture_title, sub: c.sub, size: `${W} by ${H}`,
      title,
      description: `${c.sub}. Scripture from the King James Version. Come home to The Quiet Authority at sanctuary-grace.com`,
      destination_link: "https://sanctuary-grace.com",
      status: "READY for Grace to pin by hand. Nothing here uploads.",
    });
  }
  writeFileSync(new URL("pins.json", OUT), JSON.stringify({ about: "Pinterest Idea Pins made by scripts/generate-pinterest-idea-pins.mjs. 1080 by 1920. Grace pins by hand. Nothing uploads.", pins: index }, null, 2) + "\n");
};

const check = () => {
  const errors = [];
  const fail = (m) => errors.push(m);
  const ok = [];
  const pinsFile = new URL("pins.json", OUT);
  if (!existsSync(pinsFile)) { console.error("FAIL: pins.json is missing. Run --render first."); process.exit(1); }
  const pins = JSON.parse(readFileSync(pinsFile, "utf8")).pins;
  const thumbIds = cards().map((c) => c.video);
  if (pins.length !== 6 || thumbIds.some((v) => !pins.find((p) => p.video === v))) fail("there must be one pin for each of the six master videos");
  const hashes = [];
  const grids = {};
  for (const p of pins) {
    const f = new URL(file(p.video), OUT);
    if (!existsSync(f)) { fail(`${file(p.video)} is missing`); continue; }
    const b = readFileSync(f);
    if (b.subarray(1, 4).toString("latin1") !== "PNG") { fail(`${file(p.video)} is not a PNG`); continue; }
    const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
    if (w !== W || h !== H) fail(`${file(p.video)} is ${w} by ${h}, not ${W} by ${H}`);
    if (b.length < 50000) fail(`${file(p.video)} is too small (${b.length} bytes)`);
    hashes.push(createHash("sha256").update(b).digest("hex"));
    const g = spawnSync("ffmpeg", ["-v", "error", "-i", f.pathname, "-vf", "scale=18:32,format=gray", "-f", "rawvideo", "-"], { maxBuffer: 1 << 20 });
    if (g.status === 0) grids[p.video] = g.stdout;
    for (const l of p.scripture_title) {
      const width = l.length * (SIZES[p.video] * 0.66 + 4);
      if (width > MAX_W) fail(`${p.video}: "${l}" is about ${Math.round(width)} pixels wide, over ${MAX_W}`);
    }
    const subW = p.sub.length * (38 * 0.52 + 2);
    if (subW > MAX_W) fail(`${p.video}: the subtitle is about ${Math.round(subW)} pixels wide, over ${MAX_W}`);
    const t = cards().find((c) => c.video === p.video);
    if (JSON.stringify(t.scripture_title) !== JSON.stringify(p.scripture_title)) fail(`${p.video}: the pin title differs from the thumbnail card title`);
    const text = JSON.stringify(p);
    if (text.includes(EMDASH)) fail(`${p.video}: a long dash is in the pin text`);
    if (/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(text)) fail(`${p.video}: an emoji is in the pin text`);
    if (/hustle|grind|show up|crush it|level up|self-care|mindfulness|healing journey|boundaries|thriving|wellness|burnout|hacks|\btips\b|strategies/i.test(text)) fail(`${p.video}: a banned word is in the pin text`);
    if (p.destination_link !== "https://sanctuary-grace.com") fail(`${p.video}: the destination link must be https://sanctuary-grace.com`);
  }
  if (new Set(hashes).size !== hashes.length) fail("two pins are identical files");
  const ids = Object.keys(grids);
  let minDiff = 999;
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    let d = 0;
    for (let k = 0; k < grids[ids[i]].length; k++) d += Math.abs(grids[ids[i]][k] - grids[ids[j]][k]);
    d /= grids[ids[i]].length;
    minDiff = Math.min(minDiff, d);
    if (d < 6) fail(`the pins ${ids[i]} and ${ids[j]} are too alike (difference ${d.toFixed(1)} of 255)`);
  }
  ok.push(`files: ${pins.length} real ${W} by ${H} pictures, all different (the closest pair differs by ${minDiff.toFixed(1)} of 255)`);
  ok.push(`titles: each scripture title matches its thumbnail card and every text box is ${MAX_W} pixels or less`);
  const jsx = readFileSync(new URL("src/TQAIdeaPin.jsx", remotion), "utf8");
  for (const hex of new Set(jsx.match(/#[0-9a-fA-F]{3,8}\b/g) || [])) if (!["#0d0d0d", "#c9a84c", "#f5f0e8"].includes(hex.toLowerCase())) fail(`the pin layout uses ${hex}, which is not a brand color`);
  if (/rgba?\(|hsla?\(/.test(jsx)) fail("the pin layout blends colors outside the brand set");
  if (!/maxWidth: MAX_W/.test(jsx) || !/text_width_px: 780/.test(jsx)) fail("the pin text box must be capped at 780 pixels");
  if (!/Cinzel/.test(jsx)) fail("the pin title must use Cinzel");
  ok.push("layout: brand colors, Cinzel gold titles and Jost, text capped at 780 pixels");
  ok.push("wording: no long dash, no emoji, no banned word, destination https://sanctuary-grace.com");
  if (errors.length) { console.error(`FAIL: ${errors.length} problem(s)`); errors.forEach((e) => console.error("  - " + e)); process.exit(1); }
  console.log("OK: the Pinterest Idea Pins are valid");
  ok.forEach((l) => console.log("    " + l));
};


// ---------- Local staging: one pin for a staged video that is not on the public gate yet ----------
const STAGING = new URL("workflows/output/local-staging.json", repo);
const STAGED_JSON = new URL("pins-staged.json", OUT);
// min_focus keeps the crop on the right side of the candle plate, where the jar, the candle and the light are (the left side is empty dark wall).
const STAGED = { v14: { plate: "spotlight_candle", lines: ["PSALM 46:1", "PSALM 46:7", "PSALM 84:11"], size: 62, offset: 0, min_focus: 62.5, zooms: [1, 1.4, 1.8] } };

const renderStaged = () => {
  mkdirSync(OUT, { recursive: true });
  const st = JSON.parse(readFileSync(STAGING, "utf8"));
  // Crops already used by the six public pins are skipped, so the staged pin looks different from them.
  const used = new Set();
  for (const p of JSON.parse(readFileSync(new URL("pins.json", OUT), "utf8")).pins) {
    const f = parseFloat(p.focus);
    used.add(p.plate + p.zoom + f);
    for (const d of [-12.5, 12.5]) used.add(p.plate + p.zoom + (f + d));
  }
  const index = [];
  for (const v of st.videos) {
    const cfg = STAGED[v.version];
    if (!cfg) { console.error(`no staged pin settings for ${v.version}`); process.exit(1); }
    const plate = cfg.plate;
    const scored = [];
    for (const z of cfg.zooms) for (const f of FOCI[plate].filter((x) => x >= cfg.min_focus)) scored.push({ z, f, score: sharpness(plate, visible(f, z)) });
    scored.sort((a, b) => b.score - a.score);
    const pick = scored.find((x) => !used.has(plate + x.z + x.f));
    const sub = "One Word Under All of Them";
    const card = { plate, zoom: pick.z, focus: `${pick.f}% 50%`, shade: 0.88, offset: cfg.offset, lines: cfg.lines.map((t) => ({ text: t, size: cfg.size })), sub };
    const out = new URL(file(v.version), OUT).pathname;
    console.log(`staged pin ${file(v.version)}: plate ${plate}, focus ${pick.f}%, zoom ${pick.z}, sharpness ${pick.score.toFixed(1)}`);
    const args = ["remotion", "still", "src/index.js", "TQA-IdeaPin", out, `--props=${JSON.stringify({ card })}`, "--overwrite"];
    if (process.env.REMOTION_BROWSER) args.push(`--browser-executable=${process.env.REMOTION_BROWSER}`, "--ignore-certificate-errors");
    const r = spawnSync("npx", args, { cwd: remotion.pathname, stdio: "inherit" });
    if (r.status !== 0) process.exit(r.status || 1);
    index.push({
      video: v.version, file: `content-ops/03_pinterest_pins/${file(v.version)}`, plate, focus: card.focus, zoom: card.zoom, sharpness: Math.round(pick.score * 10) / 10,
      scripture_title: cfg.lines, sub, size: `${W} by ${H}`,
      title: `${cfg.lines.map((t) => t[0] + t.slice(1).toLowerCase()).join(", ")} (KJV) | The Quiet Authority`,
      description: `${sub}: Immanu, with us. Scripture from the King James Version. Come home to The Quiet Authority at sanctuary-grace.com`,
      destination_link: "https://sanctuary-grace.com",
      status: "LOCAL STAGING ONLY. Agent draft, awaiting Grace's approval. Not on the public gate. Nothing uploads.",
    });
  }
  writeFileSync(STAGED_JSON, JSON.stringify({ about: "Local-only Idea Pins for staged videos, made by scripts/generate-pinterest-idea-pins.mjs --staged. The live gate never reads this file.", pins: index }, null, 2) + "\n");
};

const checkStaged = () => {
  const errors = [];
  const fail = (m) => errors.push(m);
  if (!existsSync(STAGED_JSON)) { console.error("FAIL: pins-staged.json is missing. Run --staged first."); process.exit(1); }
  const pins = JSON.parse(readFileSync(STAGED_JSON, "utf8")).pins;
  for (const p of pins) {
    const f = new URL(file(p.video), OUT);
    if (!existsSync(f)) { fail(`${file(p.video)} is missing`); continue; }
    const b = readFileSync(f);
    if (b.subarray(1, 4).toString("latin1") !== "PNG") fail(`${file(p.video)} is not a PNG`);
    else if (b.readUInt32BE(16) !== W || b.readUInt32BE(20) !== H) fail(`${file(p.video)} is not ${W} by ${H}`);
    if (b.length < 50000) fail(`${file(p.video)} is too small`);
    for (const l of p.scripture_title) if (l.length * (STAGED[p.video].size * 0.66 + 4) > MAX_W) fail(`"${l}" is over ${MAX_W} pixels wide`);
    if (p.sub.length * (38 * 0.52 + 2) > MAX_W) fail("the subtitle is over 780 pixels wide");
    const text = JSON.stringify(p);
    if (text.includes(EMDASH)) fail("a long dash is in the staged pin text");
    if (/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(text)) fail("an emoji is in the staged pin text");
    if (/hustle|grind|show up|crush it|level up|self-care|mindfulness|healing journey|boundaries|thriving|wellness|burnout|hacks|\btips\b|strategies/i.test(text)) fail("a banned word is in the staged pin text");
    const data = JSON.parse(readFileSync(new URL(`content-ops/04_youtube/remotion/src/data/TQA_Stillness_Journey_FINAL_${p.video}.json`, repo), "utf8"));
    const refs = data.teaching_blocks.map((b2) => b2.scripture.ref);
    for (const l of p.scripture_title) if (!refs.includes(l)) fail(`${l} is not a scripture in ${p.video}`);
  }
  if (errors.length) { console.error(`FAIL: ${errors.length} problem(s)`); errors.forEach((e) => console.error("  - " + e)); process.exit(1); }
  console.log(`OK: ${pins.length} staged local-only Idea Pin, ${W} by ${H}, scripture titles are in the video, text inside ${MAX_W} pixels, no banned wording`);
};

const mode = process.argv[2] || "--render";
if (mode === "--render") render();
else if (mode === "--check") { check(); if (existsSync(STAGED_JSON)) checkStaged(); }
else if (mode === "--staged") renderStaged();
else { console.error("use --render, --check or --staged"); process.exit(2); }
