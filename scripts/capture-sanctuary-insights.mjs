// Sanctuary Insights: turns the channel numbers Grace exports from YouTube Studio into the gauges on approval-gate.html.
// It reads workflows/output/engagement-input.json (the channel log) and writes workflows/output/engagement-metrics.json.
// It never invents a number. Anything not in the log shows as "no data yet". Nothing here uploads or posts anything.
//
// Usage (run from the repository root):
//   node scripts/capture-sanctuary-insights.mjs --template   write an empty channel log to fill in (never overwrites one)
//   node scripts/capture-sanctuary-insights.mjs --capture    read the channel log and write the metrics file (default)
//   node scripts/capture-sanctuary-insights.mjs --check      prove the maths and the sorting on a labeled test log
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const INPUT = new URL("workflows/output/engagement-input.json", root);
const OUTPUT = new URL("workflows/output/engagement-metrics.json", root);

// The six master videos, in launch order, and which video's shorts each one uses.
export const SUITES = [
  { id: "v8", title: "The Stillness Journey (Psalm 46:10)", release: "2026-10-18", shorts_from: "v8" },
  { id: "v9", title: "The Secret Place (Psalm 91)", release: "2026-10-25", shorts_from: "v9" },
  { id: "v11", title: "Waiting on the LORD (Psalm 27)", release: "2026-11-01", shorts_from: "v11" },
  { id: "v10", title: "The Posture of Prayer with Romans 10:9-10", release: "2026-11-08", shorts_from: "v10" },
  { id: "v12", title: "The Secret of the LORD (Psalm 25:14)", release: "2026-11-15", shorts_from: "v12" },
  { id: "v13", title: "The Hallowed Identity (Gate 3)", release: "2026-11-22", shorts_from: "v13" },
];
export const CLIP_NAMES = { A: "Verse One", B: "Mid-way Reflection", C: "The Outro Prayer Push" };

const empty = () => ({
  impressions: null, views: null, ctr_percent: null, watch_time_hours: null,
  avg_view_percentage: null, retention_30s_percent: null,
  traffic: { site_clicks: null, youtube_suggested: null, shorts_feed: null, search: null, external: null },
  shorts: { A: { views: null, avg_view_percentage: null, site_clicks: null }, B: { views: null, avg_view_percentage: null, site_clicks: null }, C: { views: null, avg_view_percentage: null, site_clicks: null } },
});
export const template = () => ({
  about: "Fill these in from YouTube Studio, Analytics. Leave a number as null until it exists. retention_30s_percent is the share of viewers still watching at 30 seconds. avg_view_percentage is the average percentage viewed. site_clicks is clicks to sanctuary-grace.com. The traffic numbers are views by source. Shorts for v9 are the same as v10's, so only fill the v10 shorts.",
  videos: Object.fromEntries(SUITES.map((s) => [s.id, empty()])),
});

const num = (x) => (typeof x === "number" && Number.isFinite(x) ? x : null);
const pct = (x) => (x === null ? null : Math.round(Math.min(100, Math.max(0, x)) * 10) / 10);

// Engagement score for a short: 70 percent how much of it people watch, 30 percent how many click through to the site.
// A click rate of 10 percent or more counts as a full score for the click part.
export const shortScore = (s) => {
  const watch = num(s?.avg_view_percentage);
  const views = num(s?.views);
  if (watch === null || views === null || views <= 0) return null;
  const clicks = num(s.site_clicks) ?? 0;
  const clickRate = Math.min(100, (clicks / views) * 100 * 10);
  return Math.round((0.7 * pct(watch) + 0.3 * clickRate) * 10) / 10;
};

export const compute = (log) => {
  const suites = SUITES.map((s) => {
    const v = log?.videos?.[s.id] || empty();
    const views = num(v.views);
    const clicks = num(v.traffic?.site_clicks);
    const avg = num(v.avg_view_percentage);
    const sources = ["youtube_suggested", "shorts_feed", "search", "external"].map((k) => ({ key: k, views: num(v.traffic?.[k]) }));
    const sourceTotal = sources.reduce((a, x) => a + (x.views || 0), 0);
    const source = Object.fromEntries(sources.map((x) => [x.key, x.views === null || sourceTotal === 0 ? null : pct((x.views / sourceTotal) * 100)]));
    const donor = log?.videos?.[s.shorts_from] || empty();
    const clips = Object.keys(CLIP_NAMES).map((c) => ({ clip: c, name: CLIP_NAMES[c], views: num(donor.shorts?.[c]?.views), score: shortScore(donor.shorts?.[c]) }));
    const ranked = clips.filter((c) => c.score !== null).sort((a, b) => b.score - a.score);
    return {
      id: s.id, title: s.title, release: s.release,
      has_data: views !== null,
      hook_rate: pct(num(v.retention_30s_percent)),
      retention_dropoff: avg === null ? null : pct(100 - avg),
      traffic_redirection: views === null || clicks === null || views <= 0 ? null : pct((clicks / views) * 100),
      click_through: pct(num(v.ctr_percent)),
      watch_time_hours: num(v.watch_time_hours),
      traffic_sources: source,
      top_short: ranked[0] ? { ...ranked[0], file: `public/shorts/${s.shorts_from}-clip-${ranked[0].clip}.mp4`, from: s.shorts_from } : null,
      shorts_note: s.shorts_from !== s.id ? `Uses the ${s.shorts_from} shorts` : "",
    };
  });
  // One list of video and top short pairs, best engagement first. Videos with no short numbers yet stay at the bottom.
  const pairs = suites
    .map((x) => ({ video: x.id, title: x.title, short: x.top_short }))
    .sort((a, b) => (b.short?.score ?? -1) - (a.short?.score ?? -1));
  return { about: "Generated by scripts/capture-sanctuary-insights.mjs from workflows/output/engagement-input.json. No numbers are invented.", updated: new Date().toISOString().slice(0, 10), suites, pairs };
};

