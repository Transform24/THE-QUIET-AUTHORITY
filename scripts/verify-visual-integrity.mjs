#!/usr/bin/env node
// Visual integrity agent for the TQA master videos.
//
//   node scripts/verify-visual-integrity.mjs [--write-gate] [--note="text" ...] <video.mp4> [<video.mp4> ...]
//   --note adds a plain sentence to the gate card (for example which music was confirmed by hand).
//
// With no video named it checks every out/TQA_Stillness_Journey_FINAL_v*.mp4 it can find.
// It always runs the layout checks first (picture layer, 11,520 frames, 780 pixel text, Cinzel and Jost),
// then reads every frame of each video and fails the build when:
//   1. the video is not exactly 11,520 frames at 24 fps, 1920 by 1080 (the 8:00 flat mark);
//   2. more than 3 frames in a row are solid black (#000000) before the official final fade-out;
//   3. the picture layer drops out (a long run of frames with nothing but the plain #0d0d0d backdrop)
//      before the official final fade-out.
// The official final fade-out is the last 192 frames (8 seconds). Frames in it are never counted.
// With --write-gate the result is written to workflows/output/visual-integrity.json, which
// approval-gate.html reads. A failing video shows as BLOCKED there.
//
// Needs ffmpeg and ffprobe on the machine. Nothing is rendered, changed or uploaded.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const remotion = path.join(repo, "content-ops/04_youtube/remotion");
const { RULES, buildTimeline } = await import(path.join(remotion, "src/tqaStandard.mjs"));

const TOTAL = 11520;
const FPS = 24;
const FINAL_FADE = RULES.picture_fade_out_frames; // 192 frames, 8 seconds
const FADE_START = TOTAL - FINAL_FADE;
const MAX_BLACK_RUN = 3;
const MAX_FLAT_RUN = 24; // one second. A real picture dissolve never leaves the plain backdrop this long.
const EM = String.fromCharCode(0x2014);

const problems = [];
const notes = [];
const fail = (m) => problems.push(m);

