<svelte:options namespace="svg" />

<script lang="ts">
	import type { NoteStemLayout } from '$lib/layout/LNoteStem.js';

	type MyProps = {
		stem: NoteStemLayout;
	};
	const { stem }: MyProps = $props();
</script>

<line
	class="note-stem"
	x1={stem.x}
	y1={stem.y}
	x2={stem.x}
	y2={stem.y - stem.length}
	stroke="black"
	stroke-width={stem.width}
/>
