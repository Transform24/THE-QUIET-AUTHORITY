import { Composition } from "remotion";
import { QuietAuthorityVideo } from "./QuietAuthorityVideo";
import { Psalm91Video } from "./Psalm91Video";
import psalm91 from "./data/psalm91.json";
import { FPS, totalFrames, verseFrames } from "./psalm91Timing.mjs";

export const RemotionRoot = () => {
  return (
    <>
      {/* Psalm 91, KJV, vertical 9:16. The whole psalm in one video. Words come from src/data/psalm91.json */}
      <Composition
        id="Psalm91Full"
        component={Psalm91Video}
        durationInFrames={totalFrames(psalm91)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ verses: psalm91 }}
        calculateMetadata={({ props }) => ({
          durationInFrames: totalFrames(props.verses),
        })}
      />

      {/* Psalm 91, one verse per clip. Pass {"verseIndex": 0} to {"verseIndex": 15} */}
      <Composition
        id="Psalm91Verse"
        component={Psalm91Video}
        durationInFrames={verseFrames(psalm91[0])}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ verses: psalm91, verseIndex: 0 }}
        calculateMetadata={({ props }) => ({
          durationInFrames: verseFrames(props.verses[props.verseIndex]),
        })}
      />

      {/* 9:16 vertical for Instagram/TikTok/Reels — 15 seconds */}
      <Composition
        id="QuietAuthorityShort"
        component={QuietAuthorityVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 16:9 horizontal for YouTube/Facebook — 15 seconds */}
      <Composition
        id="QuietAuthorityWide"
        component={QuietAuthorityVideo}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 1:1 square for Instagram feed — 15 seconds */}
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
