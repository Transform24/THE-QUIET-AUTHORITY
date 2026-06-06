# BRUTAL HONEST AUDIT — ALL FOUR AGENTS

**Date:** 2026-06-06  
**Auditor:** Code review (no BS)  
**Verdict:** 2.5 out of 4 platforms will actually work

---

## PINTEREST AGENT — WILL WORK ✅

**File:** `.github/workflows/pinterest-agent.yml`  
**Status:** Complete and valid

| Check | Result |
|---|---|
| Workflow syntax valid? | ✅ Yes |
| Triggers on schedule? | ✅ Yes (Daily 2pm UTC, line 5) |
| Manual trigger? | ✅ Yes (workflow_dispatch with day_override, lines 6-11) |
| Python script exists? | ✅ Yes (workflows/scripts/pinterest_agent.py) |
| Required secrets passed? | ✅ GEMINI_API_KEY (line 27) |
| Output folder created? | ✅ Yes (workflows/output/pinterest-pending/) |
| Git push wired? | ✅ Yes (lines 32-45) |

**What will happen when it runs:**
1. Generates caption for today's pin (30-day schedule)
2. Outputs to `workflows/output/pinterest-pending/YYYY-MM-DD.md`
3. Pushes to new branch `agent-output/pinterest-pending-YYYY-MM-DD`
4. Grace reviews and moves to approved/ folder
5. Deploy workflow posts to Pinterest API

**Blockers:** NONE (assuming GEMINI_API_KEY is set)

---

## YOUTUBE AGENT — WILL FAIL 🔴

**File:** `.github/workflows/youtube-agent.yml`  
**Status:** Partially complete, critical issue

| Check | Result |
|---|---|
| Workflow syntax valid? | ✅ Yes |
| Triggers on schedule? | ✅ Yes (Weekly Monday 9am UTC, line 5) |
| Manual trigger? | ✅ Yes |
| Python script exists? | ✅ Yes (youtube_agent.py) |
| Required secrets passed? | ✅ GEMINI_API_KEY (line 26) |
| FFmpeg/ImageMagick installed? | ✅ Yes (lines 29-32) |
| Render script exists? | ✅ Yes (render-youtube-video.py) |
| Output folder created? | ✅ Yes |
| Git push wired? | ✅ Yes |

**THE PROBLEM:**

**Line 41:**
```bash
python3 workflows/scripts/render-youtube-video.py "$SCRIPT_FILE" "$VIDEO_FILE"
```

**render-youtube-video.py will CRASH because:**
- Line 91 tries to create slides with ImageMagick `convert` command
- Line 96: `subprocess.run(cmd, check=True, capture_output=True)` 
- But the Cormorant-Garamond font is NOT installed on GitHub Actions runner
- ImageMagick will fail: "Can't read font 'Cormorant-Garamond'"
- Video rendering fails silently (error caught, returns None)
- No MP4 is created
- youtube_agent workflow completes but video.mp4 is never written
- Deploy workflow finds no video file to upload
- Nothing posts to YouTube

**Additional problem:**
- render-youtube-video.py line 85: Falls back to placeholder if ImageMagick fails
- But placeholder still needs ImageMagick to write PNG files
- Entire video rendering will fail

**Verdict:** YouTube agent will RUN but produce NO VIDEO FILE.

---

## SUBSTACK AGENT — WILL WORK ✅

**File:** `.github/workflows/substack-agent.yml`  
**Status:** Complete and valid

| Check | Result |
|---|---|
| Workflow syntax valid? | ✅ Yes |
| Triggers on schedule? | ✅ Yes (Daily 6am PT, line 5) |
| Manual trigger? | ✅ Yes |
| Python script exists? | ✅ Yes |
| Required secrets passed? | ✅ GEMINI_API_KEY (line 26) |
| Optional secrets handled? | ✅ Yes (SUBSTACK_API_KEY, SUBSTACK_PUB_URL have fallbacks) |
| Output folder created? | ✅ Yes |
| Git push wired? | ✅ Yes |

