<script>
let { text = 'Hello', onhidden = (function () {}) } = $props();
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

		setTimeout(onhidden, 1000);
	},

	// lifecycle

	moduleDidLoad () {
		setTimeout(mod.show, 100);
	},

};

mod.moduleDidLoad();
</script>

<container>
{#if visible}
	<feedback in:fly={ { y: -10 } } out:fade>{ text }</feedback>
{/if}
</container>

<style type="text/css">
container {
	--spacing: 10px;
	--corner: 3px;

	width: 100%;
	
	position: fixed;
	top: 0;
	left: 0;

	text-align: center;
	
	z-index: 2;
}
feedback {
	display: inline-block;
	padding: calc(var(--spacing) / 2);
	border: 1px solid #666666;
	border-radius: var(--corner);

	margin: calc(var(--spacing) * 2);
	
	background: #333333;
	color: white;
	font-family: 'Helvetica Neue', 'Helvetica', sans-serif;

}
</style>
