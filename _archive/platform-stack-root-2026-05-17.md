# Platform Stack — Sanctuary Grace Ministry

*Last updated: 2026-05-17*

---

## Email Engine

**Beacons** — `beacons.ai/sanctuarygrace`

- All email list management, sequences, and broadcasts
- Profile tags applied at submission: `profile-A`, `profile-B`, `profile-C`, `profile-D`, `new-believer`
- Storefront and free resource delivery (R.E.S.T. Workbook)
- **MailerLite has been removed** — do not reference or reconnect

---

## Form Submissions

**Formspree** — form ID `xzdkgbbq`

- Captures name + email + profile from `submitAndReveal()`
- Captures waitlist sign-ups from the Circle of Silence form
- Webhook triggers Agent 04 (Lead Responder)

---

## Payments

**Stripe** — live mode

Products: Wall Art ($9.99 each / $29.99 bundle) · Devotionals ($4.99 each / $19.96 bundle) · Books ($15.99 each)
All buy links use `buy.stripe.com` domain.

---

## Affiliate

**Amazon Associates** — tag `sanctuarygrac-20`

All Amazon product links in `SACRED_SPACE` constant include the associate tag.
Managed via `index.html` — do not modify link structure.

---

## Content & Community

| Platform | Handle / URL | Purpose |
|---|---|---|
| YouTube | `youtube.com/@TheQuietAuthority-f1z` | Circle of Silence live sessions |
| Pinterest | `pinterest.com/sanctuarygrace` | Content distribution |
| Beacons storefront | `beacons.ai/sanctuarygrace` | Email list, free resources, store |

---

## Hosting & Deploy

**GitHub Pages** — auto-deploy from `main` branch (~60s after merge)
Live URL: `https://transform24.github.io/THE-QUIET-AUTHORITY/`
Single file: `index.html` — no build tools, no npm, no framework.

---

## Agent Workflows

Six agents in `workflows/agents/` — triggered manually, by Formspree webhook, or on schedule.
See `CLAUDE.md` section 11 for full agent team definition.
