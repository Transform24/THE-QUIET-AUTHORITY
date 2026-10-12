import { Composition } from "remotion";
import { QuietAuthorityVideo } from "./QuietAuthorityVideo";
import { ScriptureReveal } from "./ScriptureReveal";
import { TQAPatternComposition } from "./TQAPatternComposition";
import { TQA_Stillness_Journey_FINAL_v10 } from "./TQA_Stillness_Journey_FINAL_v10";
import { TQAShortClip } from "./TQAShortClip";
import { TQAThumbnail, THUMB } from "./TQAThumbnail";
import { SHORT } from "./tqaShorts.mjs";
import { TQA_Stillness_Journey_FINAL_v13 } from "./TQA_Stillness_Journey_FINAL_v13";
import tqaVideo13 from "./data/TQA_Stillness_Journey_FINAL_v13.json";
import { TQA_Stillness_Journey_FINAL_v12 } from "./TQA_Stillness_Journey_FINAL_v12";
import tqaVideo12 from "./data/TQA_Stillness_Journey_FINAL_v12.json";
import { TQA_Stillness_Journey_FINAL_v11 } from "./TQA_Stillness_Journey_FINAL_v11";
import tqaVideo11 from "./data/TQA_Stillness_Journey_FINAL_v11.json";
import tqaVideo from "./data/TQA_Stillness_Journey_FINAL_v10.json";
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

      {/* The Quiet Authority video standard (version 2). The length follows the words. Words come from src/data/TQA_Stillness_Journey_FINAL_v10.json, pace from src/tqaStandard.mjs */}
      <Composition
        id="TQA-Stillness-Journey-FINAL-v10"
        component={TQA_Stillness_Journey_FINAL_v10}
        durationInFrames={buildTimeline(tqaVideo).total_frames}
        fps={tqaVideo.fps}
        width={tqaVideo.width}
        height={tqaVideo.height}
        calculateMetadata={() => ({ durationInFrames: buildTimeline(tqaVideo).total_frames })}
      />

      {/* TQA video three, Pattern of Waiting (Psalm 27). Same standard, only the words differ. Words come from src/data/TQA_Stillness_Journey_FINAL_v11.json */}
      <Composition
        id="TQA-Stillness-Journey-FINAL-v11"
        component={TQA_Stillness_Journey_FINAL_v11}
        durationInFrames={buildTimeline(tqaVideo11).total_frames}
        fps={tqaVideo11.fps}
        width={tqaVideo11.width}
        height={tqaVideo11.height}
        calculateMetadata={() => ({ durationInFrames: buildTimeline(tqaVideo11).total_frames })}
      />

      {/* TQA video four, the confidential circle. Same standard and the same prayer push as video three. Words come from src/data/TQA_Stillness_Journey_FINAL_v12.json */}
      <Composition
        id="TQA-Stillness-Journey-FINAL-v12"
        component={TQA_Stillness_Journey_FINAL_v12}
        durationInFrames={buildTimeline(tqaVideo12).total_frames}
        fps={tqaVideo12.fps}
        width={tqaVideo12.width}
        height={tqaVideo12.height}
        calculateMetadata={() => ({ durationInFrames: buildTimeline(tqaVideo12).total_frames })}
      />

      {/* TQA Shorts: one 60 second vertical clip. Pass {"video": "v12", "clip": "A"} (clips A, B and C). Words come from the video's own data file. */}
      <Composition
        id="TQA-Short"
        component={TQAShortClip}
        durationInFrames={SHORT.frames}
        fps={24}
        width={SHORT.width}
        height={SHORT.height}
        defaultProps={{ video: "v12", clip: "A" }}
      />

      {/* TQA video five (file v13), the hallowed identity, Gate 3. Same standard and prayer push as videos three and four. */}
      <Composition
        id="TQA-Stillness-Journey-FINAL-v13"
        component={TQA_Stillness_Journey_FINAL_v13}
        durationInFrames={buildTimeline(tqaVideo13).total_frames}
        fps={tqaVideo13.fps}
        width={tqaVideo13.width}
        height={tqaVideo13.height}
        calculateMetadata={() => ({ durationInFrames: buildTimeline(tqaVideo13).total_frames })}
      />

      {/* TQA thumbnail card, one still per master video. Pass {"card": {...}} (see scripts/generate-system-thumbnails.mjs). */}
      <Composition
        id="TQA-Thumbnail"
        component={TQAThumbnail}
        durationInFrames={1}
        fps={24}
        width={THUMB.width}
        height={THUMB.height}
        defaultProps={{ card: { plate: "spotlight_candle", zoom: 1, focus: "66% 60%", shade: 0.85, lines: [{ text: "SCRIPTURE", size: 72 }], sub: "The Quiet Authority" } }}
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
