// The long journey: a quiet intro, the whole of Psalm 91 (KJV), then a closing prayer.
// One timeline, two shapes. It reads the screen size, so the same file makes the wide 16:9 video and the
// tall 9:16 video with the same colors, fonts, music and pace. Words come from src/data/psalm91.json and
// src/data/journey.json. Only the brand colors and the three brand fonts are used here.
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
import { FADE_OUT_FRAMES, WORD_FADE_FRAMES, schedule } from "./revealTiming.mjs";
import { INTRO_FRAMES, PRAYER_REST_FRAMES, VERSE_REST_FRAMES, schedulePrayerText } from "./journeyTiming.mjs";
import journey from "./data/journey.json";

const BRAND = { black: "#0d0d0d", gold: "#C9A84C", cream: "#F5F0E8" };

export const verseSceneFrames = (verse, fps = 30) => schedule(verse, fps).revealEndFrame + VERSE_REST_FRAMES;
export const prayerSceneFrames = (fps = 30) => schedulePrayerText(journey.prayer, fps).revealEndFrame + PRAYER_REST_FRAMES;
export const journeyFrames = (verses, fps = 30) =>
  INTRO_FRAMES + verses.reduce((sum, v) => sum + verseSceneFrames(v, fps), 0) + prayerSceneFrames(fps);

// Music: soft, fades in and out once across the whole video, loops under it.
const MUSIC_VOLUME = 0.22;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" };
const Music = ({ src }) => {
  const { durationInFrames } = useVideoConfig();
  const volume = (f) =>
    Math.min(
      interpolate(f, [0, 60], [0, MUSIC_VOLUME], clamp),
      interpolate(f, [durationInFrames - 120, durationInFrames], [MUSIC_VOLUME, 0], clamp)
    );
  return <Audio src={staticFile(src)} loop loopVolumeCurveBehavior="extend" volume={volume} />;
};

const FONT_CSS =
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400&display=swap";
const useBrandFonts = () => {
  const [handle] = useState(() => delayRender("brand fonts", { timeoutInMilliseconds: 60000 }));
  useEffect(() => {
    const finish = () => continueRender(handle);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_CSS;
    link.onload = () =>
      Promise.all([
        document.fonts.load('400 40px "Cormorant Garamond"'),
        document.fonts.load('400 40px "Cinzel"'),
        document.fonts.load('300 40px "Jost"'),
      ]).then(finish, finish);
    link.onerror = finish;
    document.head.appendChild(link);
  }, [handle]);
};

// Sizes for each shape.
const useShape = () => {
  const { width, height } = useVideoConfig();
  return width > height
    ? { wide: true, verse: 64, badge: 34, gate: 26, rule: 120, pad: "0 130px", cap: 24, prayer: 46, prayerWidth: 1300, intro: 64, introSub: 40, introTitle: 56 }
    : { wide: false, verse: 70, badge: 36, gate: 28, rule: 120, pad: "0 90px", cap: 24, prayer: 44, prayerWidth: 900, intro: 56, introSub: 38, introTitle: 48 };
};

const fade = (frame, total, inF = 10) =>
  Math.min(interpolate(frame, [0, inF], [0, 1], clamp), interpolate(frame, [total - FADE_OUT_FRAMES, total], [1, 0], clamp));

const Words = ({ words, frame, style }) => (
  <div style={style}>
    {words.map((w, i) => (
      <span
        key={i}
        style={{
          opacity: interpolate(frame, [w.start, w.start + WORD_FADE_FRAMES], [0, 1], { ...clamp, easing: Easing.out(Easing.ease) }),
        }}
      >
        {w.text}
        {i < words.length - 1 ? " " : ""}
      </span>
    ))}
  </div>
);

const IntroScene = () => {
  const frame = useCurrentFrame();
  const s = useShape();
  const opacity = interpolate(frame, [0, 30, INTRO_FRAMES - 30, INTRO_FRAMES], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.black, justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ textAlign: "center", padding: s.wide ? "0 150px" : "0 90px", lineHeight: 1.5 }}>
        <div style={{ fontFamily: "'Cinzel', serif", color: BRAND.gold, fontSize: s.intro, letterSpacing: 4 }}>{journey.intro.ministry}</div>
        <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, color: BRAND.cream, fontSize: s.introSub, letterSpacing: 2, margin: "10px 0" }}>
          {journey.intro.presents}
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: BRAND.gold, fontSize: s.introTitle }}>
          {journey.intro.title}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const VerseScene = ({ verse }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = useShape();
  const { words } = schedule(verse, fps);
  const line = { fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: s.verse, lineHeight: 1.35, color: verse.text_color, textAlign: "center" };
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.black, alignItems: "center", justifyContent: "center", padding: s.pad, opacity: fade(frame, durationInFrames) }}>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: s.badge, letterSpacing: "0.35em", color: verse.badge_color, marginBottom: 36 }}>{verse.verse_marker}</div>
      <div style={{ width: s.rule, height: 2, backgroundColor: verse.badge_color, marginBottom: s.wide ? 56 : 72 }} />
      <Words words={words.filter((w) => w.line === 0)} frame={frame} style={{ ...line, marginBottom: 28 }} />
      <Words words={words.filter((w) => w.line === 1)} frame={frame} style={line} />
      <div style={{ position: "absolute", bottom: s.wide ? 70 : 120, fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: s.cap, letterSpacing: "0.3em", textTransform: "uppercase", color: BRAND.cream }}>
        King James Version
      </div>
    </AbsoluteFill>
  );
};

const PrayerScene = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = useShape();
  const { words } = schedulePrayerText(journey.prayer, fps);
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.black, alignItems: "center", justifyContent: "center", padding: s.pad, opacity: fade(frame, durationInFrames) }}>
      <div style={{ fontFamily: "'Cinzel', serif", fontSize: s.badge, letterSpacing: "0.35em", color: journey.prayer.badge_color, marginBottom: 36 }}>{journey.prayer.heading}</div>
      <div style={{ width: s.rule, height: 2, backgroundColor: journey.prayer.badge_color, marginBottom: 56 }} />
      <Words
        words={words}
        frame={frame}
        style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: s.prayer, lineHeight: 1.6, color: journey.prayer.text_color, textAlign: "center", maxWidth: s.prayerWidth }}
      />
    </AbsoluteFill>
  );
};

export const Journey = ({ verses, music }) => {
  useBrandFonts();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.black }}>
      {music ? <Music src={music} /> : null}
      <Series>
        <Series.Sequence durationInFrames={INTRO_FRAMES}>
          <IntroScene />
        </Series.Sequence>
        {verses.map((verse) => (
          <Series.Sequence key={verse.verse_marker} durationInFrames={verseSceneFrames(verse, fps)}>
            <VerseScene verse={verse} />
          </Series.Sequence>
        ))}
        <Series.Sequence durationInFrames={prayerSceneFrames(fps)}>
          <PrayerScene />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
