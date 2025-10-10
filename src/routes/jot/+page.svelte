<script>
import RemoteStorage from 'remotestoragejs';
import Widget from 'remotestorage-widget';
import todos from './remotestorage-module.js';
import logic from './logic.js';
import copyIcon from './copy.svg';
import completeIcon from './complete.svg';
import discardIcon from './discard.svg';

import CodeMirror from "svelte-codemirror-editor";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";

// remoteStorage module
const remoteStorage = new RemoteStorage({
  modules: [todos],
  changeEvents: { local: true, window: true, remote: true, conflict: true },
});

remoteStorage.access.claim('todos', 'rw');

remoteStorage.todos.cacheTodos();

const mod = {

	_description: '',
	descriptionEmpty: () => mod._description.trim() === '',

	_data: [],
	_groups: [],
	_completed: [],
	data: (data) => {
		mod._groups = logic.groupItems(mod._data = data);
		mod._completed = mod._data.filter(e => e.completed);
	},

	add: (item) => { mod.data(mod._data.concat(item)) },

	remove: (item) => { mod.data(mod._data.filter(e => e.$id !== item.$id)) },
	
	// modify: (item) => { remoteStorage.todos.updateTodo(item.$id, Object.assign(item, { description: Math.random().toString() })) },

	update: (item) => { mod.data(mod._data.map(e => e.$id === item.$id ? item : e)) },

	// interface

	submit: async () => {
		await remoteStorage.todos.addTodo({
			description: mod._description,
		});

		mod._description = '';

		mod._textarea.focus();
	},

	copyText: () => navigator.clipboard ? navigator.clipboard.writeText(logic.groupsPlaintext(mod._groups)) : null,

	markDone: () => Promise.all(
		mod._data.map(e => remoteStorage.todos.updateTodo(
			e.$id,
			Object.assign(e, {
				completed: !e.completed,
			})),
		),
	).then(mod.data),

	discardCompleted: () => mod._completed.forEach(e => remoteStorage.todos.removeTodo(e.$id)),

	// react

	Enter (event) {
		if (!mod.descriptionEmpty()) {
			mod.submit();

			// Return true to indicate the event was handled
			return true;
		}

		// Return false to allow default handling
		return false;
	},

	// lifecycle

	visibilitychange (event) {
		if (event.target.visibilityState === 'visible' && mod._textarea) {
			setTimeout(() => mod._textarea.focus(), 200);
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

<toolbar>
	<button class="copy-text" onclick={ mod.copyText } disabled={ !mod._groups.length ? true : null }>
		<!-- svelte-ignore a11y_missing_attribute -->
		<img src="{copyIcon}" aria-hidden="true">
		<span>copy text</span>
	</button>
	<button class="mark-done" onclick={ mod.markDone } disabled={ !mod._groups.length ? true : null }>
		<!-- svelte-ignore a11y_missing_attribute -->
		<img src="{completeIcon}" aria-hidden="true">
		<span>mark done</span>
	</button>
	<button class="discard-completed" onclick={ mod.discardCompleted } disabled={ !mod._completed.length ? true : null }>
		<!-- svelte-ignore a11y_missing_attribute -->
		<img src="{discardIcon}" aria-hidden="true">
		<span>discard</span>
	</button>
</toolbar>

<article>
	{#if !mod._groups.length }
		<placeholder>&nbsp;</placeholder>
	{/if}
	{#each mod._groups as group }
		<h1>{ group.name }</h1>

		{#each group.items as item, index }
			<p>{@html logic.itemHTML(item) }</p>	
		{/each}
	{/each}
</article>

<footer>
	<CodeMirror bind:value={ mod._description } lang={ markdown() } lineNumbers={ false } highlight={ {activeLine: false,} } placeholder="what are you thinking?" keybindings={ ['Mod-Enter', 'Control-Enter', 'Alt-Enter'].map(key => ({key, run: mod.Enter })) } onready={ e => (mod._textarea = e).focus() } />
	<button class="jot-add" onclick={ mod.submit } disabled={ mod.descriptionEmpty() ? true : null }>jot</button>
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

			.cm-gutters {
			  display: none !important;
			}

			.cm-line {
				padding: 0 !important;
			}

			.cm-content {
				height: 100px;
			}
		}
	}
}

app {
	display: flex;
	flex-direction: column;

	button {
		cursor: pointer;

		/* OLSKMobileSafariRemoveDefaultInputStyle */
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}

	#widget-wrapper :global(div) {
		margin: auto;
	}

	toolbar {
		padding: var(--spacing) 0;

		display: flex;
		justify-content: center;

		button {
			border: none;
			background: none;

			display: flex;

			&:disabled * {
				opacity: 0.25;
			}

			&:not(&:disabled) {
				&:hover * {
					opacity: 0.75;
				}

				&:active * {
					opacity: 0.50;
				}
			}

			img {
				margin-right: calc(var(--spacing) / 2);
			}

			span {
				flex-shrink: 0;
			}
		}
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

		:global(s) {
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

		button {
			padding: calc(var(--spacing) * 1.5) 0;
			margin-top: var(--spacing);
			border: var(--border);
			background: #eee;
		}
	}
}
</style>
