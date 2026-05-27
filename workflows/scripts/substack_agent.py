import urllib.request, urllib.error, json, os, datetime, pathlib, sys, time

print("=== Substack Agent starting ===", flush=True)

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY is not set or empty", flush=True)
    sys.exit(1)

print(f"API key present: YES (length {len(API_KEY)})", flush=True)

URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def call_gemini(prompt, retries=3):
    full_url = f"{URL}?key={API_KEY}"
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    data = json.dumps(payload).encode()
    for attempt in range(1, retries + 1):
        req = urllib.request.Request(full_url, data=data, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                result = json.loads(r.read())
                return result["candidates"][0]["content"]["parts"][0]["text"]
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            print(f"Attempt {attempt}: HTTP {e.code} — {body[:200]}", flush=True)
            if e.code == 429 and attempt < retries:
                wait = 30 * attempt
                print(f"Rate limited. Waiting {wait}s before retry...", flush=True)
                time.sleep(wait)
            else:
                raise
        except Exception as e:
            print(f"Attempt {attempt}: {type(e).__name__}: {e}", flush=True)
            raise

today = datetime.date.today()
day_name = today.strftime("%A")
date_str = today.strftime("%Y-%m-%d")
print(f"Date: {date_str} ({day_name})", flush=True)

mode_override = os.environ.get("MODE_OVERRIDE", "").strip()
if mode_override:
    mode = mode_override
elif day_name == "Sunday":
    mode = "sunday"
else:
    mode = "daily"

print(f"Mode: {mode}", flush=True)

VOICE = """
BRAND VOICE — SACRED LAW. Never deviate.
Voice: Sacred, tender, prophetic. Minister — never marketer.
Audience: Burned-out Christian women, 30-55, spiritual depletion or identity crisis.
Tone: Warmth, quiet authority, invitation. Never urgency, hype, or guilt.
FORBIDDEN: Hustle language, self-help jargon, pop-psychology, casual slang, emojis, exclamation marks.
Ministry: Sanctuary Grace Ministry.
Every piece closes with: https://sanctuarygrace.store
"""

if mode == "sunday":
    prompt = f"""{VOICE}

Today: {date_str} ({day_name})

Write the SUNDAY WEEKLY LETTER for The Quiet Authority Substack (600-800 words).

Structure:
- Title (sacred, not clickbait, no exclamation marks)
- Subtitle (one tender line)
- Personal opening (first-person, as if writing to a beloved friend)
- Central teaching (3-4 paragraphs, one scripture written in full with reference)
- Reflection questions (2-3, gentle)
- Closing blessing or prayer
- Final line: "If you are ready to begin, the door is open at https://sanctuarygrace.store"

Format as clean markdown. No emojis. No hype."""
else:
    prompt = f"""{VOICE}

Today: {date_str} ({day_name})

Write a DAILY DEVOTION for The Quiet Authority Substack (200-300 words).

Structure:
- Title (sacred, tender, no exclamation marks)
- Scripture verse written in full (include Book Chapter:Verse)
- Reflection (2-3 paragraphs, first-person, tender, speaks to spiritual exhaustion or identity)
- One invitation (gentle offering, not a command)
- Final line: "Come as you are. https://sanctuarygrace.store"

Format as clean markdown. No emojis. No hype."""

print("Calling Gemini API...", flush=True)
content = call_gemini(prompt)
print(f"Response received ({len(content)} chars)", flush=True)

out_dir = pathlib.Path("workflows/output/substack-drafts")
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f"{date_str}.md"
out_file.write_text(
    f"---\ndate: {date_str}\nmode: {mode}\nstatus: DRAFT — review before publishing\n---\n\n{content}\n"
)

log_file = pathlib.Path("workflows/output/substack-log.md")
entry = f"| {date_str} | {mode} | DRAFT SAVED | {out_file} |\n"
if log_file.exists():
    log_file.write_text(log_file.read_text() + entry)
else:
    log_file.write_text("| Date | Mode | Status | File |\n|---|---|---|---|\n" + entry)

print(f"=== Done. Draft saved: {out_file} ===", flush=True)
