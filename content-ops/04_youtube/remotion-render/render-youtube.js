import { renderMedia } from '@remotion/renderer';
import { YouTubeVideo } from './compositions/YouTubeVideo.js';
import fs from 'fs';
import path from 'path';

const outputDir = '../../output/youtube-pending';
const latestScriptFile = getLatestFile(outputDir);

if (!latestScriptFile) {
  console.log('No YouTube script found in output/youtube-pending/');
  process.exit(0);
}

const scriptData = JSON.parse(fs.readFileSync(latestScriptFile, 'utf-8'));

async function renderYouTubeVideo() {
  try {
    const videoPath = path.join(outputDir, `${path.basename(latestScriptFile, '.json')}.mp4`);

    console.log(`📹 Rendering YouTube video from: ${latestScriptFile}`);

    await renderMedia({
      composition: YouTubeVideo,
      seriesData: scriptData,
      output: videoPath,
      codec: 'h264',
      crf: 18,
      audioCodec: 'aac',
      videoBitrate: '5000k',
      audioBitrate: '192k',
    });

    console.log(`✅ YouTube video rendered: ${videoPath}`);
    console.log(`   Title: ${scriptData.title}`);
    console.log(`   Duration: ~12 minutes`);
  } catch (error) {
    console.error('❌ YouTube rendering failed:', error);
    process.exit(1);
  }
}

function getLatestFile(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  if (!files.length) return null;
  return path.join(dir, files.sort().reverse()[0]);
}

renderYouTubeVideo();
