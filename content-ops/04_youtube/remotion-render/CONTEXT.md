# Remotion Render Triggers
*Last updated: 2026-08-22*

Per-platform invocation scripts that call the compositions in `../remotion/` to actually render video. Not wired into any GitHub Actions workflow yet — confirmed by grep across `.github/workflows/*.yml` during the 2026-08-22 restructure, so moving this folder was safe.

- **Reads:** profile/devotion text content, the Remotion compositions in `../remotion/src/`
- **Does:** renders video per platform (`render-youtube.js`, `render-pinterest.js`, `render-instagram.js`, `render-substack.js`)
- **Writes:** rendered video files — destination not yet confirmed live (no deploy step wired)
- **Trigger:** none yet — manual only
- **Human check:** none built — this is pre-pipeline tooling
