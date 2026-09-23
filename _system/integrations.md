# Integrations — Full Platform Map
*Last updated: 2026-09-23*

## Email Engine

**MailerLite** — the live system, confirmed 2026-08-22.
Systeme.io is fully shut down — the account no longer exists. Every reference to Systeme.io as active (including "Gate Tags active", automation rules, campaign IDs) is stale. See `_archive/systeme-io-shutdown-2026-08.md` for what existed before teardown, and `_system/status.md` for a live-code contradiction this uncovered (a cron workflow still calling the dead Systeme.io API).
Older docs also referenced Beacons as the email engine at an earlier point — also superseded by MailerLite.

## Purchase Verification & Buyer Tagging

**Cloudflare Worker `lively-dew-924c`** (source: `THE-CIRCLE-OF-SILENCE/worker/worker.js`) — not previously listed here. Each of the six Circle of Silence gate pages and the Secret Place guide call its `GET /verify-purchase` (or `/secret-place/download`) route with the Stripe Checkout Session id from the post-payment redirect; the Worker checks the session against the Stripe API directly and, on a match, adds the buyer's email to that product's MailerLite group (`GATE_MAILERLITE_GROUPS` / `SECRET_PLACE_MAILERLITE_GROUP` in `worker.js`). This — not the Stripe webhook below — is what actually verifies purchases and tags buyers today.
The Stripe webhook `we_1TmPsDDvGX7GhwdzZ15UzERO` (`checkout.session.completed`) is registered in Stripe but has no receiving code anywhere in either repo — grep for `checkout.session.completed` / `stripe-webhook` outside `_archive/` returns nothing. Treat it as a real gap, not a working integration, until it's built or removed. See `_system/status.md`.

## Form Submissions

**Formspree** — form ID `xzdkgbbq`
- Captures name + email + profile from `submitAndReveal()`
- Captures waitlist sign-ups from the Circle of Silence form
- Webhook triggers Agent 04 (Lead Tracker)

## Payments

**Stripe** — live mode
Products: Wall Art ($9.99 each / $29.99 bundle) · Devotionals ($4.99 each / $19.96 bundle) · Books ($15.99 each). All buy links use `buy.stripe.com`. Full product list: `circle-of-silence/products.md`.

## Affiliate

**Amazon Associates** — tag `sanctuarygrac-20`. All Amazon links in the `SACRED_SPACE` constant in `index.html` include the tag — do not modify link structure.
**Digistore24** — affiliate link for "Harmony Within — Faith & Resilience Guide" ($15.03, $8.26 commission).

## Content & Community

| Platform | Handle / URL | Purpose |
|---|---|---|
| YouTube | `youtube.com/@TheQuietAuthority-f1z` | Circle of Silence live sessions, video scripts |
| Pinterest | `pinterest.com/sanctuarygracefaith` | Primary content distribution — see `_system/channels.md` for board names |
| Instagram | `_thequietauthority_` | Paused — see `_system/channels.md` |
| Substack | `5apop2sotwm.substack.com` | Daily/weekly devotions |

## Hosting & Deploy

**GitHub Pages** — auto-deploy from `main` (~60s after merge). Live at `https://transform24.github.io/THE-QUIET-AUTHORITY/` and `https://sanctuary-grace.com/`. Single file: `index.html` — no build tools, no npm, no framework. See `SITE-CONTEXT.md`.

## Agent Workflows

10 agents (verified count, `workflows/agents/` → prompts now live at `content-ops/*/agent.md`; the executable scripts stay at `workflows/scripts/` — see `content-ops/CONTEXT.md` for why). Triggered manually, by Formspree webhook, or on schedule via `.github/workflows/`.

## What you don't need

| Platform | Why not |
|---|---|
| Make.com | Account/automation not something to build against; corrected 2026-09-23 — the previous "zero references in running code" claim was false, see `_system/status.md` for the 4 live-but-orphaned pages still calling a Make.com webhook |
| Systeme.io | Account shut down |
| Zapier | Never adopted — direct webhooks used instead |
| Kajabi / Teachable | Not until a full course exists |
| Linktree | Not in use |
| Mailchimp / ConvertKit / Beacons | Superseded by MailerLite |

## Monthly Cost (approximate, unverified since 2026-05-17)

| Platform | Cost |
|---|---|
| GitHub Pages | Free |
| Formspree | Free (Hobbyist) |
| Pinterest | Free |
| YouTube | Free |
| MailerLite | Check current plan — not verified in this pass |
