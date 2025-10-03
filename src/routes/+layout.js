export const prerender = true;
export const trailingSlash = 'always';

/** @type {import('./$types').LayoutLoad} */
export function load() {
	return {
		title: 'memo',
		navigation: [
			{ path: '/', title: 'home' },
			{ path: '/jot/', title: 'jot' }
		],
	};
}
