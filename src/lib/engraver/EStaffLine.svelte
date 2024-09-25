<svelte:options namespace="svg" />

<script lang="ts">
	import type { StaffLineLayout } from '$lib/layout/LStaffLine.js';

	type MyProps = {
		staffLine: StaffLineLayout;
	};
	const { staffLine }: MyProps = $props();
</script>

<line
	x1={staffLine.x}
	y1={staffLine.y}
	x2={staffLine.x + staffLine.length}
	y2={staffLine.y}
	stroke="black"
	stroke-width={staffLine.thickness}
/>
