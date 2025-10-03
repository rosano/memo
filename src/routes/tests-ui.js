import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => page.goto('/'));

test('navigation', ({ page }) =>
  expect(page.locator('nav a')).toHaveText([
    'home',
    'jot',
  ])
);

test('h1', ({ page }) =>
	expect(page.locator('h1')).toHaveText('memo')
);

test('p', ({ page }) =>
  expect(page.locator('p')).toHaveText('Capture thoughts and sync to multiple devices with remoteStorage.')
);
