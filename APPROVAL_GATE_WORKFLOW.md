# APPROVAL GATE WORKFLOW — Agent Output Review & Deployment

**Updated:** 2026-06-06  
**Status:** All 4 agents (Pinterest, YouTube, Substack, Instagram) now output to approval gates before posting.

---

## 🎯 THE FLOW

```
AGENT RUNS (per schedule)
    ↓
OUTPUT TO -pending/ folder
    ↓
GRACE REVIEWS (you approve/reject)
    ↓
MOVE TO -approved/ folder (approval)
    ↓
DEPLOY WORKFLOW RUNS (auto-posts)
    ↓
ARCHIVE TO /library/ (keeps forever)
```

---

## 📍 WHERE TO FIND PENDING CONTENT FOR APPROVAL

### Option 1: GitHub Web (Easiest)
1. Go to: https://github.com/Transform24/THE-QUIET-AUTHORITY/
2. Click **Browse files** → **workflows/output/**
3. You'll see 4 folders:
   - `pinterest-pending/`
   - `youtube-pending/`
   - `substack-pending/`
   - `instagram-pending/`

### Option 2: Local Clone
```bash
cd THE-QUIET-AUTHORITY
git pull origin main

# View all pending content
ls -la workflows/output/

# Check specific platform
cat workflows/output/pinterest-pending/2026-06-06.json
cat workflows/output/youtube-pending/2026-06-06/script.json
cat workflows/output/substack-pending/2026-06-06.json
cat workflows/output/instagram-pending/2026-06-06.json
```

---

## ✅ APPROVAL CHECKLIST — EACH PLATFORM

### PINTEREST APPROVAL (Daily)

**Location:** `workflows/output/pinterest-pending/YYYY-MM-DD.json`

**What to check:**
- [ ] Tone: Sacred, tender, prophetic? (Not marketing-y)
- [ ] Length: 100–200 words?
- [ ] Ends with: `https://sanctuary-grace.com/`?
- [ ] Hashtags: Varied? (Don't repeat same 5 from last week)
- [ ] Image: File exists (e.g., `profile-C.png`, not broken path)
- [ ] Board: Correct board assigned (The Quiet Authority / Spiritual Rest / etc.)

**If approved:**
1. Open GitHub → workflows/output/pinterest-pending/
2. Download the JSON file
3. Go to `pinterest-approved/` folder
4. Upload file there (or commit via Git)
5. Delete from `pinterest-pending/`

**If rejected or needs edits:**
- Edit the JSON file directly
- Leave in `pinterest-pending/` until approved
- OR delete and wait for next agent run

---

### YOUTUBE APPROVAL (Weekly, Monday)

**Location:** `workflows/output/youtube-pending/YYYY-MM-DD/`

**Contents:**
- `script.json` — Full teaching script (12 min + Shorts script)
- `video.mp4` — Rendered video (ready to upload)
- `seo_data.json` — Title, description, tags, thumbnail brief

**What to check:**
- [ ] Opening stillness clear? (Breathing cue visible on video)
- [ ] Teaching matches scripture and profile?
- [ ] CTA natural? (Not hard-sell)
- [ ] Audio levels consistent? (Watch full video)
- [ ] Video length ~12 minutes?
- [ ] Thumbnail brief matches content?

**If approved:**
1. Open GitHub → workflows/output/youtube-pending/
2. Download the entire folder
3. Go to `youtube-approved/` folder
4. Upload folder there
5. Delete from `youtube-pending/`

**If rejected:**
- Edit `script.json` (rewrite teaching or CTA)
- Re-run agent or manually delete video
- Wait for next Monday agent run

---

### SUBSTACK APPROVAL (Daily)

**Location:** `workflows/output/substack-pending/YYYY-MM-DD.json`

**Contents:**
```json
{
  "title": "Daily Devotion",
  "scripture": "John 4:6",
  "content": "...",
  "practice": "...",
  "header_image": "2026-06-06_header.png"
}
```

**What to check:**
- [ ] Tone: First-person and prophetic? (Reads like you)
- [ ] Scripture: Integrated naturally? (Not quoted in isolation)
- [ ] Content: Specific reflection? (Not generic platitude)
- [ ] Practice: Clear and doable?
- [ ] Length: 200–300 words?
- [ ] CTA: Ends with link to sanctuary-grace.com?

**If approved:**
1. Open GitHub → workflows/output/substack-pending/
2. Move entire JSON file to `substack-approved/`

**If needs edit:**
1. Copy file locally
2. Edit content/reflection
3. Re-upload to `substack-pending/`

---

### INSTAGRAM APPROVAL (Daily, when enabled)

**Location:** `workflows/output/instagram-pending/YYYY-MM-DD/`

**Contents:**
- `caption.json` — Caption + metadata
- `reel.mp4` — Rendered 60-sec Reel video
- `carousel.json` — (Optional) Multi-slide carousel text

**What to check:**
- [ ] Caption tone: Sacred TQA voice? (No hustle, no emojis)
- [ ] Hook lands in first 3 seconds of Reel? (Watch video)
- [ ] Text overlays readable on mobile?
- [ ] CTA included? (Link to sanctuary-grace.com)
- [ ] Video ~60 seconds?
- [ ] Thumbnail thumbnail clear?

**If approved:**
1. Open GitHub → workflows/output/instagram-pending/
2. Move entire folder to `instagram-approved/`

**If rejected:**
- Instagram account is 7–14 days old (new account restrictions)
- Not eligible for posting yet
- Hold in `pending/` until June 12+

---

## 🔄 HOW TO MOVE FILES (Approve/Deploy)

### Method 1: GitHub Web UI (Simplest)
1. Go to: https://github.com/Transform24/THE-QUIET-AUTHORITY/
2. Navigate to: **workflows/output/pinterest-pending/**
3. Click file → **…** menu → **Rename**
4. Change path: `pinterest-pending/file.json` → `pinterest-approved/file.json`
5. Commit

### Method 2: Terminal (Git)
```bash
cd THE-QUIET-AUTHORITY
git pull origin main

# Move Pinterest from -pending to -approved
mv workflows/output/pinterest-pending/2026-06-06.json \
   workflows/output/pinterest-approved/2026-06-06.json

git add workflows/output/pinterest-approved/ workflows/output/pinterest-pending/
git commit -m "Approve Pinterest pin for 2026-06-06 — ready to post"
git push origin main
```

### Method 3: GitHub Actions (Approval Workflow)

Create a simple approval workflow that lists pending, lets you select, and moves:
```bash
# Coming soon — manual movement via GitHub Actions
```

---

## 🤖 WHAT HAPPENS AFTER APPROVAL

### Step 1: File Moves to -approved/
You move file from `-pending/` to `-approved/`

### Step 2: Deploy Workflow Runs
- **Pinterest:** Daily 2pm UTC → reads `pinterest-approved/` → posts to Pinterest
- **YouTube:** Weekly Monday 9am UTC → reads `youtube-approved/` → uploads to YouTube
- **Substack:** Daily 1pm UTC → reads `substack-approved/` → publishes to Substack
- **Instagram:** Daily 2pm UTC → reads `instagram-approved/` → posts to Instagram

### Step 3: Logs & Archive
- Log file updated: `workflows/pin-log.md`, `workflows/youtube-log.md`, etc.
- File archived: `workflows/library/pinterest-images/`, `workflows/library/youtube-renders/`, etc.
- File deleted from `-approved/` (keeps folder clean)

---

## ⚠️ IMPORTANT NOTES

**Once approved and deployed, reverting is hard.** Pinterest, YouTube, Substack, and Instagram all archive posts to their servers. Before approving:
- Watch the full video (YouTube)
- Read the full caption (Pinterest, Substack, Instagram)
- Verify links are correct (all should end in `sanctuary-grace.com`)
- Check tone matches brand voice

**You can edit before approving:**
- Edit the JSON/video file in `-pending/` folder
- Don't move to `-approved/` until satisfied
- Agent will never auto-overwrite — safe to leave files there

**You can skip deployment:**
- Leave file in `-pending/` indefinitely
- Deploy workflow only reads from `-approved/`
- File won't post if you don't move it

---

## 📊 APPROVAL TARGETS

| Platform | Frequency | Approval Rate | Notes |
|----------|-----------|---------------|-------|
| Pinterest | Daily | 80%+ | Some days you might skip if content doesn't feel right |
| YouTube | Weekly | 95%+ | High bar — it's 12 min of video |
| Substack | Daily | 85%+ | Edit if devotion feels generic |
| Instagram | Daily | 75%+ | New account (young) — lower expectations initially |

---

## 🚨 IF SOMETHING BREAKS

**Agent fails to generate:**
- Check GitHub Actions logs: https://github.com/Transform24/THE-QUIET-AUTHORITY/actions/
- Click workflow name (pinterest-agent, youtube-agent, etc.)
- Click latest run
- Scroll down → click failed step → see error message
- Common issues:
  - API quota exceeded (daily limit hit)
  - API key invalid or expired (check GitHub Secrets)
  - Output folder missing (create manually if needed)

**Deploy fails:**
- Similar process — check GitHub Actions logs
- Usually: file not found in `-approved/` or API credentials missing

**Video won't render (YouTube/Instagram):**
- Remotion rendering failed
- Check logs for error
- Video file not created → check script JSON for errors
- Manually re-run agent or try next scheduled time

---

## 🎯 QUICK APPROVAL SOP

**Every morning:**
1. Go to https://github.com/Transform24/THE-QUIET-AUTHORITY/workflows/output/
2. Check `pinterest-pending/` (daily)
3. Check `substack-pending/` (daily)
4. Check `instagram-pending/` (if enabled)

**Every Monday:**
1. Check `youtube-pending/`
2. Watch the video
3. Read script
4. Approve or edit

**Once approved:**
1. Move file from `-pending/` to `-approved/`
2. Deploy workflow auto-runs per schedule
3. Content posts automatically

---

## 📱 MOBILE/DESKTOP

You can approve from your phone:
1. GitHub mobile app
2. Go to repo → workflows/output/
3. Click file → view JSON
4. (Or) Go to GitHub web on mobile → rename file to move it

---

## 🔐 SECURITY NOTES

- Never paste API keys into files
- All secrets stored in GitHub Actions Secrets (Settings → Secrets)
- Approval process doesn't require any passwords
- Only you (Grace) can move files (GitHub permissions)

---

**Questions?** Check FLYWHEEL_OPERATIONAL_REPORT.md for full agent specs.

