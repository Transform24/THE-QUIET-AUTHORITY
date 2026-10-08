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

## Psalm 91 (KJV), vertical 1080x1920

The words live in `src/data/psalm91.json`. Each entry holds the verse marker, two lines, the two colors and `reveal_speed_ms`.
This engine shares its look with `circle-of-silence/remotion/`. The shared files must stay identical (see the central README, section 11).

1. Edit `src/data/psalm91.json` only. Keep 16 verses, KJV wording, no em dashes. Colors stay `#F5F0E8` (words) and `#C9A84C` (badge).
2. Check it: `npm run validate:psalm91` (it also confirms `music1.mp3` is real audio at the repository root).
3. Prove the checker still works: `npm run test:validator`
4. Render the whole psalm: `npm run render:psalm91` (about 191 seconds). It checks the script and stages the music first.
5. Render one clip per verse: `npm run render:psalm91:clips` (files appear in `out/clips/`).
6. On GitHub: Actions, "Remotion Render Psalm 91 (vertical)", Run workflow. It saves the videos as a downloadable artifact for 14 days. It uses no secrets and never uploads anywhere. Grace uploads herself.

Pace: words appear one at a time, about 110 to 130 words a minute. `reveal_speed_ms` is the time given per letter. No word is shown for less than 0.42 seconds, and punctuation adds a breath.

Music: `music1.mp3` is read from the repository root, not from this folder. `scripts/stage-audio.mjs` copies it into `public/` (ignored by git) and the video loops it softly with a fade in and fade out. Never move the music files out of the root. The website needs them there.

Fonts (Cormorant Garamond, Jost, Cinzel) load from Google Fonts while rendering.

The older promo videos in `src/QuietAuthorityVideo.jsx` are not part of this and still need a `banner.png` that is not stored here.
