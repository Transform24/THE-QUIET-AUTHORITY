# THE QUIET AUTHORITY — AGENT SOP
## Sanctuary Grace Ministry · Transform24
*Last updated: 2026-08-22 — restructured to ICM. This file routes; it holds no content itself.*

---

## ROUTING TABLE — READ THIS FIRST

| Task | Read |
|---|---|
| The live assessment app / site (screens, localStorage, code patterns, NEVER DO) | `SITE-CONTEXT.md` |
| Brand voice, design tokens (never change without Grace approval) | `_system/brand-tokens.md` |
| What's live / paused / dead across every integration right now | `_system/status.md` |
| Per-channel details (Pinterest, Substack, YouTube, Instagram) | `_system/channels.md` |
| Full integration map (email, forms, payments, hosting) | `_system/integrations.md` |
| Git branch/merge protocol | `_system/git-workflow.md` |
| Subagent permission setup | `_system/subagent-permissions.md` |
| History of completed changes | `_system/changelog.md` |
| Content agent pipelines (Pinterest, Instagram, YouTube, Substack, repurposing, reporting) | `content-ops/CONTEXT.md` |
| The Circle of Silence gates, products, pricing | `circle-of-silence/CONTEXT.md` |
| Security rules for API keys / secrets | `SITE-CONTEXT.md` §0 |

---

## SECURITY — READ BEFORE ANY INTEGRATION WORK

- **NEVER** ask the user to paste API keys, secrets, or credentials into chat.
- If a key is needed, instruct the user to set it as an environment variable or a gitignored `.env` file.
- If a secret is accidentally shared in chat, **immediately stop all work** and instruct the user to revoke/rotate it.
- Scan every diff before committing — if any string matches `sk_live_`, `sk_test_`, `rk_live_`, or `API_KEY=`, abort and warn.

---

## NEVER DO (workspace-wide)

- Force-push `main`.
- Add npm / build tools / frameworks to the live app.
- Change design tokens or brand voice without Grace's approval.
- Reference MailerLite as removed, Systeme.io as active, or Make.com as live — see `_system/status.md` for current truth.
- Move `index.html`, `gate-*.html`, `CNAME`, `.nojekyll`, `approval-gate.html`, `privacy.html`, `404.html`, or their sibling assets out of repo root — GitHub Pages serves from root. See `SITE-CONTEXT.md`.
- Move `workflows/scripts/*.py`, `workflows/output/*`, `workflows/youtube-log.md`, or `workflows/substack-log.md` — GitHub Actions hardcodes these exact paths in both the workflow YAML and the scripts' own internal path constants.
