# SITE-CONTEXT — The Quiet Authority Live App

*Files covered by this contract stay at repo root, permanently: `index.html`, `gate-zero.html` … `gate-six.html`, `approval-gate.html`, `privacy.html`, `404.html`, `CNAME`, `.nojekyll`, and every image/audio file they reference by relative path (`profile-A.png`, `music1-4.mp3`, `images/`, etc.). GitHub Pages serves this site from repo root — do not relocate any of it without: (1) updating the Pages publish-source setting, (2) rewriting every relative path inside every moved file, (3) testing on a branch and confirming the live domain still works before merging. None of that has been done. Don't start it casually.*

## App Architecture

**File:** `index.html` — single file, no build tools, no npm, no framework
**Deploy:** GitHub Pages auto-deploy from `main` (~60s after merge)
**Live URL:** `https://transform24.github.io/THE-QUIET-AUTHORITY/` and `https://sanctuary-grace.com/`

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

## localStorage Keys

| Key | Set by | Cleared by startOver() | Purpose |
|---|---|---|---|
| `tqa_profile_complete` | `submitAndReveal()` — ONCE | **NEVER** | Permanent gate |
| `tqa_profile` | `submitAndReveal()` | Yes | Profile data |
| `tqa_journal` | Journal modal save | **NEVER** | Journal entries |
| `tqa_days` | `toggleDay()` | Yes | 7-day progress |
| `tqa_sessions` | `recordSession()` | Yes | Session count |
| `tqa_signin_[date]` / `tqa_signout_[date]` | sign-in/out | Yes | Daily sign-in/out |
| `tqa_streak` | `signOutDay()` | Yes | Consecutive days |
| `seg_morning_[date]` / `seg_reflection_[date]` / `seg_practice_[date]` / `seg_silence_[date]` / `seg_journal_[date]` | segment complete | Yes | Daily tracking |
| `tqa_souls_[date]` | `acceptJesus()` | **NEVER** | Salvation count |

## Profile Gate — Permanent (Critical)

Once `tqa_profile_complete === '1'` is set it is **never cleared**. Assessment and email screens are closed permanently for that device.

- `startOver()` clears: `tqa_profile`, `tqa_days`, `tqa_sessions`, daily segment keys. Never clears: `tqa_profile_complete`, `tqa_journal`, `tqa_souls_[date]`.
- If gate is set → skip landing/questions/email → go straight to results.
- "Retake Assessment" on dashboard is the ONLY path back to questions. Even on retake, `screen-email` is never shown again — goes to `calculateAndReveal()` directly.
- Landing screen when gate is set: "Begin Assessment" → "Continue My Journey →" → `resumeProfile()`.

## Full-Day Experience — 5 Timed Segments

| Segment | Time | What Happens | localStorage |
|---|---|---|---|
| Morning Stillness | 5 min | Breathing + profile scripture | `seg_morning_[date]` |
| Reflection | 10 min | Profile read-through, diagnosis, breakthrough | `seg_reflection_[date]` |
| Sacred Practice | 10 min | Day N of 7-day plan (progressive unlock) | `seg_practice_[date]` |
| Silence Session | 15 min | Music (5 min) → silence (10 min) → journal | `seg_silence_[date]` |
| Journal & Close | 5 min | Write → sign out → streak saved | `seg_journal_[date]` |

## UX Rules — approved 2026-05-16

1. Landing: single primary action glows. Everything else secondary.
2. Between questions: emotional acknowledgment fades in 2 seconds.
3. After session complete: "Well done, beloved. Heaven noticed." → 3s → devotional CTA → journal prompt.
4. Dashboard greeting: "[Name]. This is Day [N]. You are still showing up."
5. Shop order: Stripe products first (devotionals, wall art, books) → Amazon after.
6. Mobile nav: tab bar only. Sticky nav = logo + "Start Over" text link only.
7. Journal save: save toast fires on every journal save.
8. Circle of Silence join: links to `https://youtube.com/@TheQuietAuthority-f1z`

## Mobile / UX Checklist — before opening any PR for a user-facing UI change

- [ ] Body text minimum 16px on mobile, secondary text minimum 14px
- [ ] No duplicate images or assets rendered (especially Amazon product cards)
- [ ] New-user flow works end-to-end (landing → questions → email → reveal → results)
- [ ] Returning-user flow works end-to-end (gate set → skip to results, no email screen)
- [ ] All primary CTAs tappable on 375px width
- [ ] Shop tab scrolls to Stripe products first, Amazon after

Include audit results in the PR description.

## Code Patterns

```javascript
showScreen('screen-id') // all navigation
calculateProfile() // returns A/B/C/D
getProfileScores() // {A:%, B:%, C:%, D:%}

// Submit flow — ORDER IS SACRED
// submitAndReveal()
// → localStorage.setItem('tqa_profile_complete','1') ← GATE
// → fetch(Formspree xzdkgbbq) — notifies Grace
// → calculateAndReveal()
// NOTE: mailto REMOVED. Do not add it back — popup blockers kill delivery on async code.
```

## NEVER DO (app-specific)

- Clear `tqa_profile_complete` — permanent gate
- Clear `tqa_journal` — sacred user entries
- Render profile IP as visible HTML — IP violation
- Call mailto after async code — popup blocker kills delivery
- Use `confirmBanner` or `returnBtn` — both removed
- Use `require('playwright')` — ESM only
- Reference the Make.com webhook — removed, see `_system/status.md`

## 0. Security

- **NEVER** ask the user to paste API keys, secrets, or credentials into chat.
- If a key is needed, set it as an environment variable or a gitignored `.env` file.
- If a secret is accidentally shared in chat, stop all work and have it revoked/rotated.
- Scan every diff before committing — abort on `sk_live_`, `sk_test_`, `rk_live_`, `API_KEY=`.
- Before any Stripe write operation, verify the API key has write scope with a small test call first.
- Never assume the sandbox has outbound network access to `api.stripe.com` — confirm with a read call before writing integration code.

## Audio Files (repo root)

```
voiceover.mp3 ← landing screen voiceover bar
music1.mp3 ← Classical · Violin & Piano
music2.mp3 ← Still Waters · Ambient
music3.mp3 ← Gratitude · Worship
music4.mp3 ← Sacred Strings · Orchestral
```
