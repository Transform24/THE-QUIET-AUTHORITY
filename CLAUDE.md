# THE QUIET AUTHORITY — AGENT SOP
## Sanctuary Grace Ministry · Transform24
*Last updated: 2026-05-24 · This file is the law. Everything else defers to it.*

---

## COMPLETED CHANGES — DO NOT REDO THESE

- **mailto removed** — the "email me my profile" mailto link was removed from `submitAndReveal()`. Make.com webhook handles all delivery now. Do NOT add it back.
- **Make.com webhook wired** — `https://hook.us2.make.com/r4tscqqr8qzff82pr3dcxi1a3w5yn7xy` fires on every assessment submit with `name`, `email`, `profile_key`, `profile_name`, `source`.
- **Psalm 91 Amazon link** — all 4 profiles use `https://amzn.to/3REMW6E`. Do NOT revert to B0C7V67VVV.
- **Profile card download** — opens in new browser tab as viewable image, not silent file download.
- **Email engine** — Beacons is current. Systeme.io account exists (locked, pending unlock). Migration to Systeme.io planned once unlocked. Make.com routes profiles to sequences.
- **Automation** — Make.com (free, 1,000 ops/month) is the automation layer. Zapier is not used.
- **7-day practice timers** — countdown timer on every day card, auto-marks complete at 00:00.
- **UI/UX audit complete** — lazy loading, reduced motion, focus-visible, aria-labels, aria-live, aria-hidden, noreferrer all applied.

---

## 0. SECURITY — READ BEFORE ANY INTEGRATION WORK

- **NEVER** ask the user to paste API keys, secrets, or credentials into chat.
- If a key is needed, instruct the user to set it as an environment variable (`export STRIPE_SECRET_KEY=...`) or store it in a `.env` file that is gitignored.
- If a secret is accidentally shared in chat, **immediately stop all work** and instruct the user to revoke/rotate it in the provider dashboard before proceeding.
- Scan every diff before committing — if any string matches `sk_live_`, `sk_test_`, `rk_live_`, or `API_KEY=`, abort and warn.

---

## 1. BRAND IDENTITY — NEVER CHANGE WITHOUT GRACE APPROVAL

**Voice:** Sacred, tender, prophetic. Minister — never marketer.
**Audience:** Burned-out Christian women, 30–55, spiritual depletion or identity crisis.
**Tone:** Warmth, quiet authority, invitation. Never urgency, hype, or guilt.
**Forbidden:** Hustle language, self-help jargon, pop-psychology, casual slang, emojis in copy.

---

## 2. DESIGN TOKENS — NEVER CHANGE WITHOUT GRACE APPROVAL

```css
--bg:#0d0d0d --bg2:#111111 --surface:#181818 --surface2:#202020
--border:#272727 --border2:#323232
--gold:#C9A84C --gold-light:#e2c98e --gold-dim:#7a6040
--terra:#C1593C --sage:#7d8c6e --sage-light:#9aab88
--cream:#F5F0E8 --cream-dim:#b0a898 --parchment:#C4A47C
--text:#e0dace --text-dim:#807870 --text-muted:#484840
```

**Fonts (Google CDN — already loaded):**
- `Cormorant Garamond` → headings, display, scripture, reveal ceremony
- `Jost` → body text, UI, buttons, labels
- `Cinzel` → section badges, product labels, ALL CAPS decorative

---

## 3. APP ARCHITECTURE

**File:** `index.html` — single file, no build tools, no npm, no framework
**Deploy:** GitHub Pages auto-deploy from `main` (~60s after merge)
**Live URL:** `https://transform24.github.io/THE-QUIET-AUTHORITY/`
**Branch protocol:** `claude/[task]-[4-char-id]` → PR → merge → never force-push main

### Screens (JS-switched via `showScreen()`)
| ID | Purpose |
|---|---|
| `screen-landing` | Hero, soul counter, language selector, resume banner |
| `screen-question` | 8-question assessment, progress bar |
| `screen-email` | Name + email capture — fires once, gate closes permanently |
| `screen-reveal` | Profile ceremony, match bars, scripture |
| `screen-results` | Full sanctuary — tabbed scrollable experience |
| `screen-dashboard` | Daily journey tracker, stats, journal, sign-in/sign-out |

