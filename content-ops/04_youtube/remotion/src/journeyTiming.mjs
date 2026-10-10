// Timing for the long journey, kept free of React so the checker can use it too.
import { LEAD_FRAMES, MIN_WORD_MS, PAUSE_MS, WORD_FADE_FRAMES, wordsOf } from "./revealTiming.mjs";

export const INTRO_FRAMES = 450; // 15 seconds
export const VERSE_REST_FRAMES = 120; // 4 seconds of quiet after every verse
export const PRAYER_REST_FRAMES = 120; // 4 seconds of quiet after the Amen

// The prayer is one flowing paragraph. Same pace rules as the verses.
export const schedulePrayerText = (prayer, fps = 30) => {
  const words = [];
  let ms = (LEAD_FRAMES / fps) * 1000;
  for (const text of wordsOf(prayer.text)) {
    words.push({ text, start: Math.round((ms / 1000) * fps) });
    const letters = text.replace(/[^A-Za-z']/g, "").length;
    ms += Math.max(MIN_WORD_MS, letters * prayer.reveal_speed_ms) + (PAUSE_MS[text[text.length - 1]] || 0);
  }
  const readingMs = ms - (LEAD_FRAMES / fps) * 1000;
  return { words, revealEndFrame: words[words.length - 1].start + WORD_FADE_FRAMES, readingMs };
};
