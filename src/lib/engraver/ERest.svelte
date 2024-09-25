<svelte:options namespace="svg" />

<script lang="ts">
	import type { RestLayout } from '$lib/layout/LRest.js';

	type MyProps = {
		rest: RestLayout;
	};
	const { rest }: MyProps = $props();
</script>

<circle fill="red" x={rest.x} y={rest.y} />
