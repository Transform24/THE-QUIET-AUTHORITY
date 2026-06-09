#!/usr/bin/env python3
"""
Substack Deploy Agent — Publishes approved devotions to Substack
Reads from: workflows/output/substack-approved/
Publishes via: Session cookie authentication (logged-in user)
Logs to: workflows/substack-log.md
"""

import json, os, pathlib, urllib.request, urllib.error

SESSION_COOKIE = os.environ.get('SUBSTACK_SESSION_COOKIE', '').strip()
PUBLICATION_URL = os.environ.get('SUBSTACK_PUBLICATION_URL', 'thequietauthority.substack.com').strip()

APPROVED_DIR = pathlib.Path('workflows/output/substack-approved')
LOG_FILE = pathlib.Path('workflows/substack-log.md')

if not SESSION_COOKIE:
    print("⚠️  SUBSTACK_SESSION_COOKIE not set. Skipping deploy.")
    exit(0)

if not APPROVED_DIR.exists() or not any(APPROVED_DIR.iterdir()):
    print("No approved devotions to deploy.")
    exit(0)

approved_files = sorted(APPROVED_DIR.glob("*.md"))
print(f"Found {len(approved_files)} approved devotion(s) to deploy.")

for devo_file in approved_files:
    content = devo_file.read_text()
    lines = content.split('\n')

    date_str = devo_file.stem
    mode = None
    title = None
    body_text = None

    in_frontmatter = False
    fm_lines = []
    content_start = 0

    for i, line in enumerate(lines):
        if line.startswith('---'):
            if not in_frontmatter:
                in_frontmatter = True
            else:
                content_start = i + 1
                break
        elif in_frontmatter:
            fm_lines.append(line)

    for fm_line in fm_lines:
        if fm_line.startswith('mode:'):
            mode = fm_line.split(':', 1)[1].strip()

    body_text = '\n'.join(lines[content_start:]).strip()

    if not body_text:
        print(f"⚠️  {date_str}: No content found. Skipping.")
        continue

    body_lines = body_text.split('\n')
    title = body_lines[0].strip() if body_lines else "Untitled"

    log_entry = ""

    try:
        post_payload = {
            "title": title,
            "body_markdown": body_text,
            "draft": False,
            "publish_now": True,
        }

        req_body = json.dumps(post_payload).encode('utf-8')
        req = urllib.request.Request(
            'https://substack.com/api/v1/posts',
            data=req_body,
            headers={
                'Content-Type': 'application/json',
                'Cookie': f'substack.sid={SESSION_COOKIE}',
                'User-Agent': 'Mozilla/5.0',
            },
            method='POST'
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read())
                post_id = result.get('id', 'unknown')
                post_url = result.get('canonical_url', '')
                print(f"✅ {date_str}: Published via session auth (ID: {post_id})")
                log_entry = f"| {date_str} | {mode} | {title} | PUBLISHED ({post_url or post_id}) |\n"
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            error_msg = error_body[:200] if error_body else e.reason
            print(f"❌ {date_str}: HTTP {e.code} — {error_msg}")
            log_entry = f"| {date_str} | {mode} | {title} | FAILED (HTTP {e.code}) |\n"

    except Exception as e:
        print(f"❌ {date_str}: {str(e)}")
        log_entry = f"| {date_str} | {mode} | {title} | FAILED ({str(e)[:50]}) |\n"

    if log_entry:
        if LOG_FILE.exists():
            LOG_FILE.write_text(LOG_FILE.read_text() + log_entry)
        else:
            LOG_FILE.write_text("| Date | Mode | Devotion | Status |\n|---|---|---|---|\n" + log_entry)

print("✅ Substack deploy complete.")
