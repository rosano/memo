import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run preview',
		port: 4173
	},
	testDir: 'src/routes',
	testMatch: 'src/routes/**/ui-tests.js',
	outputDir: '__playwright',
});
