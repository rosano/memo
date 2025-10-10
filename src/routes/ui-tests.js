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

test('description', ({ page }) =>
  expect(page.locator('p:first-of-type')).toHaveText('Capture thoughts and sync to multiple devices with remoteStorage.')
);

test('open-source', ({ page }) =>
  expect(page.locator('p:nth-of-type(2)')).toHaveText('open-source and interoperable with other apps.')
);
