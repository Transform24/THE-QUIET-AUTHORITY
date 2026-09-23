# Gate 1 — HaKria — The Calling
*Last updated: 2026-09-23 — corrected against `PROJECT_STATUS.md`'s confirmed 2026-08-30/31 pass, which found this file stale and said so explicitly.*

## STATUS: BUILT, LIVE ON STRIPE — EMAIL SEQUENCE MIGRATED TO MAILERLITE, AUTOMATION STILL DISABLED

## Stripe
- Product: `prod_Ul9eX4XJZNXIem`
- Payment link: https://buy.stripe.com/eVqfZh8Ba8Od0Es8YGcQU0w
- `BUY_LINK_PLACEHOLDER`: replaced in `gate-one.html` ✅

## Email delivery — migrated, waiting on Grace to flip it on

Was wired to Systeme.io (tag `gate-1-buyer`, ID 2068973, campaign "Gate 1 — The Call — Guilty Giver", automation rule tag→subscribe). **The Systeme.io account is fully shut down** (permanent). Full historical record: `_archive/systeme-io-shutdown-2026-08.md`.

**Corrected 2026-09-23 — the migration this section used to say "hasn't been done" has in fact been done.** Per `PROJECT_STATUS.md`, the 6-email sequence is loaded verbatim into MailerLite automation **"Gate 1 — The Call — Welcome Sequence"** (automation id `193979382021227889`), triggered by a subscriber joining MailerLite group `193979375492793939` ("Gate 1 Buyer — The Call"). That group id matches `GATE_MAILERLITE_GROUPS.one` in `THE-CIRCLE-OF-SILENCE`'s `worker/worker.js` — the Worker already adds a buyer to this group automatically, in real time, from its `/verify-purchase` route on a confirmed Stripe purchase. No cron job or Make.com/Systeme.io step is involved or needed. `dry_run_automation` confirmed `emails_designed: 6, emails_undesigned: 0`.

**The only real gap: the automation is still DISABLED.** Buyers joining the group today receive nothing. Turning it on is a decision for Grace, not yet made — this is the actual open item, not "where does delivery go."

`.github/workflows/gate-buyer-sync.yml` (tagged Stripe buyers in Systeme.io every 15 minutes) has been **deleted** (2026-08-22), along with `load-gate1-emails.yml` and `setup-gate-pipeline.yml` — the account they called is permanently gone, and none of them would be a fix even if restored, since buyer tagging is already handled by the Worker (see above). See `_system/status.md`.

## Email Sequence — content loaded in MailerLite, automation not yet enabled
- Email 1: Day 0 — You are not here by accident
- Email 2: Day 3 — The woman who could not stop
- Email 3: Day 5 — What you have been carrying was never yours to carry alone
- Email 4: Day 7 — Your brain dump
- Email 5: Day 10 — 12 declarations for the woman who is done proving
- Email 6: Day 14 — The next room is ready when you are
- Full body text: preserved verbatim in `_archive/systeme-io-shutdown-2026-08.md` (the workflow that used to hold it, `load-gate1-emails.yml`, is deleted); now also live inside the MailerLite automation itself.

## gate-one.html
- Committed: THE-QUIET-AUTHORITY commit 9be7a60
- Committed: the-circle-of-silence commit 837d2b7

## NEXT ACTION
Ask Grace whether to turn on MailerLite automation `193979382021227889`. Nothing else is blocking Gate 1 email delivery.
