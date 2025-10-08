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

	// interface

	submit: async () => {
		await remoteStorage.todos.addTodo({
			description: mod._description,
		});

		mod._description = '';

		mod._textarea.focus();
	},

	// react

	keydown (event) {
		if (event.key === 'Enter' && (event.altKey || event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			mod.submit();
		}
	},

	// lifecycle

	visibilitychange (event) {
		if (event.target.visibilityState === 'visible' && mod._textarea) {
			setTimeout(() => mod._textarea.focus(), 100);
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

<article>
	{#if !mod._groups.length }
		<p>&nbsp;</p>
	{/if}
	{#each mod._groups as group }
		<h1>{ group.name }</h1>

		{#each group.items as item, index }
			<p>{#if item.completed }<s>~~{@html logic.formatPlaintext(item.description) }~~</s>{:else }{@html logic.formatPlaintext(item.description) }{/if}</p>	
		{/each}
	{/each}
</article>

<footer>
	<!-- svelte-ignore a11y_autofocus -->
	<textarea required autofocus placeholder="what are you thinking?" bind:value={ mod._description } bind:this={ mod._textarea } on:keydown={ mod.keydown }></textarea>
	<button class="jot-add" on:click={ mod.submit } disabled={ mod._description.trim() === '' ? true : null }>jot</button>
</footer>

</app>

<style>
:root {
	--border: 1px solid #eee;
}

:global {
	layout {
		display: flex !important;
		height: 100dvh;

		flex-direction: column;

		app {
			flex-grow: 1;
		}
	}
}

app {
	display: flex;
	flex-direction: column;

	#widget-wrapper :global(div) {
		margin: auto;
	}

	article {
		flex-grow: 1;

		/* wrap long urls  */
		word-break: break-word;

		@media (max-width: 450px) {
			border-radius: 0;
		}
	}

	p {
		display: block;

		s {
			opacity: 0.3;
		}

		/*&.hr {
			opacity: 0.2;
		}*/
	}

	footer {
		width: calc(100% - var(--spacing) * 2);
		max-width: var(--cap);
		padding: var(--spacing);
		border-top: var(--border);
		border-radius: var(--corner) var(--corner) 0 0;

		background: #fefefe;

		@media (max-width: 450px) {
			border-radius: unset;
		}

		position: sticky;
		bottom: 0;

		display: flex;
		flex-direction: column;

		textarea {
			border: 0;
			resize: none;
			height: 100px;

			flex-grow: 1;

			&:focus {
				outline: none !important;
			}
		}

		button {
			padding: calc(var(--spacing) * 1.5) 0;
			margin-top: var(--spacing);
			border: var(--border);
			background: #eee;

			/* OLSKMobileSafariRemoveDefaultInputStyle */
			-webkit-appearance: none;
			-moz-appearance: none;
			appearance: none;
		}
	}
}
</style>
