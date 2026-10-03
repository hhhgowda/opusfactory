import { expect, test } from '@playwright/test';

test('FR-7 landscape shows the rotate overlay; portrait restores the app', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.tile')).toHaveCount(4);
  const overlay = page.locator('.rotate-overlay');
  await expect(overlay).toBeHidden();

  const { width, height } = page.viewportSize()!;
  await page.setViewportSize({ width: height, height: width }); // rotate to landscape
  await expect(overlay).toBeVisible();
  await expect(overlay).toContainText('rotate');
  await expect(page.locator('#app')).toHaveCSS('visibility', 'hidden');

  await page.setViewportSize({ width, height }); // back to portrait
  await expect(overlay).toBeHidden();
  await expect(page.locator('#app')).toHaveCSS('visibility', 'visible');
});
