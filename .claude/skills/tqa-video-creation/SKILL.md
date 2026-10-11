---
name: tqa-video-creation
description: Build a Quiet Authority teaching video (exactly 8 minutes, scripture and prayer, from Grace's words) with the Remotion engine on the tqa-compositions branch. Use when Grace asks for a new TQA video, a new set of scriptures or reflections for one, a render of an existing one, or a YouTube title and description for one.
---

# TQA video creation

Grace's rule for every TQA video: only the words change. The look, the pace and the length are locked.

## Before anything
1. Read README.md (the blueprint) and TQA-STANDARD.md (in `content-ops/04_youtube/remotion/`).
2. Work on the side branch `tqa-compositions`. Do not merge it into main.
3. Rules that never bend: KJV only for scripture, no em dashes, plain sequential tone, none of the banned words in `content-ops/_factory/brand-voice.md`, no cost without Grace's approval, never upload to YouTube, never put a video in a `-approved` folder.

## The words you need from Grace
1. The scripture references (three teaching blocks).
2. One reflection for each scripture. If Grace explicitly allows it, draft them from her themes and say so on the card.
3. The four prayer beats.
Romans 10:9-10, the "Thank you for watching" page and the intro are part of the standard.

## Steps, in order
1. Fetch each verse from bible-api.com with `?translation=kjv`, compare word for word, then add it to `src/data/kjv-registry.json` as verified.
2. Copy the newest data file (for example `src/data/TQA_Stillness_Journey_FINAL_v12.json`) to the next name and change only the scriptures, reflections and `closing.prayer_beats` (and `closing.prayer`, the beats joined by a space).
3. Copy the newest layout file to the new name, replacing the version in the names. The checker requires it to match the standard everywhere outside the PRAYER-BEGIN and PRAYER-END marks.
4. Add the new name to `ALLOWED_EXCEPTIONS` in `scripts/validate-tqa-prayer-posture.mjs` if it uses the line by line prayer push.
5. Register the composition in `src/Root.jsx` with a hyphenated ID (Remotion does not allow underscores in an ID) and add `validate:tqa-vNN` and `render:tqa-vNN` to `package.json`.
6. Run `npm run validate:tqa-vNN`. Fix anything it names. Also run the other videos' checks and `node scripts/check-remotion-sync.mjs` from the repo root.
7. Render: `npx remotion render src/index.js TQA-Stillness-Journey-FINAL-vNN out/TQA_Stillness_Journey_FINAL_vNN.mp4 --overwrite --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --ignore-certificate-errors --concurrency=4`. The entry file is `src/index.js`, not Root.tsx.
8. Check: ffprobe says 480 seconds, 1920 by 1080. Pull frames from every part and look at them.
9. Stage on main: copy the video into the repo root `public/` folder, write a card in `workflows/output/youtube-pending/` (name it for the video), push. Never put it in `youtube-approved`.
10. Write the YouTube title, description and chapters into `content-ops/04_youtube/TQA-YOUTUBE-PACK.md`. Grace uploads herself.
11. Report: where the video is, what to check, and a "Saved to:" line.

## Pitfalls we hit
- Browser caches the old video for up to 4 hours. Give Grace a link ending in `?v=N`.
- The proxy blocks Google Fonts unless you pass `--ignore-certificate-errors` to the render.
- Never use music1.mp3 here. The music is the Version 8 track, held in `src/assets/tqa/tqa-music-v8-extended.m4a`.
- The stop hook may complain that the branch is unpushed after switching branches. Run `git push -u origin tqa-compositions`.

## Planned next: Shorts, Reels and Pins (not built yet, needs Grace's go-ahead)
Each 8 minute video yields vertical 1080 by 1920 clips of about 60 seconds: one scripture revealed word by word, a line of the reflection, and a closing card with sanctuary-grace.com, over the same music and picture plates. The Psalm 91 engine already renders vertical clips and is the model to follow. The same file serves YouTube Shorts and Instagram Reels (Grace posts them herself). Pins use the same clips or a still frame with the verse in Pinterest's tall shape.
