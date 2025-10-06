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

	description: '',

	_data: [],
	data: (data) => mod._data = data,

	add: (item) => mod.data(mod._data.concat(item)),

	remove: (item) => { mod.data(mod._data.filter(e => e.$id !== item.$id)) },
	
	// modify: (item) => { remoteStorage.todos.updateTodo(item.$id, Object.assign(item, { description: Math.random().toString() })) },
	// delete: (item) => { remoteStorage.todos.removeTodo(item.$id) },

	update: (item) => { mod.data(mod._data.map(e => e.$id === item.$id ? item : e)) },

	submit: async (event) => {
		await remoteStorage.todos.addTodo({
			description: mod.description,
		});

		mod.description = '';

		mod._textarea.focus();
	},

	visibilitychange (event) {
		if (event.target.visibilityState === 'visible' && mod._textarea) {
			mod._textarea.focus();
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
	{#each mod._data as item }
		<jot-item>{@html logic.formatPlaintext(item.description) }</jot-item>
	{/each}
</section>

<footer>
	<!-- svelte-ignore a11y_autofocus -->
	<textarea autofocus placeholder="what are you thinking?" bind:value={ mod.description } bind:this={ mod._textarea }></textarea>
	<button class="jot-add" on:click={ mod.submit }>jot</button>
</footer>

</app>

<style>
:root {
	--spacing: 10px;
	--corner: 3px;
	--cap: 600px;
	--line-border: 1px solid #eee;
}

app {
	display: block;
	max-width: var(--cap);

	margin: auto;

	#widget-wrapper :global(div) {
		margin: auto;
	}

	jot-item {
		display: block;
		padding: var(--spacing);

		&:not(:nth-child(1)) {
			border-top: var(--line-border);
		}
	}

	footer {
		width: calc(100% - var(--spacing) * 2);
		max-width: var(--cap);
		padding: var(--spacing);
		border: var(--line-border);
		border-bottom: 0;
		border-radius: var(--corner) var(--corner) 0 0;

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
