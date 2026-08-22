import { renderStill } from '@remotion/renderer';
import { SubstackHeader } from './compositions/SubstackHeader.js';
import fs from 'fs';
import path from 'path';

const outputDir = '../../output/substack-pending';
const latestDevotionFile = getLatestFile(outputDir);

if (!latestDevotionFile) {
  console.log('No Substack devotion found in output/substack-pending/');
  process.exit(0);
}

const devotionData = JSON.parse(fs.readFileSync(latestDevotionFile, 'utf-8'));

async function renderSubstackHeader() {
  try {
    const imagePath = path.join(outputDir, `${path.basename(latestDevotionFile, '.json')}_header.png`);

    console.log(`🖼️  Rendering Substack header image from: ${latestDevotionFile}`);

    await renderStill({
      composition: SubstackHeader,
      seriesData: devotionData,
      output: imagePath,
      imageFormat: 'png',
      envVariables: {},
    });

    console.log(`✅ Substack header rendered: ${imagePath}`);
    console.log(`   Title: ${devotionData.title}`);
    console.log(`   Size: 1200x630px`);
  } catch (error) {
    console.error('❌ Substack rendering failed:', error);
    process.exit(1);
  }
}

function getLatestFile(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  if (!files.length) return null;
  return path.join(dir, files.sort().reverse()[0]);
}

renderSubstackHeader();
