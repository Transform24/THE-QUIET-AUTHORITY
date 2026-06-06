# APPROVAL WORKFLOW — ACTUAL IMPLEMENTATION

**Last Updated:** 2026-06-06  
**Status:** Live on main branch  
**Documents:** What the workflows ACTUALLY do (not theory)

---

## HOW IT WORKS (Real)

### 1. AGENT GENERATES → PENDING FOLDER

**Pinterest Agent** (Daily 2pm UTC)
```
Runs: agents/pinterest-agent.yml
Output: workflows/output/pinterest-pending/YYYY-MM-DD.md
Content: Frontmatter + 100-200 word caption
Format:
---
date: 2026-06-06
pinterest_day: 12
pin: "The assessment is free"
board: "The Quiet Authority for Women"
status: "DRAFT — PINTEREST_ACCESS_TOKEN not set"
---

[Caption text here]
```

**YouTube Agent** (Weekly Monday 9am UTC)
```
Runs: .github/workflows/youtube-agent.yml
Output: workflows/output/youtube-pending/YYYY-MM-DD/
Files:
  - script-video.md (script with title, sections, SEO data)
  - video.mp4 (rendered 12-min video via FFmpeg)
Status: DRAFT in frontmatter
```

**Substack Agent** (Daily 6am PT / 1pm UTC)
```
Runs: .github/workflows/substack-agent.yml
Output: workflows/output/substack-pending/YYYY-MM-DD.md
Content: Frontmatter + 200-300 word devotion
Format:
---
date: 2026-06-06
mode: daily
status: "DRAFT — Awaiting Grace approval"
---

[Devotion text here]
```

**Instagram Agent** (Daily 2pm UTC — PAUSED)
```
Runs: .github/workflows/instagram-agent.yml (if: false — awaiting account restriction lift)
Output: workflows/output/instagram-pending/YYYY-MM-DD.md
Content: Frontmatter + caption + hashtags
```

---

### 2. GRACE REVIEWS & APPROVES

**What Grace Does:**
1. Check pending folder: `workflows/output/[platform]-pending/`
2. Read content (2-15 min depending on platform)
3. **Move approved files to approved folder** using git

**Command to Move Files:**
```bash
# Single file (Pinterest/Substack/Instagram)
git mv workflows/output/pinterest-pending/2026-06-06.md \
        workflows/output/pinterest-approved/

# Folder (YouTube)
git mv workflows/output/youtube-pending/2026-06-09/ \
       workflows/output/youtube-approved/

# Commit and push
git add .
git commit -m "Grace approval: move to approved for auto-deployment"
git push origin main
```

**What Happens After Move:**
- File is now in `-approved/` folder
- Deploy workflow detects it (runs on schedule)
- Deployment begins automatically

---

### 3. DEPLOY RUNS ON SCHEDULE → POSTS

**Pinterest Deploy** (Daily 2pm UTC)
```
Trigger: Cron schedule 0 14 * * * (daily 2pm UTC)
Reads from: workflows/output/pinterest-approved/
Script: workflows/scripts/pinterest-deploy.py
Does:
  1. Finds all .md files in pinterest-approved/
  2. Parses frontmatter (caption, board, pin name)
  3. POST to Pinterest API with caption
  4. Logs result to workflows/pin-log.md
```

**YouTube Deploy** (Weekly Monday 9am UTC)
```
Trigger: Cron schedule 0 9 * * 1 (Monday 9am UTC)
Reads from: workflows/output/youtube-approved/
Script: workflows/scripts/youtube-deploy.py
Does:
  1. Finds all folders in youtube-approved/
  2. Reads video.mp4 + script-video.md
  3. Parses title, description, tags from script
  4. POST to YouTube API with video file
  5. Logs result to workflows/youtube-log.md
```

**Substack Deploy** (Daily 1pm UTC / 6am PT delivery)
```
Trigger: Cron schedule 0 13 * * * (daily 1pm UTC)
Reads from: workflows/output/substack-approved/
Script: workflows/scripts/substack-deploy.py
Does:
  1. Finds all .md files in substack-approved/
  2. Parses frontmatter + body
  3. POST to Substack API (email import or direct post)
  4. Logs result to workflows/substack-log.md
```

