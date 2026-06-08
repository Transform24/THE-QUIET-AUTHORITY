import urllib.request, urllib.error, json, os, datetime, pathlib, time, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont

API_KEY = os.environ["GEMINI_API_KEY"]
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

def call_gemini(prompt, retries=3):
    data = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode()
    for attempt in range(1, retries + 1):
        req = urllib.request.Request(URL, data=data, headers={"Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read())["candidates"][0]["content"]["parts"][0]["text"]
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            print(f"Attempt {attempt}: HTTP {e.code} — {body[:300]}", flush=True)
            if e.code == 429:
                if "quota" in body.lower():
                    print("Daily quota exceeded. Re-run tomorrow.", flush=True)
                    import sys; sys.exit(1)
                if attempt < retries:
                    wait = 30 * attempt
                    print(f"Rate limited. Waiting {wait}s...", flush=True)
                    time.sleep(wait)
                else:
                    raise
            else:
                raise

def generate_audio_elevenlabs(text, output_path):
    """Generate audio using ElevenLabs API"""
    api_key = os.environ.get('ELEVENLABS_API_KEY', '').strip()
    if not api_key:
        print("⚠️  ELEVENLABS_API_KEY not set. Falling back to gTTS.")
        return False

    try:
        # Use ElevenLabs default voice (Rachel)
        voice_id = "21m00Tcm4TlvDq8ikWAM"  # Rachel voice
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

        payload = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode('utf-8'),
            headers={
                "xi-api-key": api_key,
                "Content-Type": "application/json"
            }
        )

        with urllib.request.urlopen(req, timeout=30) as response:
            audio_data = response.read()
            with open(output_path, 'wb') as f:
                f.write(audio_data)
            print(f"✅ Audio generated with ElevenLabs")
            return True
    except Exception as e:
        print(f"⚠️  ElevenLabs failed: {str(e)}")
        return False

def generate_audio_gtts(text, output_path):
    """Fallback: Generate audio using gTTS"""
    try:
        from gtts import gTTS
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(output_path)
        print(f"✅ Audio generated with gTTS (fallback)")
        return True
    except ImportError:
        print("⚠️  gTTS not installed. Installing...")
        subprocess.run(['pip', 'install', 'gtts'], check=True)
        from gtts import gTTS
        tts = gTTS(text=text, lang='en', slow=False)
        tts.save(output_path)
        print(f"✅ Audio generated with gTTS")
        return True
    except Exception as e:
        print(f"❌ gTTS failed: {str(e)}")
        return False

def generate_slides(script_sections, output_dir):
    """Generate slide images from scripture quotes in script"""
    # Design tokens
    BG_COLOR = "#0d0d0d"
    TEXT_COLOR = "#F5F0E8"
    ACCENT_COLOR = "#C9A84C"

    # Slide dimensions (16:9 for YouTube)
    WIDTH, HEIGHT = 1280, 720

    slides = []

    # Extract scripture verses from script (lines that look like "Book X:Y")
    lines = script_sections.split('\n')
    verse_lines = [line.strip() for line in lines if ':' in line and any(book in line for book in ['Matthew', 'Mark', 'Luke', 'John', 'Romans', 'Psalms', 'Proverbs', 'Isaiah', 'Jeremiah', 'Colossians', 'Timothy', 'Peter', 'James'])]

    # If no verses found, create title slide + content slides
    if not verse_lines:
        verse_lines = script_sections.split('\n\n')[:3]  # Use first 3 paragraphs as slides

    for idx, verse in enumerate(verse_lines[:5]):  # Limit to 5 slides
        img = Image.new('RGB', (WIDTH, HEIGHT), color=BG_COLOR)
        draw = ImageDraw.Draw(img)

        # Try to use a nice serif font, fall back to default
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 48)
            small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf", 36)
        except:
            font = ImageFont.load_default()
            small_font = font

        # Wrap text
        text = verse[:200]  # Limit text length
        words = text.split()
        lines = []
        current_line = []

        for word in words:
            current_line.append(word)
            test_line = ' '.join(current_line)
            bbox = draw.textbbox((0, 0), test_line, font=font)
            if bbox[2] - bbox[0] > WIDTH - 100:
                lines.append(' '.join(current_line[:-1]))
                current_line = [word]
        lines.append(' '.join(current_line))

        # Draw accent line at top
        draw.rectangle([(0, 0), (WIDTH, 10)], fill=ACCENT_COLOR)

        # Draw text centered
        y = HEIGHT // 2 - len(lines) * 30
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=font)
            x = (WIDTH - (bbox[2] - bbox[0])) // 2
            draw.text((x, y), line, fill=TEXT_COLOR, font=font)
            y += 70

        # Save slide
        slide_path = output_dir / f"slide_{idx:03d}.png"
        img.save(slide_path)
        slides.append(slide_path)
        print(f"  Slide {idx+1}: {slide_path}")

    return slides

