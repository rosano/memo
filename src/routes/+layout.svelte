<script>
import 'normalize.css/normalize.css';
import { dev } from '$app/environment';
import { page } from '$app/state';
import Toast from './toast.svelte';
let { children, data } = $props();
</script>

<svelte:head>
	<title>{ page.data.title }</title>

	<meta name="viewport" content="{ page.data.viewport || 'width=device-width, initial-scale=1' }" />

	{#if dev }
		<!-- https://stackoverflow.com/questions/1321878/how-to-prevent-favicon-ico-requests -->
		<link rel="icon" href="data:;base64,=">
	{/if}
</svelte:head>

<layout>

<header>
	<nav>
		{#each data.navigation as section, index}
			{#if index}&nbsp;·&nbsp;{/if}<a href="{section.path}">{section.title}</a>
		{/each}
	</nav>
</header>

<children>{@render children?.()}</children>
	
<Toast></Toast>

</layout>

<style>
:root {
	--spacing: 10px;
	--cap: 600px;
	--background: #eee;
	--foreground: #f9f9f9;
	--corner: 3px;
}

:global {
	body {
		background: var(--background);
		font-family: monospace;
	}

	layout {
		display: block;
		width: 100%;
		max-width: var(--cap);

		margin: auto;

		article {
			display: block;
			padding: var(--spacing);
			border-radius: var(--corner);

			background: var(--foreground);
		}
	}
}

nav {
	padding: calc(var(--spacing) / 2);

	text-align: center;
}
</style>