### screen-results Sections (tab-navigated)
| Anchor | Section | Tab |
|---|---|---|
| `resultsTop` | Profile hero, journal + download CTAs | Profile |
| `section-practice` | 7-day practice (progressive unlock) | Practice |
| `section-shop` | Stripe products first, then Amazon curated by profile | Shop |
| `silenceSection` | 15-min session (music + silence), journal prompt | Silence |
| *(CoS)* | Circle of Silence, YouTube link, waitlist | — |
| *(salvation)* | Romans 10:9, Accept Jesus CTA | — |

### Audio Files (repo root — confirmed)
```
voiceover.mp3 ← landing screen voiceover bar
music1.mp3 ← Classical · Violin & Piano
music2.mp3 ← Still Waters · Ambient
music3.mp3 ← Gratitude · Worship
music4.mp3 ← Sacred Strings · Orchestral
```

---

## 4. LOCALSTORAGE KEYS

| Key | Set by | Cleared by startOver() | Purpose |
|---|---|---|---|
| `tqa_profile_complete` | `submitAndReveal()` — ONCE | **NEVER** | Permanent gate |
| `tqa_profile` | `submitAndReveal()` | Yes | Profile data |
| `tqa_journal` | Journal modal save | **NEVER** | Journal entries |
| `tqa_days` | `toggleDay()` | Yes | 7-day progress |
| `tqa_sessions` | `recordSession()` | Yes | Session count |
| `tqa_signin_[date]` | `signInDay()` | Yes | Daily sign-in |
| `tqa_signout_[date]` | `signOutDay()` | Yes | Daily sign-out |
| `tqa_streak` | `signOutDay()` | Yes | Consecutive days |
| `seg_morning_[date]` | Segment 1 complete | Yes | Daily tracking |
| `seg_reflection_[date]` | Segment 2 complete | Yes | Daily tracking |
| `seg_practice_[date]` | Segment 3 complete | Yes | Daily tracking |
| `seg_silence_[date]` | `recordSession()` | Yes | Daily tracking |
| `seg_journal_[date]` | Journal modal save | Yes | Daily tracking |
| `tqa_souls_[date]` | `acceptJesus()` | **NEVER** | Salvation count |

---

## 5. PROFILE GATE — PERMANENT (CRITICAL)

Once `tqa_profile_complete === '1'` is set it is **never cleared**.
Assessment and email screens are closed permanently for that device.

**`startOver()` behavior:**
- Clears: `tqa_profile`, `tqa_days`, `tqa_sessions`, daily segment keys
- **Never clears:** `tqa_profile_complete`, `tqa_journal`, `tqa_souls_[date]`
- If gate is set → skip landing/questions/email → go straight to results
- "Retake Assessment" on dashboard is the ONLY path back to questions
- Even on retake, `screen-email` is never shown again — goes to `calculateAndReveal()` directly

**Landing screen when gate is set:**
- "Begin Assessment" → changes to "Continue My Journey →" → calls `resumeProfile()`
- Resume banner shows profile name
- Profile return bar visible at bottom

---

## 6. FULL-DAY EXPERIENCE — 5 TIMED SEGMENTS

| Segment | Time | What Happens | localStorage |
|---|---|---|---|
| Morning Stillness | 5 min | Breathing + profile scripture | `seg_morning_[date]` |
| Reflection | 10 min | Profile read-through, diagnosis, breakthrough | `seg_reflection_[date]` |
| Sacred Practice | 10 min | Day N of 7-day plan (progressive unlock) | `seg_practice_[date]` |
| Silence Session | 15 min | Music (5 min) → silence (10 min) → journal | `seg_silence_[date]` |
| Journal & Close | 5 min | Write → sign out → streak saved | `seg_journal_[date]` |

Dashboard shows: name, profile, streak, today's 5 segments with status, 7-day circles, stats, journal preview.

---

## 7. UX RULES — APPROVED 2026-05-16

