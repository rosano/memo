import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => page.goto('/jot'));

test('title', async ({ page }) =>
  expect(await page.title()).toEqual('jot')
);

test('manifest', ({ page }) =>
	expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.json')
);

test('textarea', ({ page }) =>
	expect(page.locator('textarea')).toHaveAttribute('placeholder', 'what are you thinking?')
);

test('button', ({ page }) =>
	expect(page.locator('button')).toHaveText('jot')
);

test('jot-item', ({ page }) => 
	expect(page.locator('jot-item')).toHaveCount(0)
);

test('create jot-item', async ({ page }) => {
	const item = Math.random().toString();
	await page.locator('textarea').fill(item);
  await page.locator('button').click();

  await expect(page.locator('jot-item')).toHaveCount(1);
  await expect(page.locator('textarea')).toHaveText('');
  await expect(page.locator('jot-item')).toHaveText(item);
});
