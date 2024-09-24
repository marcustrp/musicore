<svelte:options namespace="svg" />

<script lang="ts">
	import type { ERest } from '$lib/layout/LRest.js';

	type MyProps = {
		rest: ERest;
	};
	const { rest }: MyProps = $props();
</script>

<circle fill="red" x={rest.x} y={rest.y} />