def create_video(audio_path, slides, output_path):
    """Combine audio and slides into MP4 using FFmpeg"""
    if not slides:
        print("❌ No slides to create video")
        return False

    try:
        # Get audio duration
        cmd_duration = [
            'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1:nokey=1', audio_path
        ]
        duration_result = subprocess.run(cmd_duration, capture_output=True, text=True, check=True)
        audio_duration = float(duration_result.stdout.strip())

        # Duration per slide
        duration_per_slide = audio_duration / len(slides)

        # Create concat file for slides
        concat_file = pathlib.Path(tempfile.gettempdir()) / "concat.txt"
        with open(concat_file, 'w') as f:
            for slide in slides:
                f.write(f"file '{slide.absolute()}'\n")
                f.write(f"duration {duration_per_slide}\n")

        # Create video from slides
        slides_video = pathlib.Path(tempfile.gettempdir()) / "slides.mp4"
        cmd_slides = [
            'ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_file),
            '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=#0d0d0d',
            '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'medium',
            str(slides_video)
        ]
        print(f"  Creating slides video...")
        subprocess.run(cmd_slides, check=True, capture_output=True)

        # Combine audio + video
        cmd_final = [
            'ffmpeg', '-y', '-i', str(slides_video), '-i', audio_path,
            '-c:v', 'copy', '-c:a', 'aac', '-map', '0:v:0', '-map', '1:a:0',
            str(output_path)
        ]
        print(f"  Combining audio and video...")
        subprocess.run(cmd_final, check=True, capture_output=True)

        print(f"✅ Video created: {output_path}")
        return True
    except Exception as e:
        print(f"❌ FFmpeg failed: {str(e)}")
        return False

# Main flow
today = datetime.date.today()
day_name = today.strftime("%A")
date_str = today.strftime("%Y-%m-%d")

VOICE = """
BRAND VOICE — SACRED LAW.
Voice: Sacred, tender, prophetic. Minister — never marketer.
Audience: Burned-out Christian women, 30-55.
FORBIDDEN: Hustle language, emojis, exclamation marks, urgency.
Ministry: Sanctuary Grace Ministry.
"""

SERIES = ["Profile deep dive", "7-day practice walkthrough", "Circle of Silence session", "Scripture reflection"]
series = SERIES[today.isocalendar()[1] % len(SERIES)]

prompt = f"""{VOICE}

Today: {date_str} ({day_name})
Series: {series}

Write a VIDEO SCRIPT for The Quiet Authority YouTube (2-3 minutes of speaking time).

## SCRIPT TITLE
Under 60 chars. Sacred, not clickbait.

## FULL SCRIPT
Conversational, 2-3 minutes of reading (~500-600 words).
Include one full scripture verse (book chapter:verse).
Structure: Opening (30s) → Teaching (2 min) → Close (30s).

## SEO DESCRIPTION
200-250 words. Sacred voice. End with: https://sanctuary-grace.com/

## TAGS
10 YouTube tags (no hash). Examples: ChristianWomen, SpiritualRest, Devotional

## THUMBNAIL CONCEPT
One sentence. Example: "Woman in peaceful prayer, dark background, gold text 'FIND REST'"
"""

print(f"Generating script...")
content = call_gemini(prompt)

# Parse sections
sections = content.split('\n##')
script_title = "Untitled"
full_script = ""
seo_desc = ""
tags = ""
thumb = ""

for section in sections:
    if 'SCRIPT TITLE' in section:
        script_title = section.split('\n', 1)[1].strip()[:100]
    elif 'FULL SCRIPT' in section:
        full_script = section.split('\n', 1)[1].strip()
    elif 'SEO DESCRIPTION' in section:
        seo_desc = section.split('\n', 1)[1].strip()
    elif 'TAGS' in section:
        tags = section.split('\n', 1)[1].strip()
    elif 'THUMBNAIL' in section:
        thumb = section.split('\n', 1)[1].strip()

# Generate audio
print(f"Generating audio...")
audio_path = pathlib.Path(f"/tmp/audio_{date_str}.mp3")
if not generate_audio_elevenlabs(full_script, str(audio_path)):
    if not generate_audio_gtts(full_script, str(audio_path)):
        print("❌ Audio generation failed")
        exit(1)

# Generate slides
print(f"Generating slides...")
slides_dir = pathlib.Path(f"/tmp/slides_{date_str}")
slides_dir.mkdir(parents=True, exist_ok=True)
slides = generate_slides(full_script, slides_dir)

# Create video
print(f"Creating video...")
video_path = pathlib.Path(f"workflows/output/youtube_video_{date_str}.mp4")
video_path.parent.mkdir(parents=True, exist_ok=True)
if not create_video(str(audio_path), slides, str(video_path)):
    print("❌ Video creation failed")
    exit(1)

# Save script metadata for approval gate
print(f"Saving script metadata...")
out_dir = pathlib.Path("workflows/output/youtube-pending")
out_dir.mkdir(parents=True, exist_ok=True)
script_file = out_dir / f"{date_str}.md"

script_file.write_text(f"""---
date: {date_str}
series: {series}
status: VIDEO READY — Grace downloads and uploads to YouTube
video_file: youtube_video_{date_str}.mp4
---

## SCRIPT TITLE
{script_title}

## FULL SCRIPT
{full_script}

## SEO DESCRIPTION
{seo_desc}

## TAGS
{tags}

## THUMBNAIL CONCEPT
{thumb}

---

**Video ready:** Download `{video_path}` from GitHub Actions artifacts.
Record date: {date_str}
Length: ~2-3 minutes
Format: 1280x720 MP4 (YouTube ready)
""")

# Log
log_file = pathlib.Path("workflows/output/youtube-log.md")
entry = f"| {date_str} | Video + Script | {series} | READY FOR UPLOAD | {video_path} |\n"
if log_file.exists():
    log_file.write_text(log_file.read_text() + entry)
else:
    log_file.write_text("| Date | Content | Series | Status | Output |\n|---|---|---|---|---|\n" + entry)

print(f"\n✅ COMPLETE")
print(f"   Script: {script_file}")
print(f"   Video: {video_path}")
print(f"   Download from GitHub Actions artifacts tab")
