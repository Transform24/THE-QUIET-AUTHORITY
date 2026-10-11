// The Quiet Authority video standard (version 2). Used for every TQA teaching video.
// Every word comes from the blueprint JSON. Every pace rule and frame number comes from src/tqaStandard.mjs.
// Order: intro, teaching blocks, closing scripture with the prayer, thank you page.
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
import blueprint from "./data/TQA_Stillness_Journey_FINAL_v10.json";
import { RULES, buildTimeline, wordsOf } from "./tqaStandard.mjs";
import spotlightCandle from "./assets/tqa/light-stream-plate.jpg";
import characterSpotlight from "./assets/tqa/character-spotlight-plate.jpg";
import musicTrack from "./assets/tqa/tqa-music-v8-extended.m4a";

const { colors, layout, plates, thanks } = blueprint;
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

const centerOf = (item) => plates[item.plate].column_center_x;
const widthOf = (item) => plates[item.plate].column_width_px;

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

// Scripture: every word holds its place from the start, and each one fades in on its own beat.
const Scripture = ({ frame, reveal }) => (
  <div style={body(40, { lineHeight: 1.38 })}>
    {reveal.words.map((w, i) => (
      <span key={i} style={{ opacity: ease(frame, w.start, w.start + RULES.word_fade_frames) }}>
        {w.text}
        {i < reveal.words.length - 1 ? " " : ""}
      </span>
    ))}
  </div>
);

const Intro = ({ item }) => {
  const frame = useCurrentFrame();
  const total = item.frames;
  const o = Math.min(ease(frame, 24, 72), 1 - ease(frame, total - RULES.block_fade_out_frames, total));
  return (
    <div style={{ opacity: o }}>
      <div style={box(layout.intro_center_x, layout.intro_y, { display: "flex", flexDirection: "column", alignItems: "center", gap: 22 })}>
        {blueprint.intro.lines.map((l) => (
          <div key={l.text} style={{ ...header(l.size_px, l.letter_spacing_px, l.color), whiteSpace: "nowrap" }}>
            {l.text}
          </div>
        ))}
      </div>
    </div>
  );
};

// A teaching block: the scripture, a quiet pause, then the slowly typed reflection.
const Teaching = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = item.block;
  const fade = Math.min(ease(frame, 0, RULES.block_fade_in_frames), 1 - ease(frame, item.frames - RULES.block_fade_out_frames, item.frames));
  return (
    <div style={{ opacity: fade }}>
      <div style={box(centerOf(item), layout.top_y, {}, widthOf(item))}>
        <div style={header(30, "0.3em", "gold")}>{b.scripture.ref}</div>
        <div style={{ height: 26 }} />
        <Scripture frame={frame} reveal={item.reveal} />
        <div style={{ height: 44 }} />
        <Typed text={b.reflection} frame={frame} start={item.type_start} cps={RULES.reflection_letters_per_second} fps={fps} style={body(32)} />
      </div>
    </div>
  );
};

// The closing scripture: Romans 10:9-10 on its own page.
const Closing = ({ item }) => {
  const frame = useCurrentFrame();
  const fade = Math.min(ease(frame, 0, RULES.block_fade_in_frames), 1 - ease(frame, item.frames - RULES.block_fade_out_frames, item.frames));
  return (
    <div style={{ opacity: fade }}>
      <div style={box(centerOf(item), layout.top_y, {}, widthOf(item))}>
        <div style={header(30, "0.3em", "gold")}>{item.block.scripture.ref}</div>
        <div style={{ height: 26 }} />
        <Scripture frame={frame} reveal={item.reveal} />
      </div>
    </div>
  );
};

// The prayer has its own page, a few lines at a time.
const Prayer = ({ item }) => {
  const frame = useCurrentFrame();
  const x = RULES.prayer_crossfade_frames;
  const cx = centerOf(item);
  const fade = Math.min(ease(frame, 0, RULES.block_fade_in_frames), 1 - ease(frame, item.frames - RULES.block_fade_out_frames, item.frames));
  return (
    <div style={{ opacity: fade }}>
      <div style={box(cx, layout.prayer_page_y, {}, widthOf(item))}>
        <div style={header(30, "0.3em", "gold")}>A PRAYER</div>
      </div>
      {item.groups.map((g, i) => {
        const inn = ease(frame, g.start, g.start + x);
        const out = i < item.groups.length - 1 ? 1 - ease(frame, g.end - x, g.end) : 1;
        return (
          <div key={i} style={box(cx, layout.prayer_page_y + 80, body(36, { opacity: Math.min(inn, out), lineHeight: 1.5 }), widthOf(item))}>
            {g.text}
          </div>
        );
      })}
    </div>
  );
};

const Thanks = ({ item }) => {
  const frame = useCurrentFrame();
  const o = ease(frame, 0, RULES.thanks_fade_in_frames);
  return (
    <div style={{ opacity: o }}>
      <div style={box(layout.thanks_center_x, layout.thanks_y, { display: "flex", flexDirection: "column", alignItems: "center", gap: 28 })}>
        <div style={{ ...header(48, "0.06em", "gold"), whiteSpace: "nowrap" }}>{thanks.heading}</div>
        {thanks.lines.map((l) => (
          <div key={l} style={body(34)}>
            {l}
          </div>
        ))}
        <div style={header(30, "0.2em", "gold")}>{thanks.link}</div>
      </div>
    </div>
  );
};

const Music = () => {
  const { durationInFrames } = useVideoConfig();
  const volume = (f) =>
    Math.min(
      interpolate(f, [0, RULES.music_fade_in_frames], [0, blueprint.music.volume], clamp),
      interpolate(f, [durationInFrames - RULES.music_fade_out_frames, durationInFrames], [blueprint.music.volume, 0], clamp)
    );
  return <Audio src={musicTrack} volume={volume} />;
};

// The pictures, held steady. Each block shows its own picture; they dissolve into each other at the block edges.
// The first one comes up from black at the start, and the picture and the music fade out together at the end.
const Backdrop = ({ items }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const up = ease(frame, 0, RULES.picture_fade_in_frames);
  const down = 1 - ease(frame, durationInFrames - RULES.picture_fade_out_frames, durationInFrames);
  return (
    <AbsoluteFill>
      {Object.keys(plates).map((name) => {
        const pts = items.flatMap((b) => {
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

export const TQA_Stillness_Journey_FINAL_v10 = () => {
  useBrandFonts();
  const { items } = buildTimeline(blueprint);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.black }}>
      <Music />
      <Backdrop items={items} />
      {items.map((it) => (
        <Sequence key={it.id} from={it.start_frame} durationInFrames={it.frames} layout="none">
          <AbsoluteFill>
            {it.type === "intro" && <Intro item={it} />}
            {it.type === "teaching" && <Teaching item={it} />}
            {it.type === "closing" && <Closing item={it} />}
            {it.type === "prayer" && <Prayer item={it} />}
            {it.type === "thanks" && <Thanks item={it} />}
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
