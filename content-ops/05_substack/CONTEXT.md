# 05 — Substack
*Last updated: 2026-08-22 — auth method corrected*

- **Reads:** daily devotion content from Drive `/devotion-inbox/` or generates from profile descriptions, `_system/channels.md` for auth
- **Does:** writes in Grace's voice — sacred, tender, first-person, prophetic. Two modes: Daily Devotion (200–300 words, daily 6am) and Weekly Letter (600–800 words, Sunday)
- **Writes:** Substack via `POST /api/v1/drafts` then `/api/v1/drafts/{id}/publish`; logs to `workflows/substack-log.md`
- **Trigger:** daily 6am (devotion), Sunday (letter)
- **Human check:** `approval-gate.html` before publish

## Auth — corrected 2026-08-22

Use `SUBSTACK_COOKIE_ID` (connect.sid cookie). This supersedes the `SUBSTACK_API_KEY` + `SUBSTACK_PUBLICATION_ID` method described in `agent.md` — that method was never confirmed working; the cookie method is what `_system/channels.md` confirms as current. Do not use the old HTTP session-cookie-in-header path — that's the pre-fix broken method responsible for the historical run of `FAILED (HTTP 403)` entries in `workflows/substack-log.md`.
