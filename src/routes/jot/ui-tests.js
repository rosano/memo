import { test, expect } from '@playwright/test';
import mod from './logic.js';

function uItem (properties = {}) {
	return Object.assign({
		description: Math.random().toString(),
		dateCreated: new Date(),
	}, properties);
};

async function fillCodemirror(page, text) {
	const editor = await page.locator('.cm-editor');
	await editor.click();
	return await page.keyboard.type(text);
};

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

test('button.copy-text', ({ page }) =>
	expect(page.locator('button.copy-text')).toBeDisabled()
);

test('button.mark-done', ({ page }) =>
	expect(page.locator('button.mark-done')).toBeDisabled()
);

test('button.discard-completed', async ({ page }) => {
	await fillCodemirror(page, Math.random().toString());
	await page.locator('button.jot-add').click()
	
	expect(page.locator('button.discard-completed')).toBeDisabled()
});

test.describe('codemirror', () => {

	test('placeholder', ({ page }) =>
		expect(page.locator('.cm-placeholder')).toHaveText('what are you thinking?')
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
	expect(page.locator('article p')).toHaveCount(0)
);

test('headings', ({ page }) => 
	expect(page.locator('article h1')).toHaveCount(0)
);

test('create jot-item', async ({ page }) => {
	const item = Math.random().toString();
	await fillCodemirror(page, item);
  await page.locator('button.jot-add').click();

  await expect(page.locator('.cm-content')).toHaveText('what are you thinking?');
  await expect(page.locator('article h1')).toHaveText(mod.heading(new Date()));
  await expect(page.locator('article p')).toHaveText(item);
});

test('create jot-item multiline', async ({ page }) => {
	const item = [Math.random().toString(), Math.random().toString()].join('\n');
	await fillCodemirror(page, item);
  await page.locator('button.jot-add').click();

  await expect(await page.locator('article p').innerHTML()).toEqual(expect.stringContaining(item.replace('\n', '<br>')));
});

test.describe('shortcuts', () => {

	[
		'Control+Enter',
		'Alt+Enter',
		'Meta+Enter',
	].forEach(shortcut =>

		test.skip(shortcut, async ({ page }) => {
			const item = Math.random().toString();
			await fillCodemirror(page, item);
			await page.keyboard.press(shortcut);

		  await expect(page.locator('article p')).toHaveText(item);
		})

	);

});

test.skip('copy all', async ({ page, context }) => {
	const items = [uItem(), uItem()];
	await fillCodemirror(page, items[0].description);
	await page.locator('button.jot-add').click()
	await fillCodemirror(page, items[1].description);
	await page.locator('button.jot-add').click();

	expect(page.locator('button.copy-text')).toHaveText('copy text');

	// Grant clipboard permissions to browser context
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);

	await page.locator('button.copy-text').click();
	expect(await (await page.evaluateHandle(() => navigator.clipboard.readText())).jsonValue()).toEqual(mod.groupsPlaintext(mod.groupItems(items)));
});

test('mark-done', async ({ page, context }) => {
	const items = [uItem(), uItem()];
	await fillCodemirror(page, items[0].description);
	await page.locator('button.jot-add').click()
	await fillCodemirror(page, items[1].description);
	await page.locator('button.jot-add').click();

	expect(page.locator('button.mark-done')).toHaveText('mark done');

	await page.locator('button.mark-done').click();
	await expect(page.locator('article p s')).toHaveText(items.map(e => mod.itemPlaintext(Object.assign(e, {
		completed: true,
	}))));
});

test('discard-completed', async ({ page, context }) => {
	const items = [uItem(), uItem()];
	await fillCodemirror(page, items[0].description);
	await page.locator('button.jot-add').click()
	await fillCodemirror(page, items[1].description);
	await page.locator('button.jot-add').click();
	await page.locator('button.mark-done').click();

	expect(page.locator('button.discard-completed')).toHaveText('discard');

	await page.locator('button.discard-completed').click();
	await expect(page.locator('article p')).toHaveCount(0);
});
