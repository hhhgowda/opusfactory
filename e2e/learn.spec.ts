import { expect, type Page, test } from '@playwright/test';

/** The element's box lies fully inside the viewport (NFR-9/NFR-13: nothing cut off). */
async function expectInsideViewport(page: Page, selector: string) {
  const box = await page.locator(selector).boundingBox();
  const vp = page.viewportSize();
  expect(box && vp).toBeTruthy();
  if (!box || !vp) return;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(vp.height + 1);
}

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
}

test.describe('learn', () => {
  test('FR-11 FR-16 tile → grid → card → detail → Back → grid → Back → landing', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Consonants/ }).click();
    await expect(page).toHaveURL(/\/learn\/consonants$/);
    await expect(page.getByRole('heading', { level: 1, name: 'ವ್ಯಂಜನಗಳು' })).toBeVisible();
    await expect(page.locator('.card')).toHaveCount(34);

    await page.getByRole('link', { name: 'ಕ, ka' }).click();
    await expect(page).toHaveURL(/\/learn\/consonants\/ka$/);
    await expect(page.getByTestId('glyph')).toHaveText('ಕ');
    await expect(page.getByTestId('caption')).toHaveText('ka');

    await page.getByRole('link', { name: 'Back' }).click();
    await expect(page).toHaveURL(/\/learn\/consonants$/);
    await page.getByRole('link', { name: 'Back' }).click();
    await expect(page.locator('.tile')).toHaveCount(4);
  });

  test('FR-16 browser back from a detail returns to the grid', async ({ page }) => {
    await page.goto('/learn/vowels');
    await page.getByRole('link', { name: 'ಔ, au' }).click();
    await expect(page.getByTestId('glyph')).toHaveText('ಔ');
    await page.goBack();
    await expect(page).toHaveURL(/\/learn\/vowels$/);
    await expect(page.locator('.card')).toHaveCount(15);
  });

  test('FR-16 deep link to a detail, then Back goes to its section', async ({ page }) => {
    await page.goto('/learn/numbers/9');
    await expect(page.getByTestId('glyph')).toHaveText('೯');
    await expect(page.getByTestId('caption')).toHaveText('ಒಂಬತ್ತು · ombattu · 9');
    await page.getByRole('link', { name: 'Back' }).click();
    await expect(page).toHaveURL(/\/learn\/numbers$/);
  });

  test('FR-17 unknown section and item show Not found', async ({ page }) => {
    await page.goto('/learn/vowels/zz');
    await expect(page.getByRole('heading', { name: 'Not found' })).toBeVisible();
    await page.goto('/action/1');
    await expect(page.getByRole('heading', { name: 'Not found' })).toBeVisible();
  });

  test('NFR-9 tall letters and the longest word fit on the detail screen', async ({ page }) => {
    for (const url of ['/learn/vowels/au', '/learn/vowels/ru', '/learn/words/mango', '/learn/numbers/10']) {
      await page.goto(url);
      await expect(page.getByTestId('glyph')).toBeVisible();
      await expectInsideViewport(page, '[data-testid="glyph"]');
      await expectInsideViewport(page, '[data-testid="caption"]');
      await expectNoHorizontalScroll(page);
    }
  });

  test.describe('at 320 px wide', () => {
    test.use({ viewport: { width: 320, height: 640 } });

    test('NFR-13 grids fit without horizontal scroll and cards stay ≥ 44 px', async ({ page }) => {
      for (const section of ['vowels', 'consonants', 'numbers', 'words']) {
        await page.goto(`/learn/${section}`);
        await expect(page.locator('.card').first()).toBeVisible();
        await expectNoHorizontalScroll(page);
        const box = await page.locator('.card').first().boundingBox();
        expect(Math.min(box?.width ?? 0, box?.height ?? 0)).toBeGreaterThanOrEqual(44);
      }
    });
  });
});
