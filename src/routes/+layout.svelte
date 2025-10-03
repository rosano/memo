<script>
let { children } = $props();
</script>

<header>
	<nav>
		<a href="/">home</a>
		·
		<a href="/jot">jot</a>
	</nav>
</header>

{@render children?.()}
