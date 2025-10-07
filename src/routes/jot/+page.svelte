<script>
import RemoteStorage from 'remotestoragejs';
import Widget from 'remotestorage-widget';
import todos from './remotestorage-module.js';
import logic from './logic.js';

// remoteStorage module
const remoteStorage = new RemoteStorage({
  modules: [todos],
  changeEvents: { local: true, window: true, remote: true, conflict: true },
});

remoteStorage.access.claim('todos', 'rw');

remoteStorage.todos.cacheTodos();

const mod = {

	_description: '',

	_data: [],
	_groups: [],
	data: (data) => mod._groups = logic.groupItems(mod._data = data),

	add: (item) => { mod.data(mod._data.concat(item)) },

	remove: (item) => { mod.data(mod._data.filter(e => e.$id !== item.$id)) },
	
	// modify: (item) => { remoteStorage.todos.updateTodo(item.$id, Object.assign(item, { description: Math.random().toString() })) },
	// delete: (item) => { remoteStorage.todos.removeTodo(item.$id) },

	update: (item) => { mod.data(mod._data.map(e => e.$id === item.$id ? item : e)) },

	submit: async () => {
		await remoteStorage.todos.addTodo({
			description: mod._description,
		});

		mod._description = '';

		mod._textarea.focus();
	},

	visibilitychange (event) {
		if (event.target.visibilityState === 'visible' && mod._textarea) {
			setTimeout(() => mod._textarea.focus(), 100);
		}
	},

	keydown (event) {
		if (event.key === 'Enter' && (event.altKey || event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			mod.submit();
		}
	},

};

// remoteStorage events

// remoteStorage.on('ready', () => {});

remoteStorage.on('disconnected', () => mod.data([]));
  
remoteStorage.todos.handle('change', (event) => {
  if (event.newValue && !event.oldValue) {
    return mod.add(remoteStorage.todos.hydrate(event.relativePath, event.newValue));
  }

  if (!event.newValue && event.oldValue) {
    return mod.remove(remoteStorage.todos.hydrate(event.relativePath, event.oldValue));
  }

  if (event.newValue && event.oldValue) {
    return mod.update(remoteStorage.todos.hydrate(event.relativePath, event.newValue));
  }
});


import { onMount } from 'svelte';

onMount(() => {
  (new Widget(remoteStorage)).attach('widget-wrapper');
});
</script>

<svelte:document onvisibilitychange={ mod.visibilitychange } />

<svelte:head>
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />

	<link rel="manifest" href="/manifest.json" />
</svelte:head>

<app>

<div id="widget-wrapper"></div>

<section>
	{#each mod._groups as group }
		<h1># { group.name }</h1>

		{#each group.items as item, index }
			<p>{@html logic.formatPlaintext(item.description) }</p>
		{/each}
	{/each}
</section>

<footer>
	<!-- svelte-ignore a11y_autofocus -->
	<textarea required autofocus placeholder="what are you thinking?" bind:value={ mod._description } bind:this={ mod._textarea } on:keydown={ mod.keydown }></textarea>
	<button class="jot-add" on:click={ mod.submit } disabled={ mod._description.trim() === '' ? true : null }>jot</button>
</footer>

</app>

<style>
:root {
	--spacing: 10px;
	--corner: 3px;
	--cap: 600px;
	--line-border: 1px solid #eee;
	--background: #eee;
}

app {
	display: block;
	max-width: var(--cap);

	margin: auto;

	background: var(--background);
	font-family: monospace;

	#widget-wrapper :global(div) {
		margin: auto;
	}

	section {
		padding: var(--spacing);

		background: #f9f9f9;
	}

	p {
		display: block;

		/*&.hr {
			opacity: 0.2;
		}*/
	}

	footer {
		width: calc(100% - var(--spacing) * 2);
		max-width: var(--cap);
		padding: var(--spacing);
		border: var(--line-border);
		border-bottom: 0;
		border-radius: var(--corner) var(--corner) 0 0;

		background: #fdfdfd;

		@media (max-width: 450px) {
			border: unset;
			border-top: var(--line-border);
			border-radius: unset;
		}

		position: absolute;
		bottom: 0;

		display: flex;

		textarea {
			border: 0;
			resize: none;
			height: 50px;

			flex-grow: 1;

			&:focus {
				outline: none !important;
			}
		}

		button {
			padding: 0 calc(var(--spacing) * 1.5);
			margin-left: var(--spacing);
		}
	}
}
</style>
