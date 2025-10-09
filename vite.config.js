import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.js',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*-tests.{js,ts}'],
					exclude: ['**/ui-tests.{js,ts}'],
				},
			},
		],
	},
	server: {
		allowedHosts: [
			'loc.sv',
		],
	},
	exclude: [
		'svelte-codemirror-editor',
		'codemirror',
		'@codemirror/language-markdown',
	],
});
