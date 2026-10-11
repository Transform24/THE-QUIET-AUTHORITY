// The Quiet Authority, The Posture of Prayer. One 8 minute timeline (11,520 frames at 24 per second).
// Every word, frame number and position comes from src/data/tqa-prayer-posture.json.
// Headers are Cinzel, all body text is Jost. Every text box is held to 780 pixels or less.
// Only the brand colors are used here. scripts/validate-tqa-prayer-posture.mjs checks all of this.
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import blueprint from "./data/tqa-prayer-posture.json";
import spotlightCandle from "./assets/tqa/light-stream-plate.jpg";
import characterSpotlight from "./assets/tqa/character-spotlight-plate.jpg";
import musicTrack from "./assets/tqa/tqa-music-v8-extended.m4a";

const { colors, layout, music, background, plates } = blueprint;
const IMAGES = { spotlight_candle: spotlightCandle, character_spotlight: characterSpotlight };
const MAX_W = layout.text_max_width_px; // 780, the mobile safe column
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const ease = (f, a, b) => interpolate(f, [a, b], [0, 1], clamp);

const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400&family=Jost:wght@300;400&display=swap";
const useBrandFonts = () => {
  const [handle] = useState(() => delayRender("brand fonts", { timeoutInMilliseconds: 60000 }));
  useEffect(() => {
    const finish = () => continueRender(handle);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_CSS;
    link.onload = () =>
      Promise.all([document.fonts.load('400 40px "Cinzel"'), document.fonts.load('300 40px "Jost"')]).then(finish, finish);
    link.onerror = finish;
    document.head.appendChild(link);
  }, [handle]);
};

// A box that never grows past the safe column. The column sits beside the picture, never on the figure.
const box = (centerX, top, extra = {}, width = MAX_W) => ({
  position: "absolute",
  left: centerX - width / 2,
  top,
  width: Math.min(width, MAX_W),
  maxWidth: MAX_W,
  boxSizing: "border-box",
  textAlign: "center",
  ...extra,
});
const header = (size, spacing, color) => ({
  fontFamily: "'Cinzel', serif",
  fontWeight: 400,
  fontSize: size,
  letterSpacing: spacing,
  color: colors[color],
  textShadow: `0 2px 14px ${colors.black}`,
});
const body = (size, extra = {}) => ({
  fontFamily: "'Jost', sans-serif",
  fontWeight: 300,
  fontSize: size,
  lineHeight: 1.45,
  color: colors.cream,
  textShadow: `0 2px 14px ${colors.black}`,
  ...extra,
});

// Typing. The letters not yet typed keep their space, so nothing jumps while it types.
const Typed = ({ text, frame, start, cps, fps, style }) => {
  const count = Math.max(0, Math.min(text.length, Math.floor(((frame - start) / fps) * cps)));
  return (
    <div style={style}>
      <span>{text.slice(0, count)}</span>
      <span style={{ visibility: "hidden" }}>{text.slice(count)}</span>
    </div>
  );
};

const Scripture = ({ frame, block, centerX, fadeStart, fadeFrames }) => {
  const o = ease(frame, fadeStart, fadeStart + fadeFrames);
  return (
    <div style={{ opacity: o }}>
      <div style={box(centerX, layout.scripture_ref_y, header(30, "0.3em", "gold"), widthOf(block))}>{block.scripture.ref}</div>
      <div style={box(centerX, block.scripture_y, body(40, { lineHeight: 1.38 }), widthOf(block))}>{block.scripture.text}</div>
    </div>
  );
};

const centerOf = (block) => plates[block.plate].column_center_x;
const widthOf = (block) => plates[block.plate].column_width_px;

