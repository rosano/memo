<script>
const mod = {

	description: '',

	data: [],


	submit: (event) => {
		mod.data.push({
			description: mod.description,
			dateCreated: new Date(),
		});

		mod.description = ''
	},

};
</script>

<svelte:head>
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />

	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<app>

<section>
	{#each mod.data as item }
		<jot-item>{ item.description }</jot-item>
	{/each}
</section>

<footer>
	<textarea autofocus placeholder="what are you thinking?" bind:value={ mod.description }></textarea>
	<button on:click={ mod.submit }>jot</button>
</footer>

</app>

<style>
:root {
	--spacing: 10px;
	--corner: 3px;
	--cap: 600px;
}

app {
	display: block;
	max-width: var(--cap);

	margin: auto;

	footer {
		--footer-border: 1px solid #eee;

		width: calc(100% - var(--spacing) * 2);
		max-width: var(--cap);
		padding: var(--spacing);
		border: var(--footer-border);
		border-bottom: 0;
		border-radius: var(--corner) var(--corner) 0 0;

		@media (max-width: 450px) {
			border: unset;
			border-top: var(--footer-border);
			border-radius: unset;
		}

		position: absolute;
		bottom: 0;

		display: flex;

		textarea {
			border: 0;
			resize: none;

			flex-grow: 1;

			&:focus {
				outline: none !important;
			}
		}

		button {
			padding: 0 var(--spacing);
		}
	}
}
</style>
