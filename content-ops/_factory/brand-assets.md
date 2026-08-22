# Brand Assets Reference — Sanctuary Grace Ministry / The Quiet Authority

*Ministry: Sanctuary Grace Ministry · Product: The Quiet Authority · Founder: Grace Turner*
*Last updated: 2026-05-17 · Authoritative reference for all AI agents. Do not deviate without Grace approval.*

---

## 1. VOICE & TONE

**Brand voice:** Sacred, tender, prophetic. Grace Turner is a minister, not a marketer. Write as a shepherd addressing a weary flock — not as a brand addressing a customer.

**Audience:** Burned-out Christian women, ages 30–55, experiencing spiritual depletion or identity crisis. They are exhausted, not lazy. Wounded, not weak. They need invitation, not instruction.

**Tone markers:**
- Warmth — speak to the whole person, not just the problem
- Quiet authority — confident without being loud
- Invitation — open a door, never push through it
- Tenderness — honor the pain without dwelling in it

**FORBIDDEN words and phrases:**
- hustle, productivity, grind, level up, crush it
- self-help, game-changer, life-changing, transformation (as a marketing word)
- limited time, don't miss out, last chance, sign up now, act fast
- exclamation points in headers
- emojis in any copy (body, headers, subject lines, captions)
- pop-psychology language (e.g., "toxic," "boundaries" used casually, "manifest")

---

## 2. DESIGN TOKENS

CSS variables — never change without Grace approval. These apply to index.html and all branded visual assets.

```css
--bg:#0d0d0d
--bg2:#111111
--surface:#181818
--surface2:#202020
--border:#272727
--border2:#323232
--gold:#C9A84C
--gold-light:#e2c98e
--gold-dim:#7a6040
--terra:#C1593C
--sage:#7d8c6e
--sage-light:#9aab88
--cream:#F5F0E8
--cream-dim:#b0a898
--parchment:#C4A47C
--text:#e0dace
--text-dim:#807870
--text-muted:#484840
```

**Color usage guidance:**
- Gold (`--gold`, `--gold-light`) — primary accent, scripture highlights, CTAs
- Terra (`--terra`) — secondary accent, urgency-free emphasis only
- Sage (`--sage`, `--sage-light`) — supporting accent, rest and nature imagery
- Cream / Parchment — text on dark backgrounds, scripture display
- All backgrounds are near-black. The aesthetic is candlelit, not clinical.

---

## 3. TYPOGRAPHY

All fonts loaded via Google Fonts CDN. Never swap fonts. Never add fonts without Grace approval.

| Font | Use | Notes |
|---|---|---|
| Cormorant Garamond | Headings, scripture, display text | Always italic when displaying scripture |
| Jost | Body text, UI elements, buttons, labels | Weight 300 (light) for body; weight 400 for UI/buttons |
| Cinzel | Section badges, profile tags, decorative labels | Always uppercase, wide letter-spacing |

**Typography rules:**
- Scripture is always set in Cormorant Garamond italic, never paraphrased, always cited
- Button labels use Jost 400, sentence case (not all caps)
- Section badges and profile type labels use Cinzel uppercase

---

## 4. PROFILES — THE QUIET AUTHORITY

Assessment produces one of four primary profiles, plus one special designation.

| Key | Name | Core wound |
|---|---|---|
| A | The Striving Achiever | Burned out from performing for approval |
| B | The Depleted Survivor | Running on empty from surviving crisis after crisis |
| C | The Guilty Giver | Exhausted from giving everything away, nothing left |
| D | The Lost Wanderer | Disconnected from herself and from God |
| NB | New Believer | Just said yes to Jesus — tender, new, held |

**Profile rules:**
- Never reduce a profile to a flaw. Each is a wound, not a verdict.
- Profile names are always displayed in full (e.g., "The Striving Achiever," not just "Achiever").
- Profile copy speaks to the wound with tenderness, then points toward restoration.

---

## 5. SCRIPTURE STANDARD

- Translation: KJV or NIV — Grace's preference. Use one consistently per piece.
- Never paraphrase scripture. Display the full verse text exactly as it appears in the chosen translation.
- Always cite: Book Chapter:Verse (e.g., Matthew 11:28, Psalm 46:10).
- Display format: Cormorant Garamond italic, gold accent or parchment color, citation below verse in smaller text.

---

## 6. EMAIL SIGNATURE

All emails sent from or on behalf of Grace use this exact signature:

```
With love,
Grace Turner
Sanctuary Grace Ministry · The Quiet Authority
```

No titles. No URLs in the signature block unless the email template explicitly includes a CTA section below it.

---

## 7. CALL TO ACTION HIERARCHY

One CTA per email. One CTA per section. Never layer multiple asks in the same unit of content.

**Priority order:**
1. Return to the sanctuary — https://transform24.github.io/THE-QUIET-AUTHORITY/
2. Download your profile (download button within the app)
3. Shop Stripe products — devotionals, wall art, books (in that order)
4. Amazon Sacred Space curation (always last; affiliate links only)

**CTA language:**
- Use: "Return to the sanctuary," "Continue your journey," "Receive your profile"
- Never use: "Buy now," "Shop here," "Click this link," "Sign up today"

---

## 8. PLATFORM HANDLES & INTEGRATIONS

| Platform | Handle / URL / ID |
|---|---|
| GitHub Pages (live app) | transform24.github.io/THE-QUIET-AUTHORITY |
| Beacons (email engine + storefront) | beacons.ai/sanctuarygrace |
| YouTube (Circle of Silence) | youtube.com/@TheQuietAuthority-f1z |
| Pinterest | pinterest.com/sanctuarygracefaith |
| Formspree (all form submissions) | Form ID: xzdkgbbq |
| Amazon Associates | Tag: sanctuarygrac-20 — every affiliate link must include this tag |

**Email engine is Beacons.** Not MailerLite. Not Zapier. All sequences, broadcasts, and list management run through Beacons.

---

## 9. WHAT GRACE SOUNDS LIKE

Use these as calibration. When in doubt, ask: does this sound like a minister or a marketer?

**Approved phrases and patterns:**
- "You were not made to carry this alone."
- "He restores what you've been running on empty for."
- "Your portion is sacred too."
- "You are still being found."
- "Heaven is still rejoicing over you."
- "You do not have to earn your way back."
- "This is not a program. This is a sanctuary."
- "Come as you are. Stay as long as you need."

**Never sounds like:**
- "Sign up now!"
- "Don't miss this!"
- "Last chance to join!"
- "This will change your life!"
- "Ready to level up your faith?"

**Test:** If it could appear on a productivity app or a wellness influencer's Instagram, it does not belong here.

---

*This document is the authoritative brand reference. It does not override CLAUDE.md — it supplements it. For architecture, localStorage, and code patterns, see CLAUDE.md.*
