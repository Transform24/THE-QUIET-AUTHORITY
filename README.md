# Sanctuary Grace Ecosystem Hub: Master Blueprint

Owner: Grace (Sanctuary Grace Ministry, Transform24)
Last rebuilt: 2026-10-07
Purpose: This file is the permanent memory baseline. Every session, human or AI, reads this file first, before any other action.

---

## 1. PERMANENT EXECUTION MANDATES (never override)

1. **Scripture is King James Version (KJV) only.** Verify every verse against the KJV before it reaches Grace. Never paraphrase a verse and present it as scripture.
   - Isaiah 43:18 (KJV): "Remember ye not the former things, neither consider the things of old."
   - Luke 4:17-18 (KJV): "And there was delivered unto him the book of the prophet Esaias. And when he had opened the book, he found the place where it was written, The Spirit of the Lord is upon me, because he hath anointed me to preach the gospel to the poor; he hath sent me to heal the brokenhearted, to preach deliverance to the captives, and recovering of sight to the blind, to set at liberty them that are bruised,"
2. **No em dashes, ever.** The long dash character is banned in all copy, code comments, commit messages and documents. Use a period, comma, colon or the word "and" instead.
3. **Humanized, sequential tone.** Write like a caring person walking someone through a path, one step at a time, in order. Plain words, no jargon, no hype, no performative warmth.
4. **Do only what Grace asked.** If a step goes beyond the request, stop and say so in one line.
5. **No paid generation or any cost without Grace approving the cost first.**
6. **Never upload to YouTube.** Grace does her own quality check and uploads herself.
7. **Never ask Grace to paste keys, tokens or passwords into chat.** If a secret is ever shared in chat, stop all work and rotate it.
8. **Never rebuild what already exists.** Search the repos and Drive first.
9. **Grace is not the messenger.** Never ask her to relay, copy or retype what the files already hold.

---

## 2. SESSION START CHECKLIST (every session, in this order)

1. Read this README.md.
2. Read `CLAUDE.md` in the project being touched (Quiet Authority holds the full agent SOP).
3. Read the live truth: `_system/status.md` and `STATUS.txt` in THE-QUIET-AUTHORITY.
4. State three lines to Grace: done, running, next.
5. Work only on what she asked. Update STATUS.txt after every meaningful step.
6. Before calling anything finished: saved to GitHub and Google Drive, sizes compared, STATUS.txt true.

(Claude Code loads `CLAUDE.md` automatically, and that file imports this README, so this baseline is read at the start of every session.)

---

## 3. THE ECOSYSTEM MAP

| Property | GitHub repo | What it is |
|---|---|---|
| The Quiet Authority | `Transform24/THE-QUIET-AUTHORITY` | The main site and hub. Serves sanctuary-grace.com through GitHub Pages. Holds the content agents (Pinterest, Substack, Instagram, YouTube), the approval gate, the gate pages and the shared SOP files. |
| The Circle of Silence | `Transform24/THE-CIRCLE-OF-SILENCE` | The Cloudflare Worker (`lively-dew-924c`) that handles MailerLite sign-ups, Stripe purchase checks, the TWWP and Names of God ebook delivery, and restore-access. Also holds the Secret Place page and ebook assets. |
| The Wilderness | `Transform24/the-wilderness-storefront-` | The Wilderness storefront and book manifest. |

Other repos in the account (not part of this hub): `TQA-2`, `Math-cat`.

### The umbrella workspace
For shared context, the three properties are gathered side by side under one root folder named `sanctuary-grace-ecosystem`:

```
sanctuary-grace-ecosystem/
  README.md                 (this blueprint)
  the-quiet-authority/
  circle-of-silence/
  the-wilderness/
```

IMPORTANT: this umbrella is a working copy for context only. The three GitHub repos stay separate and stay live. See section 6 for why they must not be physically merged.

---

## 4. LIVE INFRASTRUCTURE

