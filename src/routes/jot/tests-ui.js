import { test, expect } from '@playwright/test';
import mod from './logic.js';

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

	test('required', ({ page }) =>
		expect(page.locator('textarea')).toHaveAttribute('required', '')
	);

});

test.describe('button.jot-add', () => {

	test('text', ({ page }) =>
		expect(page.locator('button.jot-add')).toHaveText('jot')
	);

	test('disabled', ({ page }) =>
		expect(page.locator('button.jot-add')).toHaveAttribute('disabled', '')
	);
	
});

test('jot-item', ({ page }) => 
	expect(page.locator('section p')).toHaveCount(0)
);

test('headings', ({ page }) => 
	expect(page.locator('section h1')).toHaveCount(0)
);

test('create jot-item', async ({ page }) => {
	const item = Math.random().toString();
	await page.locator('textarea').fill(item);
  await page.locator('button.jot-add').click();

  await expect(page.locator('textarea')).toHaveText('');
  await expect(page.locator('section h1')).toHaveText('# ' + mod.heading(new Date()));
  await expect(page.locator('section p')).toHaveText(item);
});

test('create jot-item multiline', async ({ page }) => {
	const item = [Math.random().toString(), Math.random().toString()].join('\n');
	await page.locator('textarea').fill(item);
  await page.locator('button.jot-add').click();

  await expect(await page.locator('section p').innerHTML()).toEqual(expect.stringContaining(item.replace('\n', '<br>')));
});

test.describe('shortcuts', () => {

	[
		'Control+Enter',
		'Alt+Enter',
		'Meta+Enter',
	].forEach(shortcut =>

		test.skip(shortcut, async ({ page }) => {
			const item = Math.random().toString();
			await page.locator('textarea').fill(item);
			await page.getByRole('textbox').press(shortcut);

		  await expect(page.locator('section p')).toHaveText(item);
		})

	);

});
