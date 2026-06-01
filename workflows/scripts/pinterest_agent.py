import os, datetime, pathlib, json, urllib.request, urllib.error, time

GEMINI_API_KEY = os.environ['GEMINI_API_KEY']
PINTEREST_ACCESS_TOKEN = os.environ.get('PINTEREST_ACCESS_TOKEN', '').strip()
DAY_OVERRIDE = os.environ.get('DAY_OVERRIDE', '').strip()

REPO_IMAGE_BASE = 'https://transform24.github.io/THE-QUIET-AUTHORITY'

today = datetime.date.today()
date_str = today.strftime('%Y-%m-%d')
start_date = datetime.date(2026, 5, 26)

if DAY_OVERRIDE and DAY_OVERRIDE.isdigit():
    day_number = int(DAY_OVERRIDE)
else:
    day_number = ((today - start_date).days % 30) + 1

SCHEDULE = {
    1:  {"pin": "The Guilty Giver wall art", "board": "The Quiet Authority", "image_file": "profile-C.png"},
    2:  {"pin": "Sacred aesthetic — There is a stillness that heals what striving never could", "board": "Sacred Morning Practices", "image_file": None},
    3:  {"pin": "The Depleted Survivor wall art", "board": "The Quiet Authority", "image_file": "profile-B.png"},
    4:  {"pin": "Scripture — Matthew 11:28", "board": "Christian Women Encouragement", "image_file": None},
    5:  {"pin": "The Striving Achiever wall art", "board": "The Quiet Authority", "image_file": "profile-A.png"},
    6:  {"pin": "Devotional Week 1 Vision cover", "board": "Sacred Morning Practices", "image_file": None},
    7:  {"pin": "The Lost Wanderer wall art", "board": "The Quiet Authority", "image_file": "profile-D.png"},
    8:  {"pin": "Which type are you — all 4 profiles listed", "board": "Spiritual Rest for Women", "image_file": None},
    9:  {"pin": "Scripture and Guilty Giver quote", "board": "Christian Women Encouragement", "image_file": None},
    10: {"pin": "Devotional Week 2 Renewal cover", "board": "Sacred Morning Practices", "image_file": None},
    11: {"pin": "Re-pin Guilty Giver wall art", "board": "Spiritual Rest for Women", "image_file": "profile-C.png"},
    12: {"pin": "The assessment is free. The stillness is real.", "board": "The Quiet Authority", "image_file": None},
    13: {"pin": "You were not made to pour from empty", "board": "Christian Women Encouragement", "image_file": None},
    14: {"pin": "Circle of Silence — 15 minutes. Just you and God.", "board": "Sacred Morning Practices", "image_file": None},
    15: {"pin": "Start here — assessment overview", "board": "Spiritual Rest for Women", "image_file": None},
    16: {"pin": "Devotional Week 3 Peace cover", "board": "Sacred Morning Practices", "image_file": None},
    17: {"pin": "Re-pin Guilty Giver wall art", "board": "Christian Women Encouragement", "image_file": "profile-C.png"},
    18: {"pin": "Quote from Guilty Giver profile", "board": "The Quiet Authority", "image_file": None},
    19: {"pin": "R.E.S.T. Workbook — Free. No catch. Just a path forward.", "board": "Spiritual Rest for Women", "image_file": None},
    20: {"pin": "Your exhaustion is not failure. It is an invitation.", "board": "Christian Women Encouragement", "image_file": None},
    21: {"pin": "Devotional Week 4 Calling cover", "board": "Sacred Morning Practices", "image_file": None},
    22: {"pin": "Re-pin top performer Week 1", "board": "Spiritual Rest for Women", "image_file": "profile-C.png"},
    23: {"pin": "Re-pin top performer Week 2", "board": "Christian Women Encouragement", "image_file": "profile-B.png"},
    24: {"pin": "Re-pin top performer", "board": "Sacred Morning Practices", "image_file": "profile-A.png"},
    25: {"pin": "Brand story — personal, links to assessment", "board": "Spiritual Rest for Women", "image_file": None},
    26: {"pin": "Re-pin Guilty Giver wall art", "board": "The Quiet Authority", "image_file": "profile-C.png"},
    27: {"pin": "Devotional bundle — all 4 weeks", "board": "The Quiet Authority", "image_file": None},
    28: {"pin": "Circle of Silence waitlist", "board": "Sacred Morning Practices", "image_file": None},
    29: {"pin": "Scripture from 7-day practice", "board": "Christian Women Encouragement", "image_file": None},
    30: {"pin": "Month 2 preview", "board": "The Quiet Authority", "image_file": None},
}

pin_data = SCHEDULE.get(day_number, SCHEDULE[1])

