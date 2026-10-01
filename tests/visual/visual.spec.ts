import { test, expect } from '@playwright/test';

test.describe('Visual regression @visual', () => {

  test('home page matches baseline', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.02,   // tolerate small rendering differences
    });
  });

  test('navigation bar component matches baseline', async ({ page }) => {
    await page.goto('/');
    const navbar = page.locator('nav').first();
    await expect(navbar).toHaveScreenshot('navbar.png');
  });

  test('footer component matches baseline', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer').first();
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toHaveScreenshot('footer.png');
  });
});