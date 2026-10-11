import { Composition } from "remotion";
import { QuietAuthorityVideo } from "./QuietAuthorityVideo";
import { ScriptureReveal } from "./ScriptureReveal";
import { TQAPatternComposition } from "./TQAPatternComposition";
import { TQAPrayerPostureComposition } from "./TQAPrayerPostureComposition";
import tqaPrayerPosture from "./data/tqa-prayer-posture.json";
import tqaPattern from "./data/tqa-pattern-blueprint.json";
import psalm91 from "./data/psalm91.json";
import { buildTimeline } from "./tqaStandard.mjs";
import { FPS, totalFrames, verseFrames } from "./revealTiming.mjs";

// Soft violin and piano from the repository root (staged into public/ by scripts/stage-audio.mjs).
const PSALM_MUSIC = "music1.mp3";

export const RemotionRoot = () => {
  return (
    <>
      {/* Psalm 91, KJV, vertical 9:16. The whole psalm in one video. Words come from src/data/psalm91.json */}
      <Composition
        id="Psalm91Full"
        component={ScriptureReveal}
        durationInFrames={totalFrames(psalm91)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ verses: psalm91, music: PSALM_MUSIC }}
        calculateMetadata={({ props }) => ({
          durationInFrames: totalFrames(props.verses),
        })}
      />

      {/* The Quiet Authority, Pattern of Waiting: 8 minutes, 11,520 frames at 24 fps. Words and timing come from src/data/tqa-pattern-blueprint.json */}
      <Composition
        id="TQAPattern"
        component={TQAPatternComposition}
        durationInFrames={tqaPattern.total_frames}
        fps={tqaPattern.fps}
        width={tqaPattern.width}
        height={tqaPattern.height}
      />

      {/* The Quiet Authority video standard (version 2). The length follows the words. Words come from src/data/tqa-prayer-posture.json, pace from src/tqaStandard.mjs */}
      <Composition
        id="TQAPrayerPosture"
        component={TQAPrayerPostureComposition}
        durationInFrames={buildTimeline(tqaPrayerPosture).total_frames}
        fps={tqaPrayerPosture.fps}
        width={tqaPrayerPosture.width}
        height={tqaPrayerPosture.height}
        calculateMetadata={() => ({ durationInFrames: buildTimeline(tqaPrayerPosture).total_frames })}
      />

      {/* Psalm 91, one verse per clip. Pass {"verseIndex": 0} to {"verseIndex": 15} */}
      <Composition
        id="Psalm91Verse"
        component={ScriptureReveal}
        durationInFrames={verseFrames(psalm91[0])}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ verses: psalm91, verseIndex: 0, music: PSALM_MUSIC }}
        calculateMetadata={({ props }) => ({
          durationInFrames: verseFrames(props.verses[props.verseIndex]),
        })}
      />

      {/* 9:16 vertical for Instagram/TikTok/Reels, 15 seconds */}
      <Composition
        id="QuietAuthorityShort"
        component={QuietAuthorityVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 16:9 horizontal for YouTube/Facebook, 15 seconds */}
      <Composition
        id="QuietAuthorityWide"
        component={QuietAuthorityVideo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 1:1 square for Instagram feed, 15 seconds */}
      <Composition
        id="QuietAuthoritySquare"
        component={QuietAuthorityVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1080}
      />
    </>
  );
};
