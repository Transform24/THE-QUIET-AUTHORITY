// Shared timing rules for the Psalm 91 video. Used by the video, the Root and the validator.
export const FPS = 30;
export const LEAD_FRAMES = 18; // badge fades in before the words begin
export const HOLD_FRAMES = 90; // the finished verse rests for 3 seconds
export const FADE_OUT_FRAMES = 15;

// reveal_speed_ms is the pause between each letter appearing.
export const typingFrames = (verse, fps = FPS) => {
  const letters = verse.line_1.length + verse.line_2.length;
  return Math.ceil(((letters * verse.reveal_speed_ms) / 1000) * fps);
};

export const verseFrames = (verse, fps = FPS) =>
  LEAD_FRAMES + typingFrames(verse, fps) + HOLD_FRAMES;

export const totalFrames = (verses, fps = FPS) =>
  verses.reduce((sum, verse) => sum + verseFrames(verse, fps), 0);
