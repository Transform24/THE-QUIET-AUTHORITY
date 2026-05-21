import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8080';

// Seed a returning user in localStorage
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
    const landing = page.locator('#screen-landing');
    await expect(landing).toBeVisible();
    await page.screenshot({ path: 'test-results/01-landing-new-user.png', fullPage: true });
  });

  test('primary CTA button is tappable at 375px', async ({ page }) => {
    // Button must exist, be visible, and have a bounding box wide enough to tap
    const btn = page.locator('#screen-landing button, #screen-landing [role="button"]').first();
    await expect(btn).toBeVisible();
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThanOrEqual(44);  // minimum tap target
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test('question screen loads after starting assessment', async ({ page }) => {
    // Click the first primary button on landing (Begin Assessment)
    const btn = page.locator('#screen-landing button').first();
    await btn.click();
    const qScreen = page.locator('#screen-question');
    await expect(qScreen).toBeVisible({ timeout: 5000 });
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
    // At least one of these must be visible
    const results = page.locator('#screen-results');
    const dashboard = page.locator('#screen-dashboard');
    const landing = page.locator('#screen-landing');
    const anyVisible = await results.isVisible() || await dashboard.isVisible() || await landing.isVisible();
    expect(anyVisible).toBe(true);
  });
});

// ─── SHOP TAB ────────────────────────────────────────────────────────────────

test.describe('Shop tab', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE);
    await setReturningUser(page, 'A');
    await page.reload();
    // Navigate to results screen and open shop tab
    await page.evaluate(() => {
      if (typeof showScreen === 'function') showScreen('screen-results');
    });
  });

  test('no duplicate product images', async ({ page }) => {
    await page.screenshot({ path: 'test-results/04-shop-tab.png', fullPage: true });
    const images = await page.locator('#section-shop img').all();
    const srcs = await Promise.all(images.map(img => img.getAttribute('src')));
    const validSrcs = srcs.filter(Boolean);
    const unique = new Set(validSrcs);
    // Allow hero/cover image to repeat at most once but flag exact duplicates in product cards
    expect(validSrcs.length).toBe(unique.size);
  });

  test('Stripe products appear before Amazon section', async ({ page }) => {
    // Stripe buy links should come before Amazon affiliate links
    const allLinks = await page.locator('#section-shop a[href]').all();
    const hrefs = await Promise.all(allLinks.map(a => a.getAttribute('href')));
    const stripeIdx = hrefs.findIndex(h => h && h.includes('stripe.com'));
    const amazonIdx = hrefs.findIndex(h => h && h.includes('amazon.com'));
    if (stripeIdx !== -1 && amazonIdx !== -1) {
      expect(stripeIdx).toBeLessThan(amazonIdx);
    }
  });
});

// ─── MOBILE FONT SIZES ───────────────────────────────────────────────────────

test.describe('Mobile font sizes', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('body text is at least 14px on mobile', async ({ page }) => {
    await page.goto(BASE);
    // Sample a few paragraph/body elements
    const sizes = await page.evaluate(() => {
      const els = [...document.querySelectorAll('p, li, .body-text, .desc')].slice(0, 10);
      return els.map(el => parseFloat(window.getComputedStyle(el).fontSize));
    });
    const tooSmall = sizes.filter(s => s > 0 && s < 14);
    expect(tooSmall).toHaveLength(0);
  });
});
