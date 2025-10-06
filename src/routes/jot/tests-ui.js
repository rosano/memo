import { test, expect } from '@playwright/test';

test.beforeEach(({ page }) => page.goto('/jot'));

test('title', async ({ page }) =>
  expect(await page.title()).toEqual('jot')
);

test('viewport', ({ page }) =>
	expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0')
);

test('mobile-web-app-capable', async ({ page }) => {
	await expect(page.locator('meta[name=mobile-web-app-capable]')).toHaveAttribute('content', 'yes');
	await expect(page.locator('meta[name=apple-mobile-web-app-capable]')).toHaveAttribute('content', 'yes');
});

test('manifest', ({ page }) =>
	expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.json')
);

test.describe('placeholder', () => {

	test('placeholder', ({ page }) =>
		expect(page.locator('textarea')).toHaveAttribute('placeholder', 'what are you thinking?')
	);

	test('autofocus', ({ page }) =>
		expect(page.locator('textarea')).toHaveAttribute('autofocus', '')
	);

})

test('button.jot-add', ({ page }) =>
	expect(page.locator('button.jot-add')).toHaveText('jot')
);

test('jot-item', ({ page }) => 
	expect(page.locator('section p')).toHaveCount(0)
);

test('create jot-item', async ({ page }) => {
	const item = Math.random().toString();
	await page.locator('textarea').fill(item);
  await page.locator('button.jot-add').click();

  await expect(page.locator('section p')).toHaveCount(1);
  await expect(page.locator('textarea')).toHaveText('');
  await expect(page.locator('section p')).toHaveText(item);
});

test('create jot-item multiline', async ({ page }) => {
	const item = [Math.random().toString(), Math.random().toString()].join('\n');
	await page.locator('textarea').fill(item);
  await page.locator('button.jot-add').click();

  await expect(await page.locator('section p').innerHTML()).toEqual(expect.stringContaining(item.replace('\n', '<br>')));
});
