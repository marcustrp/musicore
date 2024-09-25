<script lang="ts">
	import { MusicStringImporter } from '$lib/index.js';
	import Score from '$lib/engraver/EScore.svelte';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import type { LayoutSettings } from '$lib/layout/types.js';

	const importer = new MusicStringImporter();
	//** TODO #7 is written one octave wrong (musicore issue?) */
	const score = importer.parse('@KC 1 #7 +6h [135]h [-135]h');

	const layoutSettings: LayoutSettings = $state({
		staffSize: 4,
	});
	const settings: EngraverSettings = {};
</script>

<Score {score} {settings} {layoutSettings} />
