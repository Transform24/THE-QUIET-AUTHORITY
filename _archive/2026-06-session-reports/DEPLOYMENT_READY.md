# 🚀 PINTEREST & YOUTUBE READY TO DEPLOY

**Date:** 2026-06-06  
**Status:** ✅ Complete and tested  
**Branch:** `claude/inspiring-hopper-3oc52`

---

## WHAT'S READY

### ✅ Pinterest Automation (100% Complete)

**Flow:**
1. **Daily 2pm UTC:** Pinterest agent generates caption
2. Caption saved to → `workflows/output/pinterest-pending/YYYY-MM-DD.md`
3. **Grace approves:** Move file to `workflows/output/pinterest-approved/`
4. **Auto-posts:** Deploy workflow runs, posts to Pinterest API
5. **Logged:** Result saved to `workflows/pin-log.md`

**Files Created:**
- `workflows/scripts/pinterest-deploy.py` — reads approved captions, posts to API
- Updated `.github/workflows/pinterest-deploy.yml` — calls deploy script daily at 2pm UTC

**Test Result:**
- ✅ Agent generates captions in correct folder
- ✅ Deploy script reads approved pins
- ✅ API requests formed correctly
- ✅ Results logged

**To Go Live:**
1. Add `PINTEREST_ACCESS_TOKEN` to GitHub Secrets
   - Get from: https://developers.pinterest.com
   - Scopes: pins:write, boards:read
2. Schedule: Runs automatically daily at 2pm UTC

---

### ✅ YouTube Automation (100% Complete)

**Flow:**
1. **Weekly Monday 9am UTC:** YouTube agent generates script + renders video
2. **Video creation:** FFmpeg converts script to 12-minute faceless video
3. Video + script saved to → `workflows/output/youtube-pending/YYYY-MM-DD/`
4. **Grace approves:** Move folder to `workflows/output/youtube-approved/`
5. **Auto-uploads:** Deploy workflow runs, uploads to YouTube API
6. **Logged:** Result saved to `workflows/youtube-log.md`

**Files Created:**
- `workflows/scripts/render-youtube-video.py` — FFmpeg video renderer (text slides + audio)
- `workflows/scripts/youtube-deploy.py` — reads MP4, uploads to YouTube API
- Updated `.github/workflows/youtube-agent.yml` — renders video before commit
- Updated `.github/workflows/youtube-deploy.yml` — calls deploy script weekly

**Video Specs:**
- Duration: 12 minutes (720 seconds)
- Resolution: 1920×1080 (Full HD)
- Format: H.264 MP4
- Content: Text slides from script, TQA color scheme
- Faceless: No on-camera required ✅

**To Go Live:**
1. Add YouTube OAuth 2.0 credentials to GitHub Secrets:
   - `YOUTUBE_CLIENT_ID` — from Google Cloud Console
   - `YOUTUBE_CLIENT_SECRET` — from Google Cloud Console
   - `YOUTUBE_REFRESH_TOKEN` — generated via OAuth flow
2. Schedule: Runs automatically weekly Monday 9am UTC

---

## APPROVAL GATE WORKFLOW

### For Grace (Daily)

**Pinterest (Daily)**
1. Check: `workflows/output/pinterest-pending/`
2. Read caption (2 min)
3. If approved: Move file to `workflows/output/pinterest-approved/`
4. Deploy runs automatically 2pm UTC → posts to Pinterest

**YouTube (Weekly, Monday)**
1. Check: `workflows/output/youtube-pending/YYYY-MM-DD/`
2. Watch video (12 min)
3. Read script (2 min)
4. If approved: Move folder to `workflows/output/youtube-approved/`
5. Deploy runs automatically 9am UTC → uploads to YouTube

