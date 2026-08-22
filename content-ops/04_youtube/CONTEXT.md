# 04 — YouTube
*Last updated: 2026-08-22*

- **Reads:** devotional content, profile descriptions, 7-day practice content (Drive)
- **Does:** writes long-form video scripts (sacred voice, `/copywriting`), SEO description (`/content-strategy`); separately, the `remotion/` + `remotion-render/` tooling in this folder renders profile/devotion content into actual video
- **Writes:** `workflows/output/youtube-pending/` (scripts), rendered video output from the Remotion pipeline
- **Trigger:** weekly
- **Human check:** `approval-gate.html` before any post/upload

## Video repurposing (Remotion)

Two parts, both live here, neither wired into any GitHub Actions workflow yet (safe to have moved — confirmed no `.yml` or script references either path):

- `remotion/` — the Remotion React composition project (`QuietAuthorityVideo.jsx`, `Root.jsx`) — the actual video-rendering engine.
- `remotion-render/` — the per-platform render trigger scripts (`render-youtube.js`, `render-pinterest.js`, `render-instagram.js`, `render-substack.js`) that invoke the compositions above.
- `render-youtube-video.py` — Python wrapper for the YouTube render path.

Takes in: profile/devotion text content. Outputs: rendered video for the YouTube channel (and, per the render-*.js naming, potentially other platforms — not yet confirmed wired anywhere live).
