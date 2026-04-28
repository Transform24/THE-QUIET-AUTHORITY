// @ts-check
const { test, expect } = require('@playwright/test');

// ── helpers ──────────────────────────────────────────────────────────────────

/** Block external requests so tests never depend on Google, Stripe, etc. */
async function blockExternalRequests(page) {
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith('http://localhost')) return route.continue();
    const type = route.request().resourceType();
    if (type === 'fetch' || type === 'xhr') return route.fulfill({ status: 200, body: '{}' });
    return route.abort();
  });
}

/**
 * Answer all 8 questions using the same answer index (0–3), then confirm
 * the email gate is visible.
 * answerIdx 0 → profile A, 1 → B, 2 → C, 3 → D
 */
async function completeAllQuestions(page, answerIdx = 0) {
  for (let q = 0; q < 8; q++) {
    await expect(page.locator('#screen-question')).toBeVisible();
    const opts = page.locator('.opt');
    await opts.nth(answerIdx).click();
    await page.locator('#btnNext.on').click();
  }
  await expect(page.locator('#screen-email')).toBeVisible();
}

/** Fill the email gate and submit, landing on results. */
async function submitEmail(page, name = 'Test Grace', email = 'test@example.com') {
  await page.fill('#inputName', name);
  await page.fill('#inputEmail', email);
  await page.locator('#screen-email .btn-begin').click();
  await expect(page.locator('#screen-results')).toBeVisible();
}

// ── tests ─────────────────────────────────────────────────────────────────────

test.describe('Landing screen', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
  });

  test('shows landing screen on load', async ({ page }) => {
    await expect(page.locator('#screen-landing')).toBeVisible();
    await expect(page.locator('#screen-question')).not.toBeVisible();
  });

  test('displays ministry label and title', async ({ page }) => {
    await expect(page.locator('.ministry-label')).toContainText('Sanctuary Grace Ministry');
    await expect(page.locator('.landing-title')).toBeVisible();
  });

  test('Begin button navigates to questions', async ({ page }) => {
    await page.locator('.btn-begin').click();
    await expect(page.locator('#screen-question')).toBeVisible();
    await expect(page.locator('#qNum')).toContainText('QUESTION 1 OF 8');
  });

  test('soul counter is visible', async ({ page }) => {
    await expect(page.locator('.soul-counter')).toBeVisible();
    await expect(page.locator('#soulCount')).toBeVisible();
  });
});

test.describe('Questions flow', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
    await page.locator('.btn-begin').click();
  });

  test('first question renders with 4 options', async ({ page }) => {
    await expect(page.locator('#qTitle')).toBeVisible();
    await expect(page.locator('.opt')).toHaveCount(4);
  });

  test('Next button disabled until answer selected', async ({ page }) => {
    await expect(page.locator('#btnNext')).not.toHaveClass(/\bon\b/);
    await page.locator('.opt').first().click();
    await expect(page.locator('#btnNext')).toHaveClass(/\bon\b/);
  });

  test('progress dots advance', async ({ page }) => {
    await page.locator('.opt').first().click();
    await page.locator('#btnNext.on').click();
    await expect(page.locator('.dot.done')).toHaveCount(1);
    await expect(page.locator('#qNum')).toContainText('QUESTION 2 OF 8');
  });

  test('Back button returns to previous question', async ({ page }) => {
    await page.locator('.opt').first().click();
    await page.locator('#btnNext.on').click();
    await expect(page.locator('#qNum')).toContainText('QUESTION 2 OF 8');
    await page.locator('#btnBack').click();
    await expect(page.locator('#qNum')).toContainText('QUESTION 1 OF 8');
  });

  test('completing all 8 questions shows email gate', async ({ page }) => {
    await completeAllQuestions(page, 0);
  });
});

test.describe('Email gate', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
    await page.locator('.btn-begin').click();
    await completeAllQuestions(page, 0);
  });

  test('email gate visible with name and email fields', async ({ page }) => {
    await expect(page.locator('#inputName')).toBeVisible();
    await expect(page.locator('#inputEmail')).toBeVisible();
  });

  test('validation — empty submit does not advance', async ({ page }) => {
    await page.locator('#screen-email .btn-begin').click();
    await expect(page.locator('#screen-email')).toBeVisible();
    await expect(page.locator('#screen-results')).not.toBeVisible();
  });

  test('valid submit advances to results', async ({ page }) => {
    await submitEmail(page);
  });
});

