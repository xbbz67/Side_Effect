import { test, expect } from '@playwright/test';
test('a full browser match reaches the result screen', async ({ page }) => {
  test.setTimeout(180000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: '2', exact: true }).click();
  await page.getByRole('button', { name: 'Take a seat' }).click();
  await expect(page.locator('canvas')).toBeVisible();
  let steps = 0;
  while (!(await page.locator('.result').count()) && steps++ < 450) {
    const begin = page.getByRole('button', {
      name: /^(Draw 2 cards|Begin turn|Sit out this turn)$/,
    });
    if (await begin.isVisible()) {
      await begin.click();
      continue;
    }
    const dialog = page.getByRole('dialog');
    if (await dialog.count()) {
      const ready = page.getByRole('button', { name: 'Ready — start 3 seconds' });
      if (await ready.count()) {
        await ready.click();
        const options = page.locator('.choice-cards button');
        const need = Number((await dialog.innerText()).match(/Choose (\d)/)?.[1] ?? 3);
        for (let i = 0; i < need; i++) await options.nth(i).click();
        await page.getByRole('button', { name: /Discard \d \/ \d/ }).click();
        continue;
      }
      const take = page.getByRole('button', { name: 'Take random cards' });
      if (await take.count()) {
        await take.click();
        continue;
      }
      const decline = page.getByRole('button', { name: 'Decline theft' });
      if (await decline.count()) {
        await decline.click();
        continue;
      }
    }
    const hand = page.getByRole('group', { name: /Your hand/ });
    const playable = hand.getByRole('button', { name: /, playable$/ });
    if (await playable.count()) {
      await playable.first().click();
      await page.locator('.target-button').first().click();
      continue;
    }
    const end = page.getByRole('button', { name: 'End turn', exact: true });
    if (await end.isVisible()) {
      if (await end.isEnabled()) {
        await end.click();
        continue;
      }
      const available = hand.getByRole('button');
      if (await available.count()) {
        await available.first().click();
        await page.getByRole('button', { name: 'Discard', exact: true }).click();
        continue;
      }
    }
    await page.waitForTimeout(40);
  }
  await expect(page.locator('.result')).toBeVisible();
  await expect(page.locator('.result h2')).toContainText(/win/);
  await page.screenshot({ path: 'artifacts/completed-match.png' });
});
