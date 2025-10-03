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

{#each mod.data as item }
	<jot-item>{ item.description }</jot-item>
{/each}

<textarea placeholder="what are you thinking?" bind:value={ mod.description }></textarea>
<button on:click={ mod.submit }>jot</button>
