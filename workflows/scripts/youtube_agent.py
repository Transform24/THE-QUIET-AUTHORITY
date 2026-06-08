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
            print(f"Attempt {attempt}: HTTP {e.code}", flush=True)
            if e.code == 429:
                if "quota" in body.lower():
                    print("Daily quota exceeded. Re-run tomorrow.", flush=True)
                    import sys; sys.exit(1)
                if attempt < retries:
                    wait = 30 * attempt
                    print(f"Rate limited. Waiting {wait}s...", flush=True)
                    time.sleep(wait)
                else:
                    raise
            else:
                raise

today = datetime.date.today()
day_name = today.strftime("%A")
date_str = today.strftime("%Y-%m-%d")

VOICE = """
BRAND VOICE — SACRED LAW.
Voice: Sacred, tender, prophetic. Minister — never marketer.
Audience: Burned-out Christian women, 30-55.
FORBIDDEN: Hustle language, emojis, exclamation marks, urgency.
Ministry: Sanctuary Grace Ministry.
"""

SERIES = ["Profile deep dive", "7-day practice walkthrough", "Circle of Silence session", "Scripture reflection"]
series = SERIES[today.isocalendar()[1] % len(SERIES)]

prompt = f"""{VOICE}

Today: {date_str} ({day_name})
Series: {series}

Write a VIDEO SCRIPT for The Quiet Authority YouTube (2-3 minutes of speaking time).

## SCRIPT TITLE
Under 60 characters. Sacred, not clickbait.

## FULL SCRIPT
Conversational, 2-3 minutes of reading (~500-600 words).
Include one full scripture verse (book chapter:verse).
Structure: Opening (30s) → Teaching (2 min) → Close (30s).

## SEO DESCRIPTION
200-250 words. Sacred voice. End with: https://sanctuary-grace.com/

## TAGS
10 YouTube tags (no hash). Examples: ChristianWomen, SpiritualRest, Devotional, BibleStudy, WomenInFaith, ChristianMinistry, FaithJourney, SpiritualPeace, WomenOfFaith, FaithAndWellness

## THUMBNAIL CONCEPT
One sentence. Example: "Woman in peaceful prayer, dark background, gold text 'FIND REST'"
"""

print(f"Generating script...")
content = call_gemini(prompt)

# Save to approval gate
out_dir = pathlib.Path("workflows/output/youtube-pending")
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f"{date_str}.md"

output_text = f"""---
date: {date_str}
series: {series}
status: SCRIPT READY — Grace records and uploads to YouTube
---

{content}

---

**How to use this script:**
1. Download this script from the Approval Gate
2. Record yourself reading the script (phone, webcam, or camera — 2-3 minutes)
3. Use Canva or simple slides to create visuals while recording
4. Export as MP4
5. Upload to YouTube with the SEO description and tags provided above
"""

out_file.write_text(output_text)

# Log
log_file = pathlib.Path("workflows/output/youtube-log.md")
entry = f"| {date_str} | Script ready | {series} | PENDING GRACE RECORDING |\n"
if log_file.exists():
    log_file.write_text(log_file.read_text() + entry)
else:
    log_file.write_text("| Date | Content | Series | Status |\n|---|---|---|---|\n" + entry)

print(f"✅ Script saved: {out_file}")
print(f"   Grace downloads from Approval Gate and records herself")
