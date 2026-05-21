# THE QUIET AUTHORITY — AGENT SOP
## Sanctuary Grace Ministry · Transform24
*Last updated: 2026-05-21 · This file is the law. Everything else defers to it.*

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
// → buildProfileText()
// → a.click() [mailto — SYNC BEFORE ANY FETCH]
// → localStorage.setItem('tqa_profile_complete','1') ← GATE
// → fetch(Formspree xzdkgbbq)
// → calculateAndReveal()

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

## 12. AGENT TEAM — 6 AGENTS

| # | Agent | Reads | Writes | Trigger |
|---|---|---|---|---|
| 01 | Repurpose | Drive /content-inbox/ | Drive /content-queue/ | Manual |
| 02 | Publish | Drive /content-queue/ (approved) | pin-log.md + posts | After approval |
| 03 | Storefront Sync | index.html + product-registry.md | Audit + patches | Mon 6am |
| 04 | Lead Responder | Formspree webhook | leads.md + Beacons tag | Formspree webhook |
| 05 | Weekly Report | All /output/ | Weekly report | Mon 7am |
| 06 | Daily Check-In | Beacons list + templates | Beacons broadcast | Daily 7am |

---

## 12. GIT WORKFLOW

- Branch protocol: `claude/[task]-[4-char-id]` → PR → squash merge → never force-push main
- After every squash merge: immediately rebase any open dependent branches onto `origin/main` before opening the next PR — prevents duplicate-commit merge conflicts
- Before opening a PR: always run `git fetch origin && git rebase origin/main` to surface conflicts early
- When a branch conflicts with already-squash-merged commits: cherry-pick only the new commits onto a fresh branch from main rather than fighting the rebase
- Before opening a PR: complete the Mobile / UX Checklist (Section 8) and include results in the PR body
- Never skip the checklist to ship faster — one cleanup PR costs more than one careful pre-merge pass

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
