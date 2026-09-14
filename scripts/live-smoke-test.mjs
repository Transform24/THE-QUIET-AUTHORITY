// Live smoke test for sanctuary-grace.com
//
// Runs the same checks a human would do by clicking through the site by hand:
// every gate loads, has its audio, and points at the correct live Stripe
// purchase link; the foyer links to Daily Sanctuary; Daily Sanctuary has all
// four moments and bridges into Gate One. Content that only appears after a
// purchase (gate6's closing invitation, etc.) is checked by simulating an
// already-verified visitor via localStorage, the same pattern the site
// itself uses to unlock that content.
//
// Usage: BASE_URL=https://sanctuary-grace.com node scripts/live-smoke-test.mjs
// Defaults to https://sanctuary-grace.com if BASE_URL is not set.

import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'https://sanctuary-grace.com';
const PASS = '\x1b[32m✓\x1b[0m';
const FAIL = '\x1b[31m✗\x1b[0m';
let passed = 0, failed = 0;
const failures = [];
function pass(msg) { console.log(`  ${PASS} ${msg}`); passed++; }
function fail(msg) { console.log(`  ${FAIL} ${msg}`); failed++; failures.push(msg); }

// The live, real Stripe Payment Links currently wired into each gate.
// Sourced directly from the committed HTML, not guessed -- if a gate's
// buy button ever points somewhere else, this test is what catches it.
const GATES = [
  { n: 1, file: 'gate-one.html',   audio: 'gate-1-voice.mp3', stripe: 'eVqfZh8Ba8Od0Es8YGcQU0w' },
  { n: 2, file: 'gate-two.html',   audio: 'gate-2-voice.mp3', stripe: '6oU3cv8Bac0pcna0sacQU0x' },
  { n: 3, file: 'gate-three.html', audio: 'gate-3-voice.mp3', stripe: '9B600j9FefcB0EscaScQU0y' },
  { n: 4, file: 'gate-four.html',  audio: 'gate-4-voice.mp3', stripe: 'dRmdR9g3CfcB72Qgr8cQU0z' },
  { n: 5, file: 'gate-five.html',  audio: 'gate-5-voice.mp3', stripe: '6oU00j4kU9Sh3QE7UCcQU0A' },
  { n: 6, file: 'gate-six.html',   audio: 'gate-6-voice.mp3', stripe: 'eVq8wP8Ba0hHgDqej0cQU0B' },
];

const DAILY_AUDIO = ['daily-morning.mp3', 'daily-midday.mp3', 'daily-drivehome.mp3', 'daily-bedside.mp3'];

const RETRIES = Number(process.env.SMOKE_RETRIES || 5);
const DELAY_MS = Number(process.env.SMOKE_RETRY_DELAY_MS || 15000);

async function loadWithRetry(page, path, { retries = RETRIES, delayMs = DELAY_MS } = {}) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const resp = await page.goto(`${BASE}${path}`, { waitUntil: 'load', timeout: 20000 });
      if (resp && resp.ok()) return resp;
      lastErr = new Error(`status ${resp && resp.status()}`);
    } catch (e) {
      lastErr = e;
    }
    if (i < retries - 1) await new Promise(r => setTimeout(r, delayMs));
  }
  throw lastErr;
}

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });

console.log(`\nRunning live smoke test against ${BASE}\n`);

// ── EACH GATE: loads, has its audio, has its correct Stripe link ──────────
for (const g of GATES) {
  console.log(`== gate-${g.n} (${g.file}) ==`);
  try {
    const page = await ctx.newPage();
    await loadWithRetry(page, `/${g.file}`);
    pass('loads');

    const audioCount = await page.locator('audio').count();
    if (audioCount > 0) {
      const src = await page.locator('audio').first().getAttribute('src').catch(() => null);
      (src && src.includes(g.audio)) ? pass(`audio src is ${g.audio}`) : fail(`unexpected audio src: ${src}`);
    } else {
      fail('no <audio> element found');
    }

    const stripeLinks = await page.locator(`a[href*="buy.stripe.com"]`).all();
    const hrefs = await Promise.all(stripeLinks.map(l => l.getAttribute('href')));
    hrefs.some(h => h && h.includes(g.stripe))
      ? pass('purchase button points to the correct live Stripe link')
      : fail(`expected Stripe link containing ${g.stripe}, found: ${hrefs.join(', ') || '(none)'}`);

    await page.close();
  } catch (e) {
    fail(`gate-${g.n} threw: ${e.message}`);
  }
  console.log('');
}

// ── GATE SIX: closing content visible once "purchased" ────────────────────
console.log('== gate-six.html, simulating an already-purchased visitor ==');
try {
  const page = await ctx.newPage();
  await loadWithRetry(page, '/gate-six.html');
  await page.evaluate(() => localStorage.setItem('gate6_verified', '1'));
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(500);
  const toolkitVisible = await page.locator('#toolkit-section').isVisible().catch(() => false);
  toolkitVisible ? pass('gated content unlocks once gate6_verified is set') : fail('gated content still hidden for a verified buyer');
  const bodyText = await page.locator('body').innerText();
  /share your story|new name/i.test(bodyText)
    ? pass('closing share-your-story invitation present')
    : fail('closing invitation text not found even when unlocked');
  await page.close();
} catch (e) {
  fail(`gate-six unlocked check threw: ${e.message}`);
}
console.log('');

// ── DAILY SANCTUARY ─────────────────────────────────────────────────────
console.log('== daily-sanctuary.html ==');
try {
  const page = await ctx.newPage();
  await loadWithRetry(page, '/daily-sanctuary.html');
  pass('loads');

  const srcs = await page.locator('audio').evaluateAll(els => els.map(e => e.getAttribute('src')));
  for (const expected of DAILY_AUDIO) {
    srcs.some(s => s && s.includes(expected)) ? pass(`has audio for ${expected}`) : fail(`missing audio for ${expected}`);
  }

  const gateOneLinks = await page.locator('a[href*="gate-one.html"]').count();
  gateOneLinks > 0 ? pass('closing bridge links into gate-one.html') : fail('no bridge link into gate-one.html found');

  const bodyText = await page.locator('body').innerText();
  /\$9/.test(bodyText) ? pass('page shows the $9 Gate One CTA framing') : fail('no "$9" CTA text found');

  await page.close();
} catch (e) {
  fail(`daily-sanctuary threw: ${e.message}`);
}
console.log('');

// ── FOYER ────────────────────────────────────────────────────────────────
console.log('== foyer.html ==');
try {
  const page = await ctx.newPage();
  await loadWithRetry(page, '/foyer.html');
  pass('loads');
  const dsLinks = await page.locator('a[href*="daily-sanctuary.html"]').count();
  dsLinks > 0 ? pass('has a door tile linking to daily-sanctuary.html') : fail('no link to daily-sanctuary.html found on foyer.html');
  await page.close();
} catch (e) {
  fail(`foyer threw: ${e.message}`);
}

await browser.close();

console.log(`\n${'='.repeat(50)}`);
console.log(`TOTAL: ${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.log('\nFAILURES:');
  failures.forEach(f => console.log(`  - ${f}`));
}
process.exit(failed > 0 ? 1 : 0);
