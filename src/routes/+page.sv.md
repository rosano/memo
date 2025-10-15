<script>
import { onMount } from 'svelte';
import { dev } from '$app/environment';

let gazetteContainer, feedboxContainer;

onMount(() => {
	if (dev) {
		return
	}

  gazetteContainer = window.gazette.loadElement(gazetteContainer);
  feedboxContainer = window.feedbox._loadROCO(feedboxContainer);
});
	</script>

<article>

# memo

a notepad you can't edit.

[read the intro](https://rosano.ca/blog/introducing-memo/) or just [try it](/jot/).

## features

- always ready to type (supports the [work digress cycle](https://rosano.ca/blog/work-then-dont/))
- no managing conflict
- works offline
- [interoperable](https://todos-interop.0data.app) with [Listable](https://listable.5apps.com) and [TodoMVC](https://todomvc.0data.app)
- [open-source](https://github.com/rosano/memo)

<div bind:this={ gazetteContainer }></div>

<div bind:this={ feedboxContainer }></div>

</article>

<a class="root-link" href="https://rosano.ca" title="Visit rosano.ca">
	<img role="presentation" src="https://static.rosano.ca/rcreativ/identity.svg">
</a>
