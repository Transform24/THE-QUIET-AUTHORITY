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
3. Closing scripture: Romans 10:9-10 is revealed the same way and rests for 8 seconds.
4. The prayer has its own page, a few lines at a time, for 1 minute 53 seconds.
5. Thank you page: "Thank you for watching." with the two lines and sanctuary-grace.com. It stays on screen until the end of the video.
6. The music and the picture fade out together over the last 8 seconds.

Every video is exactly 8 minutes (11,520 frames), which is the YouTube standard. The thank you page takes whatever time the words leave. The checker stops the render if the words are so long that the thank you page would be under 12 seconds.

## What you change for a new video
Only `src/data/tqa-prayer-posture.json` (or a copy of it): the scriptures, the reflections and the prayer.

## What you never change
- `src/tqaStandard.mjs` holds every pace rule. Every video is exactly 8 minutes.
- Every scripture must be listed word for word in `src/data/kjv-registry.json` (KJV only). The checker stops the render if a verse is missing or different, and prints CHECK for any verse not yet matched to a KJV source.
- Brand: black #0d0d0d, gold #C9A84C, cream #F5F0E8. Cinzel for headers, Jost for body. Text boxes 780 pixels or less.
- Nothing uploads to YouTube. Grace uploads herself.

## Commands (run in this folder)
- Check: `npm run validate:tqa-prayer`
- Render: `npx remotion render src/index.js TQAPrayerPosture out/tqa-standard-v2.mp4 --overwrite`
