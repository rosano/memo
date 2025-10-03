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
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<app>

{#each mod.data as item }
	<jot-item>{ item.description }</jot-item>
{/each}

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
	max-width: var(--cap);
	display: block;

	margin: auto;
}

footer {
	width: 100%;
	max-width: var(--cap);
	padding: var(--spacing);
	border: 1px solid #eee;
	border-radius: var(--corner);
	border-bottom: 0;

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
</style>
