# Sanctuary Grace Ministry — System Status
*Last updated: 2026-10-08*

## Root URL now serves the Welcome foyer; About moved to about.html (2026-10-08)
- `index.html` at repo root is now the Welcome foyer: Proverbs 4:23 (KJV) header and four numbered doors (How To Pray, The Quiet Authority, The Circle of Silence at `gate-zero.html`, The Woman Who Pours Shop).
- The About page moved to `about.html` (canonical and share address updated, "Return Home" link added). The 2026-09-24 entry below, which says the root serves About, is superseded.
- Gate One checkout link locked in as `fZu4gz18I5C11Iw0sacQU0E` (verified in live Stripe). Gate Six audio player restored and live (Worker route for gate-six.html removed 2026-10-08; smoke test 29 of 29). 2026-10-09: public pages cleared of em dashes and off-palette hex; saved language bar (`lang.js`) added to Gates Zero to Six. See README items 9, 12, 24, 25. See README sections 8 and 12.

## Root URL now serves About, not the TQA assessment (2026-09-24)
- `index.html` at repo root is now the About page (Luke 4:18, ministry origin story).
  It was previously TQA's 8-question assessment.
- The assessment moved to `discover-your-profile.html` (its own URL) and is
  otherwise unchanged — same internal logic, same `?view=shop`/`?view=silence`
  handling, same anonymous-visitor redirect to `foyer.html`. Its `canonical`/
  `og:url` tags now point to `/discover-your-profile.html`.
- The old `about.html` file no longer exists — it was renamed to `index.html`.
  Its `canonical`/`og:url` tags now point to `/`.
- Six links across five pages were repointed from `index.html` to
  `discover-your-profile.html` (with `?view=...` params preserved where
  present): `the-quiet-authority-foyer.html` (Begin The Assessment button),
  `library.html` (2 links), `names-of-god.html` (2 links), `foyer.html`
  (the door link).
- Reason: every visitor was meeting a diagnostic quiz before meeting the
  ministry itself, and Circle of Silence sat three clicks deep behind it.
  About now bridges directly into Gate Zero and The Secret Place.
- Verified locally (static server + Playwright): root serves About,
  `/discover-your-profile.html` serves the assessment unchanged, all six
  repointed links and About's two CTAs resolve correctly, no broken
  relative links introduced.
- Pre-existing, unrelated to this change: `discover-your-profile.html` still
  calls an `addToSysteme(...)` function (4 call sites) that has no definition
  in the file — dead code left over from the Systeme.io teardown. Not
  introduced by this pass; app internal logic was intentionally left
  untouched per this change's scope. Flagging for a future pass.

## WHAT WORKS — DO NOT REBUILD
- GitHub Pages: live at sanctuary-grace.com and transform24.github.io
- Stripe: live, webhook `we_1TmPsDDvGX7GhwdzZ15UzERO` fires on `checkout.session.completed`
- Pinterest agent: running, commits to `workflows/output/pinterest-pending/`
- Approval gate: `transform24.github.io/THE-QUIET-AUTHORITY/approval-gate.html` password: approve
- MailerLite: the live email engine (see `_system/integrations.md`)

## WHAT IS PAUSED — RECONNECTS LATER, DON'T ARCHIVE
- Substack (agent + deploy): paused 2026-10-03 by Grace. The daily `schedule:` triggers were removed from `substack-agent.yml` and `substack-deploy.yml`; only manual `workflow_dispatch` remains. Note: the agent publishes live when it runs and the secret is valid. To resume, restore the cron lines noted in each workflow file. Handle is `sapop2sotwm.substack.com`.
- Instagram: paused due to a Meta account restriction. All agent/pipeline files stay in place — see `_system/channels.md`. Reconnects to the Pinterest content flow when the restriction lifts.

## WHAT IS DEAD — DO NOT REFERENCE, DO NOT REBUILD
- **Make.com** — confirmed dead. Zero references exist in the actual running code. Not running. See `_archive/make-com-removed.md`.
- **Systeme.io** — account fully shut down, no longer exists (confirmed by Grace, permanent). Every "Gate Tags active" / automation-rule claim in older docs is stale. See `_archive/systeme-io-shutdown-2026-08.md`.
  - `.github/workflows/gate-buyer-sync.yml`, `load-gate1-emails.yml`, and `setup-gate-pipeline.yml` — all three called the Systeme.io API and have been **deleted** (2026-08-22). Full content preserved in `_archive/systeme-io-shutdown-2026-08.md`, including the Gate 1 email copy those workflows carried.
  - **Consequence:** Gate 1's email sequence (see `circle-of-silence/gate-1-hakria.md`) has no live delivery mechanism right now. It was wired to Systeme.io; that's gone, and so is the automation that sent it. Needs a decision — migrate to MailerLite, or something else.
- Substack via HTTP 403 / session-cookie-in-header — old broken path, do not use. Current method: `SUBSTACK_COOKIE_ID`, see `_system/channels.md`.
- Cowork for Windows filesystem: Linux wall, use Claude Code instead