**What will happen:**
1. Generates daily devotion (200-300 words, first-person)
2. Outputs to `workflows/output/substack-pending/YYYY-MM-DD.md`
3. Pushes to new branch
4. Grace approves and moves to approved/
5. Deploy workflow publishes via Substack API

**Blockers:** NONE (assuming GEMINI_API_KEY is set)

---

## INSTAGRAM AGENT — COMPLETELY DISABLED 🚫

**File:** `.github/workflows/instagram-agent.yml`  
**Status:** Broken by design

| Check | Result |
|---|---|
| Workflow syntax valid? | ✅ Yes |
| Triggers on schedule? | ✅ Yes (Daily 2pm UTC, line 5) |
| Manual trigger? | ✅ Yes |
| Python script exists? | ✅ Yes |
| Will the steps run? | ❌ NO (line 11: `if: false`) |

**THE PROBLEM:**

**Line 11:**
```yaml
if: false  # PAUSED until account restriction lifts (7-14 days from account creation)
```

**This means:**
- Entire job never runs
- No code is executed
- No caption is generated
- No output is created
- Workflow shows "skipped" status
- Instagram agent is dead until someone changes `if: false` to `if: true`

**Additional problems inside the job (lines 37-42):**
```bash
npm install -g remotion @remotion/cli
# TODO: Create remotion-render.js for Instagram Reel generation
echo "Remotion Reel rendering coming in next step"
```

**This is a TODO stub:**
- Remotion is installed (correct)
- But no actual Instagram Reel rendering code exists
- Even if `if: false` is removed, it will just echo "Remotion Reel rendering coming"
- No Reel video will be generated

**Verdict:** Instagram agent will NOT RUN. Even if it did, video rendering is incomplete.

---

## DEPLOY WORKFLOWS STATUS

### Pinterest Deploy ✅

**File:** `.github/workflows/pinterest-deploy.yml`  
**Status:** Complete

- Runs daily 2pm UTC (line 5)
- Checks for approved pins (lines 20-28) ✅
- Calls pinterest-deploy.py (line 41) ✅
- Logs results (lines 43-51) ✅

**Issue:** Line 36 installs `anthropic` but deploy script doesn't use it (harmless)

**Will work:** YES

---

### YouTube Deploy ❌

**File:** `.github/workflows/youtube-deploy.yml`  
**Status:** Will run but nothing to upload

- Runs weekly Monday 9am UTC (line 5) ✅
- Checks for approved videos (lines 20-28) ✅
- Installs YouTube API libs (lines 36-37) ✅
- Calls youtube-deploy.py (line 45) ✅

**Problem:** YouTube agent never creates video.mp4 (see above)
- Deploy runs
- Checks `youtube-approved/` folder
- No video files exist (or only script-video.md)
- Workflow exits with "No approved videos to deploy" (line 27)
- Nothing uploads to YouTube

**Will work:** Only if video.mp4 exists. It won't.

---

### Substack Deploy ✅

**File:** `.github/workflows/substack-deploy.yml`  
**Status:** Complete

- Runs daily 1pm UTC (line 5) ✅
- Checks for approved devotions (lines 20-28) ✅
- Calls substack-deploy.py (line 43) ✅
- Logs results ✅

**Issue:** Line 36 installs `anthropic` but deploy script doesn't use it (harmless)

**Will work:** YES

---

### Instagram Deploy 🚫

**File:** `.github/workflows/instagram-deploy.yml`  
**Status:** Blocked by missing environment variable

- Runs daily 2pm UTC (line 5)
- Line 16: `if: ${{ vars.INSTAGRAM_RESTRICTION_LIFTED == 'true' }}`
- Variable `INSTAGRAM_RESTRICTION_LIFTED` is NOT set anywhere
- GitHub evaluates this as FALSE
- Entire job is skipped
- Never checks for approved posts
- Never calls deploy script
- Never posts to Instagram

**Will work:** Only if you set `INSTAGRAM_RESTRICTION_LIFTED = 'true'` in GitHub Variables

---

