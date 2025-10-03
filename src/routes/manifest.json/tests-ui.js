import { expect, test } from '@playwright/test';

test('navigation', async ({ request }) =>

  expect(await (await request.get('/manifest.json')).json()).toEqual(expect.objectContaining({
    name: 'memo',
    start_url: '/jot/',
  }))

);
