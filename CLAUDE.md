# THE QUIET AUTHORITY — AGENT SOP PLAYBOOK
## Sanctuary Grace Ministry · Transform24 Ecosystem
*Reusable template for all Grace Turner projects. Last updated: 2026-04-26*

---

## 1. BRAND IDENTITY

**Voice**: Sacred, tender, prophetic. Speak as a trusted minister — never as a marketer.
**Audience**: Burned-out Christian women, 30–55, in spiritual depletion or identity crisis.
**Tone markers**: Warmth, quiet authority, invitation — never urgency, hype, or guilt.
**Forbidden**: Hustle language, self-help jargon, pop-psychology framing, casual slang, emojis in copy.

---

## 2. DESIGN TOKENS

```css
--bg:#0d0d0d  --bg2:#111111  --surface:#181818  --surface2:#202020
--border:#272727  --border2:#323232
--gold:#C9A84C  --gold-light:#e2c98e  --gold-dim:#7a6040
--terra:#C1593C  --sage:#7d8c6e  --sage-light:#9aab88
--cream:#F5F0E8  --cream-dim:#b0a898  --parchment:#C4A47C
--text:#e0dace  --text-dim:#807870  --text-muted:#484840
```

**Fonts**: Cormorant Garamond (headings/display) · Jost (body/UI) · Cinzel (labels)
**Rule**: Never change tokens. Never add new colors without Grace's approval.

---

## 3. APP ARCHITECTURE — THE QUIET AUTHORITY

**File**: `index.html` (single-file, no build tools, no framework)
**Deploy**: GitHub Pages auto-deploy from `main` ~60s
**Live URL**: https://transform24.github.io/THE-QUIET-AUTHORITY/

### Screens (in order)
| ID | Purpose |
|---|---|
| `screen-landing` | Entry, soul counter, resume banner |
| `screen-question` | 8-question assessment |
| `screen-email` | Name + email capture before reveal |
| `screen-reveal` | Profile name ceremony + match bars |
| `screen-results` | Profile hero + scripture + shop + silence session |
| `screen-dashboard` | Practice tracker + stats + quick actions |

### LocalStorage Keys
| Key | Value |
|---|---|
| `tqa_profile` | `{profile, name, email, date}` |
| `tqa_journal` | `[{date, profile, text}]` |
| `tqa_days` | `[0,1,2,…]` — completed day indices |
| `tqa_sessions` | integer — completed silence sessions |

### Profile Keys
`A` = The Striving Achiever · `B` = The Depleted Survivor · `C` = The Guilty Giver · `D` = The Lost Wanderer

---

## 4. IP PROTECTION PROTOCOL

**Rule**: Grace's proprietary written content (diagnosis, lessons, breakthrough, 7-day plan, journal prompts) is stored in JS but **never rendered as a visible web page section**.

**Delivery pattern**:
1. On form submit → `submitAndReveal()` triggers `window.open('mailto:...')` with full profile plain text pre-filled — user sends to themselves immediately
2. On results screen → Download button calls `downloadProfile()` → `buildProfileText()` → `.txt` file
3. Results screen shows ONLY: profile name, tagline, scripture (public), email notice, shop, silence session

**`buildProfileText(p, days, name)`** — shared builder for both mailto and download. Must stay in sync if profile copy changes.

---

## 5. INTEGRATIONS

| Service | Key / ID | Purpose |
|---|---|---|
| Formspree | `xzdkgbbq` | Email submissions to Grace + soul acceptances |
| MailerLite | Account 2145322 | Email list (connect via Formspree webhook) |
| Amazon Associates | Tag `sanctuarygrac-20` | All shop links must include this tag |
| Google Fonts | CDN | Cormorant Garamond, Jost, Cinzel |

---

## 6. AGENT RULES

1. **Never change brand voice, tokens, or font stack** without explicit Grace approval
2. **Always test with Playwright** after any UI change: `node --input-type=module < test.mjs` (ESM only, path `/opt/node22/lib/node_modules/playwright/index.mjs`)
3. **Single-file HTML** — no build tools, no npm, no frameworks, no new files unless Grace requests
4. **Profile IP stays off-screen** — diagnosis/lessons/breakthrough/7-day never rendered as visible page content
5. **All Amazon links** must include `?tag=sanctuarygrac-20` or `tag=sanctuarygrac-20` in the URL
6. **Formspree key `xzdkgbbq`** — all forms submit here. Never create new endpoints without approval
7. **Git branch protocol** — new sessions use `claude/[short-task]-[4-char-id]`, push there, never force-push main
8. **No comments** in code unless the WHY is non-obvious
9. **Compact responses** — Grace wants minimal token usage. Plan briefly, execute, ship
10. **Test from the UX perspective** — open in browser, click the golden path, check mobile viewport
11. **Playwright path** — `/opt/node22/lib/node_modules/playwright/index.mjs` ESM only — never `require('playwright')`
12. **Local test server** — `python3 -m http.server 8080` from repo root, verify with `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/`
13. **startOver() clears all three** — `tqa_profile` + `tqa_days` + `tqa_sessions`
14. **emailDeliveryNotice** — shows on results only when `userEmail` is set; populated by `showResults()`
15. **Do NOT add MailerLite** until Grace is ready for automated follow-up sequences

