#!/usr/bin/env python3
"""
Pinterest Deploy Agent — Posts approved pins to Pinterest
Reads from: workflows/output/pinterest-approved/
Posts via: Pinterest API v5
Logs to: workflows/pin-log.md
Archives to: workflows/library/pinterest-images/
"""

import json, os, pathlib, datetime, urllib.request, urllib.error

API_TOKEN = os.environ.get('PINTEREST_ACCESS_TOKEN', '').strip()
APPROVED_DIR = pathlib.Path('workflows/output/pinterest-approved')
LIBRARY_DIR = pathlib.Path('workflows/library/pinterest-images')
LOG_FILE = pathlib.Path('workflows/pin-log.md')

LIBRARY_DIR.mkdir(parents=True, exist_ok=True)

if not API_TOKEN:
    print("⚠️  PINTEREST_ACCESS_TOKEN not set. Skipping deploy.")
    exit(0)

if not APPROVED_DIR.exists() or not any(APPROVED_DIR.iterdir()):
    print("No approved pins to deploy.")
    exit(0)

# Pinterest API base URL
API_URL = "https://api.pinterest.com/v5/pins"

approved_files = sorted(APPROVED_DIR.glob("*.md"))
print(f"Found {len(approved_files)} approved pin(s) to deploy.")

for pin_file in approved_files:
    content = pin_file.read_text()
    lines = content.split('\n')

    # Parse frontmatter
    date_str = pin_file.stem
    board = None
    pin_name = None
    caption = None

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

    # Extract metadata from frontmatter
    for fm_line in fm_lines:
        if fm_line.startswith('board:'):
            board = fm_line.split(':', 1)[1].strip()
        if fm_line.startswith('pin:'):
            pin_name = fm_line.split(':', 1)[1].strip()

    # Get caption (everything after frontmatter)
    caption = '\n'.join(lines[content_start:]).strip()

    if not caption:
        print(f"⚠️  {date_str}: No caption found. Skipping.")
        continue

    # Prepare pin data for Pinterest API
    pin_data = {
        "title": pin_name or "The Quiet Authority",
        "description": caption,
        "link": "https://sanctuary-grace.com/",
        "board_id": board,  # Grace must provide board IDs in secrets or we use board names
        "image_url": None  # Image handled separately if needed
    }

    try:
        # POST to Pinterest API
        req_body = json.dumps(pin_data).encode('utf-8')
        req = urllib.request.Request(
            f"{API_URL}?access_token={API_TOKEN}",
            data=req_body,
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            result = json.loads(response.read())
            pin_id = result.get('id', 'unknown')
            print(f"✅ {date_str}: Posted pin ID {pin_id}")

            # Log success
            log_entry = f"| {date_str} | {pin_name} | {board} | POSTED (ID: {pin_id}) |\n"

    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"❌ {date_str}: HTTP {e.code} — {error_body[:200]}")
        log_entry = f"| {date_str} | {pin_name} | {board} | FAILED (HTTP {e.code}) |\n"
    except Exception as e:
        print(f"❌ {date_str}: {str(e)}")
        log_entry = f"| {date_str} | {pin_name} | {board} | FAILED ({str(e)[:50]}) |\n"

    # Update log
    if LOG_FILE.exists():
        LOG_FILE.write_text(LOG_FILE.read_text() + log_entry)
    else:
        LOG_FILE.write_text("| Date | Pin | Board | Status |\n|---|---|---|---|\n" + log_entry)

print("✅ Pinterest deploy complete.")
