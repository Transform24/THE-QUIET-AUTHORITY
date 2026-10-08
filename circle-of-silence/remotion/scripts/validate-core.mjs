// Shared script checker. Stops a bad scripture file BEFORE anything is staged or rendered.
// This file is identical in content-ops/04_youtube/remotion and circle-of-silence/remotion.
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FPS, schedule, totalFrames, verseFrames, wordsPerMinute } from "../src/revealTiming.mjs";

export const TEXT_COLOR = "#F5F0E8"; // cream
export const BADGE_COLOR = "#C9A84C"; // gold
const REQUIRED_KEYS = ["verse_marker", "line_1", "line_2", "text_color", "badge_color", "reveal_speed_ms"];
const EM_DASH = String.fromCharCode(0x2014); // written by code so this file holds no em dash itself
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u;
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export const findRepoRoot = (from = dirname(fileURLToPath(import.meta.url))) => {
  let dir = resolve(from);
  for (let i = 0; i < 8; i++) {
    if (existsSync(join(dir, "CNAME")) && existsSync(join(dir, ".nojekyll"))) return dir;
    dir = dirname(dir);
  }
  return null;
};

// An mp3 starts with an ID3 tag or an MPEG frame sync. A Git LFS pointer is a tiny text file.
export const checkMp3 = (path) => {
  if (!existsSync(path)) return "file not found";
  const size = statSync(path).size;
  if (size < 100_000) return `only ${size} bytes (a placeholder or Git LFS pointer, not real audio)`;
  const head = readFileSync(path).subarray(0, 3);
  const isId3 = head.toString("latin1") === "ID3";
  const isFrame = head[0] === 0xff && (head[1] & 0xe0) === 0xe0;
  return isId3 || isFrame ? null : "does not look like an mp3 file";
};