---

## 7. KNOWN ARCHITECTURE PATTERNS

```javascript
// Screen navigation
showScreen('screen-id')  // handles all overlay visibility

// Profile scoring
calculateProfile()        // returns dominant letter A/B/C/D
getProfileScores()        // returns {A:%, B:%, C:%, D:%}

// Submit flow (IP-safe)
// submitAndReveal() → buildProfileText() → window.open(mailto:) → Formspree → calculateAndReveal()
buildProfileText(p, days, name)  // shared builder — email + download must stay in sync

// Dashboard
showDashboard()           // checks localStorage, renders, shows screen
renderDashboard(saved)    // populates all dashboard DOM
toggleDay(i)              // toggle day-circle completion; rebuilds DOM — re-query after click
recordSession()           // increment tqa_sessions; called inside sessionComplete()

// Session flow
// startSession() → runTimer() → sessionComplete() → recordSession()
```

---

## 8. PENDING / ROADMAP

- [x] **Profile match bars on reveal screen** — 4 animated bars, primary glows gold
- [x] **User dashboard** — 7-day tracker, session stats, quick actions (`screen-dashboard`)
- [x] **IP protection** — profile delivered via mailto + download, not rendered on-page
- [ ] **Dual timer display** — Music phase (5:00) + Silence phase (10:00) shown separately
- [ ] **Amazon link cloaking** — `goShop(url)` JS function, remove `href` from `<a>` tags
- [ ] **Wall art shop** — Replace gallery "coming soon" with actual art shop (Grace's creations, pricing: 8x10 / 11x14 / 16x20 / bundle, Stripe links, instant download)
- [ ] **Language selector** — English, Spanish, Portuguese, French, Korean (Google Translate cookie approach)
- [ ] **Journal preview on dashboard** — show last 2 entries inline
- [ ] **MailerLite automation** — replace mailto: with automated delivery when Grace is ready

---

## 9. PROFITABLE SUGGESTIONS FOR GRACE'S ECOSYSTEM

1. **Profile-gated content** — Each profile gets a unique Google Drive PDF delivered via email (diagnosis + 7-day plan as a beautifully designed PDF, not plain text). Upgrade path to premium version.
2. **Circle of Silence membership** — Monthly Zoom silence sessions, $27/month. Gate behind MailerLite sequence triggered by TQA completion.
3. **TQA Companion Journal (physical)** — Sell on Amazon KDP. Profile-specific journal prompts are the content. Already written — just format it.
4. **Wall art as profile gifts** — "Which profile are you?" → "Send this to a friend who is a [Profile Name]." Viral gifting loop.
5. **Ministry team licensing** — Churches buy TQA for their women's ministry. $97/year per church. White-label with church name.
6. **Devotional series upsell** — After results: "Your 30-day deep dive starts here" → link to paid devotional on Amazon KDP.
7. **Speaking / retreat tool** — TQA as a retreat ice-breaker. Retreat leaders pay to use it with groups. PDF facilitation guide.

---

## 10. WHAT NOT TO DO (learned the hard way)

- **Do NOT render** diagnosis / lessons / breakthrough / 7-day as page HTML — IP violation
- **Do NOT add MailerLite** until Grace requests automated sequences
- **Do NOT use** `confirmBanner` — removed; replaced by `emailDeliveryNotice`
- **Do NOT reference** `returnBtn` — removed from DOM and JS
- **Do NOT use** `require('playwright')` — ESM only, `import` from full path
- **Do NOT add colors** outside the token system — get Grace's approval first
- **Do NOT call** `window.open(mailto:)` after async code if possible — must fire in click handler scope
- **Do NOT re-use stale Playwright element handles** after DOM rebuilds — re-query after any click that re-renders

---

## 11. NEW PROJECT TEMPLATE (inherit from this SOP)

```
Project Name:
Deploy URL:
GitHub Repo:
Branch pattern: claude/[task]-[id]
Formspree key: (inherit xzdkgbbq or new)
MailerLite tag:
Amazon tag: sanctuarygrac-20
Primary screen IDs:
LocalStorage keys:
IP protection method: (email delivery / download / server-side)
Brand tokens: (inherit from §2 above)
Agent rules: (inherit §6 above, append project-specific rules)
```
