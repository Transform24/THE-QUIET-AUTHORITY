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


def parse_frontmatter(text):
    """Parse simple '---\\nkey: value\\n---' frontmatter into a dict."""
    fm = {}
    lines = text.split('\n')
    if not lines or lines[0].strip() != '---':
        return fm, text
    for i, line in enumerate(lines[1:], start=1):
        if line.strip() == '---':
            body = '\n'.join(lines[i + 1:])
            return fm, body
        if ':' in line:
            key, _, value = line.partition(':')
            fm[key.strip()] = value.strip()
    return fm, text


def discover_approved_items(approved_dir):
    """Find work waiting in youtube-approved/, in either shape the pipeline
    actually produces:

      1. A per-date FOLDER containing video.mp4 + script-video.md
         (the fully-automated shape this script originally assumed).
      2. A flat SCRIPT .md file — what approval-gate.html and the
         youtube-agent actually write. Grace approves the script; the
         video itself is recorded separately (per agent.md STEP 4A) and,
         per its own frontmatter `video_file:`, is expected to show up
         next to the script once she's uploaded/rendered it.

    Returns (ready, awaiting_video) where `ready` items have a real video
    file on disk and `awaiting_video` items are approved scripts with no
    video yet — nothing to upload, but NOT the same as "nothing approved".
    """
    ready = []
    awaiting_video = []

    for entry in sorted(approved_dir.iterdir()):
        if entry.is_dir():
            video_file = entry / "video.mp4"
            script_file = entry / "script-video.md"
            if video_file.exists():
                ready.append({
                    'date_str': entry.name,
                    'video_file': video_file,
                    'script_text': script_file.read_text() if script_file.exists() else '',
                })
            else:
                awaiting_video.append({'date_str': entry.name, 'expected': str(video_file)})
        elif entry.is_file() and entry.suffix == '.md':
            text = entry.read_text()
            fm, body = parse_frontmatter(text)
            date_str = fm.get('date', entry.stem)
            video_name = fm.get('video_file', '').strip()
            video_file = (approved_dir / video_name) if video_name else None
            if video_file and video_file.exists():
                ready.append({
                    'date_str': date_str,
                    'video_file': video_file,
                    'script_text': body,
                })
            else:
                awaiting_video.append({
                    'date_str': date_str,
                    'expected': str(video_file) if video_file else '(no video_file set in frontmatter)',
                })

    return ready, awaiting_video


# Check for approved videos
if not APPROVED_DIR.exists() or not any(APPROVED_DIR.iterdir()):
    print("No approved videos to deploy.")
    sys.exit(0)

approved_videos, awaiting_video = discover_approved_items(APPROVED_DIR)

if awaiting_video:
    print(f"{len(awaiting_video)} approved script(s) awaiting Grace's recorded video (not an error — nothing to upload yet):")
    for item in awaiting_video:
        print(f"  - {item['date_str']}: expected {item['expected']}")

if not approved_videos:
    print("No approved item has a video file ready to upload yet.")
    sys.exit(0)

print(f"Found {len(approved_videos)} approved video(s) ready to upload.")

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

for item in approved_videos:
    date_str = item['date_str']
    video_file = item['video_file']

    if not video_file.exists():
        print(f"⚠️  {date_str}: {video_file} not found. Skipping.")
        continue

    # Parse script metadata
    title = "The Quiet Authority"
    description = "The Quiet Authority — Sacred teaching for women who are tired.\nhttps://sanctuary-grace.com/"
    tags = ["ChristianWomen", "SpiritualRest", "FaithAndWellness"]

    script_content = item.get('script_text') or ''
    if script_content:
        lines = script_content.split('\n')

        # Extract title from either script shape: folder-based drafts use
        # "## VIDEO TITLE" on its own line; flat approved scripts use
        # "## SCRIPT TITLE" followed by a "# <title>" line.
        for i, line in enumerate(lines):
            if line.startswith('## VIDEO TITLE') or line.startswith('## SCRIPT TITLE'):
                for follow in lines[i + 1:i + 4]:
                    follow = follow.strip()
                    if follow:
                        title = follow.lstrip('#').strip()
                        break
                break

        # Use first 200 chars of script as description start
        content_start = next((i for i, l in enumerate(lines) if l.startswith('## VIDEO SCRIPT') or l.startswith('## FULL VIDEO SCRIPT') or l.startswith('## FULL SCRIPT')), 0)
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