const mode = process.argv[2] || "--capture";
if (import.meta.url === `file://${process.argv[1]}`) {
  if (mode === "--template") {
    if (existsSync(INPUT)) console.log("the channel log already exists, nothing overwritten");
    else { writeFileSync(INPUT, JSON.stringify(template(), null, 2) + "\n"); console.log("wrote the empty channel log: workflows/output/engagement-input.json"); }
  } else if (mode === "--capture") {
    const log = existsSync(INPUT) ? JSON.parse(readFileSync(INPUT, "utf8")) : template();
    const out = compute(log);
    writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + "\n");
    const withData = out.suites.filter((s) => s.has_data).length;
    console.log(`wrote workflows/output/engagement-metrics.json: ${withData} of ${out.suites.length} videos have numbers yet`);
  } else if (mode === "--check") {
    const errors = [];
    const fail = (m) => errors.push(m);
    // 1. An empty log must produce no numbers at all.
    const none = compute(template());
    if (none.suites.length !== 6) fail("there must be 6 video suites");
    if (none.suites.some((s) => s.has_data || s.hook_rate !== null || s.retention_dropoff !== null || s.traffic_redirection !== null || s.top_short)) fail("an empty log must show no numbers");
    // 2. A labeled test log proves the maths and the sorting. These are test numbers, not channel numbers.
    const test = template();
    test.videos.v13 = { ...empty(), views: 1000, retention_30s_percent: 80, avg_view_percentage: 45, traffic: { site_clicks: 30 }, shorts: { A: { views: 500, avg_view_percentage: 60, site_clicks: 10 }, B: { views: 500, avg_view_percentage: 40, site_clicks: 5 }, C: { views: 500, avg_view_percentage: 90, site_clicks: 20 } } };
    test.videos.v11 = { ...empty(), views: 200, shorts: { A: { views: 100, avg_view_percentage: 70, site_clicks: 0 }, B: { views: null, avg_view_percentage: 99, site_clicks: 9 }, C: { views: 100, avg_view_percentage: 10, site_clicks: 0 } } };
    const r = compute(test);
    const v13 = r.suites.find((s) => s.id === "v13");
    if (v13.hook_rate !== 80) fail("hook rate must be the 30 second retention");
    if (v13.retention_dropoff !== 55) fail("retention drop-off must be 100 minus the average viewed");
    if (v13.traffic_redirection !== 3) fail("traffic redirection must be clicks divided by views");
    if (v13.top_short?.clip !== "C") fail("the top short for v13 must be clip C");
    if (r.pairs[0].video !== "v13") fail("the best pair must come first");
    const v11 = r.suites.find((s) => s.id === "v11");
    if (v11.top_short?.clip !== "A") fail("a clip with no views must be ignored");
    const scores = r.pairs.map((p) => p.short?.score ?? -1);
    if (scores.join() !== [...scores].sort((a, b) => b - a).join()) fail("pairs must be sorted from highest to lowest");
    const v8 = r.suites[0];
    if (v8.id !== "v8") fail("video 8 must come first in the tracker");
    if (r.suites.some((s) => s.shorts_note)) fail("every video uses its own shorts");
    if (JSON.stringify(r).includes(String.fromCharCode(0x2014))) fail("a long dash is in the output");
    if (errors.length) { console.error(`FAIL: ${errors.length} problem(s)`); errors.forEach((e) => console.error("  - " + e)); process.exit(1); }
    console.log("OK: the insights script is valid");
    console.log("    an empty log shows no numbers, hook rate, drop-off and redirection are worked out correctly,");
    console.log("    each video pairs with its top short, and the pairs sort from highest to lowest engagement");
  } else { console.error("use --template, --capture or --check"); process.exit(2); }
}
