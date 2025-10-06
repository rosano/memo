<script>
import 'normalize.css';
import { dev } from '$app/environment';
import { page } from '$app/state';
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

<header>
	<nav>
		{#each data.navigation as section, index}
			{#if index}&nbsp;·&nbsp;{/if}<a href="{section.path}">{section.title}</a>
		{/each}
	</nav>
</header>

{@render children?.()}
