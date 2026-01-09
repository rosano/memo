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
	// // https://github.com/touchifyapp/svelte-codemirror-editor
	// // If you try to use this component with vite or svelte-kit, you have to disable dependency optimization for codemirror and all its extensions.
  // optimizeDeps: {
  // 	exclude: [
  // 		'svelte-codemirror-editor',
  // 		'codemirror',
  // 		'@codemirror/language-markdown',
  // 	],
  // },
});
