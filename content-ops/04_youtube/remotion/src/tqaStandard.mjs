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
  hold_after_closing_scripture_frames: 192, // Romans 10:9-10 rests 8 seconds, then the prayer has its own page
  total_frames: 11520, // every TQA video is exactly 8 minutes (YouTube standard)
  min_thanks_frames: 288, // the thank you page is never shorter than 12 seconds
  prayer_frames: 2712, // 1 minute 53 seconds
  prayer_crossfade_frames: 48,
  prayer_group_max_letters: 190,
  prayer_group_base_weight: 80,
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

// Optional line-by-line push for a prayer given as separate beats (a layout exception allowed for one video, see the checker).
// Each beat is broken into short lines. The lines arrive one at a time and push the earlier ones upward.
export const PUSH = Object.freeze({ max_chars_per_line: 36, first_line_frame: 48, rest_at_end_frames: 288, beat_gap_slots: 0.6 });
export const pushPlan = (beats, windowFrames = RULES.prayer_frames) => {
  const lines = [];
  beats.forEach((beat, b) => {
    // Balance the lines: as few lines as a plain wrap, and no lonely last word.
    const ws = wordsOf(beat);
    const wrap = (limit) => {
      const out = [];
      let cur = "";
      for (const w of ws) {
        if (cur && cur.length + 1 + w.length > limit) { out.push(cur); cur = w; } else cur = cur ? `${cur} ${w}` : w;
      }
      out.push(cur);
      return out;
    };
    const total = ws.join(" ").length;
    const n = wrap(PUSH.max_chars_per_line).length;
    let best = wrap(PUSH.max_chars_per_line);
    for (let limit = Math.max(Math.ceil(total / n), ...ws.map((w) => w.length)); limit <= PUSH.max_chars_per_line; limit++) {
      const t = wrap(limit);
      if (t.length === n && t[n - 1].length >= limit * 0.5) { best = t; break; }
    }
    for (const text of best) lines.push({ text, beat: b, first: false });
    lines[lines.length - lines.filter((l) => l.beat === b).length].first = true;
  });
  let slot = 0;
  let before = 0;
  lines.forEach((l, i) => {
    l.advance = 1 + (l.first && i > 0 ? PUSH.beat_gap_slots : 0);
    slot += l.advance;
    l.slot = slot;
    l.before = before;
    before += l.text.length + 10 + (l.first ? 30 : 0);
  });
  const last = lines[lines.length - 1];
  const span = windowFrames - PUSH.rest_at_end_frames - PUSH.first_line_frame;
  lines.forEach((l) => { l.start = PUSH.first_line_frame + Math.round((l.before / last.before) * span); });
  return lines;
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
    push({
      id: "closing", type: "closing", plate: c.plate, background_level: c.background_level,
      block: c, reveal: sc, frames: sc.visible + RULES.hold_after_closing_scripture_frames,
    });
    push({
      id: "prayer", type: "prayer", plate: c.plate, background_level: c.background_level,
      block: c, groups: prayerGroups(c.prayer), push: c.prayer_beats ? pushPlan(c.prayer_beats) : null, frames: RULES.prayer_frames,
    });
  }
  // The thank you page takes whatever time is left, so every video is exactly 8 minutes.
  const thanks_frames = RULES.total_frames - at;
  push({ id: "thanks", type: "thanks", plate: bp.closing.plate, frames: thanks_frames, background_level: 0.45 });
  return { items, total_frames: at };
};