- **Domain:** `sanctuary-grace.com` (with a hyphen). Cloudflare zone, active. The spelling `sanctuarygrace.com` (no hyphen) is NOT in the Cloudflare account. Always use the hyphen.
- **Hosting:** GitHub Pages from the root of THE-QUIET-AUTHORITY (`CNAME` file, four GitHub A records, `www` points to `transform24.github.io`). Cloudflare SSL mode: Full. The root `index.html` is the Welcome foyer (four doors) and `about.html` is the About page.
- **Cloudflare Workers sit in front of some pages (found 2026-10-08).** Routes on `sanctuary-grace.com` hand these exact paths to a Worker before GitHub Pages sees them: `/gate-one.html` to `/gate-five.html` and `/library.html` go to the Worker `sg-gates` (the `/gate-six.html` route was removed on 2026-10-08, see item 23); `/how-to-pray.html` and `/hubs*` go to `sg-hubs`. These Workers are not in any repository. A route matches the exact path only, so adding any `?query` skips the Worker and shows GitHub's own copy, which is a quick way to compare. What `sg-gates` does: it swaps the old Gate One checkout link for the current one, adds the bonus line to Gates 1 to 5, and serves its own stored copy of the Library. Compare the live page with GitHub's before trusting that a change to these pages is visible.
- **Email engine:** MailerLite (live). Sending authentication is set in Cloudflare DNS (section 5).
- **Payments:** Stripe, live.
- **Worker:** `lively-dew-924c` on Cloudflare Workers. Secrets held in Cloudflare (names only): `MAILERLITE_API_KEY`, `RESTORE_ACCESS_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_TEST_SECRET_KEY`, `TWWP_SEED_SECRET`.
- **Automation (GitHub Actions in THE-QUIET-AUTHORITY):** pinterest-agent (running daily, refreshes its own access token once the one-time setup is done), substack-agent (PAUSED by Grace 2026-10-03, manual run only, saves a DRAFT only and never publishes), substack-deploy (PAUSED, publishes only what Grace moves into `workflows/output/substack-approved/`, and skips anything already marked PUBLISHED in the log), instagram (paused, Meta restriction), youtube, live-smoke-test, ux-check, remotion-check (compiles both video engines on every change), remotion-psalm91 and remotion-gates (manual video renders, no secrets, no uploads).
- **Secondary domain:** `sanctuarygrace.store`, Cloudflare zone is pending (nameservers not yet switched at the registrar).

---

## 5. EMAIL AUTHENTICATION (MailerLite on sanctuary-grace.com)

These records must exist in Cloudflare DNS for the zone `sanctuary-grace.com`. All are present as of 2026-10-07.