**Instagram Deploy** (Daily 2pm UTC — when enabled)
```
Trigger: Cron schedule 0 14 * * * (daily 2pm UTC)
Condition: if: ${{ vars.INSTAGRAM_RESTRICTION_LIFTED == 'true' }}
Reads from: workflows/output/instagram-approved/
Script: workflows/scripts/instagram-deploy.py
Does:
  1. Finds all .md files in instagram-approved/
  2. Parses caption + hashtags
  3. POST to Instagram Graph API
  4. Logs result to workflows/instagram-log.md
```

---

## APPROVAL SCHEDULE

| Platform | Check Pending | Move to Approved | Deploy Runs | Live |
|---|---|---|---|---|
| **Pinterest** | Daily anytime | Anytime | Daily 2pm UTC | 2pm UTC |
| **YouTube** | Weekly Mon anytime | Anytime | Weekly Mon 9am UTC | 9am UTC Mon |
| **Substack** | Daily anytime | Anytime | Daily 1pm UTC | 6am PT same day |
| **Instagram** | Daily anytime | Anytime | Daily 2pm UTC | 2pm UTC (when enabled) |

---

## ACTUAL FILES CREATED

**Deploy Scripts:**
- `workflows/scripts/pinterest-deploy.py` — Reads from pinterest-approved/, posts to API
- `workflows/scripts/youtube-deploy.py` — Reads from youtube-approved/, uploads to API
- `workflows/scripts/substack-deploy.py` — Reads from substack-approved/, publishes to API
- `workflows/scripts/instagram-deploy.py` — Reads from instagram-approved/, posts to API

**Video Rendering:**
- `workflows/scripts/render-youtube-video.py` — FFmpeg renderer (text slides + background)

**Workflow Files (Updated):**
- `.github/workflows/pinterest-deploy.yml` — Runs pinterest-deploy.py daily 2pm UTC
- `.github/workflows/youtube-agent.yml` — Renders video via FFmpeg before commit
- `.github/workflows/youtube-deploy.yml` — Runs youtube-deploy.py weekly Mon 9am UTC
- `.github/workflows/substack-deploy.yml` — Runs substack-deploy.py daily 1pm UTC
- `.github/workflows/instagram-deploy.yml` — Runs instagram-deploy.py daily 2pm UTC (when enabled)

---

## LOGS (Where to check status)

Each deploy creates a log file:
- `workflows/pin-log.md` — All Pinterest posts logged
- `workflows/youtube-log.md` — All YouTube uploads logged
- `workflows/substack-log.md` — All Substack publishes logged
- `workflows/instagram-log.md` — All Instagram posts logged

**Format:**
```
| Date | Pillar/Mode | Content | Status |
|---|---|---|---|
| 2026-06-06 | daily | The Tired Soul is Heard | PUBLISHED (Email ID: abc123) |
| 2026-06-07 | daily | Wait for the Still Voice | FAILED (HTTP 403) |
```

---

## ERROR HANDLING

**If deploy fails:**
1. Check GitHub Actions logs: https://github.com/transform24/THE-QUIET-AUTHORITY/actions
2. Find workflow run: `[Platform] Deploy`
3. Click run → view logs
4. Search for ❌ error
5. Common issues:
   - API token expired or invalid
   - File not in -approved/ folder (still in -pending/)
   - Network timeout (retry manually or wait for next scheduled run)

**If agent fails to generate:**
1. Check: `[Platform] Agent` workflow run
2. Usually: API quota exceeded (Gemini daily limit)
3. Solution: Wait 24 hours or provide second API key

---

## MANUAL TESTING

**Test a single deploy manually:**
```bash
# 1. Create test content in approved folder
mkdir -p workflows/output/pinterest-approved
cat > workflows/output/pinterest-approved/2026-06-06.md << 'EOF'
---
date: 2026-06-06
pinterest_day: 12
pin: Test Pin
board: Test Board
status: DRAFT
---

Test caption here.

https://sanctuary-grace.com/
EOF

# 2. Run deploy script locally
PINTEREST_ACCESS_TOKEN="your-real-token" python3 workflows/scripts/pinterest-deploy.py

# 3. Check log
cat workflows/pin-log.md

# 4. Clean up test file
rm workflows/output/pinterest-approved/2026-06-06.md
```

---

## SUMMARY

**What happens when:**
1. **Agent runs** → Content generated → Output to pending/
2. **Grace moves file** → pending/ → approved/ (git mv + push)
3. **Deploy runs** (on schedule) → Reads from approved/ → Posts to platform → Logs result

**No manual posting. No copying. Just approve and go.**

**All 4 platforms use same pattern.**

**Everything is logged and traceable.**