const Intro = ({ block }) => {
  const frame = useCurrentFrame();
  const total = block.end_frame - block.start_frame;
  // One fade in, then it rests. No second appearance, no repeated line.
  const o = Math.min(
    ease(frame, block.fade_in_start, block.fade_in_start + block.fade_in_frames),
    1 - ease(frame, total - block.fade_out_frames, total)
  );
  return (
    <div style={{ opacity: o }}>
      <div style={box(layout.intro_center_x, layout.intro_y, { display: "flex", flexDirection: "column", alignItems: "center", gap: 22 })}>
        {block.lines.map((l) => (
          <div key={l.text} style={{ ...header(l.size_px, l.letter_spacing_px, l.color), whiteSpace: "nowrap" }}>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
};

const ScriptureThenReflection = ({ block }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = block.end_frame - block.start_frame;
  const x = centerOf(block);
  const s = block.scripture;
  const r = block.reflection;
  const inn = ease(frame, 0, block.fade_in_frames);
  const out = 1 - ease(frame, total - block.fade_out_frames, total);
  // In block 3 the scripture carries straight into the outro; only the reflection fades away.
  const scriptureOpacity = block.keep_scripture_through_end ? inn : Math.min(inn, out);
  return (
    <div>
      <div style={{ opacity: scriptureOpacity }}>
        <Scripture frame={frame} block={block} centerX={x} fadeStart={s.fade_in_start} fadeFrames={s.fade_in_frames} />
      </div>
      <div style={{ opacity: Math.min(inn, out) }}>
        <Typed text={r.text} frame={frame} start={r.type_start} cps={r.chars_per_second} fps={fps} style={box(x, block.reflection_y, body(32), widthOf(block))} />
      </div>
    </div>
  );
};

// The closing section. Matthew 6:9 stays; the prayer settles in the lower third, a few lines at a time.
const Outro = ({ block, verseBlock }) => {
  const frame = useCurrentFrame();
  const total = block.end_frame - block.start_frame;
  const p = block.prayer;
  const x = p.crossfade_frames;
  const cx = centerOf(block);
  return (
    <div>
      <Scripture frame={frame} block={verseBlock} centerX={cx} fadeStart={-100} fadeFrames={1} />
      <div style={{ opacity: 1 - ease(frame, total - block.fade_out_frames, total) }}>
        {p.groups.map((g, i) => {
          const inn = ease(frame, g.start, g.start + x);
          const out = i < p.groups.length - 1 ? 1 - ease(frame, g.end - x, g.end) : 1;
          return (
            <div key={i} style={box(cx, layout.prayer_lower_third_y, body(32, { opacity: Math.min(inn, out), lineHeight: 1.5 }), widthOf(block))}>
              {g.text}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Music = () => {
  const { durationInFrames } = useVideoConfig();
  const volume = (f) =>
    Math.min(
      interpolate(f, [0, music.fade_in_frames], [0, music.volume], clamp),
      interpolate(f, [durationInFrames - music.fade_out_frames, durationInFrames], [music.volume, 0], clamp)
    );
  return <Audio src={musicTrack} volume={volume} />;
};

// The pictures, held steady. Each block shows its own picture; they dissolve into each other at the block edges.
// The first one comes up from black at the start, and everything goes back to black at the end.
const Backdrop = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const up = ease(frame, 0, background.fade_from_black_frames);
  const down = 1 - ease(frame, durationInFrames - background.fade_to_black_frames, durationInFrames);
  return (
    <AbsoluteFill>
      {Object.keys(plates).map((name) => {
        const pts = blueprint.timeline.flatMap((b) => {
          const v = b.plate === name ? b.background_level : 0;
          return [[b.start_frame + 12, v], [b.end_frame - 12, v]];
        });
        const o = interpolate(frame, pts.map((q) => q[0]), pts.map((q) => q[1]), clamp);
        return (
          <AbsoluteFill key={name} style={{ opacity: Math.min(up, down) * o }}>
            <Img src={IMAGES[name]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

export const TQAPrayerPostureComposition = () => {
  useBrandFonts();
  const verseBlock = blueprint.timeline.find((b) => b.id === "block3");
  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <Music />
      <Backdrop />
      {blueprint.timeline.map((b) => (
        <Sequence key={b.id} from={b.start_frame} durationInFrames={b.end_frame - b.start_frame} layout="none">
          <AbsoluteFill>
            {b.type === "intro" && <Intro block={b} />}
            {b.type === "scripture_then_reflection" && <ScriptureThenReflection block={b} />}
            {b.type === "outro" && <Outro block={b} verseBlock={verseBlock} />}
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