1. Landing: single primary action glows. Everything else secondary.
2. Between questions: emotional acknowledgment fades in 2 seconds.
3. After session complete: "Well done, beloved. Heaven noticed." → 3s → devotional CTA → journal prompt.
4. Dashboard greeting: "[Name]. This is Day [N]. You are still showing up."
5. Shop order: Stripe products first (devotionals, wall art, books) → Amazon after.
6. Mobile nav: tab bar only. Sticky nav = logo + "Start Over" text link only.
7. Journal save: save toast fires on every journal save.
8. Circle of Silence join: links to `https://youtube.com/@TheQuietAuthority-f1z`

---

## 8. MOBILE / UX CHECKLIST

Before opening any PR for a user-facing UI change, verify all of the following:

- [ ] Body text is minimum 16px on mobile, secondary text minimum 14px
- [ ] No duplicate images or assets rendered (especially Amazon product cards)
- [ ] New-user flow works end-to-end (landing → questions → email → reveal → results)
- [ ] Returning-user flow works end-to-end (gate set → skip to results, no email screen)
- [ ] All primary CTAs are tappable on 375px width
- [ ] Shop tab scrolls to Stripe products first, Amazon after

Include audit results in the PR description.

---

## 9. CODE PATTERNS

```javascript
showScreen('screen-id') // all navigation
calculateProfile() // returns A/B/C/D
getProfileScores() // {A:%, B:%, C:%, D:%}

// Submit flow — ORDER IS SACRED
// submitAndReveal()
// → localStorage.setItem('tqa_profile_complete','1') ← GATE
// → fetch(Formspree xzdkgbbq) — notifies Grace
// → fetch(Make.com webhook) — routes to Beacons sequence by profile
// → calculateAndReveal()
// NOTE: mailto REMOVED. Make.com handles all delivery.

// startOver() — gate check before routing
// toggleDay(i) — rebuilds DOM, re-query after
// recordSession() — inside sessionComplete()
// goShop(url) — all external links
```

---

## 9. ALL PRODUCTS

### Wall Art — Stripe (live)
| Profile | Price | Link |
|---|---|---|
| A — The Striving Achiever | $9.99 | buy.stripe.com/14AbJ1bNm3tT9aY3EmcQU0n |
| B — The Depleted Survivor | $9.99 | buy.stripe.com/dRm9ATg3Cc0p2MA2AicQU0r |
| C — The Guilty Giver | $9.99 | buy.stripe.com/7sYdR95oY3tT1IwdeWcQU0q |
| D — The Lost Wanderer | $9.99 | buy.stripe.com/5kQdR92cM5C1af23EmcQU0o |
| Bundle — All Four | $29.99 | buy.stripe.com/7sY4gz5oY4xXbj6caScQU0l |

Wall art images: wall-art-WOMT9.jpg (A) · wall-art-WOMT8.jpg (B) · wall-art-WOMT-profile3.jpg (C) · wall-art-WOMT-profile2.jpg (D) · wall-art-WOMT-cover1.jpg (hero)

### Devotionals — Stripe (live)
| Product | Price | Link |
|---|---|---|
| Week 1 — Vision | $4.99 | buy.stripe.com/cNieVdbNm6G586UdeWcQU03 |
| Week 2 — Renewal | $4.99 | buy.stripe.com/3cI7sL18I7K9evi1wecQU04 |
| Week 3 — Peace | $4.99 | buy.stripe.com/14A7sL8Ba4xX9aY7UCcQU06 |
| Week 4 — Calling | $4.99 | buy.stripe.com/eVqeVd7x66G5gDq0sacQU02 |
| Bundle all 4 | $19.96 | buy.stripe.com/4gM6oH6t28Od5YM3EmcQU0k |

### Books — Stripe (live)
| Product | Price | Link |
|---|---|---|
| The Quiet Authority | $15.99 | buy.stripe.com/00w3cv5oYc0p0EscaScQU0d |
| The Parable of the Cocoon | $15.99 | buy.stripe.com/eVq3cv8Ba6G5bj6fn4cQU0g |
| R.E.S.T. Workbook | Free | beacons.ai/sanctuarygrace |

### Amazon Affiliate (tag: sanctuarygrac-20)
Weighted fleece throw · Travel mug · Prayer journal · Flameless candles · Butterfly mug · Diffuser · Leather journal · Parallel Bible
All links already in index.html SACRED_SPACE data. Do not modify link structure.

