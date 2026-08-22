import { renderStill } from '@remotion/renderer';
import { PinterestPin } from './compositions/PinterestPin.js';
import fs from 'fs';
import path from 'path';

const outputDir = '../../output/pinterest-pending';
const latestCaptionFile = getLatestFile(outputDir);

if (!latestCaptionFile) {
  console.log('No Pinterest caption found in output/pinterest-pending/');
  process.exit(0);
}

const captionData = JSON.parse(fs.readFileSync(latestCaptionFile, 'utf-8'));

async function renderPinterestPin() {
  try {
    const imagePath = path.join(outputDir, `${path.basename(latestCaptionFile, '.json')}_pin.png`);

    console.log(`📌 Rendering Pinterest pin from: ${latestCaptionFile}`);

    await renderStill({
      composition: PinterestPin,
      seriesData: captionData,
      output: imagePath,
      imageFormat: 'png',
      envVariables: {},
    });

    console.log(`✅ Pinterest pin rendered: ${imagePath}`);
    console.log(`   Caption: ${captionData.caption?.substring(0, 100)}...`);
    console.log(`   Size: 1000x1500px`);
  } catch (error) {
    console.error('❌ Pinterest rendering failed:', error);
    process.exit(1);
  }
}

function getLatestFile(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  if (!files.length) return null;
  return path.join(dir, files.sort().reverse()[0]);
}

renderPinterestPin();
