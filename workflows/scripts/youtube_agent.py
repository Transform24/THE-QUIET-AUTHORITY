import urllib.request, urllib.error, json, os, datetime, pathlib, time

API_KEY = os.environ["GEMINI_API_KEY"]
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

def call_gemini(prompt, retries=3):
    data = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode()
    for attempt in range(1, retries + 1):
        req = urllib.request.Request(URL, data=data, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read())["candidates"][0]["content"]["parts"][0]["text"]
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            print(f"Attempt {attempt}: HTTP {e.code} — {body[:300]}", flush=True)
            if e.code == 429:
                if "quota" in body.lower():
                    print("Daily quota exceeded. Quota resets at midnight Pacific time. Re-run tomorrow or add a second GEMINI_API_KEY.", flush=True)
                    import sys; sys.exit(1)
                if attempt < retries:
                    wait = 30 * attempt
                    print(f"Rate limited. Waiting {wait}s before retry...", flush=True)
                    time.sleep(wait)
                else:
                    raise
            else:
                raise

today = datetime.date.today()
day_name = today.strftime("%A")
date_str = today.strftime("%Y-%m-%d")

task_override = os.environ.get("TASK_OVERRIDE", "").strip()
if task_override:
    task = task_override
elif day_name == "Wednesday":
    task = "video"
else:
    task = "community"

VOICE = """
BRAND VOICE — SACRED LAW. Never deviate.
Voice: Sacred, tender, prophetic. Minister — never marketer.
Audience: Burned-out Christian women, 30-55.
FORBIDDEN: Hustle language, emojis in copy, exclamation marks, urgency language.
Ministry: Sanctuary Grace Ministry. Channel: youtube.com/@TheQuietAuthority-f1z
Every description ends with: https://sanctuarygrace.store
"""

SERIES = ["Profile deep dive", "7-day practice walkthrough", "Circle of Silence session", "Scripture reflection"]
series = SERIES[today.isocalendar()[1] % len(SERIES)]

if task == "video":
    prompt = f"""{VOICE}

Today: {date_str} ({day_name})
Content series: {series}

Write a complete VIDEO SCRIPT PACKAGE for The Quiet Authority YouTube channel.

## VIDEO TITLE
Under 60 characters. Sacred, not clickbait. No exclamation marks.

## VIDEO SCRIPT
OPENING STILLNESS (30 seconds): Voiceover inviting the viewer to breathe, arrive, be present.
MAIN TEACHING (8-10 minutes): First-person, tender, prophetic. One central truth. One scripture written in full. 3-4 teaching sections. Speaks to the woman who is exhausted, questioning, or lost.
SILENCE INVITATION (2 minutes): Guide the viewer into stillness. Tender, unhurried.
SOFT CLOSE (30 seconds): One blessing. Soft CTA to https://sanctuarygrace.store

## SEO DESCRIPTION
200-250 words. Sacred voice. Mention the spiritual need, one scripture, the free assessment, the channel.
End with: https://sanctuarygrace.store

## TAGS
8-10 YouTube tags (no hash symbol). Mix broad and specific.

## PINNED COMMENT
Under 100 words. Tender invitation to the assessment. End with: https://sanctuarygrace.store

## THUMBNAIL BRIEF
1280x720px. Dark background. One profile image (B&W, high contrast).
One short Cinzel ALL CAPS line in terra #C1593C. Gold star accent."""

else:
    prompt = f"""{VOICE}

Today: {date_str} ({day_name})

Write a YOUTUBE COMMUNITY POST for The Quiet Authority channel.
- One scripture (written in full with reference)
- 2-3 paragraphs of tender encouragement, first-person, prophetic
- Soft invitation to the assessment or devotional
- Final line: https://sanctuarygrace.store
- Total: 100-150 words. No emojis. No exclamation marks."""

content = call_gemini(prompt)

out_dir = pathlib.Path("workflows/output/yt-drafts")
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f"{date_str}-{task}.md"
out_file.write_text(
    f"---\ndate: {date_str}\ntask: {task}\nseries: {series}\nstatus: DRAFT — review before publishing\n---\n\n{content}\n"
)

log_file = pathlib.Path("workflows/output/yt-log.md")
entry = f"| {date_str} | {task} | {series} | DRAFT SAVED | {out_file} |\n"
if log_file.exists():
    log_file.write_text(log_file.read_text() + entry)
else:
    log_file.write_text("| Date | Task | Series | Status | File |\n|---|---|---|---|---|\n" + entry)

print(f"YouTube draft saved: {out_file}")
