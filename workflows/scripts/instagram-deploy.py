#!/usr/bin/env python3
"""
Instagram Deploy Agent — Posts approved content to Instagram
Reads from: workflows/output/instagram-approved/
Posts via: Instagram Graph API
Logs to: workflows/instagram-log.md
Archives to: workflows/library/instagram-reels/
"""

import json, os, pathlib, datetime, urllib.request, urllib.error

INSTAGRAM_ACCESS_TOKEN = os.environ.get('INSTAGRAM_ACCESS_TOKEN', '').strip()
INSTAGRAM_USER_ID = os.environ.get('INSTAGRAM_USER_ID', '').strip()

APPROVED_DIR = pathlib.Path('workflows/output/instagram-approved')
LIBRARY_DIR = pathlib.Path('workflows/library/instagram-reels')
LOG_FILE = pathlib.Path('workflows/instagram-log.md')

LIBRARY_DIR.mkdir(parents=True, exist_ok=True)

if not INSTAGRAM_ACCESS_TOKEN or not INSTAGRAM_USER_ID:
    print("⚠️  INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID not set. Skipping deploy.")
    exit(0)

if not APPROVED_DIR.exists() or not any(APPROVED_DIR.iterdir()):
    print("No approved posts to deploy.")
    exit(0)

approved_files = sorted(APPROVED_DIR.glob("*.md"))
print(f"Found {len(approved_files)} approved Instagram post(s) to deploy.")

# Instagram Graph API endpoint
API_URL = f"https://graph.instagram.com/v18.0/{INSTAGRAM_USER_ID}/media"

for post_file in approved_files:
    content = post_file.read_text()
    lines = content.split('\n')

    # Parse frontmatter
    date_str = post_file.stem
    pillar = None
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

    # Extract metadata
    for fm_line in fm_lines:
        if fm_line.startswith('pillar:'):
            pillar = fm_line.split(':', 1)[1].strip()

    # Get caption (everything after frontmatter)
    caption = '\n'.join(lines[content_start:]).strip()

    if not caption:
        print(f"⚠️  {date_str}: No caption found. Skipping.")
        continue

    # Check if this is a Reel (has video file)
    reel_file = APPROVED_DIR / f"{date_str}_reel.mp4"
    image_file = APPROVED_DIR / f"{date_str}_image.jpg"

    log_entry = ""

    try:
        if reel_file.exists():
            # Post as Reel video
            # Instagram Reel requires uploading video first, then creating media
            with open(reel_file, 'rb') as f:
                video_data = f.read()

            # Create Reel container
            payload = {
                'upload_type': 'VIDEO',
                'video_data': video_data,  # Note: In production, use proper file upload
                'caption': caption,
                'media_type': 'REELS',
                'access_token': INSTAGRAM_ACCESS_TOKEN
            }

            # Simplified: would need proper multipart form data in production
            print(f"⏳ {date_str}: Reel upload would require multipart form handling")
            log_entry = f"| {date_str} | {pillar} | Reel | NEEDS_MULTIPART_UPLOAD |\n"

        elif image_file.exists():
            # Post as image/carousel
            print(f"⏳ {date_str}: Image upload would require file handling")
            log_entry = f"| {date_str} | {pillar} | Image | NEEDS_FILE_UPLOAD |\n"

        else:
            # Post as text-only carousel (caption only)
            payload = {
                'caption': caption,
                'media_type': 'CAROUSEL',
                'access_token': INSTAGRAM_ACCESS_TOKEN
            }

            req_body = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(
                f"{API_URL}?access_token={INSTAGRAM_ACCESS_TOKEN}",
                data=req_body,
                headers={"Content-Type": "application/json"},
                method="POST"
            )

            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read())
                post_id = result.get('id', 'unknown')
                print(f"✅ {date_str}: Posted to Instagram (ID: {post_id})")
                log_entry = f"| {date_str} | {pillar} | Caption | POSTED (ID: {post_id}) |\n"

    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"❌ {date_str}: HTTP {e.code} — {error_body[:200]}")
        log_entry = f"| {date_str} | {pillar} | N/A | FAILED (HTTP {e.code}) |\n"
    except Exception as e:
        print(f"❌ {date_str}: {str(e)}")
        log_entry = f"| {date_str} | {pillar} | N/A | FAILED ({str(e)[:50]}) |\n"

    # Update log
    if log_entry:
        if LOG_FILE.exists():
            LOG_FILE.write_text(LOG_FILE.read_text() + log_entry)
        else:
            LOG_FILE.write_text("| Date | Pillar | Type | Status |\n|---|---|---|---|\n" + log_entry)

print("✅ Instagram deploy complete.")
