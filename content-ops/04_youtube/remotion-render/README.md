# Remotion Rendering Layer — TQA Video & Image Generation

This folder contains the Remotion components for programmatically generating videos and images for all 4 platforms.

---

## 📁 STRUCTURE

```
remotion/
├── package.json                 # Dependencies (Remotion, renderer)
├── render-youtube.js            # YouTube video renderer
├── render-instagram.js          # Instagram Reel renderer
├── render-pinterest.js          # Pinterest pin image renderer
├── render-substack.js           # Substack header image renderer
└── compositions/
    ├── YouTubeVideo.js          # 12-min teaching video component
    ├── InstagramReel.js         # 60-sec short-form video component
    ├── PinterestPin.js          # 1000×1500px pin image component
    └── SubstackHeader.js        # 1200×630px newsletter header component
```

---

## 🚀 USAGE

### GitHub Actions (Automatic)
When agents run, Remotion renders are called automatically:

```yaml
# youtube-agent.yml example
- name: Install Remotion and render video
  run: |
    npm install -g remotion @remotion/cli
    node workflows/remotion/render-youtube.js
```

### Local Testing
```bash
# Install dependencies
cd workflows/remotion
npm install

# Render YouTube video from latest script
npm run render:youtube

# Render Instagram Reel
npm run render:instagram

# Render Pinterest pin
npm run render:pinterest

# Render Substack header
npm run render:substack
```

---

## 📊 WHAT EACH RENDERS

### YouTube Video (render-youtube.js)
- **Input:** `/workflows/output/youtube-pending/YYYY-MM-DD.json` (script)
- **Output:** `/workflows/output/youtube-pending/YYYY-MM-DD.mp4` (video)
- **Duration:** ~12 minutes (720 seconds)
- **Resolution:** 1920×1080 (Full HD)
- **Codec:** H.264 (YouTube compatible)
- **Segments:**
  1. Opening Stillness (30s) — Music + breathing guide
  2. Teaching (10.5 min) — Text-based content
  3. CTA (30s) — Call to action

### Instagram Reel (render-instagram.js)
- **Input:** `/workflows/output/instagram-pending/YYYY-MM-DD.json` (caption)
- **Output:** `/workflows/output/instagram-pending/YYYY-MM-DD_reel.mp4` (video)
- **Duration:** 60 seconds
- **Resolution:** 1080×1920 (vertical)
- **Codec:** H.264 (Instagram compatible)
- **Segments:**
  1. Hook (10s) — Eye-catching opener
  2. Teaching (35s) — Core message
  3. CTA (15s) — Call to action + link

### Pinterest Pin (render-pinterest.js)
- **Input:** `/workflows/output/pinterest-pending/YYYY-MM-DD.json` (caption)
- **Output:** `/workflows/output/pinterest-pending/YYYY-MM-DD_pin.png` (image)
- **Format:** PNG (lossless)
- **Resolution:** 1000×1500 (vertical)
- **Sections:**
  1. Profile Image (40%) — Grayscale filter
  2. Quote (30%) — Terra text
  3. CTA Button (30%) — Gold with action text

### Substack Header (render-substack.js)
- **Input:** `/workflows/output/substack-pending/YYYY-MM-DD.json` (devotion)
- **Output:** `/workflows/output/substack-pending/YYYY-MM-DD_header.png` (image)
- **Format:** PNG
- **Resolution:** 1200×630 (horizontal, for email/web)
- **Sections:**
  1. Left border accent (gold)
  2. Title (terra text)
  3. Scripture reference
  4. Brand label

---

## 🎨 DESIGN TOKENS (From CLAUDE.md)

All components use the sacred TQA color palette:

```
--bg:#0d0d0d              Dark background
--surface:#181818         Lighter surface
--border:#272727          Subtle borders
--gold:#C9A84C            Primary accent
--terra:#C1593C           Secondary accent
--sage:#7d8c6e            Tertiary accent
--cream:#F5F0E8           Light text
--text:#e0dace            Primary text
--text-dim:#807870        Secondary text
```

**Fonts:**
- `Cormorant Garamond` — Headings, display, scripture
- `Jost` — Body text, UI
- `Cinzel` — Section badges, decorative text (ALL CAPS)

---

## 📝 INPUT FILE FORMATS

### YouTube Script Format
```json
{
  "title": "Profile Name — Teaching Series",
  "scripture": "John 4:6",
  "profile_key": "A|B|C|D",
  "long_form_script": "30-40 paragraphs of teaching...",
  "shorts_script": "120-160 words for YouTube Shorts",
  "seo_title": "Under 60 chars",
  "seo_description": "200+ words optimized for search",
  "tags": ["#ChristianWomen", "#SpiritualRest", ...],
  "thumbnail_brief": "Profile image + 1 line terra text"
}
```

### Instagram Caption Format
```json
{
  "caption": "Reel text and CTA",
  "hook": "First 3 seconds text",
  "teaching": "35 seconds of core message",
  "cta": "Call to action with link",
  "profile_key": "A|B|C|D",
  "post_type": "reel|carousel"
}
```

### Pinterest Caption Format
```json
{
  "caption": "100-200 word caption",
  "profile_image": "profile-A.png|profile-B.png|etc",
  "profile_name": "The Quiet Authority",
  "profile_type": "The Striving Achiever",
  "board": "The Quiet Authority|Spiritual Rest|etc",
  "hashtags": ["#ChristianWomen", ...]
}
```

### Substack Devotion Format
```json
{
  "title": "Daily Devotion",
  "scripture": "Matthew 11:28",
  "content": "300-word devotional reflection",
  "practice": "Today's 15-minute practice guide",
  "call_to_action": "Link to sanctuary-grace.com"
}
```

---

## 🔧 TROUBLESHOOTING

### Remotion install fails
```bash
npm install -g remotion --force
# If still fails, try Node version 18+
node --version  # Should be v18.0.0 or higher
```

### Video rendering is slow
- Expected: 5–10 minutes for 12-min YouTube video (real-time rendering)
- Instagram Reel: 1–2 minutes
- Pinterest/Substack: <30 seconds (still images)

### Output file is empty
- Check `/workflows/output/[platform]-pending/` for input JSON
- Verify JSON is valid (not malformed)
- Check render script permissions
- Re-run: `npm run render:[platform]`

### Font rendering looks wrong
- Fonts must be available on system or bundled
- Remotion uses Google Fonts by default
- All TQA fonts are standard (Garamond, Jost, Cinzel available)

### API quota exceeded
- Agent ran too many times (hit Gemini daily limit)
- Wait 24 hours, then re-run
- Output folder grows — clean up old pending files

---

## 📦 DEPLOYING NEW COMPONENT

To add a new Remotion composition:

1. **Create component** in `compositions/NewComponent.js`
   ```javascript
   export const NewComponent = (props) => { /* ... */ };
   export const newComponentComp = new Composition({...});
   ```

2. **Create render script** `render-new.js`
   ```javascript
   import { renderMedia } from '@remotion/renderer';
   import { NewComponent } from './compositions/NewComponent.js';
   // ... render logic
   ```

3. **Add to package.json scripts**
   ```json
   "render:new": "node render-new.js"
   ```

4. **Integrate into workflow** (e.g., `new-agent.yml`)
   ```yaml
   - name: Install Remotion and render
     run: npm run render:new
   ```

---

## 📖 REMOTION DOCS

- Official: https://www.remotion.dev/
- CLI: https://www.remotion.dev/cli
- Components: https://www.remotion.dev/composition
- Rendering: https://www.remotion.dev/renderer

---

**Last Updated:** 2026-06-06  
**Status:** Ready for all 4 platforms

