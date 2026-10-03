import { expect, test } from '@playwright/test';

test('FR-5 render crash shows the failure shell with Reload', async ({ page }) => {
  await page.goto('/?__crash=1');
  const shell = page
    .getByRole('alert')
    .filter({ has: page.getByRole('heading', { name: 'Something went wrong' }) });
  await expect(shell).toBeVisible();
  await expect(page.getByRole('button', { name: 'Reload' })).toBeVisible();
});

test('FR-6 missing IndexedDB shows the storage failure shell', async ({ page }) => {
  await page.goto('/?__nodb=1');
  await expect(page.getByRole('heading', { name: 'Storage unavailable' })).toBeVisible();
});

test('FR-5 Reload recovers once the cause is gone', async ({ page }) => {
  await page.goto('/?__nodb=1');
  await page.evaluate(() => history.replaceState(null, '', '/'));
  await page.getByRole('button', { name: 'Reload' }).click();
  await expect(page.locator('.tile')).toHaveCount(4);
});
