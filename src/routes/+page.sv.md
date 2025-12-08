<script>
import { onMount } from 'svelte';
import { dev } from '$app/environment';

let gazetteContainer, feedboxContainer, bannerContainer;

onMount(() => {
	if (dev) {
		return
	}

  gazetteContainer = window.gazette.loadElement(gazetteContainer);
  feedboxContainer = window.feedbox._loadROCO(feedboxContainer);
  
  (async function() {
  	window.OLSKBanner._configureElement(bannerContainer, await window.OLSKBanner.OLSKBannerInfoObject())
  })();
});
</script>

<article>

# memo

a notepad you can't edit.

[read the intro](https://rosano.ca/blog/introducing-memo/) or just [try it](/jot/).

## features

- always ready to type (supports the [work digress cycle](https://rosano.ca/blog/work-then-dont/))
- no managing conflict between devices
- works offline
- [open-source](https://github.com/rosano/memo)
- [interoperable](https://todos-interop.0data.app) with [Listable](https://listable.5apps.com) and [TodoMVC](https://todomvc.0data.app)

<figure>

![](https://static.rosano.ca/home/blog/2025-10-15-introducing-memo/output.gif)

<figcaption>interoperable with other apps</figcaption>
</figure>

</article>

<div bind:this={ gazetteContainer }></div>

<div bind:this={ feedboxContainer }></div>

<a class="root-link" href="https://rosano.ca" title="Visit rosano.ca">
	<img role="presentation" src="https://static.rosano.ca/rcreativ/identity.svg">
</a>

<div bind:this={ bannerContainer }></div>
