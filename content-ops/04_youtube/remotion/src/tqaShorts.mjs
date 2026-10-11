// The Quiet Authority Shorts standard. Three 60 second vertical cuts (1080 by 1920) from each 8 minute video.
// The words always come from the video's own data file. The pace is quicker than the long video, because a short is read on a phone.
import { FPS, wordsOf, prayerGroups, pushPlan, buildTimeline } from "./tqaStandard.mjs";

export const SHORT = Object.freeze({
  frames: 1440, // 60 seconds at 24 per second
  width: 1080,
  height: 1920,
  words_per_minute: 105, // scripture reveal
  word_fade_frames: 12,
  lead_frames: 18,
  pause_frames: 72, // 3 seconds of quiet after the scripture
  min_cps: 5,
  max_cps: 14, // reflection typing, fitted to the time left
  endcard_frames: 144, // the last 6 seconds: where to watch the full video
  fade_in_frames: 18,
  fade_out_frames: 24,
  text_width_px: 780,
  safe_top_px: 180, // phone apps cover the top and bottom of a short
  safe_bottom_px: 1500,
});

export const CLIPS = Object.freeze({
  A: { name: "Verse One", what: "the first scripture, revealed word by word, with its reflection" },
  B: { name: "Mid-way Reflection", what: "the middle scripture with its reflection" },
  C: { name: "The Outro Prayer Push", what: "the prayer, arriving one line at a time" },
});

const revealWords = (text) => {
  const per = Math.round((60 / SHORT.words_per_minute) * FPS);
  const pause = { ",": 4, ";": 6, ":": 6, ".": 10, "?": 10, "!": 10 };
  let f = SHORT.lead_frames;
  const words = wordsOf(text).map((w) => {
    const item = { text: w, start: f };
    f += per + (pause[w[w.length - 1]] || 0);
    return item;
  });
  return { words, visible: words[words.length - 1].start + SHORT.word_fade_frames };
};

// Plan one clip from a video's blueprint. Returns everything the layout needs, in frames.
export const planClip = (bp, clip) => {
  const tl = buildTimeline(bp);
  const teaching = tl.items.filter((i) => i.type === "teaching");
  const contentEnd = SHORT.frames - SHORT.endcard_frames;
  if (clip === "A" || clip === "B") {
    const item = clip === "A" ? teaching[0] : teaching[Math.floor(teaching.length / 2)];
    const b = item.block;
    const reveal = revealWords(b.scripture.text);
    const typeStart = reveal.visible + SHORT.pause_frames;
    const window = contentEnd - 72 - typeStart; // leave 3 seconds to rest before the end card
    const cps = Math.min(SHORT.max_cps, Math.max(SHORT.min_cps, (b.reflection.length * FPS) / Math.max(window, 1)));
    const typeFrames = Math.ceil((b.reflection.length * FPS) / cps);
    return { clip, kind: "verse", plate: item.plate, background_level: 0.5, scripture: b.scripture, reveal, reflection: b.reflection, type_start: typeStart, type_end: typeStart + typeFrames, cps, content_end: contentEnd, fits: typeStart + typeFrames <= contentEnd };
  }
  const closing = bp.closing;
  const beats = closing.prayer_beats || prayerGroups(closing.prayer).map((g) => g.text);
  const lines = pushPlan(beats, contentEnd);
  return { clip, kind: "prayer", plate: closing.plate, background_level: 0.5, beats, lines, content_end: contentEnd, fits: lines.at(-1).start < contentEnd - 96 };
};
