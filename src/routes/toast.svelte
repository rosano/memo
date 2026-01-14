<script>
import { updated } from '$app/state';

let isVisible = true;
</script>

{#if updated.current && isVisible}
	<toast>
		<button class="close" onclick={ () => isVisible = false }>new update available</button>
		<button onclick={ () => location.reload() }>Reload</button>
	</toast>
{/if}

<style type="text/css">
toast {
	--spacing: 10px;
	--corner: 3px;

	border: 1px solid #b265ff;
	border-radius: var(--corner);
	
	position: fixed;
	margin: var(--spacing);
	top: 0;
	right: 0;
	
	background: #8000ff;
	color: white;
	font-family: 'Helvetica Neue', 'Helvetica', sans-serif;

	display: flex;

	button {
		padding: var(--spacing);
		
		color: white;

		&.close {
			opacity: 0.8;
		}

		appearance: none;
		border: 0;
		background: none;
	}
}
</style>