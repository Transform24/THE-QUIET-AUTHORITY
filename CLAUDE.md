# CLAUDE.md — Sanctuary Grace Ministry
## Agent SOP · Master Playbook · All Projects

---

## WHO YOU ARE WORKING FOR

**Grace Turner** — Founder, Sanctuary Grace Ministry  
**Mission:** Help burned-out Christian women find breakthrough through silence, stillness, and sacred identity.  
**Testimony:** God broke her ankle Nov 5, 2024 — forced stillness became her message.

---

## BRAND VOICE — NON-NEGOTIABLE

| Attribute | Description |
|-----------|-------------|
| Tone | Quiet. Sacred. Prophetic. Intimate. Never loud, never salesy. |
| Audience | Burned-out Christian women, 30–55, givers/nurturers in crisis |
| Language | KJV-adjacent scripture, "beloved," "sacred," "stillness," "sanctuary" |
| Aesthetic | Dark luxury editorial — black/gold, serif type, candlelight mood |
| Forbidden | Hype language, exclamation spam, casual slang, generic motivational copy |

**Voice rule:** If it sounds like a self-help Instagram post, rewrite it.  
**Voice rule:** If it sounds like a whisper in a cathedral, you're close.

---

## BRAND TOKENS (CSS / Design System)

```
Background:  #0d0d0d (bg)  #111111 (bg2)  #181818 (surface)
Gold:        #C9A84C (primary)  #e2c98e (light)  #7a6040 (dim)
Accent:      #C1593C (terra/CTA)  #7d8c6e (sage)  #9aab88 (sage-light)
Text:        #F5F0E8 (cream)  #e0dace (text)  #b0a898 (dim)  #807870 (muted)
Fonts:       Cormorant Garamond (headings/serif)  Jost (body/UI)  Cinzel (labels)
```

---

## ECOSYSTEM MAP

| Project | URL / Repo | Purpose |
|---------|-----------|---------|
| The Quiet Authority | `transform24.github.io/THE-QUIET-AUTHORITY` | 8-question assessment + profile engine |
| Sanctuary Community | `beacons.ai/sanctuarygrace` | Free hub, links, resources |
| Devotional Series | Stripe (4 PDFs @ $4.99 + bundle $19.96) | Weeks 1–4: Vision, Renewal, Peace, Calling |
| Books | Stripe ($15.99 each) | The Quiet Authority book · The Parable of the Cocoon |
| Gallery | Coming soon | Prophetic wall art / printable downloads |
| Circle of Silence | Coming soon | 30-day paid transformation program |
| Pinterest | `pinterest.com/sanctuarygrace` | Primary traffic driver |
| YouTube | `youtube.com/@sanctuarygrace` | Video content |

---

## SILENCE PROFILES (Assessment Engine)

| ID | Name | Tagline |
|----|------|---------|
| A | The Striving Achiever | Your worth isn't in your output — it's in His love. |
| B | The Depleted Survivor | You were meant to be the vessel, not the source. |
| C | The Guilty Giver | Boundaries aren't selfish — they're sacred. |
| D | The Lost Wanderer | Silence isn't where you lose yourself — it's where you remember. |

---

## INTEGRATIONS

| Service | Purpose | Key |
|---------|---------|-----|
| Formspree | Form submissions | `xzdkgbbq` |
| MailerLite | Email list | Account 2145322 · Group: `Quiet Authority — Assessment` |
| Amazon Associates | Shop links | Tag: `sanctuarygrac-20` |
| GitHub Pages | Hosting | Auto-deploys from `main` branch (~60s) |
| Stripe | Payments | Links in index.html devot-section |

---

## AGENT RULES (All Projects)

1. **Never change brand voice, tone, or copy** without explicit instruction
2. **Never push to `main` directly** — work on feature branch, then merge
3. **Always Playwright-test** before committing UX changes
4. **HTML-first** — this is a single-file app (`index.html`); no frameworks
5. **No new files** unless explicitly requested — edit existing
6. **Music files:** `music1–4.mp3` are local; never reference external audio URLs
7. **Images:** `banner.png`, `bio.png` are local; product images via Google Drive thumbnails
8. **Validate HTML** after every edit — no unclosed tags, DOCTYPE must be first line
9. **Compact commits** — one commit per logical change, descriptive message
10. **After push** — always confirm with Playwright screenshot of affected screens

---

## KNOWN BUGS / WATCH LIST

- [ ] Silence timer: music phase = 5 min, silence phase = 10 min (total 15) — verify on every touch
- [ ] Silence quotes: must rotate from `SILENCE_QUOTES` array (local data only, no internet quotes)
- [ ] Shop cards: links must go to Amazon **product pages** (not affiliate storefront/commission page)
- [ ] Profile download: `downloadProfile()` must produce a `.txt` file — test after any JS refactor
- [ ] `<!DOCTYPE html>` must remain the **first byte** of `index.html` — never let build tools prepend content
- [ ] Music picker: 4 tracks must be labeled and selectable before session starts

---

## WORKFLOW FOR EVERY TASK

```
1. Read CLAUDE.md (this file) — always start here
2. Read current index.html (or relevant file) — understand state before editing
3. Make changes on feature branch: claude/<task-name>
4. Playwright test: screenshot all affected screens
5. Fix any visual regressions
6. Commit with clear message
7. Merge to main → push → GitHub Pages deploys
```

---

## FILE STRUCTURE

```
THE-QUIET-AUTHORITY/
  index.html          # Entire app — single file
  404.html            # GitHub Pages redirect
  CLAUDE.md           # This file — agent SOP
  banner.png          # Landing hero image
  bio.png             # Grace Turner photo
  music1–4.mp3        # Silence session audio tracks
  CNAME               # Custom domain (if set)
  workflows/          # AI agent automation system
    README.md
    agents/           # 5 Claude agent prompt files
    templates/        # Repurpose brief, pin, email templates
    triggers/         # Remote trigger registry
```

---

## COPY THIS BLOCK FOR NEW PROJECTS

```markdown
# CLAUDE.md — [Project Name] · Sanctuary Grace Ministry

> Inherits all rules from master SOP.
> See: THE-QUIET-AUTHORITY/CLAUDE.md

## Project-Specific Context
**Purpose:**
**URL:**
**Branch strategy:**

## Project-Specific Integrations

## Known Issues / Open Tasks
```

---

*Sanctuary Grace Ministry · Transform24 · Grace Turner*  
*"Be still, and know that I am God." — Psalm 46:10*
