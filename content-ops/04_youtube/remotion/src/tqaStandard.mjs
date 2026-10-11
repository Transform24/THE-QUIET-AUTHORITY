// The Quiet Authority video standard. One set of pace rules, used by every TQA video.
// A new video changes only the words in its blueprint (scriptures, reflections, prayer). It never changes these rules.
// The layout file and the checker both read the timeline from here, so the picture and the checks cannot drift apart.
export const FPS = 24;

export const RULES = Object.freeze({
  intro_frames: 360, // 15 seconds
  block_fade_in_frames: 24, // scenes dissolve in 1 second, so the change between verses is short
  block_fade_out_frames: 24,
  scripture_words_per_minute: 80, // slow and reflective, one word at a time
  word_fade_frames: 14,
  pause_after_scripture_frames: 96, // 4 seconds of quiet before the reflection begins
  reflection_letters_per_second: 4.5, // the reflection types slowly
  hold_after_reflection_frames: 192, // 8 seconds, the last 1 second is the fade out
  pause_after_closing_scripture_frames: 96, // 4 seconds, then the prayer begins
  prayer_frames: 2712, // 1 minute 53 seconds
  prayer_crossfade_frames: 48,
  prayer_group_max_letters: 190,
  prayer_group_base_weight: 80,
  thanks_frames: 288, // 12 seconds
  thanks_fade_in_frames: 24,
  music_fade_in_frames: 48,
  music_fade_out_frames: 192,
  picture_fade_in_frames: 72,
  picture_fade_out_frames: 192,
});

const PAUSE = { ",": 6, ";": 8, ":": 8, ".": 14, "?": 14, "!": 14 };
export const wordsOf = (t) => t.split(/\s+/).filter(Boolean);

// Each word of a scripture appears on its own beat. Commas and full stops add a breath.
export const scriptureReveal = (text, lead = RULES.block_fade_in_frames) => {
  const per = Math.round((60 / RULES.scripture_words_per_minute) * FPS);
  const words = [];
  let f = lead;
  for (const w of wordsOf(text)) {
    words.push({ text: w, start: f });
    f += per + (PAUSE[w[w.length - 1]] || 0);
  }
  const visible = words[words.length - 1].start + RULES.word_fade_frames;
  return { words, visible };
};

export const typeFrames = (text, cps = RULES.reflection_letters_per_second) => Math.ceil((text.length * FPS) / cps);

// The prayer is split at sentence ends into groups that fit the lower third, then timed by length.
export const prayerGroups = (prayer, windowFrames = RULES.prayer_frames) => {
  const sentences = prayer.split(/(?<=[.!?])\s+/);
  const texts = [];
  for (const s of sentences) {
    const last = texts[texts.length - 1];
    if (last !== undefined && last.length + 1 + s.length <= RULES.prayer_group_max_letters) texts[texts.length - 1] = `${last} ${s}`;
    else texts.push(s);
  }
  // Never leave a short orphan line alone at the end: fold it into the group before it.
  if (texts.length > 1 && texts[texts.length - 1].length < 60) {
    const tail = texts.pop();
    texts[texts.length - 1] = `${texts[texts.length - 1]} ${tail}`;
  }
  const weights = texts.map((t) => t.length + RULES.prayer_group_base_weight);
  const total = weights.reduce((a, b) => a + b, 0);
  let start = 0;
  return texts.map((text, i) => {
    const end = i === texts.length - 1 ? windowFrames : start + Math.round((weights[i] / total) * windowFrames);
    const g = { text, start, end };
    start = end;
    return g;
  });
};

// The whole timeline, in frames, from the blueprint's words.
export const buildTimeline = (bp) => {
  const items = [];
  let at = 0;
  const push = (item) => {
    item.start_frame = at;
    item.end_frame = at + item.frames;
    at = item.end_frame;
    items.push(item);
  };
  push({ id: "intro", type: "intro", plate: bp.intro.plate, frames: RULES.intro_frames, background_level: 0.9 });
  bp.teaching_blocks.forEach((b, i) => {
    const sc = scriptureReveal(b.scripture.text);
    const type_start = sc.visible + RULES.pause_after_scripture_frames;
    const type_frames = typeFrames(b.reflection);
    const type_end = type_start + type_frames;
    push({
      id: `block${i + 1}`, type: "teaching", plate: b.plate, background_level: b.background_level,
      block: b, reveal: sc, type_start, type_frames, type_end,
      frames: type_end + RULES.hold_after_reflection_frames,
    });
  });
  {
    const c = bp.closing;
    const sc = scriptureReveal(c.scripture.text);
    const prayer_start = sc.visible + RULES.pause_after_closing_scripture_frames;
    push({
      id: "closing", type: "closing", plate: c.plate, background_level: c.background_level,
      block: c, reveal: sc, prayer_start, groups: prayerGroups(c.prayer),
      frames: prayer_start + RULES.prayer_frames,
    });
  }
  push({ id: "thanks", type: "thanks", plate: bp.closing.plate, frames: RULES.thanks_frames, background_level: 0.45 });
  return { items, total_frames: at };
};
