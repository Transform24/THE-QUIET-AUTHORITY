#!/usr/bin/env python3
"""
Substack Deploy Agent — Publishes approved devotions to Substack
Reads from: workflows/output/substack-approved/
Publishes via: Substack API (email import or draft creation)
Logs to: workflows/substack-log.md
Archives to: workflows/library/substack-headers/
"""

import json, os, pathlib, datetime, urllib.request, urllib.error

SUBSTACK_API_KEY = os.environ.get('SUBSTACK_API_KEY', '').strip()
SUBSTACK_PUBLICATION_ID = os.environ.get('SUBSTACK_PUBLICATION_ID', 'sapop2sotwm').strip()
SUBSTACK_PUBLICATION_URL = os.environ.get('SUBSTACK_PUBLICATION_URL', 'thequietauthority.substack.com').strip()

APPROVED_DIR = pathlib.Path('workflows/output/substack-approved')
LIBRARY_DIR = pathlib.Path('workflows/library/substack-headers')
LOG_FILE = pathlib.Path('workflows/substack-log.md')

LIBRARY_DIR.mkdir(parents=True, exist_ok=True)

if not SUBSTACK_API_KEY:
    print("⚠️  SUBSTACK_API_KEY not set. Skipping deploy.")
    exit(0)

if not APPROVED_DIR.exists() or not any(APPROVED_DIR.iterdir()):
    print("No approved devotions to deploy.")
    exit(0)

approved_files = sorted(APPROVED_DIR.glob("*.md"))
print(f"Found {len(approved_files)} approved devotion(s) to deploy.")

# Substack API endpoints
# Option 1: Email import (simplest - just send email)
EMAIL_IMPORT_URL = f"https://substack.com/api/v1/publications/{SUBSTACK_PUBLICATION_ID}/email-imports"

# Option 2: Direct API (requires proper auth)
API_URL = f"https://api.substack.com/api/v1/posts"

for devo_file in approved_files:
    content = devo_file.read_text()
    lines = content.split('\n')

    # Parse frontmatter
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

    # Extract metadata
    for fm_line in fm_lines:
        if fm_line.startswith('mode:'):
            mode = fm_line.split(':', 1)[1].strip()

    # Get body (everything after frontmatter)
    body_text = '\n'.join(lines[content_start:]).strip()

    if not body_text:
        print(f"⚠️  {date_str}: No content found. Skipping.")
        continue

    # Extract title (first line of body)
    body_lines = body_text.split('\n')
    title = body_lines[0].strip() if body_lines else "Untitled"

    # Prepare email content for Substack
    # Format: subject, from_name, html_content
    email_subject = title
    email_body = body_text.replace('\n', '<br>\n')  # Simple HTML conversion

    email_payload = {
        "subject": email_subject,
        "from_name": "Grace Turner",
        "html_content": f"<p>{email_body.replace(chr(10), '</p><p>')}</p>"
    }

    log_entry = ""

    try:
        # Method 1: Try email import API
        req_body = json.dumps(email_payload).encode('utf-8')
        req = urllib.request.Request(
            f"{EMAIL_IMPORT_URL}?access_token={SUBSTACK_API_KEY}",
            data=req_body,
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read())
                email_id = result.get('id', 'unknown')
                print(f"✅ {date_str}: Published devotion via email import (ID: {email_id})")
                log_entry = f"| {date_str} | {mode} | {title} | PUBLISHED (Email ID: {email_id}) |\n"
        except urllib.error.HTTPError as e:
            if e.code == 404:
                # Email import endpoint not available, try direct post
                print(f"⏳ {date_str}: Email import not available, trying direct API...")

                post_payload = {
                    "title": title,
                    "body_markdown": body_text,
                    "draft": False,
                    "publish_now": True,
                }

                post_req = urllib.request.Request(
                    f"{API_URL}?access_token={SUBSTACK_API_KEY}",
                    data=json.dumps(post_payload).encode('utf-8'),
                    headers={"Content-Type": "application/json"},
                    method="POST"
                )

                with urllib.request.urlopen(post_req, timeout=30) as response:
                    result = json.loads(response.read())
                    post_id = result.get('id', 'unknown')
                    print(f"✅ {date_str}: Published devotion via API (ID: {post_id})")
                    log_entry = f"| {date_str} | {mode} | {title} | PUBLISHED (API ID: {post_id}) |\n"
            else:
                error_body = e.read().decode()
                print(f"❌ {date_str}: HTTP {e.code} — {error_body[:200]}")
                log_entry = f"| {date_str} | {mode} | {title} | FAILED (HTTP {e.code}) |\n"

    except Exception as e:
        print(f"❌ {date_str}: {str(e)}")
        log_entry = f"| {date_str} | {mode} | {title} | FAILED ({str(e)[:50]}) |\n"

    # Update log
    if log_entry:
        if LOG_FILE.exists():
            LOG_FILE.write_text(LOG_FILE.read_text() + log_entry)
        else:
            LOG_FILE.write_text("| Date | Mode | Devotion | Status |\n|---|---|---|---|\n" + log_entry)

print("✅ Substack deploy complete.")
