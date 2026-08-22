# Changelog — Completed Changes

*Append-only log. Do not re-litigate anything below — it's done.*

- **mailto removed** — the "email me my profile" mailto link was removed from `submitAndReveal()`. Do NOT add it back.
- **Psalm 91 Amazon link** — all 4 profiles use `https://amzn.to/3REMW6E`. Do NOT revert to B0C7V67VVV.
- **Profile card download** — opens in new browser tab as viewable image, not silent file download.
- **7-day practice timers** — countdown timer on every day card, auto-marks complete at 00:00.
- **UI/UX audit complete** — lazy loading, reduced motion, focus-visible, aria-labels, aria-live, aria-hidden, noreferrer all applied.
- **sanctuary-grace.com is the primary CTA** — all agent posts, app links point here. Domain migrated from sanctuarygrace.store 2026-06-04.
- **Agents 01-06 GitHub Actions workflows built** — repurpose-agent.yml, storefront-sync.yml, lead-tracker.yml, weekly-report.yml, daily-checkin.yml in `.github/workflows/`.
- **Pinterest Day 1 APPROVED** — Guilty Giver wall art. Caption approved by Grace 2026-05-25.
- **Pinterest Developer App created 2026-05-27** — App ID: 1574878 · Redirect URI: `https://transform24.github.io/THE-QUIET-AUTHORITY/` · Secret: `PINTEREST_ACCESS_TOKEN` in GitHub Secrets.
- **privacy.html added** — required for Pinterest API registration and future platform API apps.
- **Approval gate (fixed 2026-06-06)** — all agents save drafts to `workflows/output/[platform]-pending/` on main. `approval-gate.html` reads pending items, Grace approves to move to `-approved/`. Deploy workflows auto-post from `-approved/`.
- **Pinterest Agent fully operational (2026-06-06)** — end-to-end: caption → `pinterest-pending/` → commit → Approval Gate → approve → `pinterest-approved/` → Pinterest API post.
- **Agents 07-10 built (Gemini Flash)** — scripts live in `workflows/scripts/`, use `gemini-2.0-flash` via `v1beta` REST API, stdlib only. `GEMINI_API_KEY` in GitHub Secrets.
- **Instagram account created 2026-05-29** — `_thequietauthority_`, 2 posts live at time of creation. Now paused — see `_system/channels.md`.
- **Substack publication exists** — Grace Turner · `5apop2sotwm.substack.com` · "The Art of Gratitude" series posted.
- **Pinterest Day 1 manually posted 2026-05-29.** Days 1–14 captions written and approved.
- **Daily reference card saved to Drive** — "TQA Daily 15-Minute Morning Routine."
- **Design/UX roadmap (approved 2026-05-16)** — all items shipped: profile-complete gate, dashboard greeting, wall art images, ticker speed, Romans 10:9 styling, YouTube link wired, progressive day unlock, session-complete copy, sticky nav simplified, journal save toast, Agent 06 file, 5-segment dashboard, shop order, wall art images uploaded.
- **2026-08-22 — ICM restructure.** Repo reorganized into `content-ops/` (agent pipelines), `circle-of-silence/` (gate records), `_system/` (cross-cutting reference), `_archive/` (dead/superseded material). Live app (`index.html` etc.) and live automation (`workflows/scripts/`, `workflows/output/`) held in place — see `CONTEXT.md`. Corrected during this pass: Make.com confirmed dead (was claimed live in the old `CLAUDE.md`), Systeme.io confirmed shut down (was claimed active in the old `CLAUDE.md` bottom section), Instagram reclassified from a live/frozen contradiction to PAUSED, Substack auth corrected to `SUBSTACK_COOKIE_ID`, Pinterest board names corrected to match the live posting code, agent count corrected to 10 (was listed as 6 in `workflows/README.md`).
