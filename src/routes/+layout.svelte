<script>
import { page } from '$app/state';
let { children, data } = $props();
</script>

<svelte:head>
	<title>{ page.data.title }</title>
</svelte:head>

<header>
	<nav>
		{#each data.navigation as section, index}
			{#if index}&nbsp;·&nbsp;{/if}<a href="{section.path}">{section.title}</a>
		{/each}
	</nav>
</header>

{@render children?.()}
