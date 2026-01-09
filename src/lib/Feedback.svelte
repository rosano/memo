<script>
let { text = 'Hello', onhide = (function () {}) } = $props();
import { fly, fade } from 'svelte/transition';
let visible = $state(false);

const mod = {

	// commands

	show () {
		visible = true;

		setTimeout(mod.hide, 1000);
	},

	hide () {
		visible = false;

		setTimeout(onhide, 1000);
	},

	// lifecycle

	moduleDidLoad () {
		setTimeout(mod.show, 100);
	},

};

mod.moduleDidLoad();
</script>

{#if visible}
	<feedback in:fly={ { y: -10 } } out:fade>{ text }</feedback>
{/if}

<style type="text/css">
feedback {
	--spacing: 10px;
	--corner: 3px;

	display: block;
	padding: calc(var(--spacing) / 2);
	border: 1px solid #666666;
	border-radius: var(--corner);
	
	position: fixed;
	margin: var(--spacing);
	left: 50%;
	top: 30px;
	
	background: #333333;
	color: white;
	font-family: 'Helvetica Neue', 'Helvetica', sans-serif;

	z-index: 2;
}
</style>
