# The Quiet Authority Video Engine Blueprint (standard version 2)

This is the permanent standard for every TQA teaching video. It matches the video Grace approved on 2026-10-11. A new video changes only the words: the scriptures, the reflections and the prayer.

## 1. What is locked
- Picture A (intro and Block 1): the pottery jar beside the single candle on a dark surface.
- Picture B (Blocks 2 and 3, Romans page, prayer page, thank you page): the woman in the orange sari under the descending light stream.
- Music: the track taken from the Version 8 video, held in `src/assets/tqa/tqa-music-v8-extended.m4a`. It fades in at the start and out at the end. `music1.mp3` is the Psalm 91 music and is never used here.
- Colors: black #0d0d0d, gold #C9A84C, cream #F5F0E8.
- Fonts: Cinzel for headers (gold), Jost for body text (cream).
- Text boxes are 780 pixels wide at most, kept off the figure, jar and candle.
- Words: KJV only for scripture, no em dashes, no emoji, no self-help words (burnout and the rest of the banned list).
- Nothing uploads to YouTube. Grace uploads herself.

## 2. The order, one step at a time
Every video is exactly 8 minutes: 11,520 frames at 24 frames a second. This is the YouTube standard.
1. Intro (0:00 to 0:15): "Sanctuary Grace Ministry presents The Quiet Authority". One fade in, one layer of text only.
2. Teaching blocks, as many as the video needs (the first video has three). In each block:
   1. The scripture reference appears.
   2. The scripture is revealed one word at a time, at 80 words a minute, with a breath at commas and full stops.
   3. Four seconds of quiet.
   4. The reflection types out slowly, 4.5 letters a second.
   5. It rests 8 seconds, then the scene dissolves in 1 second.
3. Romans 10:9-10 (KJV) on its own page, revealed the same way, resting 8 seconds.
4. The prayer on its own page, a few lines at a time, for 1 minute 53 seconds.
5. "Thank you for watching." with its two lines and sanctuary-grace.com. It stays until the end and takes whatever time the words leave. If the words are so long that it would be under 12 seconds, the checker stops the render.
6. The music and picture fade out together over the last 8 seconds.

First video's timing, for reference: intro 0 to 360, Matthew 6:7-8 to 2705, Matthew 6:6 to 4907, Matthew 6:9 to 6611, Romans 10:9-10 to 7685, prayer to 10397, thank you page to 11520.

## 3. What you change for a new video
Only `src/data/TQA_Stillness_Journey_FINAL_v10.json` (or a copy of it). Every scripture must also be listed word for word in `src/data/kjv-registry.json`. The checker prints CHECK for any verse not yet matched to a KJV source.

## 4. What you never change
`src/tqaStandard.mjs` holds every pace rule. `src/TQA_Stillness_Journey_FINAL_v10.jsx` holds the layout.

## 5. Commands (run in this folder)
- Check: `npm run validate:tqa-prayer`
- Render: `npx remotion render src/index.js TQA-Stillness-Journey-FINAL-v10 out/TQA_Stillness_Journey_FINAL_v10.mp4 --overwrite`

Naming: the files, the component and the final video use the underscore name TQA_Stillness_Journey_FINAL_v10. Remotion does not allow underscores in a composition ID, so the ID itself is TQA-Stillness-Journey-FINAL-v10 (hyphens). The render writes out/TQA_Stillness_Journey_FINAL_v10.mp4.

## Layout exception (Video Three, v11 only)
The prayer page of `TQA_Stillness_Journey_FINAL_v11` is allowed to arrive line by line: four prayer beats, each broken into short lines that spring up from below and push the earlier lines upward, in Jost, inside the 780 pixel column. The checker allows this for v11 only, and only between the PRAYER-BEGIN and PRAYER-END marks in the layout file. Everything else in the v11 layout must match the standard file exactly, and the colors, fonts, width limit and words checks stay in force.