| Type | Name | Value | Purpose |
|---|---|---|---|
| TXT | `sanctuary-grace.com` | `v=spf1 include:_spf.mx.cloudflare.net a mx include:_spf.mlsend.com ~all` | SPF. Authorizes MailerLite and Cloudflare Email Routing. Only ONE SPF record may exist. |
| CNAME | `litesrv._domainkey` | `litesrv._domainkey.mlsend.com` | DKIM for MailerLite. DNS only (grey cloud), never proxied. |
| TXT | `sanctuary-grace.com` | `mailerlite-domain-verification=...` | Proves domain ownership to MailerLite. |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:tdwdemp@gmail.com` | DMARC. Monitoring only. |

Rule: never delete these. Never proxy the DKIM CNAME. Never add a second SPF record, merge into the existing one.

---

## 6. NEVER DO (workspace wide)

- Never force-push `main`.
- Never move `index.html`, `about.html`, `gate-*.html`, `CNAME`, `.nojekyll`, `approval-gate.html`, `privacy.html`, `404.html` or their sibling assets out of the THE-QUIET-AUTHORITY repo root. GitHub Pages serves from the root.
- Never move `workflows/scripts/*.py`, `workflows/output/*`, `workflows/youtube-log.md` or `workflows/substack-log.md`. The workflow files and the scripts hardcode those exact paths.
- Never move `music1.mp3` to `music4.mp3` out of the repository root. The website player and both video engines read them from there.
- Never edit one video engine's shared files without the other. They must stay identical (section 11).
- Never nest a repo inside another repo and expect its `.github/workflows` to run. GitHub only reads workflows from the top level of each repo.
- Never add npm, build tools or frameworks to the live site.
- Never change design tokens or brand voice without Grace's approval.
- Never reference Make.com or Systeme.io as live. Both are dead. MailerLite is the email engine.
- Never resume the paused Substack schedule unless Grace says so.
- Never commit a secret. Abort if a diff contains `sk_live_`, `sk_test_`, `rk_live_`, `ghp_`, `github_pat_` or `API_KEY=` followed by a value.

---

## 7. SECRETS POLICY

- Real values live only in: Cloudflare Worker secrets, GitHub Actions secrets, or a local gitignored `.env`.
- `.env.example` in this repo lists the key names with empty values. Copy it to `.env` and fill it in locally. `.env` is gitignored.
- GitHub Actions secrets that the workflows actually read in THE-QUIET-AUTHORITY (names only, checked against the code on 2026-10-08):
  - Writing and images: `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`
  - Pinterest: `PINTEREST_APP_ID`, `PINTEREST_APP_SECRET`, `PINTEREST_REFRESH_TOKEN`, `PINTEREST_ACCESS_TOKEN` (temporary fallback only)
  - Substack: `SUBSTACK_COOKIE_ID`
  - Instagram (paused): `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, `IG_DEFAULT_IMAGE_URL`
  - YouTube: `YOUTUBE_API_KEY`, `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`
  - GitHub: `GH_SECRETS_PAT`
- Old names that no code reads anymore: `YOUTUBE_SESSION_SID` and `YOUTUBE_SESSION_HSID` (commented out in the YouTube script), `PINTEREST_BOARD_ID` (the pin script finds boards by name). They can stay in the vault or be removed.
- These secrets are passed to scripts only through each step's `env:` block, never typed into a command, so GitHub hides their values in logs.
- `PINTEREST_APP_SECRET` is the App Secret from the Pinterest Developer Configure tab (App ID 1585025). It was regenerated on 2026-10-07 after it was pasted in chat once.
- `PINTEREST_REFRESH_TOKEN` is created by the one-time workflow `pinterest-oauth-setup.yml` after Grace approves the app, and is renewed automatically by `pinterest-agent.yml`. It is NOT in place until that setup runs.
- `GH_SECRETS_PAT` is a fine-grained GitHub token with Secrets read and write on THE-QUIET-AUTHORITY only. The agent uses it to save a renewed Pinterest refresh token. It expires on the date Grace chose, so renew it before then.
- `PINTEREST_API_KEY` was deleted on 2026-10-07. Nothing uses it.
- Never paste any of these values into chat. Enter them only in GitHub Settings, Secrets and variables, Actions.

---

## 8. OPEN ITEMS (as of 2026-10-08)

1. Gate 1 email sequence has no live delivery path since Systeme.io was shut down. Needs a decision: load into MailerLite.
2. Video project is blocked until Grace allows `sanctuary-grace.com` and `bible-api.com` in the cloud environment Network access settings and supplies the stills, music and verse list.
3. The commit email `noreply@sanctuarygrace.com` (wrong domain spelling) appears in 7 workflow files. Cosmetic, fix when next editing the workflows. `_system/channels.md` also lists `sanctuarygrace.com` as the Pinterest account name.
4. DMARC is monitoring only (`p=none`). Tighten after a few weeks of clean reports.
5. COMPLETED 2026-10-07: Cloudflare "Always Use HTTPS" is on and minimum TLS is 1.2 for sanctuary-grace.com (SSL mode stays Full). Verified by reading the settings back and confirming http redirects to https.
6. Verify each GitHub Actions secret is still valid (see Grace's refresh instructions delivered with this blueprint).
7. Pinterest one-time approval is still pending: add the redirect address `https://sanctuary-grace.com/pinterest-callback.html` in the Pinterest Configure tab, approve the app, then run `pinterest-oauth-setup.yml` with the code. Also note that Pinterest Trial access shows pins only to the app owner, so daily pins may not be public until Standard access is approved.
8. The first real Substack draft is the first true test of the cookie. Earlier runs in June failed with HTTP 403. Substack stays paused until Grace says otherwise.

Findings from the 2026-10-08 file system audit (nothing below has been changed yet; each needs Grace's go-ahead):

9. COLORS. The four core colors are 1,369 of 1,612 color uses (85%). Another 90 uses are official tokens from `_system/brand-tokens.md`. 153 uses of 28 colors are off the palette, mostly `#0a0a0a` (53), `#141414` (15), `#e8d5b0` (14), `#9a9a94` (11), plus pure white and black in `how-to-pray.html`, `secret-place-printable-cards.html`, `names-of-god.html` and `wall-art.html`. Decision needed: the official token file holds 18 colors (surfaces, borders, sage, tints), not only four. Choose whether to enforce the strict four or the full token set.
10. FONTS. 361 style rules in 18 pages (mostly the gate pages) set labels to the bare `sans-serif` browser default instead of Jost. `how-to-pray.html` and `hubs/` use Lato and Frank Ruhl Libre. `404.html`, `privacy.html` and one rule in `discover-your-profile.html` use Georgia first. (`pinterest-callback.html`, added on 2026-10-07, was brought onto the brand colors and fonts during this audit.) The four Hebrew pages use Noto Serif Hebrew (probably needed for Hebrew letters; Grace to decide). Cormorant Garamond, Jost and Cinzel are otherwise used correctly.
11. SCRIPTURE. `discover-your-profile.html` quotes NIV wording for five verses (Matthew 11:28, Isaiah 43:1, Jeremiah 1:5, Zephaniah 3:17, Psalm 139:14) and advertises a parallel Bible of NIV, NKJV, NLT and The Message. The 30 daily devotion scriptures in the Substack agent read as accurate KJV, though two verses repeat (Matthew 11:28 on days 4 and 22, Isaiah 40:29 on days 10 and 20).
12. EM DASHES. Public pages 66 (46 in `gate-one.html`), agent scripts 281 (the devotion and caption text that gets published), content notes 2,639 (mostly internal skill files), internal docs 156. The ban applies to everything Grace publishes.
13. WORDING. Self-help phrasing in public copy: "best life" and "burnout" in `about.html` (the About page, formerly `index.html`), "show up for yourself" in `lost-wanderer.html`, "you are enough" and "your truth" in `discover-your-profile.html` and `the-names-of-jesus-and-the-holy-spirit.html`. "Burnout" is also in a book title.
14. SYMBOLS. No pictographic emoji on public pages. Typographic marks appear in `discover-your-profile.html` (39) and `approval-gate.html` (4). Real emoji appear only in internal log messages of the Instagram and YouTube deploy scripts.
15. SECRETS MAP. No raw keys were found in 562 files or in the 8 commits of available history. Secrets were not visible from outside GitHub, so whether each one exists and is still valid cannot be confirmed from here.
16. VIDEO, older promo. `QuietAuthorityVideo.jsx` (the three promo videos in `content-ops/04_youtube/remotion`) still uses colors and fonts outside the palette (`#0b0b0b`, `#c9a96e`, `#f0ead8`, Georgia, Arial) and its background image `banner.png` is not stored, so it renders with the picture missing. (Its music now works, because `npm run studio` stages `music1.mp3` from the root.) It is not covered by the new brand guard. Grace to decide whether to rebuild it in the same style as the scripture reveal.
17. VIDEO, music choice. Gates 1 to 3 use `music2.mp3` (Still Waters) and gates 4 to 6 use `music3.mp3` (Gratitude). Psalm 91 uses `music1.mp3` (violin and piano). Each is one field in the JSON, so Grace can change it in seconds.
18. VIDEO, gate words. The gate records in `circle-of-silence/` hold no scripture, so each gate reveal uses the hero verse printed on its own page (Luke 4:18, Psalm 46:10, Isaiah 43:2, Proverbs 3:5-6, Hebrews 11:1, Jeremiah 29:11). Grace to confirm these are the verses she wants.
19. VIDEO, mirror (and the front door). The blueprint copies in THE-CIRCLE-OF-SILENCE, the-wilderness-storefront- and the Drive backup were last updated before sections 9 to 11 and the 2026-10-08 audit. They are older than this file, and do not yet know about the new front door.
20. COMPLETED 2026-10-08: Gate One's checkout link is locked in as `fZu4gz18I5C11Iw0sacQU0E` (checked against the live Stripe account: active, $9 one-time, accepts SECONDITEM15, returns the buyer to `gate-one.html`). The smoke test expects it. The earlier Gate One link `eVqfZh8Ba8Od0Es8YGcQU0w` is still active in Stripe and could be deactivated.
21. COMPLETED 2026-10-08: Gate Six's "A word from Grace" audio player was restored from the 2026-09-14 version (a bulk commit on 2026-10-05 had dropped it). It plays `assets/audio/gate-6-voice.mp3`. This is in the repo, and visitors now see it since item 23 was settled.
22. COMPLETED 2026-10-08: the Welcome foyer is now the homepage (`index.html`). The old About page moved to `about.html`, with its canonical and share addresses updated and a Return Home link added.
23. COMPLETED 2026-10-08: LIVE GATE SIX AUDIO. With Grace's approval, the single Cloudflare Worker route `sanctuary-grace.com/gate-six.html` (script `sg-gates`, route id `608edc2416c34c0a8be779bccd0b2e0b`) was removed, so GitHub Pages now serves the repo's Gate Six page directly, player included. The other 11 routes were not touched. To undo, add that same route pattern back to `sg-gates` in Cloudflare. Verified live: the player plays and pauses in a phone-sized browser, and the smoke test passes 29 of 29.

---

## 9. FILE SYSTEM GUIDE (follow the steps in order)

Each step builds on the one before it. Do not skip ahead.

**Step 1. Start at the root of THE-QUIET-AUTHORITY.**
- The root is the live website. GitHub Pages serves `sanctuary-grace.com` straight from it.
- These stay at the root forever: `index.html` (the Welcome foyer), `about.html`, `gate-zero.html` through `gate-six.html`, `approval-gate.html`, `privacy.html`, `404.html`, `CNAME`, `.nojekyll`, and the pages and images they link to.
- Anything new that visitors should open by web address goes at the root as one flat `.html` file.

**Step 2. Read the guide files before touching anything.**
- `README.md` (this file) is read first.
- `CLAUDE.md` routes you to the right detail file.
- `SITE-CONTEXT.md` explains how the live pages work.
- `_system/` holds the current truth: `status.md` (what is live, paused or dead), `brand-tokens.md` (colors and fonts), `channels.md`, `integrations.md`, `git-workflow.md`, `changelog.md`.

**Step 3. Understand the public pages.**
- Front door: `index.html` is the Welcome foyer, headed by Proverbs 4:23 (KJV), with four numbered doors: How To Pray, The Quiet Authority, The Circle of Silence (Gate Zero) and The Woman Who Pours Shop. `about.html` is the About page (Luke 4:18 and why the ministry exists). `foyer.html` is the older door page and still works.
- Gate pages: `gate-zero.html` is the entry. `gate-one.html` to `gate-six.html` are the six gates of the Circle of Silence.
- Profile pages: `guilty-giver.html`, `lost-wanderer.html`, `striving-achiever.html`, `depleted-survivor.html`, linked from `gate-one.html` and `the-secret-place.html`. The assessment itself is `discover-your-profile.html`.
- Library and tools: `library.html`, `names-of-god.html`, `how-to-pray.html`, `daily-sanctuary.html`, `the-secret-place.html` and its foyer.
- Support pages: `restore-access.html`, `save-my-progress.html`, `privacy.html`, `404.html`, `pinterest-callback.html` (shows the one-time Pinterest approval code).

**Step 4. Understand the supporting folders.**
- `assets/` holds audio, fonts, print-ready files and image sets, grouped by project.
- `images/` holds a few cover images.
- `hubs/` holds the hub pages and their shared `hub.css` and `hub.js`.
- `scripts/live-smoke-test.mjs` and `tests/ux-check.spec.js` are the automatic checks that run on GitHub.
- `scripts/check-remotion-sync.mjs` keeps the two video engines identical and on-brand.
- `content-ops/04_youtube/remotion/` and `circle-of-silence/remotion/` are the two video engines (section 11). The music stays at the root.

**Step 5. Understand the content records.**
- `circle-of-silence/` has one record per gate (`gate-1-hakria.md` to `gate-6-hithavut.md`), `products.md` and `CONTEXT.md`.
- `content-ops/` is the content pipeline. Numbered folders `01_repurpose` to `09_daily-checkin` are stages. `_factory/` holds shared templates and voice files. Read `content-ops/CONTEXT.md` first.

**Step 6. Understand the automation.**
- `.github/workflows/` holds the schedulers: pinterest, substack, instagram, youtube agents and deploys, the smoke test, the UX check and the Pinterest one-time setup.
- `workflows/scripts/` holds the Python each workflow runs. The workflow files and the scripts hardcode each other's paths, so do not move either.
- `workflows/output/` holds the working folders: `*-pending` (waiting for Grace), `*-approved` (Grace moved it here to approve), `*-drafts`. `substack-log.md`, `youtube-log.md` and `pin-log.md` are the run records.

**Step 7. Follow the approval flow.**
1. An agent writes a draft into a `*-pending` folder (Substack also saves a draft on Substack itself).
2. Grace reviews it in `approval-gate.html` or in the platform.
3. Grace moves approved items into the matching `*-approved` folder.
4. The deploy workflow publishes only what is in `*-approved`, then writes the log.
5. Nothing publishes without Step 3.

**Step 8. Know where old things go.**
- `_archive/` holds retired material (Systeme.io, Make.com, old reports). It is kept for history. Do not build on it and do not scan it for current facts.

**Step 9. Know where secrets live.**
- Never in any file. Only in GitHub Actions secrets, Cloudflare Worker secrets, or a local `.env` that git ignores (section 7).

**Step 10. Before you save any change.**
1. Run the brand and content checks in section 10.
2. Confirm no file in the "stays at root" list moved.
3. Push to GitHub, then save a copy to the Drive folder "Sanctuary Grace Ecosystem Backup".
4. Compare byte sizes on both sides and update `STATUS.txt`.

---

## 10. BRAND AND CONTENT STANDARDS (locked, checked in every audit)

**Colors.** The four core colors, and what each is for:
- Black `#0d0d0d`: page background.
- Gold `#C9A84C`: headings, rules, key accents.
- Cream `#F5F0E8`: main reading text.
- Terra `#C1593C`: calls to action and emphasis.
- The full token set (surfaces, borders, sage, softer tints) lives in `_system/brand-tokens.md`. Never change it without Grace's approval.

**Fonts.** Three families, each with a job:
- Cormorant Garamond: headings, display, scripture, the reveal moments.
- Jost: body text, buttons, labels and interface text.
- Cinzel: section badges, product labels, small capital-letter decoration.
- A fallback after the brand font is fine. A page must never rely on the browser default font as its main font.

**Words.**
- Scripture is KJV only, with the reference. Check the wording against the KJV, never from memory.
- No em dashes, no emoji in copy.
- No self-help or wellness jargon. The banned list lives in `content-ops/_factory/brand-voice.md`.
- Voice: sacred, tender, plain, one step at a time. Minister, never marketer.
- All writing is original to Sanctuary Grace.

**How to run the sweep.**
1. List the colors in each page and compare them with the token file.
2. List the font families and compare them with the three above.
3. Search for the em dash, emoji, banned words and non-KJV version names (NIV, NKJV, NLT, ESV, The Message).
4. Compare the secrets named in `.github/workflows/` with section 7.
5. Record every mismatch in section 8 and wait for Grace's decision before fixing.

---

## 11. VIDEO GENERATION FRAMEWORK (automated, under the Sanctuary Grace Ministry umbrella)

One scripture reveal engine, built once and placed in two homes so every video looks the same: solid black `#0d0d0d`, gold verse badge `#C9A84C`, cream words `#F5F0E8`, set in Cormorant Garamond, Jost and Cinzel.

| Engine | Folder | Words | Music | Videos it makes |
|---|---|---|---|---|
| Psalm 91 (YouTube) | `content-ops/04_youtube/remotion/` | `src/data/psalm91.json`, 16 verses | `music1.mp3` | `Psalm91Full` (about 191 seconds) and `Psalm91Verse` (one clip per verse) |
| Six gates (Circle of Silence) | `circle-of-silence/remotion/` | `src/data/gates.json`, 6 gates | gates 1 to 3 `music2.mp3`, gates 4 to 6 `music3.mp3` | `GatesFull` (about 108 seconds) and `GateVerse` (one clip per gate) |

All videos are vertical 1080 by 1920.

**How to make a video, in order**
1. Edit only the JSON file for that engine. Keep KJV wording, no em dashes, and the exact colors already in the file.
2. Check it: `npm run validate:psalm91` or `npm run validate:gates`. It stops on a wrong verse count, wrong marker, wrong color, em dash, emoji, markup, bad speed, or missing music.
3. Render on GitHub: Actions, then "Remotion Render Psalm 91 (vertical)" or "Remotion Render Gates (vertical)", then Run workflow. Or render locally with `npm run render:psalm91` or `npm run render:gates`.
4. Download the videos from the run page (kept 14 days) and review them.
5. Grace uploads herself. Nothing in this framework ever uploads.

**How it behaves**
- Pace: words appear one at a time and fade in softly. About 110 to 130 words a minute, with a breath at commas, colons and full stops, and a 3 second rest at the end of each verse. `reveal_speed_ms` is the time given per letter. No word is shown for less than 0.42 seconds.
- Music: read from the repository root, copied into a git-ignored `public/` folder by `scripts/stage-audio.mjs`, then looped softly at about one fifth of full volume. It fades in at the start and out at the end, and each gate dips softly between gates.
- Shared files must stay identical in both engines: `ScriptureReveal.jsx`, `revealTiming.mjs`, `validate-core.mjs`, `stage-audio.mjs`, `render-clips.mjs`, `test-validator.mjs`, `index.js`. Only the JSON, the composition list in `Root.jsx` and the small `validate-*.mjs` file differ.

**What guards it**
- `scripts/check-remotion-sync.mjs` fails if the shared files differ, or if the video uses a color or font outside the brand set.
- `.github/workflows/remotion-check.yml` runs on every change: sync check, 44-case test of the script checker, the script check, music staging, and a full compile of each engine in a headless browser.
- No video workflow reads any secret. They have read-only repository access and no upload step. The check workflow fails the build if one ever starts to read a secret.

**Script pathways (every file, in order of use)**

| Step | Psalm 91 engine (`content-ops/04_youtube/remotion/`) | Gates engine (`circle-of-silence/remotion/`) |
|---|---|---|
| Words | `src/data/psalm91.json` | `src/data/gates.json` |
| Check the words | `npm run validate:psalm91` runs `scripts/validate-psalm91.mjs` | `npm run validate:gates` runs `scripts/validate-gates.mjs` |
| Prove the checker | `npm run test:validator` runs `scripts/test-validator.mjs` | the same |
| Stage the music from the root | `npm run stage-audio` runs `scripts/stage-audio.mjs music1.mp3` | `scripts/stage-audio.mjs music2.mp3 music3.mp3` |
| Render the whole video | `npm run render:psalm91` writes `out/psalm91-full.mp4` | `npm run render:gates` writes `out/gates-full.mp4` |
| Render one clip each | `npm run render:psalm91:clips` writes `out/clips/` | `npm run render:gates:clips` writes `out/clips/` |
| Video component and timing | `src/ScriptureReveal.jsx`, `src/revealTiming.mjs` | the same two files |
| Compositions | `src/Root.jsx` (`Psalm91Full`, `Psalm91Verse`) | `src/Root.jsx` (`GatesFull`, `GateVerse`) |
| GitHub render | Actions, `remotion-psalm91.yml` | Actions, `remotion-gates.yml` |
| GitHub check (automatic) | `remotion-check.yml` runs both engines on every change | the same run |
| Keep both identical | `scripts/check-remotion-sync.mjs` (run from the repository root) | the same |

The render commands run the check and the music staging first by themselves. The music files are read from the repository root and copied into a git-ignored `public/` folder.

---

## 12. LIVE SMOKE TEST (what it checks and with which parameters)

The test is `scripts/live-smoke-test.mjs`. The workflow `.github/workflows/live-smoke-test.yml` only runs it, after every push to `main` and once a day at 13:00 UTC (9am US Eastern). It opens the live site in a phone-sized browser, the way a visitor would.

| Setting | Value |
|---|---|
| Site tested | `BASE_URL`, default `https://sanctuary-grace.com` |
| Retries per page | `SMOKE_RETRIES`, default 5 |
| Wait between retries | `SMOKE_RETRY_DELAY_MS`, default 15000 (15 seconds, so a fresh deploy has time to appear) |
| Browser | Chromium through Playwright, 390 by 844 (phone) |

What it checks for each gate, and the exact values it expects:

| Gate | Page | Voice recording | Stripe checkout link (`https://buy.stripe.com/...`) |
|---|---|---|---|
| 1 HaKria | `gate-one.html` | `gate-1-voice.mp3` | `fZu4gz18I5C11Iw0sacQU0E` |
| 2 Sheket | `gate-two.html` | `gate-2-voice.mp3` | `6oU3cv8Bac0pcna0sacQU0x` |
| 3 HaMidbar | `gate-three.html` | `gate-3-voice.mp3` | `9B600j9FefcB0EscaScQU0y` |
| 4 Hitkania | `gate-four.html` | `gate-4-voice.mp3` | `dRmdR9g3CfcB72Qgr8cQU0z` |
| 5 Bitachon | `gate-five.html` | `gate-5-voice.mp3` | `6oU00j4kU9Sh3QE7UCcQU0A` |
| 6 Hithavut | `gate-six.html` | `gate-6-voice.mp3` | `eVq8wP8Ba0hHgDqej0cQU0B` |

It also checks that a purchased visitor sees Gate Six's closing invitation, that Daily Sanctuary has its four audio moments (`daily-morning.mp3`, `daily-midday.mp3`, `daily-drivehome.mp3`, `daily-bedside.mp3`) and links into Gate One, and that `foyer.html` has a door to Daily Sanctuary. 29 checks in all.

To change a checkout link: change it on the gate page, then change the same value in the `GATES` list at the top of `scripts/live-smoke-test.mjs`, and confirm it in Stripe first (active, $9 one time, returns the buyer to that gate page). The test does not cover the Welcome foyer or `about.html` yet.

Last verified 2026-10-08: all six links exist in the live Stripe account, all active, all $9 one-time USD. The local copy passed 29 of 29. Against the live site it also passes 29 of 29 after the Gate Six Worker route was removed (item 23 of section 8).

