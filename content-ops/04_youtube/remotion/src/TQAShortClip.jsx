// The Quiet Authority Shorts layout: one 60 second vertical clip (1080 by 1920) cut from a finished video.
// Which video and which clip (A, B or C) arrive as props. The words come from that video's data file.
// Headers are Cinzel, all body text is Jost. Every text box is held to 780 pixels or less, inside the phone safe zone.
// The picture is centered on the candle or the seated woman. Only the brand colors are used here.
import { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Img, continueRender, delayRender, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import v8 from "./data/TQA_Stillness_Journey_FINAL_v8.json";
import v9 from "./data/TQA_Stillness_Journey_FINAL_v9.json";
import v10 from "./data/TQA_Stillness_Journey_FINAL_v10.json";
import v11 from "./data/TQA_Stillness_Journey_FINAL_v11.json";
import v12 from "./data/TQA_Stillness_Journey_FINAL_v12.json";
import v13 from "./data/TQA_Stillness_Journey_FINAL_v13.json";
import { SHORT, planClip } from "./tqaShorts.mjs";
import spotlightCandle from "./assets/tqa/light-stream-plate.jpg";
import characterSpotlight from "./assets/tqa/character-spotlight-plate.jpg";
import musicTrack from "./assets/tqa/tqa-music-v8-extended.m4a";

export const SHORT_SOURCES = { v8, v9, v10, v11, v12, v13 };
const IMAGES = { spotlight_candle: spotlightCandle, character_spotlight: characterSpotlight };
// Where the candle and the seated woman sit in each picture (percent from the left), so the crop keeps them in the middle.
const FOCUS = { spotlight_candle: "66% 50%", character_spotlight: "52% 50%" };
const MAX_W = SHORT.text_width_px; // 780
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const ease = (f, a, b) => interpolate(f, [a, b], [0, 1], clamp);

const FONT_CSS = "https://fonts.googleapis.com/css2?family=Cinzel:wght@400&family=Jost:wght@300;400&display=swap";
const useBrandFonts = () => {
  const [handle] = useState(() => delayRender("brand fonts", { timeoutInMilliseconds: 60000 }));
  useEffect(() => {
    const finish = () => continueRender(handle);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_CSS;
    link.onload = () => Promise.all([document.fonts.load('400 40px "Cinzel"'), document.fonts.load('300 40px "Jost"')]).then(finish, finish);
    link.onerror = finish;
    document.head.appendChild(link);
  }, [handle]);
};

const box = (top, extra = {}) => ({
  position: "absolute",
  left: (SHORT.width - MAX_W) / 2,
  top,
  width: MAX_W,
  maxWidth: MAX_W,
  boxSizing: "border-box",
  textAlign: "center",
  ...extra,
});
const header = (size, spacing, color, colors) => ({ fontFamily: "'Cinzel', serif", fontWeight: 400, fontSize: size, letterSpacing: spacing, color: colors[color], textShadow: `0 2px 14px ${colors.black}` });
const body = (size, colors, extra = {}) => ({ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: size, lineHeight: 1.45, color: colors.cream, textShadow: `0 2px 14px ${colors.black}`, ...extra });

const Verse = ({ plan, colors }) => {
  const frame = SHORT_FRAME();
  const count = Math.max(0, Math.min(plan.reflection.length, Math.floor(((frame - plan.type_start) / 24) * plan.cps)));
  return (
    <div>
      <div style={box(SHORT.safe_top_px + 60, header(38, "0.3em", "gold", colors))}>{plan.scripture.ref}</div>
      <div style={box(SHORT.safe_top_px + 150, body(plan.compact ? 42 : 50, colors, { lineHeight: 1.38 }))}>
        {plan.reveal.words.map((w, i) => (
          <span key={i} style={{ opacity: ease(frame, w.start, w.start + SHORT.word_fade_frames) }}>
            {w.text}
            {i < plan.reveal.words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
      <div style={box(1010, body(38, colors))}>
        <span>{plan.reflection.slice(0, count)}</span>
        <span style={{ visibility: "hidden" }}>{plan.reflection.slice(count)}</span>
      </div>
    </div>
  );
};

const SHORT_FRAME = () => useCurrentFrame();

// The prayer arrives one line at a time. Each new line springs up from below and pushes the earlier lines upward.
const Prayer = ({ plan, colors }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineH = 62;
  const bottomY = 1400;
  const topY = 330;
  const grow = plan.lines.map((l) => spring({ frame: frame - l.start, fps, durationInFrames: 30, config: { damping: 200 } }));
  const moved = plan.lines.reduce((sum, l, i) => sum + grow[i] * l.advance, 0);
  return (
    <div>
      <div style={box(SHORT.safe_top_px + 60, header(38, "0.3em", "gold", colors))}>A PRAYER</div>
      {plan.lines.map((l, i) => {
        const y = bottomY - (moved - l.slot) * lineH;
        const top = ease(y, topY, topY + 140);
        return (
          <div key={i} style={box(y, body(42, colors, { opacity: grow[i] * top, whiteSpace: "nowrap" }))}>
            {l.text}
          </div>
        );
      })}
    </div>
  );
};

const EndCard = ({ colors, copy }) => {
  const frame = useCurrentFrame();
  const start = SHORT.frames - SHORT.endcard_frames;
  const at = (i) => ease(frame, start + 6 + i * 30, start + 30 + i * 30);
  return (
    <div>
      <div style={box(820, { display: "flex", flexDirection: "column", alignItems: "center", gap: 30 })}>
        <div style={{ ...header(52, "0.08em", "gold", colors), whiteSpace: "nowrap", opacity: at(0) }}>The Quiet Authority</div>
        <div style={body(40, colors, { opacity: at(1) })}>{copy.watch}</div>
        <div style={{ ...header(34, "0.2em", "gold", colors), opacity: at(2) }}>sanctuary-grace.com</div>
      </div>
    </div>
  );
};

export const TQAShortClip = ({ video = "v12", clip = "A" }) => {
  useBrandFonts();
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const bp = SHORT_SOURCES[video];
  const colors = bp.colors;
  const plan = planClip(bp, clip);
  const endStart = SHORT.frames - SHORT.endcard_frames;
  const content = Math.min(ease(frame, 0, SHORT.fade_in_frames), 1 - ease(frame, endStart - 24, endStart));
  const fadeOut = 1 - ease(frame, durationInFrames - SHORT.fade_out_frames, durationInFrames);
  const volume = (f) => Math.min(ease(f, 0, 36), 1 - ease(f, durationInFrames - 72, durationInFrames));
  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <Audio src={musicTrack} volume={volume} />
      <AbsoluteFill style={{ opacity: Math.min(ease(frame, 0, 36), fadeOut) * plan.background_level }}>
        <Img src={IMAGES[plan.plate]} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: FOCUS[plan.plate] }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: Math.min(content, fadeOut) }}>{plan.kind === "verse" ? <Verse plan={plan} colors={colors} /> : <Prayer plan={plan} colors={colors} />}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: Math.min(ease(frame, endStart, endStart + 18), fadeOut) }}>
        <EndCard colors={colors} copy={{ watch: "Watch the full video on YouTube" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
