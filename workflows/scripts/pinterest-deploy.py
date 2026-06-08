#!/usr/bin/env python3
"""
Pinterest Deploy Agent — Posts approved pins to Pinterest
Reads from: workflows/output/pinterest-approved/
Posts via: Pinterest API v5
Logs to: workflows/pin-log.md
Board mapping: workflows/config/pinterest-boards.json
Images: workflows/library/pinterest-images/[date].jpg or default.jpg
"""

import json, os, pathlib, datetime, urllib.request, urllib.error, base64

API_TOKEN = os.environ.get('PINTEREST_ACCESS_TOKEN', '').strip()
APPROVED_DIR = pathlib.Path('workflows/output/pinterest-approved')
LIBRARY_DIR = pathlib.Path('workflows/library/pinterest-images')
CONFIG_FILE = pathlib.Path('workflows/config/pinterest-boards.json')
LOG_FILE = pathlib.Path('workflows/pin-log.md')

if not API_TOKEN:
    print("⚠️  PINTEREST_ACCESS_TOKEN not set. Skipping deploy.")
    exit(0)

if not APPROVED_DIR.exists() or not any(APPROVED_DIR.iterdir()):
    print("No approved pins to deploy.")
    exit(0)

# Load board mapping from config
board_mapping = {}
if CONFIG_FILE.exists():
    try:
        config = json.loads(CONFIG_FILE.read_text())
        board_mapping = config.get('board_mapping', {})
    except Exception as e:
        print(f"⚠️  Could not load board mapping: {str(e)}")
        exit(1)
else:
    print(f"⚠️  Board mapping file not found: {CONFIG_FILE}")
    exit(1)

API_URL = "https://api.pinterest.com/v5/pins"
approved_files = sorted(APPROVED_DIR.glob("*.md"))
print(f"Found {len(approved_files)} approved pin(s) to deploy.")

for pin_file in approved_files:
    content = pin_file.read_text()
    lines = content.split('\n')

    date_str = pin_file.stem
    board_name = None
    board_id = None
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

    for fm_line in fm_lines:
        if fm_line.startswith('board:'):
            board_name = fm_line.split(':', 1)[1].strip()
        if fm_line.startswith('pin:'):
            pin_name = fm_line.split(':', 1)[1].strip()

    caption = '\n'.join(lines[content_start:]).strip()

    if not caption:
        print(f"⚠️  {date_str}: No caption found. Skipping.")
        continue

    if not board_name:
        print(f"⚠️  {date_str}: No board name in frontmatter. Skipping.")
        continue

    # Look up board ID from mapping
    board_id = board_mapping.get(board_name)
    if not board_id or board_id.startswith('PLACEHOLDER'):
        print(f"⚠️  {date_str}: Board '{board_name}' not found or ID is placeholder. Skipping until Standard access approved.")
        continue

    # Find image file (date-specific or default)
    date_specific_image = LIBRARY_DIR / f"{date_str}.jpg"
    default_image = LIBRARY_DIR / "default.jpg"

    image_path = None
    if date_specific_image.exists() and date_specific_image.stat().st_size > 100:
        image_path = date_specific_image
        print(f"  Using date-specific image: {date_str}.jpg")
    elif default_image.exists() and default_image.stat().st_size > 100:
        image_path = default_image
        print(f"  Using default image")
    else:
        print(f"⚠️  {date_str}: No image found. Skipping.")
        continue

    # Prepare pin data with image
    pin_data = {
        "title": pin_name or "The Quiet Authority",
        "description": caption,
        "link": "https://sanctuary-grace.com/",
        "board_id": board_id
    }

    # Add image as base64
    try:
        image_bytes = image_path.read_bytes()
        image_b64 = base64.b64encode(image_bytes).decode('utf-8')
        pin_data["image_base64"] = image_b64
    except Exception as e:
        print(f"⚠️  {date_str}: Could not read image: {str(e)}")
        continue

    try:
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
            log_entry = f"| {date_str} | {pin_name} | {board_name} | POSTED (ID: {pin_id}) |\n"

    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"❌ {date_str}: HTTP {e.code} — {error_body[:200]}")
        log_entry = f"| {date_str} | {pin_name} | {board_name} | FAILED (HTTP {e.code}) |\n"
    except Exception as e:
        print(f"❌ {date_str}: {str(e)}")
        log_entry = f"| {date_str} | {pin_name} | {board_name} | FAILED ({str(e)[:50]}) |\n"

    if LOG_FILE.exists():
        LOG_FILE.write_text(LOG_FILE.read_text() + log_entry)
    else:
        LOG_FILE.write_text("| Date | Pin | Board | Status |\n|---|---|---|---|\n" + log_entry)

print("✅ Pinterest deploy complete.")
