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
date_str = today.strftime("%Y-%m-%d")

start_date = datetime.date(2026, 5, 26)
day_override = os.environ.get("DAY_OVERRIDE", "").strip()
if day_override and day_override.isdigit():
    day_number = int(day_override)
else:
    day_number = ((today - start_date).days % 30) + 1

SCHEDULE = {
    1:  {"pin": "The Guilty Giver wall art", "board": "The Quiet Authority + Spiritual Rest for Women", "image": "profile-C.png", "type": "wall_art"},
    2:  {"pin": "Sacred aesthetic — There is a stillness that heals what striving never could", "board": "Sacred Morning Practices", "image": "Canva", "type": "quote"},
    3:  {"pin": "The Depleted Survivor wall art", "board": "The Quiet Authority", "image": "profile-B.png", "type": "wall_art"},
    4:  {"pin": "Scripture pin — Matthew 11:28", "board": "Christian Women Encouragement", "image": "Canva", "type": "scripture"},
    5:  {"pin": "The Striving Achiever wall art", "board": "The Quiet Authority", "image": "profile-A.png", "type": "wall_art"},
    6:  {"pin": "Devotional Week 1 Vision cover", "board": "Sacred Morning Practices", "image": "Drive", "type": "devotional"},
    7:  {"pin": "The Lost Wanderer wall art", "board": "The Quiet Authority", "image": "profile-D.png", "type": "wall_art"},
    8:  {"pin": "Which type are you? — all 4 profiles listed", "board": "Spiritual Rest for Women", "image": "Canva", "type": "discovery"},
    9:  {"pin": "Scripture + Guilty Giver quote", "board": "Christian Women Encouragement", "image": "Canva", "type": "scripture"},
    10: {"pin": "Devotional Week 2 Renewal cover", "board": "Sacred Morning Practices", "image": "Drive", "type": "devotional"},
    11: {"pin": "Re-pin Day 1 Guilty Giver", "board": "Spiritual Rest for Women", "image": "profile-C.png", "type": "repin"},
    12: {"pin": "The assessment is free. The stillness is real.", "board": "The Quiet Authority", "image": "Canva", "type": "quote"},
    13: {"pin": "Sacred aesthetic — You were not made to pour from empty", "board": "Christian Women Encouragement", "image": "Canva", "type": "quote"},
    14: {"pin": "Circle of Silence — 15 minutes. Just you and God.", "board": "Sacred Morning Practices", "image": "Canva", "type": "silence"},
    15: {"pin": "Start here — assessment overview", "board": "Spiritual Rest for Women", "image": "Canva", "type": "discovery"},
    16: {"pin": "Devotional Week 3 Peace cover", "board": "Sacred Morning Practices", "image": "Drive", "type": "devotional"},
    17: {"pin": "Re-pin Guilty Giver wall art", "board": "Christian Women Encouragement", "image": "profile-C.png", "type": "repin"},
    18: {"pin": "Quote from Guilty Giver profile description", "board": "The Quiet Authority", "image": "Canva", "type": "quote"},
    19: {"pin": "R.E.S.T. Workbook — Free. No catch. Just a path forward.", "board": "Spiritual Rest for Women", "image": "Canva", "type": "product"},
    20: {"pin": "Scripture — Your exhaustion is not failure. It is an invitation.", "board": "Christian Women Encouragement", "image": "Canva", "type": "scripture"},
    21: {"pin": "Devotional Week 4 Calling cover", "board": "Sacred Morning Practices", "image": "Drive", "type": "devotional"},
    22: {"pin": "Re-pin top performer from Week 1", "board": "Spiritual Rest for Women", "image": "best", "type": "repin"},
    23: {"pin": "Re-pin top performer from Week 2", "board": "Christian Women Encouragement", "image": "best", "type": "repin"},
    24: {"pin": "Re-pin top performer from Weeks 1-2", "board": "Sacred Morning Practices", "image": "best", "type": "repin"},
    25: {"pin": "Brand story — personal, links to assessment", "board": "Spiritual Rest for Women", "image": "Canva", "type": "story"},
    26: {"pin": "Re-pin Guilty Giver wall art to all 4 boards", "board": "All boards", "image": "profile-C.png", "type": "repin"},
    27: {"pin": "Devotional bundle — all 4 weeks", "board": "The Quiet Authority", "image": "Canva", "type": "product"},
    28: {"pin": "Circle of Silence waitlist", "board": "Sacred Morning Practices", "image": "Canva", "type": "silence"},
    29: {"pin": "Scripture from 7-day practice", "board": "Christian Women Encouragement", "image": "Canva", "type": "scripture"},
    30: {"pin": "Month 2 review — top 3 pins to double down on", "board": "The Quiet Authority", "image": "Canva", "type": "review"},
}

pin = SCHEDULE.get(day_number, SCHEDULE[1])

VOICE = """
BRAND VOICE — SACRED LAW. Never deviate.
Voice: Sacred, tender, prophetic. Minister — never marketer.
Audience: Burned-out Christian women, 30-55.
FORBIDDEN: Hustle language, emojis, exclamation marks, urgency language.
Ministry: Sanctuary Grace Ministry.
"""

HASHTAGS = "#ChristianWomen #SpiritualRest #FaithAndWellness #QuietTime #SanctuaryGrace #SpiritualBurnout #FaithJourney #ScriptureForWomen #SacredSpace #HopeForWomen #ChristianMom #DailyDevotion"

prompt = f"""{VOICE}

Today: {date_str}
Pinterest Day: {day_number} of 30
Pin: {pin["pin"]}
Board(s): {pin["board"]}
Image source: {pin["image"]}
Type: {pin["type"]}

Write the complete pin package:

## PIN CAPTION
100-200 words, sacred TQA voice. No emojis. No exclamation marks.
Final line: https://sanctuarygrace.store
Last line: 3-5 hashtags from: {HASHTAGS}

## CANVA BRIEF
Only if image source is "Canva". Skip if wall_art or repin.
Specs: 1000x1500px, black background (#000000)
All text: Cinzel font, ALL CAPS, color #C1593C (terra)
Stars: 4-point starburst in #C9A84C (gold), left margin, 3 sizes
Photo: B&W only, high contrast, no tint
Provide: exact headline text (max 8 words), subtext if any, placement notes

## POSTING NOTES
Board placement, timing (8-11am or 7-9pm EST), notes for Grace.
If wall art pin: image is at {pin["image"]} in repo root — no Canva needed."""

content = call_gemini(prompt)

out_dir = pathlib.Path("workflows/output/pin-drafts")
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f"{date_str}.md"
out_file.write_text(
    f"---\ndate: {date_str}\npinterest_day: {day_number}\npin: {pin['pin']}\nboard: {pin['board']}\nimage: {pin['image']}\nstatus: DRAFT — review before posting\n---\n\n{content}\n"
)

log_file = pathlib.Path("workflows/output/pin-log.md")
entry = f"| {date_str} | Day {day_number} | {pin['pin']} | {pin['board']} | DRAFT |\n"
if log_file.exists():
    log_file.write_text(log_file.read_text() + entry)
else:
    log_file.write_text("| Date | Schedule Day | Pin | Board | Status |\n|---|---|---|---|---|\n" + entry)

print(f"Pin draft saved: {out_file}")
