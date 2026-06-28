# Sanctuary Grace Ministry — System Status

## WHAT WORKS — DO NOT REBUILD
- GitHub Pages: live at sanctuary-grace.com and transform24.github.io
- Stripe: live, webhook we_1TmPsDDvGX7GhwdzZ15UzERO fires on checkout.session.completed
- Pinterest agent: running, commits to workflows/output/pinterest-pending/
- Approval gate: transform24.github.io/THE-QUIET-AUTHORITY/approval-gate.html password: approve
- gate-buyer-sync.yml: runs every 15 minutes, confirmed clean

## WHAT IS UNBLOCKED — FIX THESE
- Substack: use SUBSTACK_COOKIE_ID secret, endpoint POST https://5apop2sotwm.substack.com/api/v1/drafts
- YouTube: use YOUTUBE_SESSION_SID and YOUTUBE_SESSION_HSID secrets

## WHAT IS FROZEN — NEVER ATTEMPT
- Instagram: Meta account restriction
- Systeme.io via API: no campaign endpoint exists
- Systeme.io via MCP: requires OAuth, cannot connect
- Substack via HTTP 403: old path, do not use
- Make.com: eliminated
- Cowork for Windows filesystem: Linux wall, use Claude Code instead

## LOAD GATE 1 EMAILS
Must be done manually in Systeme.io UI. Emails written and ready. See context/gate-1.md.
