# MailerLite Integration Guide
*Sanctuary Grace Ministry. Locked 2026-10-12 on Grace's instruction. Read this before writing, loading or changing any email.*

This is the operating guide for every email that leaves MailerLite. It exists for one reason: more people should open an email and walk through the one door it points to. Follow it in order, one step at a time.

## 1. Where this fits
- MailerLite is the only email engine. Beacons, Systeme.io and Make.com are retired and are never used or linked. See `_system/integrations.md`.
- Sending authentication (SPF, DKIM, DMARC) is already set in Cloudflare. Never change it from here. See section 5 of the master blueprint, `README.md`.
- Loading or changing a sequence in MailerLite follows the skill `sanctuary-grace-mailerlite-load`. Nothing is sent or scheduled without Grace's approval.
- Sign-ups and purchase checks run through the Worker `lively-dew-924c` (see `README.md`, section 4).
- Printful orders and affiliate links are separate from email copy. They are recorded in `_system/integrations.md`. An email may point to them only through the one link rule below.

## 2. The One Link Per Email rule (strict)
Every email carries exactly one link for the reader to follow. No exceptions.

1. Pick the single next step you want the reader to take. Only one.
2. Write the whole email so it leads to that step and nowhere else.
3. Put that one link in the email, once. Do not repeat the same link in a second place.
4. The link must start with `https://sanctuary-grace.com`. Use the exact page the reader needs (a gate, the Library, a shop page), never a general front door when a specific page exists.
5. Never link to Beacons, `sanctuarygrace.store`, `transform24.github.io`, a social profile, or a second product in the same email.
6. The unsubscribe line and the sender address that MailerLite must add by law do not count as the link. Add nothing else beside them.
7. Printful, Amazon, Digistore24 and Audible links stay on the website pages. They are not placed in emails. If an email is about wall art, it links to `https://sanctuary-grace.com/wall-art.html` and the page carries the shop link.
8. Before a sequence is loaded, count the links in each email. If the count is not one, fix the email. Do not load it.

Why: one clear path gives the reader one decision. Several links split the reader's attention and the clicks fall.

## 3. Typography (locked)
These are constants for email. Do not change them without Grace's approval.

| Use | Font | Notes |
|---|---|---|
| Headers and the email title | Cinzel | Capital letters only, as Cinzel is set in this ministry. Gold `#C9A84C`. |
| Body text | Jost | Cream `#F5F0E8` on black `#0d0d0d`. |
| Call to action link | Jost | Terra `#C1593C`. |

- Many email programs do not load web fonts. Always list a fallback after the brand font: Cinzel then Georgia then serif, and Jost then Arial then sans-serif. A fallback after the brand font is fine. The browser default alone is never the main font.
- Colors come only from the token set in `_system/brand-tokens.md`.
- Scripture is King James Version only, with the reference after it, and checked against the KJV text.
- The web pages keep their own rule from the master blueprint: Cormorant Garamond for headings. This guide covers email only.

## 4. Banned words and marks (registered)
Nothing on this list may appear in any email subject, preview line, body or button.

**The em dash is banned, always.** The long dash character is never used. Use a period, a comma, a colon or the word "and".

**Self-help and wellness phrasing, banned (from `content-ops/_factory/brand-voice.md`):**
- hustle, grind, show up, crush it, level up
- self-care, mindfulness, healing journey, boundaries, thriving, wellness
- 5 steps, tips, strategies, hacks
- "God wants you to be happy"
- Any pop-psychology framing

**Also banned, flagged in the 2026-10-08 audit of public wording:**
- best life, burnout, show up for yourself, you are enough, your truth

**Also banned in email:**
- Emoji
- Exclamation points in sacred content
- Scripture from any version other than the King James Version (NIV, NKJV, NLT, ESV, The Message)
- Hype and pressure words such as "last chance" and "act now"

**Voice:** sacred, tender, plain, one step at a time. A minister, never a marketer. Short sentences with room to breathe. Point to Christ, not to a program, a product or a practice.

## 5. Check before loading (every email)
1. Exactly one link, and it starts with `https://sanctuary-grace.com`.
2. No em dash. Search the text for the long dash character.
3. No banned word from section 4.
4. Every verse is King James Version and matches the KJV text.
5. Cinzel headers and Jost body, with the fallbacks from section 3.
6. Colors are from the token set.
7. Grace has approved the copy.

Only then is the email loaded into MailerLite.

## 6. Open items
- Gate 1 email sequence still has no live delivery path. Loading it into MailerLite is still waiting on Grace's decision (`README.md`, section 8, item 1).
- Click-through is not yet measured here. When Grace exports numbers from MailerLite, record them in the channel log. Nothing is estimated.
