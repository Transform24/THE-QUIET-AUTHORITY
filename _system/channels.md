# Channels
*Last updated: 2026-08-22*

## Pinterest
- Account: sanctuarygrace.com / sanctuarygracefaith
- Agent: running, pins post daily
- Approval gate: `approval-gate.html` password `approve`
- Secrets: `PINTEREST_ACCESS_TOKEN`, `PINTEREST_API_KEY`, `PINTEREST_APP_ID`, `PINTEREST_BOARD_ID`
- Boards (verified against the live posting code, `workflows/scripts/pinterest_agent.py`, 2026-08-22): **The Quiet Authority for Women**, **Sacred Morning Practices**, **Christian Women Encouragement**, **Spiritual Rest for Women**. Any other board list in older docs is wrong — see `_archive/`.

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
- **PAUSED** — Meta account restriction. Not dead: all agent/pipeline files (`content-ops/03_instagram/agent.md`, `workflows/scripts/instagram_agent.py`, `workflows/scripts/instagram-deploy.py`) stay in place. Reconnects to the Pinterest content flow once the restriction lifts — Instagram repurposes Pinterest captions, so resuming it is a re-enable, not a rebuild.
- Account: `_thequietauthority_`
