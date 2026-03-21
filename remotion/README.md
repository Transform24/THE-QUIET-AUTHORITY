# The Quiet Authority — Remotion Video

Promotional video compositions for **The Quiet Authority** sacred assessment, built with [Remotion](https://remotion.dev).

## Setup

```bash
cd remotion
npm install
```

## Preview in Studio

```bash
npm run studio
```

Opens the Remotion Studio at `http://localhost:3000` where you can preview and scrub through the video.

## Render Videos

```bash
# 9:16 vertical (Instagram Reels, TikTok, YouTube Shorts) — 1080x1920
npm run render:short

# 16:9 horizontal (YouTube, Facebook) — 1920x1080
npm run render:wide

# 1:1 square (Instagram feed) — 1080x1080
npm run render:square

# Render all three formats
npm run render:all
```

Rendered videos are saved to `remotion/out/`.

## Compositions

| ID | Format | Use case |
|----|--------|----------|
| `QuietAuthorityShort` | 1080×1920 (9:16) | Instagram Reels, TikTok, YouTube Shorts |
| `QuietAuthorityWide` | 1920×1080 (16:9) | YouTube, Facebook |
| `QuietAuthoritySquare` | 1080×1080 (1:1) | Instagram feed |

All compositions are 15 seconds at 30fps.

## Static Assets

Remotion loads assets from the **repository root** via `staticFile()`:
- `banner.png` — hero background image
- `music1.mp3` — background audio (30% volume)

## Integration Options

### Option 1 — Embed rendered video on the landing page
Render the video, upload it somewhere (Cloudflare R2, S3, etc.), then add a `<video>` tag to `index.html`.

### Option 2 — Use `@remotion/player` in a React app
If you migrate the site to React, import `<Player>` from `@remotion/player` and pass `QuietAuthorityVideo` as the component. This lets visitors preview the video directly in the browser without a pre-render step.
