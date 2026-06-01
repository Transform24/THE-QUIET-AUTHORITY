import os, datetime, pathlib, json, urllib.request, urllib.error, time

GEMINI_API_KEY = os.environ['GEMINI_API_KEY']
SUBSTACK_SESSION_COOKIE = os.environ.get('SUBSTACK_SESSION_COOKIE', '').strip()
SUBSTACK_PUBLICATION_URL = os.environ.get('SUBSTACK_PUBLICATION_URL', '5apop2sotwm.substack.com').strip()
MODE_OVERRIDE = os.environ.get('MODE_OVERRIDE', '').strip()

today = datetime.date.today()
day_name = today.strftime('%A')
date_str = today.strftime('%Y-%m-%d')

mode = MODE_OVERRIDE if MODE_OVERRIDE else ('sunday' if day_name == 'Sunday' else 'daily')

VOICE = """BRAND VOICE: Sacred, tender, prophetic. Minister not marketer.
Audience: Burned-out Christian women, 30-55.
Ministry: Sanctuary Grace Ministry.
FORBIDDEN: Hustle language, jargon, casual slang, emojis, exclamation marks.
Every piece closes with: Come as you are. https://sanctuarygrace.store"""

if mode == 'sunday':
    prompt = f"""{VOICE}
Today: {date_str} ({day_name})

Write the SUNDAY WEEKLY LETTER for The Quiet Authority (600-800 words).

Format:
Line 1: Title only (sacred, no exclamation marks)
Line 2: Subtitle (one tender line)
Line 3: blank
Then the full letter body.

Structure:
- Personal opening (first-person, writing to a beloved friend)
- Central teaching (3-4 paragraphs, one scripture written in full with reference)
- Reflection questions (2-3, gentle)
- Closing blessing
- Final line: Come as you are. https://sanctuarygrace.store

No markdown symbols. No emojis. No exclamation marks."""
else:
    prompt = f"""{VOICE}
Today: {date_str} ({day_name})

Write a DAILY DEVOTION for The Quiet Authority (200-300 words).

Format:
Line 1: Title only (sacred, tender, no exclamation marks)
Line 2: blank
Then the devotion body.

Structure:
- Scripture verse written in full (Book Chapter:Verse)
- Reflection (2-3 paragraphs, first-person, tender)
- One invitation (gentle offering)
- Final line: Come as you are. https://sanctuarygrace.store

No markdown symbols. No emojis."""

gemini_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}'
gemini_payload = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode('utf-8')

content = None
for attempt in range(4):
    try:
        req = urllib.request.Request(gemini_url, data=gemini_payload, headers={'Content-Type': 'application/json'}, method='POST')
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read())
            content = result['candidates'][0]['content']['parts'][0]['text'].strip()
            print(f"Devotion generated ({mode})")
            break
    except urllib.error.HTTPError as e:
        if e.code == 429:
            wait = 30 * (attempt + 1)
            print(f"Gemini 429 rate limit — waiting {wait}s before retry {attempt + 1}/4")
            time.sleep(wait)
        else:
            raise

if not content:
    raise RuntimeError('Gemini API failed after 4 attempts — quota exhausted. Try again in 1 hour.')

lines = content.split('\n')
title = lines[0].strip()
subtitle = ''
body_start = 1
if mode == 'sunday' and len(lines) > 1:
    subtitle = lines[1].strip()
    body_start = 2

body_text = '\n'.join(lines[body_start:]).strip()

paragraphs = []
for para in body_text.split('\n\n'):
    para = para.strip()
    if para:
        paragraphs.append({"type": "paragraph", "content": [{"type": "text", "text": para}]})
if not paragraphs:
    paragraphs = [{"type": "paragraph", "content": [{"type": "text", "text": content}]}]

body_doc = json.dumps({"type": "doc", "content": paragraphs})

post_status = 'DRAFT'
post_url = ''

if SUBSTACK_SESSION_COOKIE:
    payload = json.dumps({
        "draft_title": title,
        "draft_subtitle": subtitle,
        "draft_body": body_doc,
        "type": "newsletter",
        "audience": "everyone",
        "draft_section_id": None,
        "section_chosen": False
    }).encode('utf-8')
    try:
        post_req = urllib.request.Request(
            f'https://{SUBSTACK_PUBLICATION_URL}/api/v1/posts',
            data=payload,
            headers={
                'Content-Type': 'application/json',
                'Cookie': f'substack-session={SUBSTACK_SESSION_COOKIE}'
            },
            method='POST'
        )
        with urllib.request.urlopen(post_req, timeout=30) as resp:
            result = json.loads(resp.read())
            post_id = result.get('id')
            post_url = result.get('canonical_url', '')
            post_status = f'DRAFT IN SUBSTACK — id: {post_id}'
            print(f"Substack draft created: {post_id}")
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        post_status = f'SUBSTACK API ERROR {e.code}: {error_body[:300]}'
        print(f"Substack error {e.code}: {error_body}")
    except Exception as e:
        post_status = f'ERROR: {str(e)[:200]}'
        print(f"Error: {e}")
else:
    post_status = 'DRAFT SAVED — add SUBSTACK_SESSION_COOKIE to GitHub Secrets to auto-create drafts in Substack'
    print("SUBSTACK_SESSION_COOKIE not set")

out_dir = pathlib.Path('workflows/output/substack-drafts')
out_dir.mkdir(parents=True, exist_ok=True)
out_file = out_dir / f'{date_str}.md'
out_file.write_text(
    f'---\ndate: {date_str}\nmode: {mode}\nstatus: {post_status}\nurl: {post_url or "pending"}\n---\n\n{content}\n'
)

log_file = pathlib.Path('workflows/output/substack-log.md')
log_entry = f'| {date_str} | {mode} | {post_status} |\n'
if log_file.exists():
    log_file.write_text(log_file.read_text() + log_entry)
else:
    log_file.write_text('| Date | Mode | Status |\n|---|---|---|\n' + log_entry)

print(f'Done. Status: {post_status}')
