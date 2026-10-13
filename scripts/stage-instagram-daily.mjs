// Instagram daily Reels staging. Reads the 18 vertical Shorts and the release calendar in workflows/output/youtube-schedule.json
// and writes one daily post template for each Short into workflows/output/shorts-staged/instagram-daily/, plus instagram-daily-schedule.json.
// Rule from Grace: a short is posted after its full video. Each video's three shorts go out on the Monday, Tuesday and Wednesday after its Sunday release.
// The caption text is copied word for word from the Instagram Reels section of the short's own caption document.
// Nothing here posts anything and it reads no secret. The Instagram workflows stay paused.
//
// Usage (run from the repository root):
//   node scripts/stage-instagram-daily.mjs --stage    write the templates and the schedule (default)
//   node scripts/stage-instagram-daily.mjs --check    check the templates against the shorts, the calendar and the wording
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";

const SCHEDULE = "workflows/output/youtube-schedule.json";
const STAGED = "workflows/output/shorts-staged/";
const DIR = STAGED + "instagram-daily/";
const INDEX = STAGED + "instagram-daily-schedule.json";
const EMDASH = String.fromCharCode(0x2014);
const CTA = "Link in bio: sanctuary-grace.com";
const CLIP_OFFSET = { A: 1, B: 2, C: 3 }; // days after the Sunday release: Monday, Tuesday, Wednesday
const BANNED = /hustle|grind|show up|crush it|level up|self-care|mindfulness|healing journey|boundaries|thriving|wellness|burnout|hacks|\btips\b|strategies/i;

const addDays = (iso, n) => {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const weekday = (iso) => new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
const reelCaption = (doc) => {
  const m = doc.match(/## Instagram Reels\s+Caption:\n([\s\S]*?)(?=\n## )/);
  return m ? m[1].trim() : null;
};
const relatedLine = (doc) => {
  const m = doc.match(/- In YouTube Studio, open this short, choose Related video, and pick: (.+)/);
  return m ? m[1].trim() : null;
};

const plan = () => {
  const data = JSON.parse(readFileSync(SCHEDULE, "utf8"));
  const release = Object.fromEntries(data.videos.map((v) => [v.version, v]));
  const rows = [];
  for (const s of data.shorts) {
    if (s.skip) continue;
    const v = release[s.video];
    const date = addDays(v.date, CLIP_OFFSET[s.clip]);
    const doc = readFileSync(s.caption, "utf8");
    rows.push({ date, weekday: weekday(date), video: s.video, clip: s.clip, name: s.name, file: s.file, caption_doc: s.caption, template: `${DIR}${date}_${s.video}-clip-${s.clip}.md`, full_video_date: v.date, full_video_title: v.title, related_video: relatedLine(doc), caption: reelCaption(doc) });
  }
  rows.sort((a, b) => a.date.localeCompare(b.date));
  return rows;
};

const body = (r) => `---
date: ${r.date}
weekday: ${r.weekday}
video: ${r.video}
clip: ${r.clip}
clip_name: ${r.name}
reel_file: ${r.file}
format: 1080 by 1920, 60 seconds, 9:16
status: STAGED for Grace to post by hand. Nothing here posts anything.
post_after: the full video, ${r.full_video_date} 5:00 AM Eastern
---

# Instagram Reel for ${r.weekday}, ${r.date}: ${r.video.toUpperCase()} Clip ${r.clip}, ${r.name}

## Step by step for the day

1. Open the Reel file: ${r.file}
2. Check that the full video is already up on YouTube (${r.full_video_title}).
3. In Instagram, choose New reel and pick the file above.
4. Paste the caption below, then replace {{YOUTUBE_WATCH_URL}} with the YouTube link only if you want it in the caption.
5. Share. Then check that your profile bio reads: ${CTA}

## Related video (native link anchor)

${r.related_video}

## Caption

${r.caption}

## Profile template

- Bio line: ${CTA}
- Scripture is from the King James Version.
- Caption source: ${r.caption_doc}
`;

const stage = () => {
  const rows = plan();
  mkdirSync(DIR, { recursive: true });
  for (const r of rows) writeFileSync(r.template, body(r));
  writeFileSync(INDEX, JSON.stringify({ about: "Daily Instagram Reel plan made by scripts/stage-instagram-daily.mjs. Grace posts every Reel by hand. The Instagram workflows stay paused. Nothing posts.", cta: CTA, days: rows.map(({ caption, ...rest }) => rest) }, null, 2) + "\n");
  console.log(`staged ${rows.length} daily Reel templates in ${DIR}`);
};

const check = () => {
  const errors = [];
  const fail = (m) => errors.push(m);
  const rows = plan();
  if (rows.length !== 18) fail(`expected 18 Reels, found ${rows.length}`);
  const days = new Set();
  for (const r of rows) {
    if (days.has(r.date)) fail(`two Reels on ${r.date}`);
    days.add(r.date);
    if (!["Monday", "Tuesday", "Wednesday"].includes(r.weekday)) fail(`${r.template}: ${r.date} is a ${r.weekday}`);
    if (r.date <= r.full_video_date) fail(`${r.template}: posts on or before its full video`);
    if (!existsSync(r.file)) fail(`${r.file} is missing`);
    if (!r.caption) fail(`${r.caption_doc} has no Instagram Reels caption`);
    else if (!r.caption.includes(CTA)) fail(`${r.caption_doc}: the Instagram caption lacks "${CTA}"`);
    if (!r.related_video) fail(`${r.caption_doc} has no related video anchor`);
    if (!existsSync(r.template)) { fail(`${r.template} is missing`); continue; }
    const t = readFileSync(r.template, "utf8");
    if (t !== body(r)) fail(`${r.template} is out of date. Run --stage.`);
    if (t.includes(EMDASH)) fail(`${r.template}: a long dash is in the template`);
    if (/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(t)) fail(`${r.template}: an emoji is in the template`);
    if (BANNED.test(t)) fail(`${r.template}: a banned word is in the template`);
  }
  if (existsSync(DIR)) {
    const extra = readdirSync(DIR).filter((f) => f.endsWith(".md") && !rows.some((r) => r.template.endsWith(f)));
    if (extra.length) fail(`unexpected templates: ${extra.join(", ")}`);
  }
  if (!existsSync(INDEX)) fail(`${INDEX} is missing`);
  // The Instagram workflows must have no active schedule and no way to post by themselves.
  for (const f of ["instagram-agent.yml", "instagram-deploy.yml", "pinterest-agent.yml", "youtube-agent.yml", "youtube-deploy.yml", "substack-agent.yml", "substack-deploy.yml"]) {
    const y = readFileSync(".github/workflows/" + f, "utf8");
    if (/^\s*schedule:/m.test(y) || /^\s*-?\s*cron:/m.test(y)) fail(`.github/workflows/${f} still has an active schedule`);
  }
  if (errors.length) { console.error(`FAIL: ${errors.length} problem(s)`); errors.forEach((e) => console.error("  - " + e)); process.exit(1); }
  console.log(`OK: 18 daily Instagram Reel templates, one a day on weekdays after each full video, caption and "${CTA}" on all, and no workflow has an active schedule`);
};

const mode = process.argv[2] || "--stage";
if (mode === "--stage") stage();
else if (mode === "--check") check();
else { console.error("use --stage or --check"); process.exit(2); }
