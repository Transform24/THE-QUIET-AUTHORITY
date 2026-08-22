import { renderMedia } from '@remotion/renderer';
import { InstagramReel } from './compositions/InstagramReel.js';
import fs from 'fs';
import path from 'path';

const outputDir = '../../output/instagram-pending';
const latestCaptionFile = getLatestFile(outputDir);

if (!latestCaptionFile) {
  console.log('No Instagram caption found in output/instagram-pending/');
  process.exit(0);
}

const captionData = JSON.parse(fs.readFileSync(latestCaptionFile, 'utf-8'));

async function renderInstagramReel() {
  try {
    const videoPath = path.join(outputDir, `${path.basename(latestCaptionFile, '.json')}_reel.mp4`);

    console.log(`📹 Rendering Instagram Reel from: ${latestCaptionFile}`);

    await renderMedia({
      composition: InstagramReel,
      seriesData: captionData,
      output: videoPath,
      codec: 'h264',
      crf: 18,
      audioCodec: 'aac',
      videoBitrate: '3000k',
      audioBitrate: '128k',
    });

    console.log(`✅ Instagram Reel rendered: ${videoPath}`);
    console.log(`   Caption: ${captionData.caption?.substring(0, 100)}...`);
    console.log(`   Duration: 60 seconds`);
  } catch (error) {
    console.error('❌ Instagram rendering failed:', error);
    process.exit(1);
  }
}

function getLatestFile(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  if (!files.length) return null;
  return path.join(dir, files.sort().reverse()[0]);
}

renderInstagramReel();
