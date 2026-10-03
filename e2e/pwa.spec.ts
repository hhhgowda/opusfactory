import { expect, test } from '@playwright/test';

test('FR-1 manifest is linked and declares portrait standalone with icons', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  expect(href).toBeTruthy();
  const manifest = await (await request.get(href!)).json();
  expect(manifest).toMatchObject({ display: 'standalone', orientation: 'portrait' });
  const sizes = manifest.icons.map((i: { sizes: string }) => i.sizes);
  expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
  expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === 'maskable')).toBe(true);
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1);
});

test('FR-2 app shell loads offline after first visit', async ({ page, context, browserName }) => {
  test.skip(browserName === 'webkit', 'Playwright WebKit does not support service workers');
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
  });
  await page.reload(); // let the SW control the page
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('.tile')).toHaveCount(4);
});

test('FR-18 section grids and detail screens open offline after first visit', async ({
  page,
  context,
  browserName,
}) => {
  test.skip(browserName === 'webkit', 'Playwright WebKit does not support service workers');
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await context.setOffline(true);
  await page.goto('/learn/consonants'); // navigation fallback + precached lazy chunks
  await expect(page.getByRole('link', { name: 'ಕ, ka' })).toBeVisible();
  await page.getByRole('link', { name: 'ಕ, ka' }).click();
  await expect(page.getByTestId('glyph')).toHaveText('ಕ');
  await page.goto('/learn/words/mango');
  await expect(page.getByTestId('glyph')).toHaveText('ಮಾವಿನಹಣ್ಣು');
});