test.describe('Profile A — The Striving Achiever', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
    await page.locator('.btn-begin').click();
    await completeAllQuestions(page, 0);
    await submitEmail(page);
  });

  test('profile name shown in results hero', async ({ page }) => {
    await expect(page.locator('#rName')).toContainText('The Striving Achiever');
  });

  test('profile badge visible', async ({ page }) => {
    await expect(page.locator('.r-badge').first()).toContainText('Silence Profile');
  });

  test('diagnosis text present', async ({ page }) => {
    await expect(page.locator('#rDiagnosis')).not.toBeEmpty();
  });

  test('scripture card visible', async ({ page }) => {
    await expect(page.locator('.scripture-card')).toBeVisible();
    await expect(page.locator('#rScripture')).not.toBeEmpty();
  });

  test('3 lessons rendered', async ({ page }) => {
    await expect(page.locator('#rLessons .lesson')).toHaveCount(3);
  });

  test('breakthrough box visible', async ({ page }) => {
    await expect(page.locator('.breakthrough-box')).toBeVisible();
  });

  test('7-day cards rendered', async ({ page }) => {
    await expect(page.locator('#dayCards .day-card')).toHaveCount(7);
  });

  test('sacred space grid has 4 cards', async ({ page }) => {
    await expect(page.locator('#sacredGrid .sacred-card')).toHaveCount(4);
  });

  test('confirmation banner shows name + email', async ({ page }) => {
    await expect(page.locator('#confirmBanner')).toBeVisible();
    await expect(page.locator('#confirmText')).toContainText('Test Grace');
  });
});

test.describe('Profile B — The Depleted Survivor', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
    await page.locator('.btn-begin').click();
    await completeAllQuestions(page, 1);
    await submitEmail(page, 'Grace B', 'b@example.com');
  });

  test('profile B name shown', async ({ page }) => {
    await expect(page.locator('#rName')).toContainText('The Depleted Survivor');
  });
});

test.describe('Profile C — The Guilty Giver', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
    await page.locator('.btn-begin').click();
    await completeAllQuestions(page, 2);
    await submitEmail(page, 'Grace C', 'c@example.com');
  });

  test('profile C name shown', async ({ page }) => {
    await expect(page.locator('#rName')).toContainText('The Guilty Giver');
  });
});

test.describe('Profile D — The Lost Wanderer', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
    await page.locator('.btn-begin').click();
    await completeAllQuestions(page, 3);
    await submitEmail(page, 'Grace D', 'd@example.com');
  });

  test('profile D name shown', async ({ page }) => {
    await expect(page.locator('#rName')).toContainText('The Lost Wanderer');
  });
});

test.describe('Day progress', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
    await page.locator('.btn-begin').click();
    await completeAllQuestions(page, 0);
    await submitEmail(page);
    // Clear previous localStorage state
    await page.evaluate(() => localStorage.clear());
    // Re-render to pick up cleared state
    await page.reload();
    // Re-run assessment after reload
    await blockExternalRequests(page);
    await page.locator('.btn-begin').click();
    await completeAllQuestions(page, 0);
    await submitEmail(page);
  });

  test('Day 1 card starts as available', async ({ page }) => {
    await expect(page.locator('#dayCards .day-card.available').first()).toBeVisible();
  });

  test('clicking Day 1 marks it complete', async ({ page }) => {
    await page.locator('#dayCards .day-card.available').first().click();
    await expect(page.locator('#dayCards .day-card.completed')).toHaveCount(1);
    await expect(page.locator('#dayCards .day-card.available')).toHaveCount(1);
  });

  test('localStorage key updated after day complete', async ({ page }) => {
    await page.locator('#dayCards .day-card.available').first().click();
    const stored = await page.evaluate(() => localStorage.getItem('tqa_days_A'));
    expect(JSON.parse(stored)).toContain(0);
  });
});

test.describe('Journal modal', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
    await page.locator('.btn-begin').click();
    await completeAllQuestions(page, 0);
    await submitEmail(page);
  });

  test('journal modal opens and accepts text', async ({ page }) => {
    await page.locator('.btn-session.gold').first().click();
    await expect(page.locator('#journalModal')).toBeVisible();
    await page.locator('#journalEntry').fill('This is my truth today.');
    await expect(page.locator('#journalEntry')).toHaveValue('This is my truth today.');
  });

  test('saving journal entry stores in localStorage', async ({ page }) => {
    await page.locator('.btn-session.gold').first().click();
    await page.locator('#journalEntry').fill('Sacred truth.');
    await page.locator('#journalModal button[onclick="saveJournalEntry()"]').click();
    await page.waitForTimeout(400);
    const stored = await page.evaluate(() => localStorage.getItem('tqa_journal'));
    const entries = JSON.parse(stored || '[]');
    expect(entries.length).toBeGreaterThan(0);
    expect(entries[0].text).toBe('Sacred truth.');
  });
});