## APPROVAL GATE STATUS

**Question:** Is the approval flow actually wired into the workflow?

**Answer:** NO. Here's what actually happens:

**Agent Workflow:**
1. Generates content ✅
2. Outputs to `-pending/` folder ✅
3. Pushes to **new branch** `agent-output/pinterest-pending-YYYY-MM-DD` (line 38-41)
4. **This is NOT main branch**

**Problem:**
- Content is on a separate branch
- Grace needs to manually switch to that branch
- OR manually move files from pending/ to approved/ on main
- Then commit and push to main
- Deploy workflow only reads from main branch

**What's missing:**
- Deploy workflow doesn't check agent-output branches
- Deploy workflow doesn't auto-pull latest changes
- No automation to move approved files from agent-output branches to main approved/ folder

**Verdict:** Approval gate documentation exists but the actual workflow integration is incomplete.

---

## MISSING API CREDENTIALS

### What you MUST set in GitHub Secrets (Settings → Secrets and variables → Actions):

| Secret | For Platform | Status | Impact |
|---|---|---|---|
| `GEMINI_API_KEY` | All agents | MUST SET | All agents fail without it |
| `PINTEREST_ACCESS_TOKEN` | Pinterest Deploy | MUST SET | Pinterest deploy silently fails |
| `SUBSTACK_API_KEY` | Substack Deploy | MUST SET | Substack deploy silently fails |
| `SUBSTACK_PUBLICATION_ID` | Substack Deploy | MUST SET | Substack deploy silently fails |
| `SUBSTACK_PUBLICATION_URL` | Substack Agent | OPTIONAL | Has fallback (5apop2sotwm.substack.com) |
| `YOUTUBE_API_KEY` | YouTube Deploy | MUST SET | YouTube deploy silently fails |
| `YOUTUBE_CLIENT_ID` | YouTube Deploy | MUST SET | YouTube deploy silently fails |
| `YOUTUBE_CLIENT_SECRET` | YouTube Deploy | MUST SET | YouTube deploy silently fails |
| `YOUTUBE_REFRESH_TOKEN` | YouTube Deploy | MUST SET | YouTube deploy silently fails |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram Deploy | MUST SET | Instagram blocked anyway (if: false) |
| `INSTAGRAM_USER_ID` | Instagram Deploy | MUST SET | Instagram blocked anyway (if: false) |

---

## PRIORITY FIX LIST

### 1. BLOCKING EVERYTHING: YouTube video rendering (HIGH PRIORITY)
**Problem:** `render-youtube-video.py` will crash on GitHub Actions because fonts aren't installed  
**Impact:** YouTube agent generates script but NO video file is created  
**Fix:**
- Option A: Use system fonts instead of Google fonts (change line 91 in render-youtube-video.py)
- Option B: Remove font specification, let ImageMagick use default
- Option C: Skip video rendering entirely, just output script (deploy manually later)

**Recommendation:** Option A (simplest, fastest)

**File to fix:** `workflows/scripts/render-youtube-video.py` line 91
**Change:**
```python
# FROM:
cmd = [
    'convert',
    '-size', '1920x1080',
    'xc:#0d0d0d',
    '-font', 'Cormorant-Garamond',  # ← THIS WILL FAIL
    '-pointsize', '48',
    ...
]

# TO:
cmd = [
    'convert',
    '-size', '1920x1080',
    'xc:#0d0d0d',
    # REMOVE -font line, use system default
    '-pointsize', '48',
    ...
]
```

---

### 2. BLOCKING INSTAGRAM: Deploy gate is disabled (HIGH PRIORITY)

**Problem:** Line 16 of `instagram-agent.yml` has `if: false`  
**Impact:** Instagram agent never runs, can't even test it  
**Fix:** Remove or change the condition

**File to fix:** `.github/workflows/instagram-agent.yml` line 11  
**Change:**
```yaml
# FROM:
if: false  # PAUSED until account restriction lifts (7-14 days from account creation)

# TO:
if: true
# OR remove the line entirely
```

---

