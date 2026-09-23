# Pinterest GitHub Action — retired 2026-09-23

This pipeline (`pinterest_agent.py`, `.github/workflows/pinterest-agent.yml`,
this dir's `pin-log.md` and `pinterest-pending/`) never actually posted a
pin. `pin-log.md` shows zero rows with status `POSTED`, ever — every
attempt failed with a missing token, a board-name mismatch, or a missing
image. Its GitHub Action ran 84 times and then simply stopped after
2026-07-20, with no error, while other workflows in this repo kept
running normally.

The real, live posting mechanism for Pinterest (and Instagram, and YouTube
Shorts) is Metricool, confirmed directly against Metricool's own
scheduled-posts data on 2026-09-23 — see `MINISTRY-WORKFLOW.md` at the
repo root for the current, correct picture. This pipeline is retired, not
fixed, because it's fully superseded.

Kept here for history, same as `_archive/systeme-io-shutdown-2026-08.md`
and `_archive/make-com-removed.md`. Do not resurrect it without checking
with Grace first — Metricool is the live channel now.
