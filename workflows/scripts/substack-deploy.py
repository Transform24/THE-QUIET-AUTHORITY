#!/usr/bin/env python3
"""
Substack Deploy Agent: publishes devotions that Grace has approved.
Reads from: workflows/output/substack-approved/ (Grace moves a file here to approve it)
Publishes via: the Substack drafts API, using the SUBSTACK_COOKIE_ID secret (connect.sid cookie)
Logs to: workflows/substack-log.md
"""

import json, os, pathlib, urllib.request, urllib.error

SUBSTACK_COOKIE_ID = os.environ.get('SUBSTACK_COOKIE_ID', '').strip()
BASE_URL = 'https://sapop2sotwm.substack.com'

APPROVED_DIR = pathlib.Path('workflows/output/substack-approved')
LOG_FILE = pathlib.Path('workflows/substack-log.md')

if not APPROVED_DIR.exists() or not any(APPROVED_DIR.iterdir()):
    print("No approved devotions to deploy.")
    exit(0)

if not SUBSTACK_COOKIE_ID:
    print("ERROR: SUBSTACK_COOKIE_ID is not set in repository secrets. Nothing was published.")
    exit(1)

HEADERS = {
    'Content-Type': 'application/json',
    'Cookie': f'connect.sid={SUBSTACK_COOKIE_ID}',
}

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
        print(f"WARNING {date_str}: No content found. Skipping.")
        continue

    body_lines = body_text.split('\n')
    title = body_lines[0].strip() if body_lines else "Untitled"
    # The first line is the title. The rest is the body, so the title is not repeated in the post.
    draft_body = '\n'.join(body_lines[1:]).strip() or body_text

    log_entry = ""

    try:
        # Step 1: create the draft
        create_req = urllib.request.Request(
            f'{BASE_URL}/api/v1/drafts',
            data=json.dumps({
                "draft_title": title,
                "draft_body": draft_body,
                "draft_subtitle": "",
            }).encode('utf-8'),
            headers=HEADERS,
            method='POST',
        )
        with urllib.request.urlopen(create_req, timeout=30) as response:
            draft = json.loads(response.read())
        draft_id = draft.get('id')
        if not draft_id:
            raise ValueError('draft created but no id returned')

        # Step 2: publish the approved draft
        publish_req = urllib.request.Request(
            f'{BASE_URL}/api/v1/drafts/{draft_id}/publish',
            data=b'{}',
            headers=HEADERS,
            method='POST',
        )
        with urllib.request.urlopen(publish_req, timeout=30) as response:
            result = json.loads(response.read())
        post_url = result.get('canonical_url', result.get('url', ''))
        print(f"OK {date_str}: Published (draft id {draft_id})")
        log_entry = f"| {date_str} | {mode} | {title} | PUBLISHED ({post_url or draft_id}) |\n"

    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        error_msg = error_body[:200] if error_body else e.reason
        print(f"FAILED {date_str}: HTTP {e.code} {error_msg}")
        log_entry = f"| {date_str} | {mode} | {title} | FAILED (HTTP {e.code}) |\n"
    except Exception as e:
        print(f"FAILED {date_str}: {str(e)}")
        log_entry = f"| {date_str} | {mode} | {title} | FAILED ({str(e)[:50]}) |\n"

    if log_entry:
        if LOG_FILE.exists():
            LOG_FILE.write_text(LOG_FILE.read_text() + log_entry)
        else:
            LOG_FILE.write_text("| Date | Mode | Devotion | Status |\n|---|---|---|---|\n" + log_entry)

print("Substack deploy complete.")
