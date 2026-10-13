# KJV Verification Report: Week 7 (Video 14)
*Run 2026-10-13 on the side branch `tqa-compositions`. Command: `npm run verify:kjv-v14` in `content-ops/04_youtube/remotion/` (script `scripts/verify-kjv-match.mjs`). It fetches the King James Version live from bible-api.com and compares it word for word. Status of the video: local preview deck only, unchanged.*

## Result: all scriptures match, nothing needed correcting

| Reference | Matches the registry | Matches the live KJV | LORD in capitals |
|---|---|---|---|
| Psalm 46:1 | Yes | Yes | None in this verse (the KJV prints "God") |
| Psalm 46:7 | Yes | Yes | 1 of 1 |
| Psalm 84:11 | Yes | Yes | 2 of 2 |
| Romans 10:9-10 | Yes | Yes | None. The KJV prints "the Lord Jesus", which is correctly lower case, so it was left as the KJV has it |

## The three phrases named for this audit
- Psalm 46:1: "a very present help" is present. Full verse: "God is our refuge and strength, a very present help in trouble."
- Psalm 46:7: "The LORD of hosts is with us" is present. Full verse: "The LORD of hosts is with us; the God of Jacob is our refuge. Selah."
- Psalm 84:11: "them that walk uprightly" is present. Full verse: "For the LORD God is a sun and shield: the LORD will give grace and glory: no good thing will he withhold from them that walk uprightly."

## Capitalization of LORD outside the scriptures
Checked the three reflections, the prayer and its four lines. Every use of the name is in solid capitals ("The LORD of hosts" in reflection 2, "the LORD of hosts" and the opening "LORD," in the prayer). No lowercase "lord" or mixed case was found, so no correction was made.

## Layout re-check (local)
`npm run validate:tqa-v14` passes: every text box is held to 780 pixels or less, text is Jost for body and Cinzel for headers, only the three brand colors are used, no long dashes, emoji, exclamation points or banned words. The six earlier videos still pass.

## Status
Video 14 stays on the local preview deck (`workflows/output/local-staging.json`, Ready, Approved locally). It is not on the live portal and not on `main`.