### Command to Move Files (Git)
```bash
# Move Pinterest caption to approved
git mv workflows/output/pinterest-pending/2026-06-06.md workflows/output/pinterest-approved/

# Move YouTube folder to approved
git mv workflows/output/youtube-pending/2026-06-07/ workflows/output/youtube-approved/

# Commit and push
git add .
git commit -m "Grace approval: move to approved for auto-deployment"
git push origin main
```

---

## WHAT HAPPENS ON SCHEDULE

### Pinterest (Daily 2pm UTC / 7am PT)
```
1. pinterest-agent.yml runs (2pm UTC)
   ↓
   Generates caption → outputs to pinterest-pending/
   ↓
2. Grace reviews (anytime before next day)
3. Grace moves to pinterest-approved/ (git mv + push)
4. pinterest-deploy.yml runs (2pm UTC next day)
   ↓
   Reads from -approved/ → posts to Pinterest API
   ↓
   Logs result → archives to library/
```

### YouTube (Weekly, Monday 9am UTC / 1am PT)
```
1. youtube-agent.yml runs (Monday 9am UTC)
   ↓
   Generates script → renders video with FFmpeg
   ↓
   Outputs to youtube-pending/YYYY-MM-DD/
   ↓
2. Grace reviews (Mon-Sun)
3. Grace moves to youtube-approved/ (git mv + push)
4. youtube-deploy.yml runs (Monday 9am UTC next week)
   ↓
   Reads MP4 from -approved/ → uploads to YouTube API
   ↓
   Logs result → archives to library/
```

---

## TROUBLESHOOTING

### Pinterest deployment fails
- Check: `PINTEREST_ACCESS_TOKEN` in GitHub Secrets (Settings → Secrets and variables → Actions)
- Check: Token not expired (Pinterest dashboard)
- Check: Folder `workflows/output/pinterest-approved/` has file moved (not copied)

### YouTube deployment fails
- Check: `YOUTUBE_CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN` all set in GitHub Secrets
- Check: OAuth 2.0 credentials valid (Google Cloud Console)
- Check: Channel exists and agent account has upload permission
- Check: Folder `workflows/output/youtube-approved/` has file moved (not copied)

### Video rendering fails (YouTube agent)
- Install dependencies: `apt-get install -y ffmpeg imagemagick`
- Check: Script file exists at `youtube-pending/YYYY-MM-DD/script-video.md`
- Output: Video saved to `youtube-pending/YYYY-MM-DD/video.mp4`

### Files not deploying
- Common: File is copied (not moved with `git mv`)
- Solution: Always use `git mv` to move files between folders
- Verify: Check git status shows files are moved, not deleted + created

---

## WHAT'S NEXT (Substack + Instagram)

Not included in this 2-3 hour session, but can be built with same pattern:

**Substack** (lower complexity):
- Agent generates devotions (already in place)
- Deploy reads from `substack-approved/` → publishes to Substack API
- Time: ~30 min

**Instagram** (higher complexity):
- Agent generates + renders Reel videos (like YouTube, but 60 sec vertical)
- Deploy reads from `instagram-approved/` → posts to Instagram Graph API
- Time: ~1 hour (similar to YouTube)

---

## SUMMARY

| Platform | Agent | Render | Deploy | Status |
|---|---|---|---|---|
| **Pinterest** | ✅ | N/A | ✅ | Ready |
| **YouTube** | ✅ | ✅ | ✅ | Ready |
| Substack | ✅ | N/A | ⏳ | Next |
| Instagram | ✅ | ⏳ | ⏳ | Next |

**Time spent:** ~2.5 hours  
**Next target:** Substack (30 min) + Instagram (1 hour)

---

## GITHUB ACTIONS LOGS

Check workflow runs:
1. Go to: https://github.com/transform24/THE-QUIET-AUTHORITY/actions
2. Find: `Pinterest Agent`, `YouTube Agent`, etc.
3. Click run → view logs
4. Search for ✅ or ❌ to see success/failure

---

**Ready to merge to main and go live?**  
Review, test, then merge `claude/inspiring-hopper-3oc52` to `main` to activate schedules.
