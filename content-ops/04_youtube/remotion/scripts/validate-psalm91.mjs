// Checks psalm91.json (and that music1.mp3 is real audio) before anything is staged or rendered.
// Usage: node scripts/validate-psalm91.mjs [path-to-json]
import { runCli } from "./validate-core.mjs";

export const psalm91Profile = {
  count: 16,
  expectedMarkers: Array.from({ length: 16 }, (_, i) => `PSALM 91:${i + 1}`),
  requiredAudio: ["music1.mp3"],
  defaultPath: "src/data/psalm91.json",
};

if (import.meta.url === `file://${process.argv[1]}`) runCli(psalm91Profile, process.argv[2]);
