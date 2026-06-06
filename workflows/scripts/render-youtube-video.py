#!/usr/bin/env python3
"""
YouTube Video Renderer — Creates faceless teaching videos
Input: Script markdown (from youtube_agent.py)
Output: video.mp4 (1920x1080, 12 minutes)
Process: Text slides + background + silent audio duration

This is a minimal renderer using ImageMagick + FFmpeg.
For production, consider Remotion or similar for higher quality.
"""

import subprocess, json, pathlib, textwrap, sys, os

def create_text_slides(script_md, output_dir):
    """
    Parse script markdown and create text slide images.
    Returns list of slide image paths.
    """
    lines = script_md.split('\n')
    slides = []
    current_section = None
    current_text = []

    # Extract sections from script
    sections = {
        'OPENING STILLNESS': [],
        'MAIN TEACHING': [],
        'SILENCE INVITATION': [],
        'SOFT CLOSE': []
    }

    in_section = None
    for line in lines:
        if 'OPENING STILLNESS' in line:
            in_section = 'OPENING STILLNESS'
        elif 'MAIN TEACHING' in line:
            in_section = 'MAIN TEACHING'
        elif 'SILENCE INVITATION' in line:
            in_section = 'SILENCE INVITATION'
        elif 'SOFT CLOSE' in line:
            in_section = 'SOFT CLOSE'
        elif line.strip() and in_section and not line.startswith('#'):
            sections[in_section].append(line.strip())

    # Create slide images (one per 10 seconds = 72 slides for 12 min)
    slide_num = 0

    # Opening stillness (30 sec = 3 slides)
    for i in range(3):
        text = "The Quiet Authority\n\nTake a breath.\nBe present.\nYou are welcome here."
        slide_path = create_slide(text, slide_num, output_dir)
        slides.append(slide_path)
        slide_num += 1

    # Main teaching (10.5 min = 63 slides)
    teaching_text = '\n'.join(sections['MAIN TEACHING'])
    teaching_chunks = textwrap.wrap(teaching_text, width=150)
    for chunk in teaching_chunks[:63]:
        slide_path = create_slide(chunk, slide_num, output_dir)
        slides.append(slide_path)
        slide_num += 1

    # Silence invitation (2 min = 12 slides)
    silence_text = "Breathe.\nSit with what you have heard.\nGod is here."
    for i in range(12):
        slide_path = create_slide(silence_text, slide_num, output_dir)
        slides.append(slide_path)
        slide_num += 1

    # Soft close (30 sec = 3 slides)
    close_text = "You are loved.\nYou are seen.\nGo in peace.\n\nhttps://sanctuary-grace.com/"
    for i in range(3):
        slide_path = create_slide(close_text, slide_num, output_dir)
        slides.append(slide_path)
        slide_num += 1

    return slides[:72]  # Exactly 72 slides for 12 min at 1 fps

def create_slide(text, slide_num, output_dir):
    """Create a single text slide using ImageMagick (convert command)."""
    slide_path = output_dir / f"slide_{slide_num:03d}.png"

    cmd = [
        'convert',
        '-size', '1920x1080',
        'xc:#0d0d0d',  # Dark TQA background
        '-font', 'Cormorant-Garamond',
        '-pointsize', '48',
        '-fill', '#e2c98e',  # Gold text
        '-gravity', 'Center',
        '-annotate', '+0+0',
        text,
        str(slide_path)
    ]

    try:
        subprocess.run(cmd, check=True, capture_output=True)
        return slide_path
    except subprocess.CalledProcessError as e:
        print(f"❌ ImageMagick convert failed: {e.stderr.decode()}")
        # Fallback: create simple placeholder
        return None
    except FileNotFoundError:
        print("⚠️  ImageMagick not installed. Cannot render video.")
        return None

def render_video_from_slides(slides, output_video, audio_track=None):
    """
    Create video from slides using FFmpeg.
    Each slide displayed for ~10 seconds.
    """
    valid_slides = [s for s in slides if s and s.exists()]

    if not valid_slides:
        print("❌ No valid slides to render.")
        return False

    # Create concat demux file for ffmpeg
    concat_file = output_video.parent / "concat.txt"
    concat_content = "\n".join([f"file '{s.absolute()}'" for s in valid_slides])
    concat_file.write_text(concat_content)

    # FFmpeg command: create video with 10s per slide = 72 slides * 10s = 720s = 12 min
    cmd = [
        'ffmpeg',
        '-y',  # Overwrite output
        '-framerate', '0.1',  # 1 frame every 10 seconds
        '-i', str(valid_slides[0]),  # Input format (will use concat file)
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-s', '1920x1080',
        str(output_video)
    ]

    # Better approach: use image2 with concat demux
    cmd = [
        'ffmpeg',
        '-y',
        '-framerate', '0.1',
        '-pattern_type', 'glob',
        '-i', str(output_video.parent / 'slide_*.png'),
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-b:v', '5000k',
        str(output_video)
    ]

    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"✅ Video rendered: {output_video}")
        concat_file.unlink()
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ FFmpeg failed: {e.stderr.decode()}")
        return False
    except FileNotFoundError:
        print("⚠️  FFmpeg not installed. Cannot render video.")
        print("   Install with: apt-get install ffmpeg imagemagick")
        return False

# Main
if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <script.md> <output.mp4>")
        sys.exit(1)

    script_file = pathlib.Path(sys.argv[1])
    output_video = pathlib.Path(sys.argv[2])

    if not script_file.exists():
        print(f"❌ Script not found: {script_file}")
        sys.exit(1)

    script_text = script_file.read_text()
    output_dir = output_video.parent

    print(f"Creating slides from script...")
    slides = create_text_slides(script_text, output_dir)

    print(f"Rendering video from {len(slides)} slides...")
    if render_video_from_slides(slides, output_video):
        print(f"✅ Done: {output_video}")
    else:
        print("❌ Rendering failed.")
        sys.exit(1)
