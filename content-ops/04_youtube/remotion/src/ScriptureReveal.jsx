// Shared scripture reveal. Black canvas, gold badge, cream words that appear one at a time.
// This file is identical in content-ops/04_youtube/remotion and circle-of-silence/remotion.
// scripts/check-remotion-sync.mjs fails the build if the two copies ever differ.
import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Series,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FADE_OUT_FRAMES,
  WORD_FADE_FRAMES,
  schedule,
  verseFrames,
} from "./revealTiming.mjs";

// The only three colors this video may use.
export const BRAND = { black: "#0d0d0d", gold: "#C9A84C", cream: "#F5F0E8" };

// Music sits softly under the words, fades in and out, and loops when the video is longer than the track.
const MUSIC_VOLUME = 0.22;
const MUSIC_FADE_IN_FRAMES = 60;
const MUSIC_FADE_OUT_FRAMES = 75;

const calmVolume = (durationInFrames) => (frame) => {
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const up = interpolate(frame, [0, MUSIC_FADE_IN_FRAMES], [0, MUSIC_VOLUME], clamp);
  const down = interpolate(
    frame,
    [durationInFrames - MUSIC_FADE_OUT_FRAMES, durationInFrames],
    [MUSIC_VOLUME, 0],
    clamp
  );
  return Math.min(up, down);
};

const Music = ({ src }) => {
  const { durationInFrames } = useVideoConfig();
  // "extend" keeps the fade timeline running across loop passes, so the final fade-out lands at the very end.
  return (
    <Audio
      src={staticFile(src)}
      loop
      loopVolumeCurveBehavior="extend"
      volume={calmVolume(durationInFrames)}
    />
  );
};

// Brand fonts. Cormorant Garamond for scripture, Jost for small text, Cinzel for badges.
const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400&display=swap";

const useBrandFonts = () => {
  const [handle] = useState(() =>
    delayRender("brand fonts", { timeoutInMilliseconds: 60000 })
  );
  useEffect(() => {
    const finish = () => continueRender(handle);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_CSS;
    link.onload = () => {
      Promise.all([
        document.fonts.load('400 40px "Cormorant Garamond"'),
        document.fonts.load('400 40px "Cinzel"'),
        document.fonts.load('300 40px "Jost"'),
      ]).then(finish, finish);
    };
    link.onerror = finish; // render with fallback fonts rather than fail
    document.head.appendChild(link);
  }, [handle]);
};

// Each word fades in on its own beat. Unrevealed words keep their space, so nothing jumps.
const WordLine = ({ words, frame, style }) => (
  <div style={style}>
    {words.map((word, i) => (
      <span
        key={i}
        style={{
          opacity: interpolate(frame, [word.start, word.start + WORD_FADE_FRAMES], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.ease),
          }),
        }}
      >
        {word.text}
        {i < words.length - 1 ? " " : ""}
      </span>
    ))}
  </div>
);

const VerseScene = ({ verse, audioSrc }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { words } = schedule(verse, fps);

  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
  const fadeIn = interpolate(frame, [0, 10], [0, 1], clamp);
  const fadeOut = interpolate(
    frame,
    [durationInFrames - FADE_OUT_FRAMES, durationInFrames],
    [1, 0],
    clamp
  );
  const lineStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 400,
    fontSize: 70,
    lineHeight: 1.35,
    color: verse.text_color,
    textAlign: "center",
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.black,
        alignItems: "center",
        justifyContent: "center",
        padding: "0 90px",
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
      {audioSrc ? <Music src={audioSrc} /> : null}
      {verse.gate_label ? (
        <div
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 28,
            letterSpacing: "0.3em",
            color: verse.badge_color,
            marginBottom: 28,
          }}
        >
          {verse.gate_label}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 36,
          letterSpacing: "0.35em",
          color: verse.badge_color,
          marginBottom: 36,
        }}
      >
        {verse.verse_marker}
      </div>
      <div
        style={{
          width: 120,
          height: 2,
          backgroundColor: verse.badge_color,
          marginBottom: 72,
        }}
      />
      <WordLine
        words={words.filter((w) => w.line === 0)}
        frame={frame}
        style={{ ...lineStyle, marginBottom: 28 }}
      />
      <WordLine
        words={words.filter((w) => w.line === 1)}
        frame={frame}
        style={lineStyle}
      />
      <div
        style={{
          position: "absolute",
          bottom: 120,
          fontFamily: "'Jost', sans-serif",
          fontWeight: 300,
          fontSize: 24,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: BRAND.cream,
        }}
      >
        King James Version
      </div>
    </AbsoluteFill>
  );
};

// verseIndex set: one verse. Not set: every verse in order.
// perSceneAudio: each verse plays its own music file (named in the verse's "music" field).
// Otherwise one track, named by the "music" prop, plays under the whole video.
export const ScriptureReveal = ({ verses, verseIndex, music, perSceneAudio }) => {
  useBrandFonts();
  const { fps } = useVideoConfig();

  if (typeof verseIndex === "number") {
    const verse = verses[verseIndex];
    return <VerseScene verse={verse} audioSrc={verse.music || music} />;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.black }}>
      {!perSceneAudio && music ? <Music src={music} /> : null}
      <Series>
        {verses.map((verse) => (
          <Series.Sequence
            key={verse.verse_marker}
            durationInFrames={verseFrames(verse, fps)}
          >
            <VerseScene verse={verse} audioSrc={perSceneAudio ? verse.music : null} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
