# The Quiet Authority Video Standard (version 2)

This is the one pattern for every TQA teaching video. A new video changes only the words. Nothing else.

## The order, one step at a time
1. Intro: Sanctuary Grace Ministry presents The Quiet Authority (15 seconds).
2. Teaching blocks (as many as the video needs). In each block:
   1. The scripture reference appears.
   2. The scripture is revealed one word at a time, at 80 words a minute, with a breath at commas and full stops.
   3. Four seconds of quiet.
   4. The reflection types out slowly, 4.5 letters a second.
   5. It rests for 8 seconds, then the scene dissolves in 1 second to the next.
3. Closing scripture: Romans 10:9-10 is revealed the same way and stays on the screen while the prayer settles in the lower third, a few lines at a time, for 1 minute 53 seconds.
4. Thank you page: "Thank you for watching." with the two lines and sanctuary-grace.com.
5. The music and the picture fade out together over the last 8 seconds.

## What you change for a new video
Only `src/data/tqa-prayer-posture.json` (or a copy of it): the scriptures, the reflections and the prayer.

## What you never change
- `src/tqaStandard.mjs` holds every pace rule. The length of the video follows the words.
- Every scripture must be listed word for word in `src/data/kjv-registry.json` (KJV only). The checker stops the render if a verse is missing or different, and prints CHECK for any verse not yet matched to a KJV source.
- Brand: black #0d0d0d, gold #C9A84C, cream #F5F0E8. Cinzel for headers, Jost for body. Text boxes 780 pixels or less.
- Nothing uploads to YouTube. Grace uploads herself.

## Commands (run in this folder)
- Check: `npm run validate:tqa-prayer`
- Render: `npx remotion render src/index.js TQAPrayerPosture out/tqa-standard-v2.mp4 --overwrite`
