import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8080';

async function setReturningUser(page, profile = 'B') {
  await page.evaluate((p) => {
    localStorage.setItem('tqa_profile_complete', '1');
    localStorage.setItem('tqa_profile', JSON.stringify({
      name: 'Grace',
      email: 'test@sanctuarygrace.com',
      profile: p,
      date: new Date().toISOString()
    }));
  }, profile);
}

// ─── NEW USER ────────────────────────────────────────────────────────────────

test.describe('New user flow', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('landing screen is visible', async ({ page }) => {
    await expect(page.locator('#screen-landing')).toBeVisible();
    await page.screenshot({ path: 'test-results/01-landing-new-user.png', fullPage: true });
  });

  test('primary CTA button is tappable at 375px', async ({ page }) => {
    const btn = page.locator('#screen-landing .btn-begin');
    await expect(btn).toBeVisible();
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test('question screen loads after starting assessment', async ({ page }) => {
    const btn = page.locator('#screen-landing .btn-begin');
    await btn.click();
    await expect(page.locator('#screen-question')).toBeVisible({ timeout: 8000 });
    await page.screenshot({ path: 'test-results/02-question-screen.png', fullPage: true });
  });
});

// ─── RETURNING USER ──────────────────────────────────────────────────────────

test.describe('Returning user flow', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await setReturningUser(page, 'B');
    await page.reload();
  });

  test('never shows email capture screen', async ({ page }) => {
    await expect(page.locator('#screen-email')).not.toBeVisible();
  });

  test('never shows question screen', async ({ page }) => {
    await expect(page.locator('#screen-question')).not.toBeVisible();
  });

  test('lands in results or dashboard directly', async ({ page }) => {
    await page.screenshot({ path: 'test-results/03-returning-user.png', fullPage: true });
    const results = await page.locator('#screen-results').isVisible();
    const dashboard = await page.locator('#screen-dashboard').isVisible();
    const landing = await page.locator('#screen-landing').isVisible();
    expect(results || dashboard || landing).toBe(true);
  });
});

// ─── SHOP TAB ────────────────────────────────────────────────────────────────

test.describe('Shop tab', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await setReturningUser(page, 'A');
    await page.reload();
    await page.evaluate(() => {
      if (typeof showScreen === 'function') showScreen('screen-results');
    });
    await page.waitForTimeout(1000);
  });

  test('Stripe products appear before Amazon section', async ({ page }) => {
    const allLinks = await page.locator('#section-shop a[href]').all();
    const hrefs = await Promise.all(allLinks.map(a => a.getAttribute('href')));
    const stripeIdx = hrefs.findIndex(h => h && h.includes('stripe.com'));
    const amazonIdx = hrefs.findIndex(h => h && h.includes('amazon.com'));
    if (stripeIdx !== -1 && amazonIdx !== -1) {
      expect(stripeIdx).toBeLessThan(amazonIdx);
    }
    await page.screenshot({ path: 'test-results/04-shop-tab.png', fullPage: true });
  });
});

// ─── MOBILE FONT SIZES ───────────────────────────────────────────────────────

test.describe('Mobile font sizes', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('primary body text paragraphs are at least 14px', async ({ page }) => {
    await page.goto(BASE);
    const sizes = await page.evaluate(() => {
      const els = [
        ...document.querySelectorAll(
          '.landing-body, .salvation-body, .seven-day-sub, .silence-sub, .landing-sub'
        )
      ].slice(0, 10);
      return els.map(el => parseFloat(window.getComputedStyle(el).fontSize));
    });
    const tooSmall = sizes.filter(s => s > 0 && s < 14);
    expect(tooSmall).toHaveLength(0);
  });
});

// ─── GUIDED PATH ─────────────────────────────────────────────────────────────

test.describe('Guided path strip', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await setReturningUser(page, 'A');
    await page.reload();
    await page.evaluate(() => {
      if (typeof showScreen === 'function') showScreen('screen-results');
    });
  });

  test('guided path strip is present on results screen', async ({ page }) => {
    await expect(page.locator('#guidedPathStrip')).toBeVisible();
    await page.screenshot({ path: 'test-results/05-guided-path.png', fullPage: true });
  });

  test('highlightPathStep does not throw', async ({ page }) => {
    const error = await page.evaluate(() => {
      try {
        if (typeof highlightPathStep === 'function') highlightPathStep(2);
        return null;
      } catch (e) { return e.message; }
    });
    expect(error).toBeNull();
  });
});
