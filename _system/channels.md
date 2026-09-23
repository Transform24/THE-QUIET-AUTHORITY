# Channels
*Last updated: 2026-09-23*

## READ THIS FIRST — the real posting mechanism, and an open safety gap

Corrected 2026-09-23. This repo's own GitHub Action pipeline for Pinterest
never worked and is retired — see `_archive/pinterest-github-action-retired-2026-09/README.md`.
Pinterest, Instagram, and YouTube Shorts are actually posted through
**Metricool** (brand id 6554085, account `sanctuarygracefaith` /
`_thequietauthority_`), confirmed directly against Metricool's own
scheduled-posts data on 2026-09-23. Real posts are going out and mostly
succeeding.

**Open safety gap, not yet resolved, Grace's decision, not touched by any
session:** every post checked in Metricool has `autoPublish: true`. There
is no human review step in that pipeline. This directly contradicts the
purpose of `approval-gate.html` below, which Grace built specifically so
nothing goes out in the ministry's name without her seeing it first. The
repo's own pipelines (YouTube long-form, and the retired Pinterest one)
respect that gate; Metricool does not. Do not treat Metricool's posting as
a fixed or good thing without checking with Grace first — she has not yet
said whether to turn off auto-publish, review what's already gone out, or
something else. See `MINISTRY-WORKFLOW.md` for the fuller trace.

## Pinterest
- Account: sanctuarygrace.com / sanctuarygracefaith
- **Live posting is via Metricool, not this repo.** The repo's own agent
  (`pinterest_agent.py` + its GitHub Action) never posted a single pin —
  retired 2026-09-23, see `_archive/pinterest-github-action-retired-2026-09/`.
- Approval gate: `approval-gate.html` — built for the repo's own pipelines
  (YouTube long-form video approval). It does not sit in front of
  Metricool's posting at all; see the safety-gap note above.
- Secrets `PINTEREST_ACCESS_TOKEN`/`PINTEREST_API_KEY`/`PINTEREST_APP_ID`/`PINTEREST_BOARD_ID`
  belonged to the retired pipeline and are no longer needed by anything
  live in this repo.

## Substack
- URL: https://5apop2sotwm.substack.com
- Sender: Grace Turner
- Secret: `SUBSTACK_COOKIE_ID` (connect.sid cookie, do not sign out) — **this is current**, confirmed over the `SUBSTACK_API_KEY`/`SUBSTACK_PUBLICATION_ID` method described in older agent specs
- Agent: publishes daily KJV devotion 6am via `POST /api/v1/drafts` then `/api/v1/drafts/{id}/publish`
- Do NOT use the old HTTP session-cookie-in-header path — that's the pre-fix broken method

## YouTube
- Channel: youtube.com/@TheQuietAuthority-f1z
- Secrets: `YOUTUBE_SESSION_SID`, `YOUTUBE_SESSION_HSID`
- Agent: generates weekly KJV scripture script, saves to `workflows/output/youtube-pending/`
- Grace approves at `approval-gate.html` before any posting
- Video repurposing pipeline (`content-ops/04_youtube/remotion/` + `remotion-render/`) renders profile/devotion content into video for this channel

## Instagram
- **This repo's own pipeline is PAUSED** — Meta account restriction. Not dead: all agent/pipeline files (`content-ops/03_instagram/agent.md`, `workflows/scripts/instagram_agent.py`, `workflows/scripts/instagram-deploy.py`) stay in place, cleanly config-gated, zero cost while paused.
- **But Instagram is not actually dark** — Metricool is posting real Reels to this account right now, separately from this repo's pipeline. See the safety-gap note above: those posts are not passing through `approval-gate.html` or any human review.
- Account: `_thequietauthority_`
