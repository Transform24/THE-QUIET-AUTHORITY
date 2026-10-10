import { Composition } from "remotion";
import { QuietAuthorityVideo } from "./QuietAuthorityVideo";
import { ScriptureReveal } from "./ScriptureReveal";
import { Journey, journeyFrames } from "./Journey";
import psalm91 from "./data/psalm91.json";
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

      {/* The long journey, wide 16:9: intro, all of Psalm 91 with 4 second rests, then the closing prayer */}
      <Composition
        id="Psalm91Long"
        component={Journey}
        durationInFrames={journeyFrames(psalm91)}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{ verses: psalm91, music: PSALM_MUSIC }}
        calculateMetadata={({ props }) => ({ durationInFrames: journeyFrames(props.verses) })}
      />

      {/* The same journey, tall 9:16 for phones. Same timeline, colors, fonts and music */}
      <Composition
        id="Psalm91Mobile"
        component={Journey}
        durationInFrames={journeyFrames(psalm91)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ verses: psalm91, music: PSALM_MUSIC }}
        calculateMetadata={({ props }) => ({ durationInFrames: journeyFrames(props.verses) })}
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
