# Sanctuary Grace Ministry — System Status
*Last updated: 2026-08-22*

## WHAT WORKS — DO NOT REBUILD
- GitHub Pages: live at sanctuary-grace.com and transform24.github.io
- Stripe: live, webhook `we_1TmPsDDvGX7GhwdzZ15UzERO` fires on `checkout.session.completed`
- Pinterest agent: running, commits to `workflows/output/pinterest-pending/`
- Approval gate: `transform24.github.io/THE-QUIET-AUTHORITY/approval-gate.html` password: approve
- MailerLite: the live email engine (see `_system/integrations.md`)

## WHAT IS PAUSED — RECONNECTS LATER, DON'T ARCHIVE
- Instagram: paused due to a Meta account restriction. All agent/pipeline files stay in place — see `_system/channels.md`. Reconnects to the Pinterest content flow when the restriction lifts.

## WHAT IS DEAD — DO NOT REFERENCE, DO NOT REBUILD
- **Make.com** — confirmed dead. Zero references exist in the actual running code. Not running. See `_archive/make-com-removed.md`.
- **Systeme.io** — account fully shut down, no longer exists. Every "Gate Tags active" / automation-rule claim in older docs is stale. See `_archive/systeme-io-shutdown-2026-08.md`.
  - ⚠️ **Live-code contradiction found during the 2026-08-22 audit:** `.github/workflows/gate-buyer-sync.yml` still runs every 15 minutes (cron) and calls the Systeme.io API directly with hardcoded gate tag IDs. `.github/workflows/load-gate1-emails.yml` and `setup-gate-pipeline.yml` also call the Systeme.io API. If the account is truly gone, these are failing (or silently no-op-ing) on every run. **Not disabled as part of this restructure** — that's an infrastructure change beyond a doc cleanup and needs Grace's confirmation before touching a live cron workflow. Flagged, not fixed.
  - **Consequence:** Gate 1's email sequence (see `circle-of-silence/gate-1-hakria.md`) has no confirmed live delivery mechanism right now. It was wired to Systeme.io; that's gone. Needs a decision — migrate to MailerLite, or something else.
- Substack via HTTP 403 / session-cookie-in-header — old broken path, do not use. Current method: `SUBSTACK_COOKIE_ID`, see `_system/channels.md`.
- Cowork for Windows filesystem: Linux wall, use Claude Code instead
