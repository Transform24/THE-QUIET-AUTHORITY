#!/usr/bin/env python3
"""
YouTube Deploy Agent — Uploads approved videos to YouTube
Reads from: workflows/output/youtube-approved/[date]/video.mp4 + metadata
Uploads via: YouTube Data API v3
Logs to: workflows/youtube-log.md
Archives to: workflows/library/youtube-renders/
"""

import os, json, pathlib, datetime, sys

# YouTube API libraries
try:
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
except ImportError:
    print("⚠️  Google API libraries not installed. Install with: pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client")
    sys.exit(0)

APPROVED_DIR = pathlib.Path('workflows/output/youtube-approved')
LIBRARY_DIR = pathlib.Path('workflows/library/youtube-renders')
LOG_FILE = pathlib.Path('workflows/youtube-log.md')

LIBRARY_DIR.mkdir(parents=True, exist_ok=True)

# Check for approved videos
if not APPROVED_DIR.exists() or not any(APPROVED_DIR.iterdir()):
    print("No approved videos to deploy.")
    sys.exit(0)

approved_videos = [d for d in APPROVED_DIR.iterdir() if d.is_dir()]

if not approved_videos:
    print("No video folders in youtube-approved/.")
    sys.exit(0)

print(f"Found {len(approved_videos)} approved video folder(s) to upload.")

# YouTube API setup (simplified for GitHub Actions)
# In production, use OAuth 2.0 with refresh tokens stored in secrets
API_KEY = os.environ.get('YOUTUBE_API_KEY', '').strip()
CLIENT_ID = os.environ.get('YOUTUBE_CLIENT_ID', '').strip()
CLIENT_SECRET = os.environ.get('YOUTUBE_CLIENT_SECRET', '').strip()
REFRESH_TOKEN = os.environ.get('YOUTUBE_REFRESH_TOKEN', '').strip()

if not API_KEY and not REFRESH_TOKEN:
    print("⚠️  YouTube credentials not configured. Skipping deploy.")
    print("   Set YOUTUBE_API_KEY or YOUTUBE_CLIENT_ID + CLIENT_SECRET + REFRESH_TOKEN in GitHub Secrets.")
    sys.exit(0)

for video_folder in approved_videos:
    date_str = video_folder.name
    video_file = video_folder / "video.mp4"
    script_file = video_folder / "script-video.md"

    if not video_file.exists():
        print(f"⚠️  {date_str}: video.mp4 not found. Skipping.")
        continue

    # Parse script metadata
    title = "The Quiet Authority"
    description = "The Quiet Authority — Sacred teaching for women who are tired.\nhttps://sanctuary-grace.com/"
    tags = ["ChristianWomen", "SpiritualRest", "FaithAndWellness"]

    if script_file.exists():
        script_content = script_file.read_text()
        lines = script_content.split('\n')

        # Extract title from first content line (after frontmatter)
        for i, line in enumerate(lines):
            if line.startswith('## VIDEO TITLE'):
                title = lines[i + 1].strip() if i + 1 < len(lines) else title
                break

        # Use first 200 chars of script as description start
        content_start = next((i for i, l in enumerate(lines) if l.startswith('## VIDEO SCRIPT')), 0)
        if content_start:
            script_text = ' '.join(lines[content_start:content_start+10])
            description = f"{title}\n\n{script_text[:300]}\n\nhttps://sanctuary-grace.com/"

    log_entry = ""

    try:
        if REFRESH_TOKEN:
            # Use OAuth 2.0 with refresh token (best practice for automation)
            from google.auth.transport.requests import Request
            from google.oauth2.credentials import Credentials

            credentials = Credentials.from_authorized_user_info({
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'refresh_token': REFRESH_TOKEN,
                'type': 'authorized_user'
            })

            credentials.refresh(Request())
            youtube = build('youtube', 'v3', credentials=credentials)

        else:
            # Use API key (read-only, won't work for uploads)
            print(f"⚠️  {date_str}: API_KEY-only auth does not support uploads. Use OAuth 2.0.")
            log_entry = f"| {date_str} | N/A | SKIPPED (API key doesn't support uploads) |\n"
            continue

        # Upload video
        media = MediaFileUpload(str(video_file), mimetype='video/mp4', resumable=True)

        body = {
            'snippet': {
                'title': title[:100],  # YouTube limit
                'description': description[:5000],  # YouTube limit
                'tags': tags[:50],  # YouTube limit
                'categoryId': '26'  # Howto & Style category
            },
            'processingDetails': {
                'processingStatus': 'processing'
            }
        }

        # Set privacy (unlisted so only people with link can watch during Grace review)
        body['status'] = {
            'privacyStatus': 'unlisted',  # Not private (Grace can share link) but not public yet
            'embeddable': True
        }

        request = youtube.videos().insert(
            part='snippet,status,processingDetails',
            body=body,
            media_body=media
        )

        response = None
        while response is None:
            status, response = request.next_chunk()
            if status:
                print(f"  Upload progress: {int(status.progress() * 100)}%")

        video_id = response.get('id')
        print(f"✅ {date_str}: Uploaded video ID {video_id}")
        log_entry = f"| {date_str} | {title} | UPLOADED (ID: {video_id}) |\n"

        # Archive video to library
        archive_path = LIBRARY_DIR / f"{date_str}-video.mp4"
        import shutil
        shutil.copy(str(video_file), str(archive_path))
        print(f"  Archived to {archive_path}")

    except Exception as e:
        print(f"❌ {date_str}: {str(e)}")
        log_entry = f"| {date_str} | N/A | FAILED ({str(e)[:100]}) |\n"

    # Update log
    if log_entry:
        if LOG_FILE.exists():
            LOG_FILE.write_text(LOG_FILE.read_text() + log_entry)
        else:
            LOG_FILE.write_text("| Date | Video | Status |\n|---|---|---|\n" + log_entry)

print("✅ YouTube deploy complete.")
