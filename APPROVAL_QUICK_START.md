# GRACE'S APPROVAL WORKFLOW — Quick Start (5 min read)

---

## 🎯 YOUR JOB

**Agent generates content → You approve → Content auto-posts**

That's it. No more manual uploading or copying captions.

---

## 📅 YOUR SCHEDULE

| Day | Platform | Time | What to Do |
|-----|----------|------|-----------|
| **Daily** | Pinterest | Anytime | Review caption in `-pending/` → move to `-approved/` |
| **Daily** | Substack | Anytime | Review devotion → move to `-approved/` |
| **Daily** | Instagram | After June 12 | Review Reel → move to `-approved/` |
| **Monday** | YouTube | Anytime | Watch video → move to `-approved/` |

---

## 🔍 HOW TO REVIEW (3 STEPS)

### Step 1: Find the content
```
Go to: GitHub.com → THE-QUIET-AUTHORITY repo
Click: workflows/output/ folder
Open: [platform]-pending/ folder (pinterest, youtube, etc.)
```

### Step 2: Review it
**Pinterest:** Read caption  
**YouTube:** Watch the full 12-min video  
**Substack:** Read the devotion  
**Instagram:** Watch the 60-sec Reel

### Step 3: Approve or edit
**If good:** Move file from `-pending/` to `-approved/`  
**If needs edit:** Edit the JSON file in `-pending/`, leave it there  
**If bad:** Delete it from `-pending/`

---

## ✅ APPROVAL CHECKLIST (1-2 min per item)

**Pinterest:**
- Sacred tone? (not marketing)
- Ends with `sanctuary-grace.com`? ✓ move to approved

**YouTube:**
- Video quality okay? Audio levels good?
- Teaching matches scripture?
- ✓ move to approved

**Substack:**
- Reads like you (prophetic, tender)?
- Specific reflection (not generic)?
- ✓ move to approved

**Instagram:**
- Hook lands first 3 seconds?
- Text readable on mobile?
- ✓ move to approved

---

## 📤 HOW TO MOVE FILES (2 ways)

### Way 1: GitHub Web (Easiest)
1. Go to: https://github.com/Transform24/THE-QUIET-AUTHORITY/
2. Navigate: workflows/output/pinterest-pending/
3. Click file → Click "..." menu
4. Select "Rename"
5. Change: `pinterest-pending/file.json` → `pinterest-approved/file.json`
6. Click "Commit"

### Way 2: Terminal (If you use Git)
```bash
cd THE-QUIET-AUTHORITY
git pull

# Move Pinterest file
mv workflows/output/pinterest-pending/2026-06-06.json \
   workflows/output/pinterest-approved/2026-06-06.json

git add workflows/output/
git commit -m "Approve Pinterest pin for 2026-06-06"
git push
```

---

## 🤖 WHAT HAPPENS AFTER YOU APPROVE

1. **You move** file from `-pending/` to `-approved/`
2. **Workflow auto-runs** at scheduled time (2pm for Pinterest, 9am Monday for YouTube, etc.)
3. **Content posts** to platform (Pinterest, YouTube, Substack, Instagram)
4. **Log updates** (pin-log.md, youtube-log.md, etc.)
5. **File archives** to `/library/` (kept forever for reuse)

**You don't have to do anything else.** The system handles posting.

---

## ⚠️ COMMON QUESTIONS

**Q: What if I don't like it?**  
A: Edit the JSON file in `-pending/` or delete it. Don't move it to `-approved/`. Next agent run will create a new one.

**Q: Can I undo an approval?**  
A: Once it posts (auto-deploys from `-approved/`), it's on the platform. You can delete the post from Pinterest/YouTube/etc., but the agent won't know.

**Q: What if the agent breaks?**  
A: Check GitHub Actions logs. You'll see an error message. Usually it's "API quota exceeded" (wait 24 hours) or "API key invalid" (let me know to fix).

**Q: Can I pre-approve content?**  
A: Yes! Agents generate Sunday, you can approve Sunday evening, and it posts during the week.

**Q: How far in advance should I approve?**  
A: Ideally 3–5 days. This gives you a buffer if something breaks.

---

## 📊 APPROVAL TARGETS

- **Pinterest:** 80%+ (some days you might skip)
- **YouTube:** 95%+ (high bar)
- **Substack:** 85%+ (edit if generic)
- **Instagram:** 75%+ (new account, lower bar)

---

## 🚀 YOUR FIRST APPROVAL

**This Sunday:**
1. Agents run per schedule
2. Content appears in `-pending/` folders
3. Open each folder and review
4. Move approved files to `-approved/`
5. Deploy workflows run automatically
6. Content posts to platforms

**That's it.** You're done.

---

## 📞 IF YOU NEED HELP

- Detailed approval process: Read `APPROVAL_GATE_WORKFLOW.md`
- Agent specs: Read `FLYWHEEL_OPERATIONAL_REPORT.md`
- Remotion tech: Read `workflows/remotion/README.md`

---

**Status:** Ready to go live on the next agent run (Sunday).