test.describe('Thank-you screen', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
  });

  test('?ty=tqa shows thank-you screen with correct title', async ({ page }) => {
    await page.goto('/?ty=tqa');
    await expect(page.locator('#screen-thankyou')).toBeVisible();
    await expect(page.locator('#tyBadge')).toContainText('Spiritual Formation');
    await expect(page.locator('#tyTitle')).toBeVisible();
  });

  test('?ty=dw1 shows devotional week 1 badge', async ({ page }) => {
    await page.goto('/?ty=dw1');
    await expect(page.locator('#screen-thankyou')).toBeVisible();
    await expect(page.locator('#tyBadge')).toContainText('Devotional Series');
  });

  test('?ty=wa1 shows wall art badge', async ({ page }) => {
    await page.goto('/?ty=wa1');
    await expect(page.locator('#screen-thankyou')).toBeVisible();
    await expect(page.locator('#tyBadge')).toContainText('Fine Art Collection');
  });

  test('?ty=circle_basic shows Circle badge', async ({ page }) => {
    await page.goto('/?ty=circle_basic');
    await expect(page.locator('#screen-thankyou')).toBeVisible();
    await expect(page.locator('#tyBadge')).toContainText('Circle of Silence');
  });

  test('unknown ?ty param does not show thank-you screen', async ({ page }) => {
    await page.goto('/?ty=invalid_code');
    await expect(page.locator('#screen-landing')).toBeVisible();
    await expect(page.locator('#screen-thankyou')).not.toBeVisible();
  });

  test('sequence list renders for known product', async ({ page }) => {
    await page.goto('/?ty=tqa');
    await expect(page.locator('#tySequence')).toBeVisible();
    await expect(page.locator('#tySequenceList .ty-seq-item')).toHaveCount(5);
  });

  test('email capture block shown when no email known', async ({ page }) => {
    await page.goto('/?ty=cocoon');
    await expect(page.locator('#tyEmailBlock')).toBeVisible();
    await expect(page.locator('#tyDownloadBox')).not.toBeVisible();
  });

  test('back to profile button navigates to results', async ({ page }) => {
    await page.goto('/?ty=tqa');
    await page.locator('.btn-session.gold').first().click();
    await expect(page.locator('#screen-results')).toBeVisible();
  });
});

test.describe('Share button', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
    await page.locator('.btn-begin').click();
    await completeAllQuestions(page, 0);
    await submitEmail(page);
  });

  test('share button is present in results hero', async ({ page }) => {
    const shareBtn = page.locator('.r-hero .btn-session:not(.gold)');
    await expect(shareBtn).toBeVisible();
    await expect(shareBtn).toContainText('Share');
  });
});

test.describe('Navigation — Start Over', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
    await page.locator('.btn-begin').click();
    await completeAllQuestions(page, 0);
    await submitEmail(page);
  });

  test('"Begin Again" returns to landing', async ({ page }) => {
    await page.locator('.btn-circle-ghost').click();
    await expect(page.locator('#screen-landing')).toBeVisible();
  });
});

test.describe('Stripe buy buttons — links present', () => {
  test.beforeEach(async ({ page }) => {
    await blockExternalRequests(page);
    await page.goto('/');
    await page.locator('.btn-begin').click();
    await completeAllQuestions(page, 0);
    await submitEmail(page);
  });

  test('wall art buy button has Stripe href', async ({ page }) => {
    const btn = page.locator('#wa1BuyBtn');
    await expect(btn).toHaveAttribute('href', /buy\.stripe\.com/);
  });

  test('Circle Basic buy button has Stripe href', async ({ page }) => {
    const links = page.locator('a[href*="buy.stripe.com"]');
    await expect(links).toHaveCount.call(expect, await links.count());
    const hrefs = await links.evaluateAll(els => els.map(e => e.href));
    expect(hrefs.some(h => h.includes('4gMeVd5oYaWl'))).toBe(true);
  });

  test('Circle Pro buy button has Stripe href', async ({ page }) => {
    const links = page.locator('a[href*="buy.stripe.com"]');
    const hrefs = await links.evaluateAll(els => els.map(e => e.href));
    expect(hrefs.some(h => h.includes('5kQ14n6t27K9'))).toBe(true);
  });
});
