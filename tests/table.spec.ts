import { test, expect } from '@playwright/test';
const resolutions = [
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1600, height: 900 },
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
];
for (const size of resolutions)
  test(`table and dialogs fit ${size.width}×${size.height}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewportSize(size);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.screenshot({ path: `artifacts/lobby-${size.width}.png` });
    await page.getByRole('button', { name: 'Take a seat' }).click();
    await expect(page.locator('canvas')).toBeVisible();
    await page.getByRole('button', { name: 'Draw 2 cards' }).click();
    await expect(page.getByRole('button', { name: 'End turn' })).toBeEnabled();
    await expect(page.getByRole('group', { name: /Your hand/ }).getByRole('button')).toHaveCount(6);
    await page.screenshot({ path: `artifacts/table-${size.width}.png` });
    await page.getByRole('button', { name: 'Audio and motion settings' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const bounds = await dialog.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.y).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(size.width);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(size.height);
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    const controls = await page
      .locator('.table-header button,.turn-actions button,.hand-keyboard button')
      .all();
    for (const b of controls) {
      const r = await b.boundingBox();
      expect(r).toBeTruthy();
      expect(r!.x).toBeGreaterThanOrEqual(0);
      expect(r!.y + r!.height).toBeLessThanOrEqual(size.height + 0.1);
    }
    const first = page
      .getByRole('group', { name: /Your hand/ })
      .getByRole('button')
      .first();
    await first.click();
    await expect(page.locator('.selection-panel')).toBeVisible();
    await page.getByRole('button', { name: 'Inspect (I)' }).click();
    const inspection = await page.locator('.card-inspection').boundingBox();
    expect(inspection!.x + inspection!.width).toBeLessThanOrEqual(size.width);
    expect(inspection!.y + inspection!.height).toBeLessThanOrEqual(size.height);
    await page.keyboard.press('Escape');
    expect(errors).toEqual([]);
  });
test('save/restore, legal targeting and private hotseat handoff', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByLabel('Company').selectOption('hotseat');
  await page.getByRole('button', { name: 'Take a seat' }).click();
  await page.getByRole('button', { name: 'Draw 2 cards' }).click();
  let played = 0;
  const hand = page.getByRole('group', { name: /Your hand/ });
  for (let i = 0; i < 6; i++) {
    const buttons = hand.getByRole('button');
    if (i >= (await buttons.count())) break;
    await buttons.nth(i).click();
    const targets = page.locator('.target-button');
    if (await targets.count()) {
      await targets.first().click();
      played++;
      break;
    }
    await page.keyboard.press('Escape');
  }
  expect(played).toBe(1);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Save in browser' }).click();
  await expect(page.getByRole('dialog')).toContainText('Table saved');
  await page.keyboard.press('Escape');
  await page.reload();
  await page.getByRole('button', { name: 'Resume saved table' }).click();
  await expect(page.locator('canvas')).toBeVisible();
  await page.getByRole('button', { name: 'End turn' }).click();
  await expect(page.getByRole('button', { name: "I'm ready — show my hand" })).toBeVisible();
  await expect(page.getByRole('group', { name: /Your hand/ })).toHaveCount(0);
  await page.getByRole('button', { name: "I'm ready — show my hand" }).click();
  await expect(page.getByRole('button', { name: 'Draw 2 cards' })).toBeVisible();
});
test('card room search/filter/keyboard preview', async ({ page }) => {
  await page.goto('/dev/cards');
  await expect(page.locator('.catalogue-card')).toHaveCount(17);
  await page.getByLabel('Find a card').fill('Anxiety');
  await expect(page.locator('.catalogue-card')).toHaveCount(2);
  await page.getByLabel('Card type').selectOption('drug');
  await expect(page.locator('.catalogue-card')).toHaveCount(1);
  await expect(page).toHaveURL(/q=Anxiety&type=drug/);
  await page.getByRole('button', { name: 'Inspect Anxiety Treatment' }).click();
  await expect(page.getByRole('dialog')).toContainText('Exposes you to');
  await page.keyboard.press('Escape');
});
test('animation lab cancellation, speeds, route cleanup', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/dev/animations');
  await expect(page.locator('canvas')).toHaveCount(1);
  for (const kind of ['draw', 'flip', 'therapy', 'deal']) {
    await page.getByRole('button', { name: kind, exact: true }).click();
    await page.getByRole('button', { name: 'Play / restart' }).click();
    await page.getByRole('button', { name: 'Fast-forward', exact: true }).click();
    await expect(page.getByRole('status')).toContainText(/Complete|Skipped/);
  }
  await page.getByLabel('Speed').selectOption('0.25');
  await page.getByRole('button', { name: 'Play / restart' }).click();
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Resume', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await page.getByRole('link', { name: 'Open card room' }).click();
  await expect(page.locator('canvas')).toHaveCount(0);
  expect(errors).toEqual([]);
});