---

## 10. STRIPE INTEGRATION

- Before any Stripe write operation (coupons, products, prices), verify the API key has write scope. Make a small test write call first; if it fails with 403, stop and ask Grace to provide a write-scoped key OR provide exact Stripe dashboard steps for manual completion.
- Never assume the sandbox has outbound network access to `api.stripe.com` — confirm with a read call before writing any integration code.
- Stripe MCP key lives in settings — never request it in chat.

---

## 11. INTEGRATIONS

| Service | Key | Purpose |
|---|---|---|
| Formspree | `xzdkgbbq` | All form submissions |
| Amazon Associates | `sanctuarygrac-20` | All product links must include tag |
| Beacons | beacons.ai/sanctuarygrace | Email list, sequences, storefront |
| YouTube | youtube.com/@TheQuietAuthority-f1z | Circle of Silence join link |

**Email engine: Beacons — not MailerLite, not Zapier.**

---

## 12. AGENT TEAM — 10 AGENTS

| # | Agent | Reads | Writes | Trigger |
|---|---|---|---|---|
| 01 | Repurpose | Drive /content-inbox/ | Drive /content-queue/ | Manual |
| 02 | Publish | Drive /content-queue/ (approved) | pin-log.md + posts | After approval |
| 03 | Storefront Sync | index.html + product-registry.md | Audit + patches | Mon 6am |
| 04 | Lead Responder | Formspree webhook | leads.md + Beacons tag | Formspree webhook |
| 05 | Weekly Report | All /output/ | Weekly report | Mon 7am |
| 06 | Daily Check-In | Beacons list + templates | Beacons broadcast | Daily 7am |
| 07 | Pinterest Agent | CLAUDE.md Pinterest SOP + pin schedule | Canva design + pin-log.md | Daily per schedule |
| 08 | Instagram Agent | Content calendar + Drive /content-queue/ | ig-log.md + scheduled posts | Daily per schedule |
| 09 | YouTube Agent | Drive /content-queue/ + profile descriptions | Video scripts + yt-log.md | Weekly |
| 10 | Substack Agent | Drive /devotion-inbox/ + profile content | Substack draft + substack-log.md | Daily 6am |

---

**Agent 07 — Pinterest Agent (pending build):**
- Reads the 30-day pin schedule in Section 13
- Uses Canva MCP (`brand_kit_id: kAHKceDuDGk`) to generate non-wall-art pins (scripture, quotes, devotional covers)
- Wall art pins use existing repo images `profile-A/B/C/D.png` — no Canva generation needed
- Writes caption copy using `/copywriting` skill in sacred TQA voice
- Publishes via Pinterest API or scheduling tool (Tailwind/Buffer/Later)
- Logs to `workflows/output/pin-log.md`
- Needs: `PINTEREST_ACCESS_TOKEN` in `.env`

---

**Agent 08 — Instagram Agent (pending build):**
- Reads content calendar and Drive `/content-queue/` for approved content
- Repurposes Pinterest captions into shorter IG captions using `/social` skill (max 150 words, sacred voice)
- Writes Reel scripts: hook (3 sec) + 3 beats + soft CTA → `beacons.ai/sanctuarygrace`
- Writes carousel text: profile descriptions broken into 5–7 slides, each ending on a turn
- Generates Canva thumbnail brief for Reel covers using brand kit `kAHKceDuDGk`
- Posts via Instagram Graph API or drops into Buffer/Later/scheduling tool
- Logs to `workflows/output/ig-log.md`
- Needs: `IG_ACCESS_TOKEN` in `.env` (Meta Business account required)
- Voice: same sacred TQA brand voice — no hustle, no urgency, no emojis in copy
- Every post caption ends with: `beacons.ai/sanctuarygrace`

**Instagram Content Pillars (mirrors Pinterest):**
| Pillar | Format | Frequency |
|---|---|---|
| Profile reveal | Carousel (5–7 slides) | Weekly |
| Scripture + profile | Static image or Reel | 2x/week |
| Sacred aesthetic | Reel (B-roll + voiceover) | Weekly |
| Devotional preview | Static image + caption | Weekly |
| Circle of Silence | Reel or Story | Bi-weekly |

