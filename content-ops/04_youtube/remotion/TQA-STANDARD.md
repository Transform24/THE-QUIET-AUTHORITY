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
- Uploads to YouTube: the old rule "Nothing uploads to YouTube. Grace uploads herself." was lifted by Grace on October 11, 2026. See "Upload restriction lifted" at the end of this file.

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

## Layout exception (the line-by-line prayer: videos 8, 9, 10, 11, 12 and 13)
The prayer page of `TQA_Stillness_Journey_FINAL_v11` is allowed to arrive line by line: four prayer beats, each broken into short lines that spring up from below and push the earlier lines upward, in Jost, inside the 780 pixel column. The checker allows this for v8, v9, v10, v11, v12 and v13 only, and only between the PRAYER-BEGIN and PRAYER-END marks in the layout file. The pushed prayer page takes the time the words leave, so the thank you page can stay at 30 seconds. Everything else in the v11 layout must match the standard file exactly, and the colors, fonts, width limit and words checks stay in force.

## Shorts, Reels and Pins (planned cuts from each video)
`scripts/generate-shorts-pipeline.mjs` plans three 60 second vertical cuts (1080 by 1920) from each finished video: Clip A the first scripture with its reflection, Clip B the middle scripture with its reflection, Clip C the prayer arriving one line at a time. The layout is `src/TQAShortClip.jsx` and the pace rules are in `src/tqaShorts.mjs`. A short reads a little quicker than the long video (105 words a minute) because it is read on a phone. Text boxes stay at 780 pixels in Jost, inside the phone safe zone, with the picture centered on the candle or the seated woman and the Version 8 music underneath. The last 6 seconds point to the full video and sanctuary-grace.com.

Commands (run in the remotion folder): `npm run shorts:plan` writes the caption documents to `workflows/output/shorts-staged/`, `npm run shorts:check` checks the assets, the plan, the captions and the shared engine, and `npm run shorts:render -- v12 A` renders one clip into `out/shorts/`. Nothing uploads. v9 carries the same words as v10, so its clips repeat v10's.

## Locked pacing: long videos and shorts (permanent note)
Pacing is intentionally set at two different speeds, and neither is to be changed without Grace's approval.
- The Long-Form Master (every 8 minute video) is locked at 80 words per minute for the scripture reveal.
- Shorts are locked at 105 words per minute, for mobile performance. A short is read on a phone in 60 seconds, so it moves a little quicker.
The long video rule lives in `src/tqaStandard.mjs` and the shorts rule in `src/tqaShorts.mjs`.

## Pinterest: automatic scheduler paused (permanent note, 2026-10-11)
The automatic Pinterest scheduler is paused to protect the account's standing. The daily schedule in `.github/workflows/pinterest-agent.yml` is commented out, so nothing pins on its own. The workflow can still be started by hand from the GitHub Actions panel. Pinterest pinning is now done by hand, using the finished vertical Shorts in `public/shorts/` and the Pinterest text in each caption card in `workflows/output/shorts-staged/`. The long-form masters and every short stay tracked in this branch and on `main`, and nothing in this change touches them.

## Engagement Metrics Tracker (channel numbers on the approval gate)
`scripts/capture-sanctuary-insights.mjs` turns the numbers Grace exports from YouTube Studio into the gauges on `approval-gate.html`. She fills in `workflows/output/engagement-input.json` (the channel log, made with `--template`), and `--capture` writes `workflows/output/engagement-metrics.json`. For each of the five master videos the gate shows a Hook rate (still watching at 30 seconds), a Retention drop-off (100 minus the average percentage viewed) and a Traffic redirection (clicks to sanctuary-grace.com divided by views). Each video is paired with its top 60 second short, and the pairs are sorted from highest engagement to lowest. A short's engagement is 70 percent how much of it is watched plus 30 percent how many click through. v9 uses the v10 shorts. No number is ever estimated: anything not in the log shows "no data yet". `node scripts/capture-sanctuary-insights.mjs --check` proves the maths and the sorting.

## Upload restriction lifted (permanent record, October 11, 2026)
On October 11, 2026, Grace lifted the old rule that said nothing uploads to YouTube and that she uploads herself. In her own words in the session: "I, Grace, lift rule 6. You are explicitly authorized to upload my videos to YouTube on the calendar dates." The authorization covers the five master videos on their calendar Sundays at 5:00 AM Eastern: v9 on Oct 18, v13 on Oct 25, v11 on Nov 1, v10 on Nov 15 and v12 on Nov 29. Each is meant to be uploaded privately and scheduled to go public on its own date, one at a time, never all at once. The authorization does not cover anything else: no other video, no shorts, and nothing on Pinterest or Instagram, which stay paused. This note records the decision. The rule in the blueprint on `main` must be updated to match before any upload runs.

## System security status (recorded October 12, 2026)
These are the backend security measures that sit under every video and every link. The full table is in `content-ops/06_storefront-sync/Q4-HOLIDAY-SETUP.md`, Part 2. They were read from Cloudflare on this date. Secret values are never read or written, only names.
- Domain `sanctuary-grace.com`: Cloudflare zone active, SSL mode Full, Always Use HTTPS on, minimum TLS 1.2.
- Email sending: SPF, the MailerLite DKIM key (not proxied) and DMARC (monitoring only) are all present.
- The five secret names on the Worker `lively-dew-924c` match the blueprint. No raw key was found in the repository or in the three Worker scripts read.
- The video engines read no secret. They have read-only access and no upload step, and the check workflow fails the build if one starts to read a secret.
- Upload authorization: the only authorized uploads are the five master videos in the section above. Any upload workflow reads its keys from GitHub Actions secrets only.
- Checkout links: the six gate links match the daily smoke test. The retired Gate One link is not shown on any page. See `content-ops/06_storefront-sync/STRIPE-VERIFICATION.md`.
- Not verified from here: the GitHub Actions secret values, the Stripe account settings, and the Printful carrier setting. Each is listed for Grace to check.
- Check commands: `node scripts/storefront-visibility.mjs --check` for the shop filter, and the video checks in section 5.

On October 13, 2026 Grace re-aligned the release calendar: v8 on Oct 18 (Week 1), v9 on Oct 25, v11 on Nov 1, v10 on Nov 8, v12 on Nov 15 and v13 on Nov 22. Video 9 now carries Psalm 91. The dates above are the record of what was authorized on October 11. Video 8 was not part of that authorization. Nothing uploads without Grace's word.

## Voice boundary: the master videos stay silent (permanent, 2026-10-13)
Grace's decision. Every YouTube master video stays 100% silent of voice. There is no narration, no spoken scripture and no spoken prayer. The words are on the screen and the only sound is the Version 8 music, as it is today. This protects the brand standard. The ElevenLabs grandmother storytelling voice profile is locked for one use only: the Wilderness 5-day website courses and their companion devotional materials. It is never used in a TQA master video, a Short, a Reel or a Pin. The voice recordings that already play on the gate pages (voice: Matilda) are a separate set, recorded earlier, and are not changed by this rule. The full record is in `_system/audio-tracker.md`.

## Starter credits treasury law (permanent, 2026-10-13)
A voice asset may be generated only after its script text has passed the final human validation gate: Grace has read the text and said yes. Automated drafts, agent drafts and test text never consume the monthly starter credits. If the text is not yet approved, nothing is generated. The step by step is in `_system/audio-tracker.md`.