### 3. INSTAGRAM: Reel rendering incomplete (MEDIUM PRIORITY)

**Problem:** Lines 37-42 of `instagram-agent.yml` are TODO stubs  
**Impact:** Even after fixing #2, no Reel videos are generated  
**Fix:** Implement actual Instagram Reel rendering (OR skip video, just generate captions)

**File to fix:** `.github/workflows/instagram-agent.yml` lines 37-42  
**Current code:**
```bash
npm install -g remotion @remotion/cli
# Remotion will read caption from output and render Reel MP4
# TODO: Create remotion-render.js for Instagram Reel generation
echo "Remotion Reel rendering coming in next step"
```

**Replace with (simple version - just captions, no video):**
```bash
# Skip Reel rendering for now - Grace can edit videos manually
# Just generate captions to workflows/output/instagram-pending/
echo "✅ Instagram captions ready for Grace approval"
```

---

### 4. INSTAGRAM DEPLOY: Restriction gate (MEDIUM PRIORITY)

**Problem:** Line 16 of `instagram-deploy.yml` checks for `vars.INSTAGRAM_RESTRICTION_LIFTED`  
**Impact:** Deploy never runs even when files are approved  
**Fix:** Set the variable to true in GitHub repository variables

**How to fix:**
1. Go to: GitHub repo → Settings → Variables → Actions
2. Create new variable: `INSTAGRAM_RESTRICTION_LIFTED = true`

---

### 5. APPROVAL GATE: Agent outputs bypass main branch (LOW PRIORITY)

**Problem:** Agents push to `agent-output/` branches, not main  
**Impact:** Deploy workflows (which run on main) don't see content until Grace manually moves it  
**Fix:** Change agent workflows to commit directly to main

**Files to fix:**
- `pinterest-agent.yml` lines 38-41
- `youtube-agent.yml` lines 55-58
- `substack-agent.yml` lines 37-40
- `instagram-agent.yml` lines 50-53

**Current pattern:**
```bash
BRANCH="agent-output/pinterest-pending-$(date +%Y-%m-%d)"
git checkout -b "$BRANCH"
git commit -m "..."
git push -u origin "$BRANCH"
```

**Change to:**
```bash
git config user.name "TQA Agent"
git config user.email "noreply@sanctuarygrace.com"
git add workflows/output/pinterest-pending/
if ! git diff --staged --quiet; then
  git commit -m "Pinterest Agent: $(date +%Y-%m-%d) pin draft"
  git push origin main  # ← Directly to main, not separate branch
fi
```

---

## EXECUTION ORDER (Do these in order)

1. **YouTube video rendering fix** (5 min)
   - File: `workflows/scripts/render-youtube-video.py`
   - Change: Remove font specification from ImageMagick command

2. **Instagram agent enable** (2 min)
   - File: `.github/workflows/instagram-agent.yml`
   - Change: Remove or change `if: false` to `if: true`

3. **Instagram deploy variable** (2 min)
   - Location: GitHub Settings → Variables
   - Create: `INSTAGRAM_RESTRICTION_LIFTED = 'true'`

4. **Instagram Reel rendering** (decide: build vs skip) (10-30 min)
   - File: `.github/workflows/instagram-agent.yml` lines 37-42
   - Options: 
     - A) Build actual Reel rendering code
     - B) Skip video, just generate captions

5. **Approval gate branch fix** (10 min, optional)
   - Files: All agent workflows
   - Change: Push to main, not agent-output branches

---

## SUMMARY

| Platform | Status | Problem | Fix Time |
|---|---|---|---|
| **Pinterest** | ✅ READY | None | 0 min |
| **YouTube** | 🔴 BROKEN | Font rendering | 5 min |
| **Substack** | ✅ READY | None | 0 min |
| **Instagram** | 🚫 DISABLED | if: false + incomplete rendering | 15 min |

**Total time to fix:** ~22 minutes

**Current working:** 2 out of 4 platforms  
**After fixes:** 4 out of 4 platforms (assuming YouTube font fix works)

