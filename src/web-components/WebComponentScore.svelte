<script lang="ts">
	import { Score, type LayoutSettings, type EngraverSettings } from '$lib/index.js';
	import EScore from '$lib/engraver/EScore.svelte';

	type Props = {
		score: Score;
	};

	let { score }: Props = $props();

	const layoutSettings: LayoutSettings = {};
	const settings: EngraverSettings = {};
</script>

<EScore {score} {settings} {layoutSettings} />
