import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => page.goto('/jot'));

test('title', async ({ page }) =>
  expect(await page.title()).toEqual('jot')
);

test('manifest', ({ page }) =>
	expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.json')
);

test('h1', ({ page }) =>
	expect(page.locator('h1')).toHaveText('jot')
);
