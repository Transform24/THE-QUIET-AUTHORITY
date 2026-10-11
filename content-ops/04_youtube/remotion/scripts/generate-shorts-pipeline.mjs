// The Quiet Authority Shorts pipeline. From each finished 8 minute video (v9, v10, v11, v12) it plans three 60 second
// vertical (1080 by 1920) cuts: Clip A the first scripture, Clip B the middle reflection, Clip C the outro prayer push.
// It writes a caption document for every clip into workflows/output/shorts-staged/ and can render the clips.
// Nothing here uploads anything. Grace posts every short herself.
//
// Usage (run from content-ops/04_youtube/remotion):
//   node scripts/generate-shorts-pipeline.mjs --plan            plan the 12 clips and write the caption documents (default)
//   node scripts/generate-shorts-pipeline.mjs --check           check the assets, the plan, the captions and the shared engine
//   node scripts/generate-shorts-pipeline.mjs --render v12 A    render one clip to out/shorts/ (omit the video and clip for all 12)
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { SHORT, CLIPS, planClip } from "../src/tqaShorts.mjs";

const root = new URL("../", import.meta.url);
const repoRoot = new URL("../../../../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const STAGED = new URL("workflows/output/shorts-staged/", repoRoot);

// The finished videos. v9 carries the same words as v10, so it reads the v10 data file.
const VIDEOS = {
  v9: { data: "src/data/TQA_Stillness_Journey_FINAL_v10.json", release: "Sunday, October 18, 2026", title: "The Posture of Prayer | Matthew 6:6-9 (KJV) | A Quiet Prayer to Rest In", prayer: "closing", same_as: "v10" },
  v11: { data: "src/data/TQA_Stillness_Journey_FINAL_v11.json", release: "Sunday, November 1, 2026", title: "Waiting on the LORD | Psalm 27 and Psalm 91:1 (KJV) | A Quiet Bedtime Prayer", prayer: "bedtime" },
  v10: { data: "src/data/TQA_Stillness_Journey_FINAL_v10.json", release: "Sunday, November 15, 2026", title: "The Posture of Prayer | Matthew 6:6-9 and Romans 10:9-10 (KJV) | A Quiet Prayer to Rest In", prayer: "closing" },
  v12: { data: "src/data/TQA_Stillness_Journey_FINAL_v12.json", release: "Sunday, November 29, 2026", title: "The Secret of the LORD | Psalm 25:14, Proverbs 3:32, Malachi 3:6 (KJV) | A Quiet Morning Prayer", prayer: "morning" },
};
const EMDASH = String.fromCharCode(0x2014);
const load = (id) => JSON.parse(read(VIDEOS[id].data));
const fileName = (id, clip) => `${id}-clip-${clip}`;

const caption = (id, clip, plan, bp) => {
  const v = VIDEOS[id];
  const prettyRef = plan.kind === "verse" ? plan.scripture.ref.replace(/\b([A-Z])([A-Z]*)/g, (m, a, b) => a + b.toLowerCase()) : null;
  const verseText = plan.kind === "verse" ? plan.scripture.text : null;
  const hook =
    plan.kind === "verse"
      ? `${prettyRef} (KJV). Read it slowly, one word at a time.`
      : `A quiet ${v.prayer} prayer. Pray it with me, one line at a time.`;
  const quote = verseText && verseText.length <= 300 ? `\n"${verseText}"\n` : "";
  const prayerLine = plan.kind === "prayer" ? `\n${plan.beats[0]}\n` : "";
  const shortTitle = plan.kind === "verse" ? `${prettyRef} (KJV) | The Quiet Authority` : `A Quiet ${v.prayer[0].toUpperCase() + v.prayer.slice(1)} Prayer | The Quiet Authority`;
  const tags = "#TheQuietAuthority #KJV #Prayer";
  const bio = "Link in bio: sanctuary-grace.com";
  const related = `Watch the full 8 minute video: {{YOUTUBE_WATCH_URL}}`;
  return `---
video: ${id}
clip: ${clip}
clip_name: ${CLIPS[clip].name}
file: out/shorts/${fileName(id, clip)}.mp4
format: 1080 by 1920, 60 seconds
status: PLANNED, not rendered yet. Nothing here uploads anything.
full_video_release: ${v.release}
---

# ${id.toUpperCase()}, Clip ${clip}: ${CLIPS[clip].name}

This short shows ${CLIPS[clip].what}.${v.same_as ? `\nNote: ${id} carries the same words as ${v.same_as}, so these clips repeat ${v.same_as}'s. Post one set, not both.` : ""}

## Related video (native link anchor)

- In YouTube Studio, open this short, choose Related video, and pick: ${v.title}
- Full video link, to paste after Grace uploads it: {{YOUTUBE_WATCH_URL}}
- The full video is scheduled for ${v.release}, 5:00 AM Eastern. Post the short after that.

## YouTube Shorts

Title: ${shortTitle}

Description:
${hook}
${quote}${prayerLine}
${related}
${bio}

${tags} #Shorts

## Instagram Reels

Caption:
${hook}
${quote}${prayerLine}
${related}
${bio}

${tags}

## Pinterest

Title: ${shortTitle}
Description: ${hook} Full video and more at sanctuary-grace.com ${tags}
Destination link: https://sanctuary-grace.com

## Call to action strings (for any bio or end card)

- ${bio}
- Full video on YouTube. Come home to The Quiet Authority at sanctuary-grace.com
- Scripture is from the King James Version.
`;
};

const planAll = () => {
  const plans = [];
  for (const id of Object.keys(VIDEOS)) {
    const bp = load(id);
    for (const clip of Object.keys(CLIPS)) plans.push({ id, clip, plan: planClip(bp, clip), bp });
  }
  return plans;
};

const writeStaged = (plans) => {
  mkdirSync(STAGED, { recursive: true });
  for (const { id, clip, plan, bp } of plans) writeFileSync(new URL(`${fileName(id, clip)}.md`, STAGED), caption(id, clip, plan, bp));
  const summary = plans.map(({ id, clip, plan }) => ({
    file: `out/shorts/${fileName(id, clip)}.mp4`,
    video: id,
    clip,
    name: CLIPS[clip].name,
    plate: plan.plate,
    fits_60_seconds: plan.fits,
    frames: SHORT.frames,
  }));
  writeFileSync(new URL("shorts-plan.json", STAGED), JSON.stringify({ about: "Planned Shorts. Generated by scripts/generate-shorts-pipeline.mjs. Nothing uploads.", clips: summary }, null, 2) + "\n");
  return summary.length;
};

const check = (plans) => {
  const errors = [];
  const ok = [];
  const fail = (m) => errors.push(m);
  // 1. Raw assets: present, big enough, real files.
  const assets = [
    ["src/assets/tqa/light-stream-plate.jpg", 20000, (b) => b[0] === 0xff && b[1] === 0xd8],
    ["src/assets/tqa/character-spotlight-plate.jpg", 20000, (b) => b[0] === 0xff && b[1] === 0xd8],
    ["src/assets/tqa/tqa-music-v8-extended.m4a", 1000000, (b) => b.subarray(4, 8).toString("latin1") === "ftyp"],
  ];
  for (const [p, min, magic] of assets) {
    const f = new URL(p, root);
    if (!existsSync(f)) { fail(`${p} is missing`); continue; }
    if (statSync(f).size < min) fail(`${p} is too small (${statSync(f).size} bytes)`);
    else if (!magic(readFileSync(f).subarray(0, 16))) fail(`${p} is not a real file of its type`);
  }
  const probe = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", new URL("src/assets/tqa/tqa-music-v8-extended.m4a", root).pathname], { encoding: "utf8" });
  if (probe.status === 0) { const d = parseFloat(probe.stdout); if (!(d >= 60)) fail(`the music is only ${d} seconds`); else ok.push(`assets: both pictures and the Version 8 music are real files (music ${Math.round(d)} seconds)`); }
  else ok.push("assets: both pictures and the Version 8 music are real files (ffprobe not available, music length not measured)");
  // 2. Layout rules.
  if (SHORT.text_width_px > 780) fail("short text width must be 780 pixels or less");
  if (SHORT.frames !== 1440) fail("a short must be exactly 60 seconds (1440 frames)");
  if (SHORT.width !== 1080 || SHORT.height !== 1920) fail("a short must be 1080 by 1920");
  const jsx = read("src/TQAShortClip.jsx");
  for (const hex of new Set(jsx.match(/#[0-9a-fA-F]{3,8}\b/g) || [])) fail(`the short layout uses ${hex}, which is not a brand color`);
  if (/rgba?\(|hsla?\(/.test(jsx)) fail("the short layout blends colors outside the brand set");
  for (const m of jsx.matchAll(/fontFamily:\s*"([^"]+)"/g)) for (const f of m[1].split(",")) if (!["cinzel", "jost", "serif", "sans-serif"].includes(f.trim().replace(/['"]/g, "").toLowerCase())) fail(`the short layout uses the font ${f}`);
  if (!/maxWidth: MAX_W/.test(jsx)) fail("every short text box must be capped with MAX_W");
  if (jsx.includes(EMDASH)) fail("a long dash is in the short layout");
  ok.push("layout: 1080 by 1920, 60 seconds, text boxes 780 pixels or less in Jost and Cinzel, brand colors only");
  // 3. The plan: every clip fits inside 60 seconds and keeps the words exact.
  let kjvOk = true;
  const reg = JSON.parse(read("src/data/kjv-registry.json")).verses;
  for (const { id, clip, plan } of plans) {
    if (!plan.fits) fail(`${id} clip ${clip} does not fit in 60 seconds`);
    if (plan.kind === "verse" && reg[plan.scripture.ref]?.text !== plan.scripture.text) { kjvOk = false; fail(`${id} clip ${clip}: ${plan.scripture.ref} does not match the KJV list`); }
    if (plan.kind === "verse" && plan.cps > SHORT.max_cps + 0.001) fail(`${id} clip ${clip}: the reflection types too fast`);
  }
  if (kjvOk) ok.push(`plan: all ${plans.length} clips fit inside 60 seconds, every scripture matches the KJV list`);
  // 4. Caption documents.
  for (const { id, clip } of plans) {
    const f = new URL(`${fileName(id, clip)}.md`, STAGED);
    if (!existsSync(f)) { fail(`caption document missing for ${id} clip ${clip}`); continue; }
    const t = readFileSync(f, "utf8");
    if (!t.includes("sanctuary-grace.com")) fail(`${id} clip ${clip}: no sanctuary-grace.com link`);
    if (!t.includes("Link in bio: sanctuary-grace.com")) fail(`${id} clip ${clip}: no link in bio line`);
    if (!t.includes("{{YOUTUBE_WATCH_URL}}") || !t.includes("Related video")) fail(`${id} clip ${clip}: no related video anchor`);
    if (t.includes(EMDASH)) fail(`${id} clip ${clip}: a long dash is in the caption`);
  }
  ok.push(`captions: ${plans.length} caption documents with the related video anchor and the link in bio line`);
  // 5. The shared engine check (the long video files must be untouched and on brand).
  const sync = spawnSync("node", ["scripts/check-remotion-sync.mjs"], { cwd: repoRoot.pathname, encoding: "utf8" });
  if (sync.status !== 0) fail("the shared engine check failed: " + (sync.stdout + sync.stderr).trim().split("\n").slice(-3).join(" "));
  else ok.push("sync: " + sync.stdout.trim().split("\n").pop());
  if (errors.length) {
    console.error(`FAIL: ${errors.length} problem(s)`);
    errors.forEach((e) => console.error("  - " + e));
    process.exit(1);
  }
  console.log("OK: the Shorts pipeline is valid");
  ok.forEach((l) => console.log("    " + l));
};

const render = (only) => {
  mkdirSync(new URL("out/shorts/", root), { recursive: true });
  const [wantVideo, wantClip] = only;
  for (const id of Object.keys(VIDEOS)) for (const clip of Object.keys(CLIPS)) {
    if ((wantVideo && wantVideo !== id) || (wantClip && wantClip !== clip)) continue;
    const out = `out/shorts/${fileName(id, clip)}.mp4`;
    console.log("render " + out);
    const r = spawnSync("npx", ["remotion", "render", "src/index.js", "TQA-Short", out, `--props=${JSON.stringify({ video: id, clip })}`, "--overwrite", "--concurrency=4", ...(process.env.REMOTION_BROWSER ? [`--browser-executable=${process.env.REMOTION_BROWSER}`, "--ignore-certificate-errors"] : [])], { cwd: root.pathname, stdio: "inherit" });
    if (r.status !== 0) process.exit(r.status || 1);
  }
};

const args = process.argv.slice(2);
const mode = args[0] || "--plan";
const plans = planAll();
if (mode === "--plan") console.log(`planned ${writeStaged(plans)} clips, caption documents written to workflows/output/shorts-staged/`);
else if (mode === "--check") check(plans);
else if (mode === "--render") render(args.slice(1));
else { console.error("use --plan, --check or --render [video] [clip]"); process.exit(2); }
