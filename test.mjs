import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:8080';
let passed = 0;
let failed = 0;

function ok(label) { console.log(`  ✓ ${label}`); passed++; }
function fail(label, err) { console.error(`  ✗ ${label}: ${err}`); failed++; }

async function assert(label, fn) {
  try { await fn(); ok(label); }
  catch(e) { fail(label, e.message); }
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

// Capture page errors
const pageErrors = [];
page.on('pageerror', e => pageErrors.push(e.message));
page.on('console', msg => { if (msg.type() === 'error') pageErrors.push(msg.text()); });

// ── 1. LANDING SCREEN ──────────────────────────────────────────────────────
console.log('\n[Landing Screen]');
await page.goto(BASE, { waitUntil: 'load' });
await page.waitForTimeout(800);

await assert('landing screen is active', async () => {
  const el = await page.$('#screen-landing.active');
  if (!el) throw new Error('screen-landing not active');
});

await assert('Begin the Assessment button exists', async () => {
  const btn = await page.$('button[onclick="startAssessment()"]');
  if (!btn) throw new Error('button not found');
});

// ── 2. QUESTION SCREEN ─────────────────────────────────────────────────────
console.log('\n[Question Screen — 8 questions]');

// Call startAssessment() directly via JS to avoid click-on-span issues
await page.evaluate(() => startAssessment());
await page.waitForTimeout(300);

await assert('question screen is active', async () => {
  const el = await page.$('#screen-question.active');
  if (!el) {
    if (pageErrors.length) throw new Error('page errors: ' + pageErrors.join('; '));
    throw new Error('screen-question not active');
  }
});

await assert('question 1 of 8 shown', async () => {
  const text = await page.$eval('#qNum', el => el.textContent);
  if (!text.includes('1')) throw new Error(`unexpected: ${text}`);
});

// Answer all 8 questions by always picking the first option
for (let q = 0; q < 8; q++) {
  await assert(`Q${q + 1}: options rendered`, async () => {
    await page.waitForSelector('#qOptions .opt', { timeout: 3000 });
    const opts = await page.$$('#qOptions .opt');
    if (!opts.length) throw new Error('no options');
  });

  // Click first option via JS to avoid pointer-events issues
  await page.evaluate(() => selectAnswer(0));
  await page.waitForTimeout(100);

  await assert(`Q${q + 1}: Continue button enabled`, async () => {
    const btn = await page.$('#btnNext.on');
    if (!btn) throw new Error('btnNext not enabled');
  });

  if (q < 7) {
    await page.evaluate(() => nextQ());
    await page.waitForTimeout(150);
  }
}

// ── 3. EMAIL SCREEN ────────────────────────────────────────────────────────
console.log('\n[Email Screen]');
// After last question, calling nextQ() navigates to email
await page.evaluate(() => nextQ());
await page.waitForTimeout(300);

await assert('email screen is active', async () => {
  const el = await page.$('#screen-email.active');
  if (!el) throw new Error('screen-email not active');
});

await assert('name input exists', async () => {
  if (!await page.$('#inputName')) throw new Error('not found');
});

await assert('email input exists', async () => {
  if (!await page.$('#inputEmail')) throw new Error('not found');
});

// Validation: submit without filling
await assert('submit blocked when fields empty', async () => {
  await page.evaluate(() => {
    document.getElementById('inputName').value = '';
    document.getElementById('inputEmail').value = '';
  });
  await page.evaluate(() => submitAndReveal());
  await page.waitForTimeout(200);
  const still = await page.$('#screen-email.active');
  if (!still) throw new Error('should stay on email screen');
});

// Intercept Formspree
await page.route('https://formspree.io/**', r => r.fulfill({ status: 200, body: '{"ok":true}' }));

await page.fill('#inputName', 'Grace');
await page.fill('#inputEmail', 'grace@test.com');
await page.evaluate(() => submitAndReveal());
await page.waitForSelector('#screen-reveal.active', { timeout: 8000 });

// ── 4. REVEAL SCREEN ───────────────────────────────────────────────────────
console.log('\n[Reveal Screen]');

await assert('reveal screen is active', async () => {
  const el = await page.$('#screen-reveal.active');
  if (!el) throw new Error('screen-reveal not active');
});

await assert('profile name populated in #revealName', async () => {
  const text = await page.$eval('#revealName', el => el.textContent.trim());
  if (!text) throw new Error('revealName is empty');
  console.log(`    profile: "${text}"`);
});

await assert('match bars rendered (4)', async () => {
  await page.waitForTimeout(400);
  const bars = await page.$$('.match-bar-fill');
  if (bars.length < 4) throw new Error(`expected 4 bars, got ${bars.length}`);
});

await assert('"Enter My Sanctuary" button visible', async () => {
  const btn = await page.$('button[onclick="enterResults()"]');
  if (!btn) throw new Error('button not found');
});

// ── 5. RESULTS SCREEN ─────────────────────────────────────────────────────
console.log('\n[Results Screen]');
await page.evaluate(() => enterResults());
await page.waitForTimeout(400);

await assert('results screen is active', async () => {
  const el = await page.$('#screen-results.active');
  if (!el) throw new Error('screen-results not active');
});

await assert('sticky nav visible', async () => {
  const nav = await page.$('#stickyNav.visible');
  if (!nav) throw new Error('#stickyNav.visible not found');
});

await assert('tab bar visible', async () => {
  const tb = await page.$('#tabBar.visible');
  if (!tb) throw new Error('#tabBar.visible not found');
});

await assert('download button present', async () => {
  const btn = await page.$('button[onclick="downloadProfile()"]');
  if (!btn) throw new Error('not found');
});

// ── 6. DASHBOARD ───────────────────────────────────────────────────────────
console.log('\n[Dashboard Tab]');
await page.evaluate(() => showDashboard());
await page.waitForTimeout(400);

await assert('dashboard screen is active', async () => {
  const el = await page.$('#screen-dashboard.active');
  if (!el) throw new Error('screen-dashboard not active');
});

await assert('profile name shown in dashboard', async () => {
  const text = await page.$eval('#dashProfileName', el => el.textContent.trim());
  if (!text) throw new Error('dashProfileName empty');
  console.log(`    dashboard profile: "${text}"`);
});

await assert('7 day-circles rendered', async () => {
  const circles = await page.$$('.day-circle');
  if (circles.length !== 7) throw new Error(`expected 7, got ${circles.length}`);
});

await assert('day circle toggles done state', async () => {
  await page.evaluate(() => toggleDay(0));
  await page.waitForTimeout(300);
  const circles = await page.$$('.day-circle');
  const cls = await circles[0].getAttribute('class');
  if (!cls.includes('done')) throw new Error('day circle did not become done');
});

// ── 7. LOCALSTORAGE ────────────────────────────────────────────────────────
console.log('\n[LocalStorage]');

await assert('tqa_profile saved with correct shape', async () => {
  const raw = await page.evaluate(() => localStorage.getItem('tqa_profile'));
  if (!raw) throw new Error('tqa_profile not found');
  const parsed = JSON.parse(raw);
  if (!parsed.profile || !['A','B','C','D'].includes(parsed.profile)) throw new Error(`bad profile: ${JSON.stringify(parsed)}`);
  if (parsed.name !== 'Grace') throw new Error(`bad name: ${parsed.name}`);
  if (parsed.email !== 'grace@test.com') throw new Error(`bad email: ${parsed.email}`);
});

await assert('tqa_days saved as array', async () => {
  const raw = await page.evaluate(() => localStorage.getItem('tqa_days'));
  if (!raw) throw new Error('tqa_days not found');
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr)) throw new Error('not an array');
});

