import { test, expect } from '@playwright/test';

test.beforeEach(({ page }) => page.goto('/'));

test('title', async ({ page }) =>
  expect(await page.title()).toEqual('memo')
);

test('navigation', ({ page }) =>
  expect(page.locator('nav a')).toHaveText([
    'home',
    'jot',
  ])
);

test('h1', ({ page }) =>
	expect(page.locator('h1')).toHaveText('memo')
);
