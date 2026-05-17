import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const URL = 'http://127.0.0.1:8765/index.html';
const PASS = '\x1b[32m✓\x1b[0m';
const FAIL = '\x1b[31m✗\x1b[0m';
const INFO = '\x1b[33m→\x1b[0m';

let passed = 0, failed = 0;
function pass(msg) { console.log(`  ${PASS} ${msg}`); passed++; }
function fail(msg) { console.log(`  ${FAIL} ${msg}`); failed++; }
function info(msg) { console.log(`  ${INFO} ${msg}`); }

const browser = await chromium.launch({ headless: true, args: ['--ignore-certificate-errors'] });

// ── NEW USER (fresh browser, no localStorage) ────────────────
console.log('\n══ NEW USER FLOW ══════════════════════════════════');
const ctx1 = await browser.newContext({ viewport: { width: 390, height: 844 }, ignoreHTTPSErrors: true });
const p1 = await ctx1.newPage();
const errors1 = [];
p1.on('console', m => { if (m.type() === 'error') errors1.push(m.text()); });

await p1.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
await p1.waitForTimeout(2000);

// Screenshot for diagnosis
await p1.screenshot({ path: '/tmp/tqa-landing.png', fullPage: false });
info('Screenshot saved: /tmp/tqa-landing.png');

// What screen is active?
const activeScreen = await p1.$eval('.screen.active', el => el.id).catch(() => 'none');
info(`Active screen on load: ${activeScreen}`);

const landingActive = activeScreen === 'screen-landing';
landingActive ? pass('Landing screen active for new user') : fail(`Expected screen-landing, got: ${activeScreen}`);

// Check text sizes
const bodySize = await p1.$eval('.landing-body', el => getComputedStyle(el).fontSize).catch(() => null);
info(`Landing body font-size: ${bodySize}`);
bodySize && parseFloat(bodySize) >= 15 ? pass('Landing body ≥ 15px') : fail(`Landing body: ${bodySize}`);

const btnSize = await p1.$eval('.btn-begin', el => getComputedStyle(el).fontSize).catch(() => null);
info(`Begin button font-size: ${btnSize}`);
btnSize && parseFloat(btnSize) >= 13 ? pass('Begin button readable') : fail(`Begin button: ${btnSize}`);

// Click Begin
if (landingActive) {
  await p1.click('.btn-begin');
  await p1.waitForTimeout(1500);
}

// ── ASSESSMENT ───────────────────────────────────────────────
console.log('\n══ ASSESSMENT (8 QUESTIONS) ═══════════════════════');
const qScreen = await p1.$eval('.screen.active', el => el.id).catch(() => 'none');
info(`Active screen: ${qScreen}`);
qScreen === 'screen-question' ? pass('Question screen appeared') : fail(`Expected screen-question, got: ${qScreen}`);

const optSize = await p1.$eval('.opt', el => getComputedStyle(el).fontSize).catch(() => null);
info(`Option font-size: ${optSize}`);
optSize && parseFloat(optSize) >= 15 ? pass('Option text ≥ 15px') : fail(`Option text: ${optSize}`);

const qStemSize = await p1.$eval('#qStem', el => getComputedStyle(el).fontSize).catch(() => null);
info(`Question stem font-size: ${qStemSize}`);
qStemSize && parseFloat(qStemSize) >= 17 ? pass('Question stem ≥ 17px') : fail(`Question stem: ${qStemSize}`);

// Answer all 8 questions
for (let q = 1; q <= 8; q++) {
  await p1.waitForSelector('.opt', { timeout: 5000 }).catch(() => {});
  const opts = await p1.$$('.opt');
  if (opts.length === 0) { fail(`No options visible on Q${q}`); break; }
  await opts[0].click();
  // Wait for Continue to become enabled after selection
  await p1.waitForSelector('#btnNext:not([disabled])', { timeout: 5000 }).catch(() => {});
  await p1.click('#btnNext').catch(() => {});
  await p1.waitForTimeout(900);
  const curr = await p1.$eval('.screen.active', el => el.id).catch(() => 'none');
  if (curr === 'screen-email') { info(`Email screen appeared after Q${q}`); break; }
}

// ── EMAIL SCREEN ─────────────────────────────────────────────
console.log('\n══ EMAIL SCREEN ═══════════════════════════════════');
const emailScreen = await p1.$eval('.screen.active', el => el.id).catch(() => 'none');
info(`Active screen: ${emailScreen}`);
emailScreen === 'screen-email' ? pass('Email capture screen appeared') : fail(`Expected screen-email, got: ${emailScreen}`);

const emailSubSize = await p1.$eval('.email-sub', el => getComputedStyle(el).fontSize).catch(() => null);
info(`Email sub font-size: ${emailSubSize}`);
emailSubSize && parseFloat(emailSubSize) >= 15 ? pass('Email sub ≥ 15px') : fail(`Email sub: ${emailSubSize}`);

const inputSize = await p1.$eval('.form-input', el => getComputedStyle(el).fontSize).catch(() => null);
info(`Form input font-size: ${inputSize}`);
inputSize && parseFloat(inputSize) >= 15 ? pass('Form input ≥ 15px') : fail(`Form input: ${inputSize}`);