// ── 8. START OVER ──────────────────────────────────────────────────────────
console.log('\n[Start Over]');

await assert('startOver clears localStorage and shows landing', async () => {
  await page.evaluate(() => startOver());
  await page.waitForTimeout(400);

  const profile  = await page.evaluate(() => localStorage.getItem('tqa_profile'));
  const days     = await page.evaluate(() => localStorage.getItem('tqa_days'));
  const sessions = await page.evaluate(() => localStorage.getItem('tqa_sessions'));
  if (profile || days || sessions) throw new Error('localStorage not fully cleared');

  const el = await page.$('#screen-landing.active');
  if (!el) throw new Error('landing not shown after startOver');
});

// ── 9. RESUME BANNER ───────────────────────────────────────────────────────
console.log('\n[Resume Banner]');

await assert('resume banner hidden when no profile saved', async () => {
  const el = await page.$('#resumeBanner');
  const display = await page.evaluate(() => {
    const b = document.getElementById('resumeBanner');
    return b ? getComputedStyle(b).display : 'none';
  });
  if (display !== 'none') throw new Error(`resume banner display="${display}" should be "none"`);
});

// ── PAGE ERRORS ────────────────────────────────────────────────────────────
if (pageErrors.length) {
  console.log('\n[Page Errors Detected]');
  pageErrors.forEach(e => console.error('  !', e));
}

// ── SUMMARY ────────────────────────────────────────────────────────────────
await browser.close();
console.log(`\n${'─'.repeat(44)}`);
console.log(`  ${passed} passed  |  ${failed} failed`);
console.log('─'.repeat(44));
if (failed > 0) process.exit(1);
