<svelte:options namespace="svg" />

<script lang="ts">
	import type { ClefLayout } from '$lib/layout/LClef.js';

	type MyProps = {
		clef: ClefLayout;
	};
	const { clef }: MyProps = $props();
</script>

<path
	class="clef"
	transform="rotate(180, {clef.x},{clef.y}) translate({clef.x},{clef.y}) scale(-1,1)"
	fill="black"
	d={clef.glyph.d}
/>