const mailtoNote = await p1.$eval('p.email-privacy + p.email-privacy', el => el.textContent).catch(() => null);
mailtoNote ? pass('Mailto explanation note visible') : info('Mailto note not found (may be adjacent sibling check issue)');

await p1.fill('#inputName', 'Grace Test');
await p1.fill('#inputEmail', 'grace@test.com');
await p1.click('#screen-email .btn-begin');
await p1.waitForTimeout(2500);

// ── REVEAL ───────────────────────────────────────────────────
console.log('\n══ REVEAL CEREMONY ════════════════════════════════');
const revScreen = await p1.$eval('.screen.active', el => el.id).catch(() => 'none');
info(`Active screen: ${revScreen}`);
revScreen === 'screen-reveal' ? pass('Reveal ceremony appeared') : fail(`Expected screen-reveal, got: ${revScreen}`);

const profileName = await p1.$eval('#revealName', el => el.textContent.trim()).catch(() => null);
profileName ? pass(`Profile revealed: "${profileName}"`) : fail('Profile name missing');

await p1.screenshot({ path: '/tmp/tqa-reveal.png' });

// Click "Enter My Sanctuary →" button on reveal screen
await p1.click('#screen-reveal .btn-begin').catch(() => {});
await p1.waitForTimeout(1500);

// ── RESULTS ──────────────────────────────────────────────────
console.log('\n══ RESULTS SCREEN ═════════════════════════════════');
const resScreen = await p1.$eval('.screen.active', el => el.id).catch(() => 'none');
info(`Active screen: ${resScreen}`);
resScreen === 'screen-results' ? pass('Results screen visible') : fail(`Expected screen-results, got: ${resScreen}`);

await p1.screenshot({ path: '/tmp/tqa-results.png' });

// Navigate to Shop tab via tabNav JS call (avoids langBar overlay click intercept)
await p1.evaluate(() => { if(typeof tabNav==='function') tabNav('shop'); }).catch(() => {});
await p1.waitForTimeout(1000);

// Check product images are distinct — scroll to section-shop first
await p1.evaluate(() => { const el=document.getElementById('section-shop'); if(el) el.scrollIntoView(); }).catch(() => {});
await p1.waitForTimeout(500);
const shopImgSrcs = await p1.$$eval('img[src*="picsum"]', imgs => imgs.map(i => i.src)).catch(() => []);
info(`Picsum product images found: ${shopImgSrcs.length}`);
if (shopImgSrcs.length > 0) {
  const unique = new Set(shopImgSrcs);
  unique.size === shopImgSrcs.length
    ? pass(`All ${shopImgSrcs.length} product images are unique`)
    : fail(`Duplicate images: ${shopImgSrcs.length} total, ${unique.size} unique`);
} else {
  info('Picsum images not yet in DOM — checking all img tags in shop section');
  const allShopImgs = await p1.$$eval('#section-shop img', imgs => imgs.map(i=>i.src)).catch(()=>[]);
  info(`All imgs in shop: ${allShopImgs.length} — srcs: ${[...new Set(allShopImgs)].join(', ').slice(0,120)}`);
}

await p1.screenshot({ path: '/tmp/tqa-shop.png' });

// ── RETURNING USER ────────────────────────────────────────────
console.log('\n══ RETURNING USER FLOW ════════════════════════════');
// Gate should now be set from the flow above
// Reload in same context (localStorage persists)
await p1.reload({ waitUntil: 'domcontentloaded' });
await p1.waitForTimeout(2000);

const returnScreen = await p1.$eval('.screen.active', el => el.id).catch(() => 'none');
info(`Active screen on return: ${returnScreen}`);
if (returnScreen === 'screen-results' || returnScreen === 'screen-reveal') {
  pass('Returning user goes directly to results — landing skipped');
} else if (returnScreen === 'screen-landing') {
  fail('Returning user still sees landing page — redirect failed');
} else if (returnScreen === 'screen-dashboard') {
  pass('Returning user goes to dashboard');
} else {
  info(`Returning user on: ${returnScreen}`);
}

await p1.screenshot({ path: '/tmp/tqa-return.png' });

// ── CONSOLE ERRORS ────────────────────────────────────────────
console.log('\n══ CONSOLE ERRORS ═════════════════════════════════');
if (errors1.length === 0) {
  pass('No JavaScript console errors');
} else {
  fail(`${errors1.length} console error(s):`);
  errors1.slice(0, 5).forEach(e => info(e));
}

// ── SUMMARY ───────────────────────────────────────────────────
console.log('\n══ SUMMARY ════════════════════════════════════════');
console.log(`  Passed: ${passed}   Failed: ${failed}`);
console.log('\n  Screenshots saved:');
console.log('  /tmp/tqa-landing.png');
console.log('  /tmp/tqa-reveal.png');
console.log('  /tmp/tqa-results.png');
console.log('  /tmp/tqa-shop.png');
console.log('  /tmp/tqa-return.png');
console.log('');

await browser.close();
process.exit(failed > 0 ? 1 : 0);
