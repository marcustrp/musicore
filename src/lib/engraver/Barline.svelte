<svelte:options namespace="svg" />

<script lang="ts">
	import type { EBarline } from '$lib/layout/LBarline.js';

	type MyProps = {
		barline: EBarline;
	};
	const { barline }: MyProps = $props();
</script>

<g class="barline">
	{#each barline.lines as line}
		<line
			x1={line.x}
			y1={line.y}
			x2={line.x}
			y2={line.y + line.height}
			stroke="black"
			stroke-width={line.width}
		/>
	{/each}
</g>
