import { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Series,
  continueRender,
  delayRender,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  FADE_OUT_FRAMES,
  LEAD_FRAMES,
  verseFrames,
} from "./psalm91Timing.mjs";

// Brand fonts. Cormorant Garamond for scripture, Jost for small text, Cinzel for the badge.
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

// Letters appear one at a time. The hidden remainder keeps its space so nothing jumps.
const Typed = ({ text, count, style }) => {
  const shown = Math.max(0, Math.min(text.length, count));
  return (
    <div style={style}>
      <span>{text.slice(0, shown)}</span>
      <span style={{ opacity: 0 }}>{text.slice(shown)}</span>
    </div>
  );
};

const VerseScene = ({ verse }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const lettersShown = Math.floor(
    ((frame - LEAD_FRAMES) / fps) * (1000 / verse.reveal_speed_ms)
  );
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - FADE_OUT_FRAMES, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
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
        backgroundColor: "#0d0d0d",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 90px",
        opacity: Math.min(fadeIn, fadeOut),
      }}
    >
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
      <Typed
        text={verse.line_1}
        count={lettersShown}
        style={{ ...lineStyle, marginBottom: 28 }}
      />
      <Typed
        text={verse.line_2}
        count={lettersShown - verse.line_1.length}
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
          color: "#F5F0E8",
          opacity: 0.55,
        }}
      >
        King James Version
      </div>
    </AbsoluteFill>
  );
};

// With verseIndex, renders that one verse. Without it, renders the whole psalm in order.
export const Psalm91Video = ({ verses, verseIndex }) => {
  useBrandFonts();
  const { fps } = useVideoConfig();

  if (typeof verseIndex === "number") {
    return <VerseScene verse={verses[verseIndex]} />;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0d" }}>
      <Series>
        {verses.map((verse) => (
          <Series.Sequence
            key={verse.verse_marker}
            durationInFrames={verseFrames(verse, fps)}
          >
            <VerseScene verse={verse} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