---

**Agent 09 — YouTube Agent (pending build):**
- Reads devotional content, profile descriptions, and 7-day practice from Drive
- Writes long-form video scripts in sacred TQA voice using `/copywriting` skill
- Script structure: Opening stillness (30s) → Profile/topic teaching (8–12 min) → Silence invitation (2 min) → Soft CTA
- Writes SEO-optimized video descriptions using `/content-strategy` skill
- Includes: title (under 60 chars), description (200+ words), 5–8 tags, pinned comment text
- Generates Canva thumbnail brief: profile image + 1 short line of terra text
- Posts Community tab weekly encouragement (scripture + soft link to Beacons)
- Logs to `workflows/output/yt-log.md`
- Needs: `YOUTUBE_API_KEY` + OAuth 2.0 credentials in `.env`
- Channel: `youtube.com/@TheQuietAuthority-f1z`

**YouTube Content Series:**
| Series | Format | Frequency |
|---|---|---|
| Profile deep dives | 10–15 min teaching | Monthly (1 per profile) |
| 7-day practice walkthroughs | 5–8 min guided | Weekly |
| Circle of Silence sessions | 15 min guided silence | Weekly |
| Scripture reflections | 3–5 min devotional | 2x/week |

---

**Agent 10 — Substack Agent (pending build):**
- Reads daily devotion content from Drive `/devotion-inbox/` or generates from profile descriptions
- Writes in Grace's voice — sacred, tender, first-person, prophetic
- Two modes:
  - **Daily Devotion** (short): 200–300 words, one scripture, one reflection, one invitation. Publishes daily at 6am.
  - **Weekly Letter** (long): 600–800 words, personal + prophetic, deeper teaching. Publishes Sunday.
- Uses `/copywriting` skill for CTA language, `/stop-slop` to remove AI writing patterns before publishing
- Formats as Substack post with title, subtitle, body, and closing CTA → `beacons.ai/sanctuarygrace`
- Publishes via Substack API or email trigger to Substack import address
- Logs to `workflows/output/substack-log.md`
- Needs: `SUBSTACK_PUBLICATION_ID` + `SUBSTACK_API_KEY` in `.env`
- Newsletter name: The Quiet Authority Daily / The Quiet Authority Letter

**Substack Content Rhythm:**
| Day | Content | Length |
|---|---|---|
| Mon–Sat | Daily Devotion | 200–300 words |
| Sunday | Weekly Letter | 600–800 words |
| As needed | Profile feature | 400–500 words |

---

**How to Remove Grace From the Process (all 4 platforms):**

```
Step 1: Set API credentials in .env (one-time setup per platform)
  PINTEREST_ACCESS_TOKEN=...
  IG_ACCESS_TOKEN=...
  YOUTUBE_API_KEY=...
  SUBSTACK_API_KEY=...

Step 2: Build agent workflow files in workflows/agents/
  pinterest-agent.yml
  instagram-agent.yml
  youtube-agent.yml
  substack-agent.yml

Step 3: Connect a scheduler
  Recommended: GitHub Actions (free, already in repo)
  Alternative: n8n for visual workflow management

Step 4: Set content source
  Drive /devotion-inbox/ = Grace drops raw content
  Agent picks up, writes, formats, publishes — Grace never opens the platform
```

**Build order (easiest → most complex):**
1. Substack — simplest API, highest daily devotion value
2. Pinterest — already specced, just needs API key
3. Instagram — most reach, Meta API has friction
4. YouTube — scripts first, auto-posting second

---

## 12. GIT WORKFLOW

- Branch protocol: `claude/[task]-[4-char-id]` → PR → squash merge → never force-push main
- After every squash merge: immediately rebase any open dependent branches onto `origin/main` before opening the next PR — prevents duplicate-commit merge conflicts
- Before opening a PR: always run `git fetch origin && git rebase origin/main` to surface conflicts early
- When a branch conflicts with already-squash-merged commits: cherry-pick only the new commits onto a fresh branch from main rather than fighting the rebase
- Before opening a PR: complete the Mobile / UX Checklist (Section 8) and include results in the PR body
- Never skip the checklist to ship faster — one cleanup PR costs more than one careful pre-merge pass

