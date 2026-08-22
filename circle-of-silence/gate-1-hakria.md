# Gate 1 — HaKria — The Calling
*Last updated: 2026-08-22*

## STATUS: BUILT, LIVE ON STRIPE — EMAIL DELIVERY BLOCKED (see below)

## Stripe
- Product: `prod_Ul9eX4XJZNXIem`
- Payment link: https://buy.stripe.com/eVqfZh8Ba8Od0Es8YGcQU0w
- `BUY_LINK_PLACEHOLDER`: replaced in `gate-one.html` ✅

## Email delivery — ⚠️ NEEDS A DECISION

Was wired to Systeme.io (tag `gate-1-buyer`, ID 2068973, campaign "Gate 1 — The Call — Guilty Giver", automation rule tag→subscribe). **The Systeme.io account is fully shut down as of this pass (2026-08-22).** That wiring no longer has anywhere to deliver to. Full historical record: `_archive/systeme-io-shutdown-2026-08.md`.

The 6-email sequence itself is written and ready (KJV, Guilty Giver profile, sender Grace Turner `grace@sanctuary-grace.com`) — the copy isn't lost, just homeless. `_system/integrations.md` lists MailerLite as the current live email engine; migrating this sequence there is the likely next step but hasn't been done.

`.github/workflows/gate-buyer-sync.yml` (tagged Stripe buyers in Systeme.io every 15 minutes) has been **deleted** (2026-08-22), along with `load-gate1-emails.yml` and `setup-gate-pipeline.yml` — the account they called is permanently gone. See `_system/status.md`.

## Email Sequence — content ready, not yet loaded anywhere live
- Email 1: Day 0 — You are not here by accident
- Email 2: Day 3 — The woman who could not stop
- Email 3: Day 5 — What you have been carrying was never yours to carry alone
- Email 4: Day 7 — Your brain dump
- Email 5: Day 10 — 12 declarations for the woman who is done proving
- Email 6: Day 14 — The next room is ready when you are
- Full body text: preserved verbatim in `_archive/systeme-io-shutdown-2026-08.md` (the workflow that used to hold it, `load-gate1-emails.yml`, is deleted)

## gate-one.html
- Committed: THE-QUIET-AUTHORITY commit 9be7a60
- Committed: the-circle-of-silence commit 837d2b7

## NEXT ACTION
Decide where Gate 1 email delivery goes now that Systeme.io is gone (MailerLite migration is the likely path) and update this record once it's live.