// profile: { count, expectedMarkers, optionalKeys, allowedMusic, requiredAudio, gateLabels }
export const validateData = (raw, profile, repoRoot = findRepoRoot()) => {
  const errors = [];
  const fail = (message) => errors.push(message);

  if (typeof raw !== "string" || !raw.trim()) return { errors: ["file is empty"], verses: null };
  if (raw.charCodeAt(0) === 0xfeff) fail("file starts with a byte order mark; save it as plain UTF-8");
  let verses;
  try {
    verses = JSON.parse(raw.replace(/^﻿/, ""));
  } catch (e) {
    return { errors: [`not valid JSON (${e.message})`], verses: null };
  }
  if (!Array.isArray(verses)) return { errors: ["top level must be an array of verses"], verses: null };
  if (verses.length !== profile.count) fail(`expected ${profile.count} verses, found ${verses.length}`);

  const optional = profile.optionalKeys || [];
  const seen = new Set();
  const textKeys = ["verse_marker", "line_1", "line_2", ...optional.filter((k) => k === "gate_label")];

  verses.forEach((v, i) => {
    const where = `verse ${i + 1}`;
    if (typeof v !== "object" || v === null || Array.isArray(v)) return fail(`${where}: must be an object`);
    const unknown = Object.keys(v).filter((k) => !REQUIRED_KEYS.includes(k) && !optional.includes(k));
    const missing = REQUIRED_KEYS.filter((k) => !(k in v));
    if (unknown.length) fail(`${where}: unexpected keys ${unknown.join(", ")}`);
    if (missing.length) return fail(`${where}: missing keys ${missing.join(", ")}`);

    const expected = profile.expectedMarkers[i];
    if (v.verse_marker !== expected) fail(`${where}: marker is "${v.verse_marker}", expected "${expected}"`);
    if (seen.has(v.verse_marker)) fail(`${where}: marker "${v.verse_marker}" is used twice`);
    seen.add(v.verse_marker);

    for (const k of textKeys) {
      if (!(k in v)) continue;
      const t = v[k];
      if (typeof t !== "string" || !t.trim()) { fail(`${where}: ${k} must be non-empty text`); continue; }
      if (t !== t.trim()) fail(`${where}: ${k} has a space at the start or end`);
      if (/ {2,}/.test(t)) fail(`${where}: ${k} has a double space`);
      if (t.includes(EM_DASH)) fail(`${where}: ${k} contains an em dash`);
      if (EMOJI.test(t)) fail(`${where}: ${k} contains an emoji`);
      if (/[<>{}`]/.test(t)) fail(`${where}: ${k} contains markup characters`);
      if (CONTROL.test(t)) fail(`${where}: ${k} contains a control character`);
      if (t.length > 240) fail(`${where}: ${k} is longer than 240 characters`);
    }
    if (profile.gateLabels && v.gate_label !== profile.gateLabels[i]) {
      fail(`${where}: gate_label is "${v.gate_label}", expected "${profile.gateLabels[i]}"`);
    }
    if (v.text_color !== TEXT_COLOR) fail(`${where}: text_color must be exactly ${TEXT_COLOR} (cream), found "${v.text_color}"`);
    if (v.badge_color !== BADGE_COLOR) fail(`${where}: badge_color must be exactly ${BADGE_COLOR} (gold), found "${v.badge_color}"`);
    if (!Number.isInteger(v.reveal_speed_ms) || v.reveal_speed_ms < 20 || v.reveal_speed_ms > 300) {
      fail(`${where}: reveal_speed_ms must be a whole number from 20 to 300`);
    }
    if ("music" in v || profile.allowedMusic) {
      if (typeof v.music !== "string" || !profile.allowedMusic?.includes(v.music)) {
        fail(`${where}: music must be one of ${profile.allowedMusic?.join(", ")}, found "${v.music}"`);
      }
    }
  });

  // Only judge timing once the shape is sound.
  if (!errors.length) {
    verses.forEach((v, i) => {
      const seconds = verseFrames(v) / FPS;
      if (seconds < 4 || seconds > 90) fail(`verse ${i + 1}: runs ${seconds.toFixed(1)} seconds, expected 4 to 90`);
    });
  }

  // Audio the video needs must exist at the repo root and be real mp3 data.
  const audio = new Set([...(profile.requiredAudio || []), ...verses.map((v) => v?.music).filter(Boolean)]);
  if (audio.size && !repoRoot) fail("could not find the repository root (CNAME and .nojekyll) to check the audio");
  else for (const file of audio) {
    const problem = checkMp3(join(repoRoot, file));
    if (problem) fail(`audio ${file} at the repository root: ${problem}`);
  }
  return { errors, verses };
};

export const runCli = (profile, argvPath) => {
  const path = argvPath || profile.defaultPath;
  let raw;
  try {
    if (statSync(path).size > 100_000) {
      console.error(`FAIL: ${path} is larger than 100 KB`);
      process.exit(1);
    }
    raw = readFileSync(path, "utf8");
  } catch (e) {
    console.error(`FAIL: cannot read ${path} (${e.code || e.message})`);
    process.exit(1);
  }
  const { errors, verses } = validateData(raw, profile);
  if (errors.length) {
    console.error(`FAIL: ${errors.length} problem(s) in ${path}`);
    errors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }
  const secs = (n) => (n / FPS).toFixed(1);
  const wpm = verses.map((v) => wordsPerMinute(v));
  console.log(`OK: ${verses.length} verses, ${secs(totalFrames(verses))} seconds in total at ${FPS} fps`);
  console.log(`    clips run ${secs(Math.min(...verses.map((v) => verseFrames(v))))}s to ${secs(Math.max(...verses.map((v) => verseFrames(v))))}s`);
  console.log(`    reading pace ${Math.min(...wpm)} to ${Math.max(...wpm)} words a minute`);
  console.log(`    words per verse ${Math.min(...verses.map((v) => schedule(v).words.length))} to ${Math.max(...verses.map((v) => schedule(v).words.length))}`);
};
