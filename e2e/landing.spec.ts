import { expect, test } from '@playwright/test';

test.describe('landing', () => {
  test('FR-3 shows four tiles laid out 2×2', async ({ page }) => {
    await page.goto('/');
    const tiles = page.locator('.tile');
    await expect(tiles).toHaveCount(4);
    const boxes = await Promise.all([0, 1, 2, 3].map(async (i) => (await tiles.nth(i).boundingBox())!));
    // Row 1: tiles 0,1 share a top; Row 2: tiles 2,3 share a top, below row 1.
    expect(Math.abs(boxes[0].y - boxes[1].y)).toBeLessThan(1);
    expect(Math.abs(boxes[2].y - boxes[3].y)).toBeLessThan(1);
    expect(boxes[2].y).toBeGreaterThan(boxes[0].y + boxes[0].height - 1);
    // Columns line up and tiles meet the 44px touch-target minimum (NFR-4).
    expect(Math.abs(boxes[0].x - boxes[2].x)).toBeLessThan(1);
    for (const b of boxes) expect(Math.min(b.width, b.height)).toBeGreaterThanOrEqual(44);
  });

  test('FR-4 a tile opens its stub screen and Back returns', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Action 2/ }).click();
    await expect(page).toHaveURL(/\/action\/2$/);
    await expect(page.getByRole('heading', { name: 'Action 2' })).toBeVisible();
    await page.getByRole('link', { name: 'Back' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('.tile')).toHaveCount(4);
  });

  test('FR-4 deep link to a stub then Back goes home', async ({ page }) => {
    await page.goto('/action/4');
    await expect(page.getByRole('heading', { name: 'Action 4' })).toBeVisible();
    await page.getByRole('link', { name: 'Back' }).click();
    await expect(page.locator('.tile')).toHaveCount(4);
  });
});