HASHTAGS = "#ChristianWomen #SpiritualRest #FaithAndWellness #QuietTime #SanctuaryGrace #SpiritualBurnout #FaithJourney #ScriptureForWomen #SacredSpace #HopeForWomen #ChristianMom #DailyDevotion"

prompt = f"""BRAND VOICE: Sacred, tender, prophetic. Minister not marketer.
Audience: Burned-out Christian women, 30-55.
FORBIDDEN: Hustle language, jargon, casual slang, emojis, exclamation marks.

Today: {date_str}
Pinterest Day: {day_number} of 30
Pin: {pin_data['pin']}
Board: {pin_data['board']}

Write ONLY the pin caption. No headers. No sections.
- 100-200 words, sacred TQA voice
- No emojis. No exclamation marks.
- Final line: https://sanctuarygrace.store
- Last line: 3-5 hashtags from: {HASHTAGS}"""

gemini_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}'
gemini_payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode('utf-8')

caption = None
for attempt in range(4):
    try:
        req = urllib.request.Request(gemini_url, data=gemini_payload, headers={'Content-Type': 'application/json'}, method='POST')
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read())
            caption = result['candidates'][0]['content']['parts'][0]['text'].strip()
            print(f"Caption generated for Day {day_number}: {pin_data['pin']}")
            break
    except urllib.error.HTTPError as e:
        if e.code == 429:
            wait = 30 * (attempt + 1)
            print(f"Gemini 429 rate limit — waiting {wait}s before retry {attempt + 1}/4")
            time.sleep(wait)
        else:
            raise

if not caption:
    raise RuntimeError('Gemini API failed after 4 attempts — quota exhausted. Try again in 1 hour.')

post_status = 'DRAFT'

def get_board_id(token, board_name):
    try:
        req = urllib.request.Request(
            'https://api.pinterest.com/v5/boards?page_size=100',
            headers={'Authorization': f'Bearer {token}'}
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
            for board in data.get('items', []):
                if board['name'].lower().strip() == board_name.lower().strip():
                    return board['id']
    except Exception as e:
        print(f"Board lookup error: {e}")
    return None

if PINTEREST_ACCESS_TOKEN:
    image_file = pin_data.get('image_file')
    if image_file:
        image_url = f"{REPO_IMAGE_BASE}/{image_file}"
        board_id = get_board_id(PINTEREST_ACCESS_TOKEN, pin_data['board'])
        if board_id:
            payload = json.dumps({
                "board_id": board_id,
                "media_source": {"source_type": "image_url", "url": image_url},
                "title": pin_data['pin'][:100],
                "description": caption[:500],
                "link": "https://sanctuarygrace.store"
            }).encode('utf-8')
            try:
                post_req = urllib.request.Request(
                    'https://api.pinterest.com/v5/pins',
                    data=payload,
                    headers={
                        'Authorization': f'Bearer {PINTEREST_ACCESS_TOKEN}',
                        'Content-Type': 'application/json'
                    },
                    method='POST'
                )
                with urllib.request.urlopen(post_req, timeout=30) as resp:
                    result = json.loads(resp.read())
                    pin_id = result.get('id')
                    post_status = f'POSTED — pin_id: {pin_id}'
                    print(f"Posted to Pinterest: {pin_id}")
            except urllib.error.HTTPError as e:
                error_body = e.read().decode()
                post_status = f'API ERROR {e.code}: {error_body[:300]}'
                print(f"Pinterest error {e.code}: {error_body}")
            except Exception as e:
                post_status = f'ERROR: {str(e)[:200]}'
                print(f"Error: {e}")
        else:
            post_status = f'DRAFT — board not found: {pin_data["board"]}. Verify board name matches exactly on Pinterest.'
    else:
        post_status = 'DRAFT — Canva image required. Build in Canva then post manually.'
else:
    post_status = 'DRAFT — PINTEREST_ACCESS_TOKEN not set in GitHub Secrets'

out_dir = pathlib.Path('workflows/output/pin-drafts')
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f'{date_str}.md'
out_file.write_text(
    f'---\ndate: {date_str}\npinterest_day: {day_number}\npin: {pin_data["pin"]}\nboard: {pin_data["board"]}\nstatus: {post_status}\n---\n\n{caption}\n'
)

log_file = pathlib.Path('workflows/output/pin-log.md')
log_entry = f'| {date_str} | Day {day_number} | {pin_data["pin"]} | {pin_data["board"]} | {post_status} |\n'
if log_file.exists():
    log_file.write_text(log_file.read_text() + log_entry)
else:
    log_file.write_text('| Date | Day | Pin | Board | Status |\n|---|---|---|---|---|\n' + log_entry)

print(f'Done. Status: {post_status}')
