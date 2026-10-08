// Proves the checker stops bad files. Every case below MUST fail, and the good case MUST pass.
// Run: node scripts/test-validator.mjs   (also runs in GitHub Actions before any render)
// This file is identical in content-ops/04_youtube/remotion and circle-of-silence/remotion.
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { checkMp3, validateData } from "./validate-core.mjs";

const profile = { count: 2, expectedMarkers: ["TEST 1:1", "TEST 1:2"], requiredAudio: [], optionalKeys: [] };
const good = () => [
  { verse_marker: "TEST 1:1", line_1: "Be still, and know that I am God:", line_2: "I will be exalted in the earth.", text_color: "#F5F0E8", badge_color: "#C9A84C", reveal_speed_ms: 75 },
  { verse_marker: "TEST 1:2", line_1: "The LORD is my shepherd;", line_2: "I shall not want.", text_color: "#F5F0E8", badge_color: "#C9A84C", reveal_speed_ms: 75 },
];
const mutate = (fn) => { const d = good(); fn(d); return JSON.stringify(d); };
const EM = String.fromCharCode(0x2014);

const cases = {
  "empty file": "",
  "only spaces": "   \n  ",
  "not JSON": "{ this is not json",
  "trailing comma": '[{"a":1},]',
  "JSON object, not array": '{"verses": []}',
  "JSON null": "null",
  "byte order mark": "﻿" + JSON.stringify(good()),
  "too few verses": mutate((d) => d.pop()),
  "too many verses": mutate((d) => d.push({ ...d[0], verse_marker: "TEST 1:3" })),
  "verse is a string": mutate((d) => { d[0] = "hello"; }),
  "verse is null": mutate((d) => { d[1] = null; }),
  "verse is an array": mutate((d) => { d[0] = []; }),
  "missing line_2": mutate((d) => { delete d[0].line_2; }),
  "missing reveal_speed_ms": mutate((d) => { delete d[1].reveal_speed_ms; }),
  "unknown key": mutate((d) => { d[0].extra = 1; }),
  "wrong marker": mutate((d) => { d[0].verse_marker = "PSALM 91:1"; }),
  "duplicate marker": mutate((d) => { d[1].verse_marker = "TEST 1:1"; }),
  "line_1 is a number": mutate((d) => { d[0].line_1 = 5; }),
  "line_1 empty": mutate((d) => { d[0].line_1 = ""; }),
  "line_1 only spaces": mutate((d) => { d[0].line_1 = "   "; }),
  "leading space": mutate((d) => { d[0].line_1 = " Be still"; }),
  "double space": mutate((d) => { d[0].line_1 = "Be  still"; }),
  "em dash": mutate((d) => { d[0].line_2 += ` ${EM} amen`; }),
  "emoji": mutate((d) => { d[1].line_2 += " \u{1F64F}"; }),
  "HTML tag": mutate((d) => { d[0].line_1 = "<b>Be still</b>"; }),
  "control character": mutate((d) => { d[0].line_1 = "Be\u0007 still"; }),
  "line too long": mutate((d) => { d[0].line_1 = "word ".repeat(60).trim(); }),
  "text color not cream": mutate((d) => { d[0].text_color = "#ffffff"; }),
  "text color lowercase": mutate((d) => { d[0].text_color = "#f5f0e8"; }),
  "badge color not gold": mutate((d) => { d[1].badge_color = "#C1593C"; }),
  "badge color missing hash": mutate((d) => { d[0].badge_color = "C9A84C"; }),
  "speed too small": mutate((d) => { d[0].reveal_speed_ms = 5; }),
  "speed too large": mutate((d) => { d[0].reveal_speed_ms = 900; }),
  "speed a decimal": mutate((d) => { d[0].reveal_speed_ms = 75.5; }),
  "speed a string": mutate((d) => { d[0].reveal_speed_ms = "75"; }),
};

let failures = 0;
for (const [name, raw] of Object.entries(cases)) {
  const { errors } = validateData(raw, profile, null);
  if (errors.length === 0) {
    console.error(`  NOT CAUGHT: ${name}`);
    failures++;
  }
}
const ok = validateData(JSON.stringify(good()), profile, null);
if (ok.errors.length) {
  console.error("  the good file was rejected:", ok.errors);
  failures++;
}

// Audio checks: a tiny placeholder (like a Git LFS pointer) and a non-mp3 must be refused.
const dir = mkdtempSync(join(tmpdir(), "validator-"));
writeFileSync(join(dir, "pointer.mp3"), "version https://git-lfs.github.com/spec/v1\noid sha256:abc\nsize 5000000\n");
writeFileSync(join(dir, "fake.mp3"), Buffer.alloc(200_000, 0x41));
writeFileSync(join(dir, "real.mp3"), Buffer.concat([Buffer.from("ID3"), Buffer.alloc(200_000)]));
for (const [name, file, shouldFail] of [["LFS pointer", "pointer.mp3", true], ["not an mp3", "fake.mp3", true], ["missing file", "none.mp3", true], ["real-looking mp3", "real.mp3", false]]) {
  const result = checkMp3(join(dir, file));
  if (Boolean(result) !== shouldFail) { console.error(`  audio check wrong for: ${name}`); failures++; }
}

// stage-audio must refuse names that could escape the folder.
const stage = join(dirname(fileURLToPath(import.meta.url)), "stage-audio.mjs");
for (const bad of ["../CNAME", "music1.wav", "/etc/passwd", "music1.mp3/../x"]) {
  const r = spawnSync("node", [stage, bad], { encoding: "utf8" });
  if (r.status === 0) { console.error(`  stage-audio accepted "${bad}"`); failures++; }
}

const total = Object.keys(cases).length + 1 + 4 + 4;
if (failures) {
  console.error(`FAIL: ${failures} of ${total} checks did not behave`);
  process.exit(1);
}
console.log(`OK: all ${total} checks behaved (${Object.keys(cases).length} bad files rejected, good file accepted, audio and path checks held)`);
