import { Composition } from "remotion";
import { ScriptureReveal } from "./ScriptureReveal";
import gates from "./data/gates.json";
import { FPS, totalFrames, verseFrames } from "./revealTiming.mjs";

// The six gates of the Circle of Silence, vertical 9:16, same look as the Psalm 91 video.
// Each gate names its own music in src/data/gates.json (music2.mp3 or music3.mp3 from the repository root).
export const RemotionRoot = () => {
  return (
    <>
      {/* All six gates in order, each with its own looping music */}
      <Composition
        id="GatesFull"
        component={ScriptureReveal}
        durationInFrames={totalFrames(gates)}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ verses: gates, perSceneAudio: true }}
        calculateMetadata={({ props }) => ({
          durationInFrames: totalFrames(props.verses),
        })}
      />

      {/* One gate per clip. Pass {"verseIndex": 0} (Gate One) to {"verseIndex": 5} (Gate Six) */}
      <Composition
        id="GateVerse"
        component={ScriptureReveal}
        durationInFrames={verseFrames(gates[0])}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ verses: gates, verseIndex: 0, perSceneAudio: true }}
        calculateMetadata={({ props }) => ({
          durationInFrames: verseFrames(props.verses[props.verseIndex]),
        })}
      />
    </>
  );
};
