// Shared timing for the scripture reveal. Words appear one at a time at a slow, reflective pace.
// This file is identical in content-ops/04_youtube/remotion and circle-of-silence/remotion.
// scripts/check-remotion-sync.mjs fails the build if the two copies ever differ.
export const FPS = 30;
export const LEAD_FRAMES = 18; // the badge fades in before the first word
export const HOLD_FRAMES = 90; // the finished verse rests for 3 seconds
export const FADE_OUT_FRAMES = 15;
export const WORD_FADE_FRAMES = 14; // each word fades in gently, it never pops

// Pace. A word stays alone for at least MIN_WORD_MS. Longer words get reveal_speed_ms per letter.
// Punctuation adds a breath. This lands near 100 words a minute, a calm reflective reading speed.
export const MIN_WORD_MS = 420;
export const LINE_BREAK_PAUSE_MS = 300;
export const PAUSE_MS = { ",": 260, ";": 320, ":": 340, ".": 520, "!": 520, "?": 520 };

export const wordsOf = (line) => line.split(/\s+/).filter(Boolean);

const intervalMs = (word, letterMs) => {
  const letters = word.replace(/[^A-Za-z']/g, "").length;
  return Math.max(MIN_WORD_MS, letters * letterMs);
};

// Returns every word with the frame it starts to appear, and the frame when all words are visible.
export const schedule = (verse, fps = FPS) => {
  const words = [];
  let ms = (LEAD_FRAMES / fps) * 1000;
  const lines = [verse.line_1, verse.line_2];
  lines.forEach((line, lineIndex) => {
    const list = wordsOf(line);
    list.forEach((text, i) => {
      words.push({ text, line: lineIndex, start: Math.round((ms / 1000) * fps) });
      const last = text[text.length - 1];
      let pause = PAUSE_MS[last] || 0;
      if (i === list.length - 1 && lineIndex === 0 && pause === 0) pause = LINE_BREAK_PAUSE_MS;
      ms += intervalMs(text, verse.reveal_speed_ms) + pause;
    });
  });
  const lastStart = words[words.length - 1].start;
  return { words, revealEndFrame: lastStart + WORD_FADE_FRAMES, readingMs: ms - (LEAD_FRAMES / fps) * 1000 };
};

export const verseFrames = (verse, fps = FPS) => schedule(verse, fps).revealEndFrame + HOLD_FRAMES;

export const totalFrames = (verses, fps = FPS) =>
  verses.reduce((sum, verse) => sum + verseFrames(verse, fps), 0);

// Words per minute while the words are appearing. Used for reporting only.
export const wordsPerMinute = (verse, fps = FPS) => {
  const { words, readingMs } = schedule(verse, fps);
  return Math.round((words.length / readingMs) * 60000);
};
