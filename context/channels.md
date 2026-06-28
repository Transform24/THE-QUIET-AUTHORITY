# Channels

## Pinterest
- Account: sanctuarygrace.com / sanctuarygracefaith
- Agent: running, pins post daily
- Approval gate: approval-gate.html password approve
- Secrets: PINTEREST_ACCESS_TOKEN, PINTEREST_API_KEY, PINTEREST_APP_ID, PINTEREST_BOARD_ID

## Substack
- URL: https://5apop2sotwm.substack.com
- Sender: Grace Turner
- Secret: SUBSTACK_COOKIE_ID (connect.sid cookie, do not sign out)
- Agent: publishes daily KJV devotion 6am via POST /api/v1/drafts then /api/v1/drafts/{id}/publish
- Do NOT use HTTP session cookie path from old agent — use SUBSTACK_COOKIE_ID only

## YouTube
- Channel: youtube.com/@TheQuietAuthority-f1z
- Secrets: YOUTUBE_SESSION_SID, YOUTUBE_SESSION_HSID
- Agent: generates weekly KJV scripture script, saves to workflows/output/youtube-pending/
- Grace approves at approval-gate.html before any posting

## Instagram
- FROZEN — Meta account restriction — do not attempt