// 1. Layout checks (no video needed)
const readJson = (p) => JSON.parse(readFileSync(path.join(remotion, p), "utf8"));
const layouts = [
  { name: "TQA_Stillness_Journey_FINAL_v10", file: "src/TQA_Stillness_Journey_FINAL_v10.jsx", data: "src/data/TQA_Stillness_Journey_FINAL_v10.json", fade: /durationInFrames\s*-\s*RULES\.picture_fade_out_frames/ },
  { name: "TQA_Stillness_Journey_FINAL_v11", file: "src/TQA_Stillness_Journey_FINAL_v11.jsx", data: "src/data/TQA_Stillness_Journey_FINAL_v11.json", fade: /durationInFrames\s*-\s*RULES\.picture_fade_out_frames/ },
  { name: "TQA_Stillness_Journey_FINAL_v12", file: "src/TQA_Stillness_Journey_FINAL_v12.jsx", data: "src/data/TQA_Stillness_Journey_FINAL_v12.json", fade: /durationInFrames\s*-\s*RULES\.picture_fade_out_frames/ },
  { name: "TQA_Stillness_Journey_FINAL_v13", file: "src/TQA_Stillness_Journey_FINAL_v13.jsx", data: "src/data/TQA_Stillness_Journey_FINAL_v13.json", fade: /durationInFrames\s*-\s*RULES\.picture_fade_out_frames/ },
  { name: "TQAPattern (video 9)", file: "src/TQAPatternComposition.jsx", data: "src/data/tqa-pattern-blueprint.json", fade: /durationInFrames\s*-\s*background\.fade_to_black_frames/ },
];
for (const L of layouts) {
  const jsx = readFileSync(path.join(remotion, L.file), "utf8");
  const bp = readJson(L.data);
  if (!/<Img\b[^>]*objectFit:\s*"cover"/.test(jsx)) fail(`${L.name}: the picture layer must be an <Img> that covers the whole frame`);
  if (!L.fade.test(jsx)) fail(`${L.name}: the picture fade-out must start from the end of the video, not earlier`);
  if (/(^|[^0-9a-fA-F])#000(000)?\b/.test(jsx)) fail(`${L.name}: the layout paints pure black (#000000)`);
  const total = L.file.includes("Pattern") ? bp.total_frames : buildTimeline(bp).total_frames;
  if (total !== TOTAL) fail(`${L.name}: the timeline is ${total} frames, it must be ${TOTAL}`);
  const width = bp.layout?.text_max_width_px;
  if (width > 780 || width === undefined) fail(`${L.name}: text boxes must be 780 pixels or less (found ${width})`);
  if (bp.fonts?.header !== "Cinzel" || bp.fonts?.body !== "Jost") fail(`${L.name}: headers must be Cinzel and body text Jost`);
  if (readFileSync(path.join(remotion, L.data), "utf8").includes(EM)) fail(`${L.name}: the data file contains an em dash`);
}
if (RULES.picture_fade_out_frames !== 192) fail(`the official final fade-out is 192 frames, found ${RULES.picture_fade_out_frames}`);
notes.push(`layouts: 5 layout files keep an <Img> picture layer, 11,520 frames, text at 780 pixels or less, Cinzel and Jost`);

// 2. Video checks
const args = process.argv.slice(2);
const writeGate = args.includes("--write-gate");
const noteArgs = args.filter((a) => a.startsWith("--note=")).map((a) => a.slice(7));
let videos = args.filter((a) => !a.startsWith("--"));
if (!videos.length) {
  const out = path.join(remotion, "out");
  if (existsSync(out)) videos = readdirSync(out).filter((f) => /^TQA_Stillness_Journey_FINAL_v\d+\.mp4$/.test(f)).map((f) => path.join(out, f));
}

const probe = (file) => {
  const r = spawnSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-count_frames", "-show_entries", "stream=width,height,r_frame_rate,nb_read_frames,color_range", "-of", "json", file], { encoding: "utf8" });
  if (r.status !== 0) throw new Error("ffprobe could not read " + file);
  return JSON.parse(r.stdout).streams[0];
};

const frameStats = (file) => new Promise((resolve, reject) => {
  const p = spawn("ffmpeg", ["-v", "error", "-i", file, "-an", "-vf", "scale=96:54,signalstats,metadata=print:file=-", "-f", "null", "-"]);
  const ymax = [];
  const ymin = [];
  let buf = "";
  p.stdout.on("data", (c) => {
    buf += c;
    let i;
    while ((i = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, i);
      buf = buf.slice(i + 1);
      const m = line.match(/lavfi\.signalstats\.(YMAX|YMIN)=(\d+)/);
      if (m) (m[1] === "YMAX" ? ymax : ymin).push(Number(m[2]));
    }
  });
  p.on("error", reject);
  p.on("close", (code) => (code === 0 ? resolve({ ymax, ymin }) : reject(new Error("ffmpeg failed on " + file))));
});

const runs = (flags) => {
  const out = [];
  let s = -1;
  for (let i = 0; i <= flags.length; i++) {
    if (i < flags.length && flags[i]) { if (s < 0) s = i; }
    else if (s >= 0) { out.push({ start: s, length: i - s }); s = -1; }
  }
  return out;
};

const results = [];
for (const file of videos) {
  const name = path.basename(file);
  const res = { video: name, ok: true, problems: [] };
  const bad = (m) => { res.ok = false; res.problems.push(m); };
  if (!existsSync(file)) { bad("file not found"); results.push(res); continue; }
  const info = probe(file);
  const [num, den] = info.r_frame_rate.split("/").map(Number);
  const frames = Number(info.nb_read_frames);
  if (info.width !== 1920 || info.height !== 1080) bad(`size is ${info.width} by ${info.height}, it must be 1920 by 1080`);
  if (num / den !== FPS) bad(`speed is ${num / den} frames a second, it must be ${FPS}`);
  if (frames !== TOTAL) bad(`${frames} frames, it must be exactly ${TOTAL} (8:00)`);
  const limited = info.color_range === "tv";
  const blackMax = limited ? 23 : 8; // solid black, with room for encoder noise. The brand backdrop #0d0d0d reads 13 (27 limited), so it is not black.
  const flatMax = limited ? 34 : 24; // only the plain #0d0d0d backdrop, no picture and no text
  const { ymax } = await frameStats(file);
  if (ymax.length !== frames) bad(`read ${ymax.length} frames of ${frames}`);
  const before = (r) => r.start < FADE_START;
  const black = runs(ymax.map((v) => v <= blackMax)).filter((r) => r.length > MAX_BLACK_RUN && before(r));
  for (const r of black) bad(`${r.length} frames in a row of solid black from frame ${r.start} (${(r.start / FPS).toFixed(1)} s), before the final fade-out at frame ${FADE_START}`);
  const flat = runs(ymax.map((v) => v <= flatMax)).filter((r) => r.length > MAX_FLAT_RUN && r.start >= RULES.picture_fade_in_frames && before(r));
  for (const r of flat) bad(`the picture is gone for ${r.length} frames from frame ${r.start} (${(r.start / FPS).toFixed(1)} s), before the final fade-out at frame ${FADE_START}`);
  const lead = ymax.slice(FADE_START - 24, FADE_START);
  if (lead.length && lead.every((v) => v <= flatMax)) bad(`no picture in the second before the final fade-out begins at frame ${FADE_START}`);
  res.frames = frames;
  res.final_fade_starts_at_frame = FADE_START;
  res.longest_black_run_before_fade = Math.max(0, ...runs(ymax.map((v) => v <= blackMax)).filter(before).map((r) => r.length));
  res.longest_picture_gap_before_fade = Math.max(0, ...runs(ymax.map((v) => v <= flatMax)).filter((r) => r.start >= RULES.picture_fade_in_frames && before(r)).map((r) => r.length));
  results.push(res);
}

const layoutOk = problems.length === 0;
const allOk = layoutOk && results.every((r) => r.ok);
console.log(layoutOk ? "OK: " + notes[0] : "FAIL: layout checks");
for (const p of problems) console.log("    " + p);
for (const r of results) {
  if (r.ok) console.log(`OK: ${r.video}: ${r.frames} frames, longest black run before the fade ${r.longest_black_run_before_fade} frames, longest picture gap ${r.longest_picture_gap_before_fade} frames, final fade starts at frame ${r.final_fade_starts_at_frame}`);
  else { console.log(`FAIL: ${r.video}`); for (const p of r.problems) console.log("    " + p); }
}
if (!results.length) console.log("No video named and none found in out/. Layout checks only.");

if (writeGate) {
  const file = path.join(repo, "workflows/output/visual-integrity.json");
  writeFileSync(file, JSON.stringify({
    about: "Written by scripts/verify-visual-integrity.mjs. A video that fails shows as BLOCKED on approval-gate.html.",
    checked: new Date().toISOString().slice(0, 10),
    rule: `No more than ${MAX_BLACK_RUN} frames in a row of solid black before the final fade-out (frame ${FADE_START} to ${TOTAL}). Exactly ${TOTAL} frames.`,
    layout_ok: layoutOk,
    layout_problems: problems,
    notes: noteArgs,
    videos: results,
  }, null, 2) + "\n");
  console.log("Wrote workflows/output/visual-integrity.json");
}
process.exit(allOk ? 0 : 1);
