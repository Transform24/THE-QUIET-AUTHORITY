// The Quiet Authority, Pattern of Waiting. One 8 minute timeline (11,520 frames at 24 per second).
// Every word, frame number and position comes from src/data/tqa-pattern-blueprint.json.
// Headers are Cinzel, all body text is Jost. Every text box is held to 780 pixels or less.
// Only the brand colors are used here. scripts/validate-tqa-pattern.mjs checks all of this.
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
import blueprint from "./data/tqa-pattern-blueprint.json";
import plate from "./assets/tqa/light-stream-plate.jpg";
import musicTrack from "./assets/tqa/tqa-music-v8-extended.m4a";

const { colors, layout, music, background } = blueprint;
const MAX_W = layout.text_max_width_px; // 780, the mobile safe column
const LEFT = layout.column_center_x - MAX_W / 2;
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

// A box that never grows past the safe column.
const box = (top, extra = {}) => ({
  position: "absolute",
  left: LEFT,
  top,
  width: MAX_W,
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

const Scripture = ({ frame, ref_, text, fadeStart, fadeFrames, refY, textY, refSize = 30, textSize = 44 }) => {
  const o = ease(frame, fadeStart, fadeStart + fadeFrames);
  return (
    <div style={{ opacity: o }}>
      <div style={box(refY, header(refSize, "0.3em", "gold"))}>{ref_}</div>
      <div style={box(textY, body(textSize, { lineHeight: 1.4 }))}>{text}</div>
    </div>
  );
};

// A block fades in at its start and out at its end, so one scene dissolves into the next.
const useBlockOpacity = (block, total) => {
  const frame = useCurrentFrame();
  const a = block.fade_in_frames ? ease(frame, 0, block.fade_in_frames) : 1;
  const b = block.fade_out_frames ? 1 - ease(frame, total - block.fade_out_frames, total) : 1;
  return Math.min(a, b);
};

const Intro = ({ block }) => {
  const frame = useCurrentFrame();
  const total = block.end_frame - block.start_frame;
  // One fade in, then it rests. No second appearance, no repeated line.
  const o = Math.min(ease(frame, block.fade_in_start, block.fade_in_start + block.fade_in_frames), 1 - ease(frame, total - block.fade_out_frames, total));
  return (
    <div style={{ opacity: o }}>
      <div style={box(layout.intro_y, { display: "flex", flexDirection: "column", alignItems: "center", gap: 22 })}>
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
  const s = block.scripture;
  const r = block.reflection;
  return (
    <div style={{ opacity: useBlockOpacity(block, total) }}>
      <Scripture frame={frame} ref_={s.ref} text={s.text} fadeStart={s.fade_in_start} fadeFrames={s.fade_in_frames} refY={layout.scripture_ref_y} textY={layout.scripture_y} />
      <Typed text={r.text} frame={frame} start={r.type_start} cps={r.chars_per_second} fps={fps} style={box(layout.reflection_y, body(32))} />
    </div>
  );
};

const TransitionThenScripture = ({ block }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = block.end_frame - block.start_frame;
  const t = block.transition;
  const s = block.scripture;
  return (
    <div>
      <div style={{ opacity: useBlockOpacity(block, total) }}>
        <Typed text={t.text} frame={frame} start={t.type_start} cps={t.chars_per_second} fps={fps} style={box(layout.transition_y, body(34))} />
      </div>
      <Scripture frame={frame} ref_={s.ref} text={s.text} fadeStart={s.fade_in_start} fadeFrames={s.fade_in_frames} refY={layout.scripture3_ref_y} textY={layout.scripture3_y} />
    </div>
  );
};

// The closing section. Psalm 91:1 stays; the prayer settles in the lower third, a few lines at a time.
const Outro = ({ block, verse }) => {
  const frame = useCurrentFrame();
  const total = block.end_frame - block.start_frame;
  const p = block.prayer;
  const x = p.crossfade_frames;
  return (
    <div>
      <Scripture frame={frame} ref_={verse.ref} text={verse.text} fadeStart={-100} fadeFrames={1} refY={layout.scripture3_ref_y} textY={layout.scripture3_y} />
      <div style={{ opacity: 1 - ease(frame, total - block.fade_out_frames, total) }}>
        <div style={box(layout.prayer_lower_third_y - 70, { opacity: ease(frame, p.groups[0].start, p.groups[0].start + x) * 0.9, ...header(26, "0.35em", "gold") })}>
          {p.heading}
        </div>
        {p.groups.map((g, i) => {
          const inn = ease(frame, g.start, g.start + x);
          const out = i < p.groups.length - 1 ? 1 - ease(frame, g.end - x, g.end) : 1;
          return (
            <div key={i} style={box(layout.prayer_lower_third_y, body(32, { opacity: Math.min(inn, out), lineHeight: 1.5 }))}>
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

// The light stream, held steady. It comes up from black at the start and goes back to black at the end.
const Backdrop = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const up = ease(frame, 0, background.fade_from_black_frames);
  const down = 1 - ease(frame, durationInFrames - background.fade_to_black_frames, durationInFrames);
  // Quieter behind the reading blocks so the words come first.
  const dims = blueprint.timeline.flatMap((b) => [
    [b.start_frame + 12, b.background_level],
    [b.end_frame - 12, b.background_level],
  ]);
  const level = interpolate(frame, dims.map((d) => d[0]), dims.map((d) => d[1]), clamp);
  return (
    <AbsoluteFill style={{ opacity: Math.min(up, down) * level }}>
      <Img src={plate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
};

export const TQAPatternComposition = () => {
  useBrandFonts();
  const outro = blueprint.timeline.find((b) => b.type === "outro");
  const verse = blueprint.timeline.find((b) => b.id === "block3").scripture;
  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <Music />
      <Backdrop />
      {blueprint.timeline.map((b) => (
        <Sequence key={b.id} from={b.start_frame} durationInFrames={b.end_frame - b.start_frame} layout="none">
          <AbsoluteFill>
            {b.type === "intro" && <Intro block={b} />}
            {b.type === "scripture_then_reflection" && <ScriptureThenReflection block={b} />}
            {b.type === "transition_then_scripture" && <TransitionThenScripture block={b} />}
            {b.type === "outro" && <Outro block={outro} verse={verse} />}
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
