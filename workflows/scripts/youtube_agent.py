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

VOICE = """
BRAND VOICE — SACRED LAW. Never deviate.
Voice: Sacred, tender, prophetic. Minister — never marketer.
Audience: Burned-out Christian women, 30-55.
FORBIDDEN: Hustle language, emojis in copy, exclamation marks, urgency language.
Ministry: Sanctuary Grace Ministry. Channel: youtube.com/@TheQuietAuthority-f1z
Every description ends with: https://sanctuary-grace.com/
"""

SERIES = ["Profile deep dive", "7-day practice walkthrough", "Circle of Silence session", "Scripture reflection"]
series = SERIES[today.isocalendar()[1] % len(SERIES)]

prompt = f"""{VOICE}

Today: {date_str} ({day_name})
Content series: {series}

Write a complete VIDEO SCRIPT PACKAGE for The Quiet Authority YouTube channel.
Grace will read this script on camera herself (no AI voiceover).

## SCRIPT TITLE
Under 60 characters. Sacred, not clickbait. No exclamation marks.

## FULL VIDEO SCRIPT
Grace reads this aloud on camera. She will record herself, so write it conversationally and naturally.
OPENING (30 seconds): Invite the viewer to breathe, arrive, be present. First-person.
MAIN TEACHING (8-10 minutes): Tender, prophetic, first-person. One central spiritual truth. One full scripture verse written out with reference. 3-4 teaching sections. Speaks to exhaustion, questioning, being lost.
SILENCE INVITATION (2 minutes): Guide into stillness. Tender, unhurried.
CLOSING (30 seconds): One blessing. Soft CTA to https://sanctuary-grace.com/

## SEO DESCRIPTION
200-250 words. Write as if describing what Grace teaches in the video. Sacred voice. Mention the spiritual need, the scripture, free assessment. End with: https://sanctuary-grace.com/

## TAGS
10-12 YouTube tags (no hash symbol, no quotes). Mix broad and niche. Examples: ChristianWomen, SpiritualRest, FaithAndWellness, QuietTime, SanctuaryGrace, Devotional, BibleStudy, WomenInFaith, ChristianMinistry, FaithJourney, SpiritualPeace, WomenOfFaith

## THUMBNAIL CONCEPT
One sentence describing the thumbnail. Example: "Woman with eyes closed in peaceful prayer, dark background, gold Cinzel text saying 'FIND YOUR REST'"
"""

content = call_gemini(prompt)

# Output as a single markdown file with all sections
out_dir = pathlib.Path("workflows/output/youtube-pending")
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f"{date_str}.md"

# Format with frontmatter + content
output_text = f"""---
date: {date_str}
series: {series}
status: DRAFT — Grace reviews and records
---

{content}
"""

out_file.write_text(output_text)

log_file = pathlib.Path("workflows/output/youtube-log.md")
entry = f"| {date_str} | Script draft | {series} | PENDING GRACE REVIEW | {out_file} |\n"
if log_file.exists():
    log_file.write_text(log_file.read_text() + entry)
else:
    log_file.write_text("| Date | Content | Series | Status | File |\n|---|---|---|---|---|\n" + entry)

print(f"✅ YouTube script draft saved: {out_file}")
print(f"   Grace will review in Approval Gate, record herself reading the script, and upload to YouTube")
