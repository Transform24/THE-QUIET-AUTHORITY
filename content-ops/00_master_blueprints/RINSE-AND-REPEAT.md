# Rinse and Repeat: the system to clone for a new project
*Written 2026-10-14 from what is already in this repository. Where something is not known, it says so. Nothing here is invented for the future projects.*

Use this file when Grace starts a new project (TGIF Streetwear, Cookie Cat Math, Special Populations). Copy the parts that apply, change only the words and the names, and leave the rules alone.

## 1. Permanent rules to carry into every project
1. Read the master blueprint (`README.md`) first, then the project's `CLAUDE.md`.
2. Do only what Grace asked. If a step goes past the request, stop and say so in one line.
3. No cost, paid generation or voice credit without Grace approving it first.
4. Never ask Grace to paste a key, token or password into chat. Secrets live only in GitHub Actions secrets, Cloudflare Worker secrets or a gitignored `.env`.
5. Never commit a secret. Abort if a diff holds `sk_live_`, `sk_test_`, `rk_live_`, `ghp_`, `github_pat_` or `API_KEY=` followed by a value.
6. Never commit a raw `.mp4` to a public branch. Keep `*.mp4` in `.gitignore`.
7. Never force-push `main`. Rewrite a side branch only when Grace says so in her own words.
8. Nothing uploads or posts by itself. Grace uploads and posts herself.
9. Writing: no em dashes, no emoji, plain words, one step at a time. Scripture is KJV only, checked word for word, LORD in capitals.
10. Approvals are Grace's own. An agent never records a video as approved unless Grace said so for that video.

## 2. The video pace rules (from `content-ops/04_youtube/remotion/src/tqaStandard.mjs` and `TQA-STANDARD.md`)
| Rule | Value |
|---|---|
| Long video length | exactly 8 minutes, 11,520 frames at 24 fps, 1920 by 1080 |
| Scripture reveal speed, long video | 80 words a minute, a breath at commas and full stops |
| Quiet after scripture | 4 seconds |
| Reflection typing | 4.5 letters a second, then an 8 second rest, then a 1 second dissolve |
| Short (vertical) length and speed | 60 seconds, 1080 by 1920, 105 words a minute (`src/tqaShorts.mjs`) |
| Longest still page (dead air) | 12 seconds. Checked by `scripts/verify-visual-integrity.mjs` |
| Text box width | 780 pixels at most, kept off the figure, jar and candle |
| Colors | black `#0d0d0d`, gold `#C9A84C`, cream `#F5F0E8` |
| Fonts | Cinzel for headers (gold), Jost for body (cream) |
| Music | one approved score per property, looped softly, fading in and out |
| Voice | none in YouTube masters |

To clone for a new project: copy the remotion folder, replace the picture plates, the music file and the JSON words, and change the brand colors and fonts only if that project's own brand tokens say so. Keep the checker scripts. A project that changes a pace number needs Grace's approval for that number.

## 3. How a video is made, in order
1. Edit only the data JSON (words). Every scripture must be listed in `kjv-registry.json` and match the live KJV.
2. Run the project's validate command, then the KJV match check.
3. Render locally, then run `verify-visual-integrity.mjs` (12 second limit, picture dropouts, 780 pixel text).
4. Write the review card and the gate entry. Grace approves with her own word.
5. Grace uploads herself. The release calendar is `workflows/output/youtube-schedule.json`.
6. Shorts, Reels and Pins are cut from the finished master and posted by hand after it.

## 4. Mobile-safe layout (780 pixels)
Every text column in a video is 780 pixels or narrower. Every web page must stay readable at a phone width of 390 by 844 (the smoke test size). Check with the project's smoke test before calling a page finished.

## 5. Shop and payment profile (what is known, what is not)
Known, from `content-ops/06_storefront-sync/Q4-HOLIDAY-SETUP.md` and `storefront-visibility.json`:
- Printful products stay hidden on the site until the Printful key is saved as the GitHub secret `SANCTUARY_GRACE_KEY` and each item is marked complete in `storefront-visibility.json`. Check with `node scripts/storefront-visibility.mjs --check`.
- The carrier setting for wall art is recorded as UPS Mail Innovations, but it is not confirmed. Grace checks it in Printful, Settings, Shipping, then says "carrier confirmed".
- Stripe checkout links must be confirmed in the live Stripe account before use (active, correct price, returns the buyer to the right page), then entered on the page and in the smoke test list.
Not known: any carrier, product or price profile for TGIF Streetwear, Cookie Cat Math or Special Populations. None exists in the repository, so none is written here. Ask Grace for each before building.

## 6. Voice
Voice assets follow `_system/audio-tracker.md`: a recording is generated only after Grace approves the final text. The voice profile Satora (Grandmother) is for the Wilderness 5-day courses and devotionals only. A new project gets its own voice decision from Grace.

## 7. Cloning checklist for a new project
1. Ask Grace for the project's name, brand tokens (colors, fonts), voice, and what she wants first.
2. Search the repos and Drive for what already exists before building.
3. Create the project's own `CLAUDE.md` that imports the master blueprint.
4. Copy only the parts of sections 2 to 4 that apply. Keep the checkers.
5. Add `.gitignore` entries for `*.mp4`, `node_modules/` and `out/`.
6. Record the project in the ecosystem map of the master blueprint, and in `STATUS.txt`.
7. Before calling it finished: saved to GitHub and Drive, sizes compared, `STATUS.txt` true.