---

## 13. PINTEREST SOP — 30-DAY LAUNCH

### Why Pinterest → Beacons
Pinterest is 76% women, strongest 25–54, faith/wellness is a top category. All traffic flows to `beacons.ai/sanctuarygrace` first — not the assessment, not Stripe. Beacons warms them, then assessment converts.

### Brand Kit
- **Canva brand kit ID:** `kAHKceDuDGk` — name: "TQA Pinterest — Sacred Profiles"
- **Colors:** `#000000` (background) · `#C1593C` (terra, all text) · `#C9A84C` (gold, stars)
- **Font:** Cinzel · Regular · ALL CAPS only
- **Stars:** 4-point starburst, 3 sizes (large ~100px, medium ~50px, small ~28px), left margin
- **Photo:** B&W only, high contrast, no tint, no overlay

### Pin Image Sources
| Pin type | Source | Do NOT recreate in Canva |
|---|---|---|
| Wall art profile pins | `profile-A/B/C/D.png` from repo root | ✓ Already perfect — download and upload directly to Pinterest |
| Scripture quote cards | Generate in Canva with brand kit | — |
| Devotional covers | Existing product images from Drive | — |
| Sacred aesthetic | Generate in Canva or source from Drive | — |

### Caption Rules
- Sacred, tender, prophetic — minister not marketer
- No emojis, no exclamation points, no urgency language
- Every caption ends with: `beacons.ai/sanctuarygrace`
- 100–200 words per caption
- 3–5 hashtags, always last line, never repeated same 5 twice in a row

### Hashtag Pool
`#ChristianWomen` `#SpiritualRest` `#FaithAndWellness` `#QuietTime` `#SanctuaryGrace` `#SpiritualBurnout` `#FaithJourney` `#ScriptureForWomen` `#SacredSpace` `#HopeForWomen` `#ChristianMom` `#DailyDevotion`

### Pinterest Boards
| Board | Purpose |
|---|---|
| The Quiet Authority | All TQA brand content — wall art, assessment pins |
| Spiritual Rest for Women | Broadest reach — discovery pins, scripture, aesthetics |
| Christian Women Encouragement | Scripture, profile quotes, affirmations |
| Sacred Morning Practices | Devotional covers, silence sessions, 7-day practice |

### 30-Day Pin Schedule
| Day | Pin | Board | Image source |
|---|---|---|---|
| 1 | The Guilty Giver wall art | The Quiet Authority | `profile-C.png` |
| 2 | Sacred aesthetic + "There is a stillness that heals what striving never could" | Sacred Morning Practices | Canva / Drive |
| 3 | The Depleted Survivor wall art | The Quiet Authority | `profile-B.png` |
| 4 | Scripture pin — Matthew 11:28 | Christian Women Encouragement | Canva |
| 5 | The Striving Achiever wall art | The Quiet Authority | `profile-A.png` |
| 6 | Devotional Week 1 Vision cover | Sacred Morning Practices | Drive |
| 7 | The Lost Wanderer wall art | The Quiet Authority | `profile-D.png` |
| 8 | "Which type are you?" discovery pin — all 4 profiles listed | Spiritual Rest for Women | Canva |
| 9 | Scripture + Guilty Giver quote | Christian Women Encouragement | Canva |
| 10 | Devotional Week 2 Renewal cover | Sacred Morning Practices | Drive |
| 11 | Re-pin Day 1 Guilty Giver → Spiritual Rest for Women | Spiritual Rest for Women | — |
| 12 | "The assessment is free. The stillness is real." | The Quiet Authority | Canva |
| 13 | Sacred aesthetic + "You were not made to pour from empty" | Christian Women Encouragement | Canva / Drive |
| 14 | Circle of Silence pin — "15 minutes. Just you and God." | Sacred Morning Practices | Canva |
| 15 | "Start here" assessment overview pin | Spiritual Rest for Women | Canva |
| 16 | Devotional Week 3 Peace cover | Sacred Morning Practices | Drive |
| 17 | Re-pin Guilty Giver wall art → Christian Women Encouragement | Christian Women Encouragement | — |
| 18 | Quote pin — line from Guilty Giver profile description | The Quiet Authority | Canva |
| 19 | R.E.S.T. Workbook — "Free. No catch. Just a path forward." | Spiritual Rest for Women | Canva |
| 20 | Scripture + "Your exhaustion is not failure. It is an invitation." | Christian Women Encouragement | Canva |
| 21 | Devotional Week 4 Calling cover | Sacred Morning Practices | Drive |
| 22–24 | Re-pin 3 highest-performing pins from Weeks 1–2 to new boards | All boards | — |
| 25 | Brand story pin — personal, links to assessment | Spiritual Rest for Women | Canva |
| 26 | Re-pin Guilty Giver wall art to all 4 boards | All boards | — |
| 27 | Devotional bundle pin — all 4 weeks, bundle savings | The Quiet Authority | Canva |
| 28 | Circle of Silence waitlist pin | Sacred Morning Practices | Canva |
| 29 | Scripture from 7-day practice | Christian Women Encouragement | Canva |
| 30 | Review: identify top 3 pins by saves → double down Month 2 | — | — |

