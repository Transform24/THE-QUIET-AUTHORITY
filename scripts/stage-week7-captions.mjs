// Week 7 (v14, Immanu) staging. LOCAL STAGING ONLY, nothing here is public or posts anything.
//   --stage   writes three Short caption cards into content-ops/05_future_development/staged-captions/
//   --check   proves the scriptures in the video data match the blueprint SCRIPTURE-SELECTION.md character by character
//             (LORD in capitals), and that the cards use the right words, the call to action and no banned wording.
// The cards follow the same layout as the cards for Videos 8 to 13 in workflows/output/shorts-staged/.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const DATA = "content-ops/04_youtube/remotion/src/data/TQA_Stillness_Journey_FINAL_v14.json";
const PLAN = "content-ops/05_future_development/SCRIPTURE-SELECTION.md";
const STAGING = "workflows/output/local-staging.json";
const OUT = "content-ops/05_future_development/staged-captions/";
const EMDASH = String.fromCharCode(0x2014);
const CTA = "Link in bio: sanctuary-grace.com";
const BANNED = /hustle|grind|show up|crush it|level up|self-care|mindfulness|healing journey|boundaries|thriving|wellness|burnout|hacks|\btips\b|strategies/i;

const bp = JSON.parse(readFileSync(DATA, "utf8"));
const st = JSON.parse(readFileSync(STAGING, "utf8")).videos.find((v) => v.version === "v14");
const plan = readFileSync(PLAN, "utf8");

// The blueprint table: | 1 | Psalm 46:1 | text |
const planned = {};
for (const m of plan.matchAll(/^\|\s*\d\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/gm)) planned[m[1].toUpperCase()] = m[2];

const blocks = bp.teaching_blocks;
const pretty = (ref) => ref.split(" ").map((w, i) => (i === 0 ? w[0] + w.slice(1).toLowerCase() : w)).join(" ");
const tags = "#TheQuietAuthority #KJV #Prayer";
const release = "Sunday, November 29, 2026";
const related = st.title;

const card = (clip, name, summary, ytTitle, hook, quote, postDay) => {
  const body = `${hook}\n\n${quote}`;
  return `---
video: v14
clip: ${clip}
clip_name: ${name}
file: not rendered yet
format: 1080 by 1920, 60 seconds
status: STAGED DRAFT, local only. Awaiting Grace's review. Nothing here uploads anything.
full_video_release: ${release}
suggested_post_day: ${postDay}
---

# V14, Clip ${clip}: ${name}

${summary}

## Related video (native link anchor)

- In YouTube Studio, open this short, choose Related video, and pick: ${related}
- Full video link, to paste after Grace uploads it: {{YOUTUBE_WATCH_URL}}
- The full video is scheduled for ${release}, 5:00 AM Eastern. Post the short after that.

## YouTube Shorts

Title: ${ytTitle} | The Quiet Authority

Description:
${body}

Watch the full 8 minute video: {{YOUTUBE_WATCH_URL}}
${CTA}

${tags} #Shorts

## Instagram Reels

Caption:
${body}

Watch the full 8 minute video: {{YOUTUBE_WATCH_URL}}
${CTA}

${tags}

## Pinterest

Title: ${ytTitle} | The Quiet Authority
Description: ${hook} Full video and more at sanctuary-grace.com ${tags}
Destination link: https://sanctuary-grace.com

## Call to action strings (for any bio or end card)

- ${CTA}
- Full video on YouTube. Come home to The Quiet Authority at sanctuary-grace.com
- Scripture is from the King James Version.
`;
};

const q = (b) => `"${b.scripture.text}"`;
const cards = {
  "v14-clip-A.md": card("A", "Verse One", "This short shows the first scripture, revealed word by word, with its reflection.", `${pretty(blocks[0].scripture.ref)} (KJV)`, `${pretty(blocks[0].scripture.ref)} (KJV). Read it slowly, one word at a time.`, q(blocks[0]), "Monday, November 30, 2026"),
  "v14-clip-B.md": card("B", "Mid-way Reflection", "This short shows the middle scripture, the word Immanu, with its reflection.", `${pretty(blocks[1].scripture.ref)} (KJV)`, `${pretty(blocks[1].scripture.ref)} (KJV). The word under it is Immanu, with us.`, q(blocks[1]), "Tuesday, December 1, 2026"),
  "v14-clip-C.md": card("C", "The Outro Prayer Push", "This short shows the prayer, arriving one line at a time.", "A Quiet Prayer to Rest In", "A quiet prayer. Pray it with me, one line at a time.", bp.closing.prayer_beats.slice(0, 2).join(" "), "Wednesday, December 2, 2026"),
};

const stage = () => {
  mkdirSync(OUT, { recursive: true });
  for (const [f, t] of Object.entries(cards)) writeFileSync(OUT + f, t);
  console.log(`staged ${Object.keys(cards).length} Week 7 caption cards in ${OUT}`);
};

const check = () => {
  const errors = [];
  const fail = (m) => errors.push(m);
  const scriptures = [...blocks.map((b) => b.scripture)];
  for (const s of scriptures) {
    const want = planned[s.ref];
    if (!want) fail(`${s.ref} is not in the blueprint table`);
    else if (want !== s.text) fail(`${s.ref}: the video text differs from the blueprint, character by character.\n    video:     ${s.text}\n    blueprint: ${want}`);
    if (/\blord\b|\bLord\b/.test(s.text) && !/\bLORD\b/.test(s.text)) fail(`${s.ref}: LORD must be in capitals`);
  }
  if (Object.keys(planned).length !== 3) fail(`the blueprint should list exactly 3 verses, found ${Object.keys(planned).length}`);
  for (const [f, t] of Object.entries(cards)) {
    const onDisk = existsSync(OUT + f) ? readFileSync(OUT + f, "utf8") : null;
    if (onDisk === null) fail(`${f} is missing. Run --stage.`);
    else if (onDisk !== t) fail(`${f} is out of date. Run --stage.`);
    if (t.includes(EMDASH)) fail(`${f}: a long dash is in the card`);
    if (/[\u{1F300}-\u{1FAFF}☀-➿]/u.test(t)) fail(`${f}: an emoji is in the card`);
    if (BANNED.test(t)) fail(`${f}: a banned word is in the card`);
    if (!t.includes(CTA)) fail(`${f}: the call to action "${CTA}" is missing`);
    if (!t.includes("Related video")) fail(`${f}: the related video anchor is missing`);
    for (const line of t.split("\n")) if (/the lord\b/.test(line) && /LORD/.test(line)) fail(`${f}: mixed LORD capitals`);
  }
  if (errors.length) { console.error(`FAIL: ${errors.length} problem(s)`); errors.forEach((e) => console.error("  - " + e)); process.exit(1); }
  console.log("OK: the three Week 7 scriptures match SCRIPTURE-SELECTION.md character by character with LORD in capitals, and the 3 staged caption cards carry the anchor, the call to action and no banned wording");
};

const mode = process.argv[2] || "--stage";
if (mode === "--stage") stage();
else if (mode === "--check") check();
else { console.error("use --stage or --check"); process.exit(2); }
