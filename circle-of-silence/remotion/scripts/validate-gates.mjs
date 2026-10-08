// Checks gates.json (and that music2.mp3 and music3.mp3 are real audio) before anything is staged or rendered.
// Usage: node scripts/validate-gates.mjs [path-to-json]
import { runCli } from "./validate-core.mjs";

export const gatesProfile = {
  count: 6,
  expectedMarkers: ["LUKE 4:18", "PSALM 46:10", "ISAIAH 43:2", "PROVERBS 3:5-6", "HEBREWS 11:1", "JEREMIAH 29:11"],
  gateLabels: ["GATE ONE: HAKRIA", "GATE TWO: SHEKET", "GATE THREE: HAMIDBAR", "GATE FOUR: HITKANIA", "GATE FIVE: BITACHON", "GATE SIX: HITHAVUT"],
  optionalKeys: ["gate_label", "music"],
  allowedMusic: ["music2.mp3", "music3.mp3"],
  requiredAudio: ["music2.mp3", "music3.mp3"],
  defaultPath: "src/data/gates.json",
};

if (import.meta.url === `file://${process.argv[1]}`) runCli(gatesProfile, process.argv[2]);
