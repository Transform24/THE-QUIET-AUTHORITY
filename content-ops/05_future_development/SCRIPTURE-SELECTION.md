# Scripture Selection: Psalms Series (Option B, Psalms Intimacy)
*Created 2026-10-13 on the branch `tqa-compositions`. Local staging only. Nothing here is live, uploaded or posted.*

This file holds the scriptures chosen for the next TQA master videos. Every verse is King James Version only, and every word was matched to the KJV text from bible-api.com on 2026-10-13. The same wording is held in `content-ops/04_youtube/remotion/src/data/kjv-registry.json`, and the video checker refuses a video whose scripture differs from it.

## Week 7: One Word Under All of Them: Immanu

- Video file: `v14` (`TQA_Stillness_Journey_FINAL_v14`)
- Sunday release slot: November 29, 2026, 5:00 AM Eastern (the Sunday after Week 6)
- The one word: Immanu, which means "with us". It is the word under each verse below. Grace confirmed its spelling and meaning in chat on 2026-10-13.
- Status: agent draft, awaiting Grace's review and approval. Grace reviews and approves. She does not have to write it.

| Block | Reference | KJV text |
|---|---|---|
| 1 | Psalm 46:1 | God is our refuge and strength, a very present help in trouble. |
| 2 | Psalm 46:7 | The LORD of hosts is with us; the God of Jacob is our refuge. Selah. |
| 3 | Psalm 84:11 | For the LORD God is a sun and shield: the LORD will give grace and glory: no good thing will he withhold from them that walk uprightly. |

After the three blocks the video follows the standard: Romans 10:9-10, the prayer, then the Thank you for watching page. See `content-ops/04_youtube/remotion/TQA-STANDARD.md`.

## Rules for every verse on this list
1. KJV only, with the reference. Never from memory: match it to the KJV text first.
2. LORD in capitals where the KJV prints it so.
3. No em dashes, no emoji, no banned words (`content-ops/_factory/brand-voice.md`).
4. Psalm 25:14 stays in Video 12 (Week 5). It is not repeated here.
5. The master videos stay silent of voice. See `_system/audio-tracker.md`.

## Reflections and prayer
The reflections and the prayer for Week 7 are drafted by the agent in `src/data/TQA_Stillness_Journey_FINAL_v14.json` and marked as drafts. Grace reads them and says yes or asks for a rebuild before anything else happens.

## Staged captions (local only)
Three Short caption cards for Week 7 are in `content-ops/05_future_development/staged-captions/` (`node scripts/stage-week7-captions.mjs --stage`). The same script's `--check` proves the video data matches this table character by character.