### Posting Schedule
- Post between 8–11am or 7–9pm (highest engagement for this demographic)
- Minimum 1 day between pins
- Save each wall art pin to at least 2 boards

### Skills Used by Agent 07
- `/copywriting` — caption writing, CTA copy
- `/social` — platform optimization, repurposing
- `/content-strategy` — pillar planning, what to create next

### What Removes Grace From the Process
Skills alone do NOT automate — they make Claude smarter when you ask.
Agent 07 + Pinterest API connection = full automation. Still needed:
- Pinterest API access token (`PINTEREST_ACCESS_TOKEN` in `.env`)
- Scheduling tool OR Pinterest API write integration
- Agent 07 workflow file in `workflows/agents/`

---

## 13. SUBAGENT PERMISSIONS

- Project-level permissions live in `.claude/settings.json` (checked into repo) — subagents inherit these automatically
- Local user settings (`settings.local.json`, gitignored) are NOT inherited by subagents — never put required permissions there
- When a subagent is denied a tool (e.g., Drive download, WebFetch), add it to `.claude/settings.json` under `permissions.allow` and retry
- Current project permissions: `mcp__9b844449__download_file_content` (Google Drive downloads)
- When spawning a subagent for Drive work, confirm `.claude/settings.json` has the permission before dispatching

---

## 13. NEVER DO

- Clear `tqa_profile_complete` — permanent gate
- Clear `tqa_journal` — sacred user entries
- Render profile IP as visible HTML — IP violation
- Call mailto after async code — popup blocker kills delivery
- Force-push main
- Add npm / build tools / frameworks
- Change design tokens without Grace approval
- Reference MailerLite — removed, Beacons is the email engine
- Use `confirmBanner` — removed
- Use `returnBtn` — removed
- Use `require('playwright')` — ESM only

---

## 13. ROADMAP — PENDING (all approved 2026-05-16)

- [x] tqa_profile_complete gate in submitAndReveal() + startOver()
- [x] Dashboard greeting: name + day number + rotating encouragement
- [x] Wall art image placeholders → WOMT images
- [x] Ticker font 1.1rem → 1.5rem, speed 180s → 300s
- [x] Romans 10:9 prominence (larger, gold, border-left)
- [x] ZOOM_PLACEHOLDER → https://youtube.com/@TheQuietAuthority-f1z
- [x] Progressive day unlock in renderDayPreview()
- [x] Between-question emotional acknowledgment
- [x] Session complete: "Well done, beloved" → 3s → devotional CTA → journal
- [x] Sticky nav simplified: logo + Start Over only
- [x] Journal save toast + seg_journal_ tracking
- [x] Agent 06 file created in workflows/agents/
- [x] Dashboard rebuilt: full 5-segment daily journey + sign-in/sign-out
- [x] Shop order: Stripe first, Amazon after (verify current order)
- [x] platform-stack.md updated (Beacons replaces MailerLite)
- [x] Wall art WOMT images uploaded to repo root (WOMT9/8/cover1/profile2/profile3)
