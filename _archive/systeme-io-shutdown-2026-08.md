# Systeme.io — Historical Record (account shut down, 2026-08)

*Archived 2026-08-22. Kept per ICM convention — never silently delete, always leave a record of what existed. Do not treat anything below as current. Current status: `_system/status.md`.*

Systeme.io was set up as the CRM/automation layer for the Circle of Silence gate-buyer pipeline: Stripe checkout → webhook → Systeme.io contact tagging → automated email sequence delivery. The account has since been fully shut down and no longer exists.

## Gate Tags (Systeme.io tag IDs, now meaningless — account gone)
- gate-1-buyer: 2068973
- gate-2-buyer: 2068974
- gate-3-buyer: 2068975
- gate-4-buyer: 2068976
- gate-5-buyer: 2068977
- gate-6-buyer: 2068978
- secret-place-buyer: 2057950 (existing, pre-dates the gate pipeline)

## Stripe → Systeme.io wiring (as it was configured)
- Webhook ID: `we_1TmPsDDvGX7GhwdzZ15UzERO`
- Webhook URL: `https://api.systeme.io/api/stripe-webhook`
- Webhook events: `checkout.session.completed`
- Gate 1 Product ID: `prod_Ul9eX4XJZNXIem`
- Gate 2–6 Product IDs: were never created (gates 2-6 never built — see `circle-of-silence/`)

## Earlier status notes (superseded)
- "Systeme.io account exists (locked, pending unlock)" — this was the status *before* the account was shut down entirely; superseded.
- "Systeme.io via API: no campaign endpoint exists" / "via MCP: requires OAuth, cannot connect" — earlier integration blockers, now moot since the account doesn't exist.

## ⚠️ Live code still references this — not yet cleaned up

Three GitHub Actions workflows still call the Systeme.io API and were **not modified** during the 2026-08-22 ICM restructure (infrastructure changes need explicit confirmation, this was a documentation restructure):

- `.github/workflows/gate-buyer-sync.yml` — cron, every 15 minutes, reads Stripe checkout sessions and tags contacts in Systeme.io using the tag IDs above and secret `SYSTEME_MAKE_KEY`.
- `.github/workflows/load-gate1-emails.yml` — manual dispatch, creates a Systeme.io email campaign and loads the 6 Gate 1 emails via `SYSTEME_API_KEY`.
- `.github/workflows/setup-gate-pipeline.yml` — manual dispatch, creates Systeme.io tags and registers the Stripe webhook to Systeme.io via `SYSTEME_API_KEY`.

If the account is genuinely gone, `gate-buyer-sync.yml` has been failing (or silently doing nothing useful) on every 15-minute run since shutdown. **Recommend disabling or deleting these three workflows** and deciding where Gate 1 email delivery moves to (MailerLite is the live email engine per `_system/integrations.md`) — flagged for Grace's decision, not acted on here.

## Gate 1 email sequence content (still valid copy, needs a new delivery mechanism)

6 emails written in Grace's voice, KJV-anchored, for the Guilty Giver / Gate 1 (HaKria) sequence — full text lives in `.github/workflows/load-gate1-emails.yml` (the API call bodies). Subjects:
1. Day 0 — You are not here by accident
2. Day 3 — The woman who could not stop
3. Day 5 — What you have been carrying was never yours to carry alone
4. Day 7 — Your brain dump
5. Day 10 — 12 declarations for the woman who is done proving
6. Day 14 — The next room is ready when you are
