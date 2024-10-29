<script lang="ts">
	import { MusicStringImporter } from '$lib/index.js';
	import Score from '$lib/engraver/EScore.svelte';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import type { LayoutSettings } from '$lib/layout/types.js';

	type Props = {
		musicstring: string;
		layoutSettings?: LayoutSettings;
		engraverSettings?: EngraverSettings;
	};
	let { musicstring, layoutSettings, engraverSettings }: Props = $props();

	const importer = new MusicStringImporter();
	//** TODO #7 is written one octave wrong (musicore issue?) */
	const score = importer.parse(musicstring);

	const layoutSettingsState: LayoutSettings = $state({
		//staffSize: 4,
		...layoutSettings,
	});
	const settings: EngraverSettings = {
		...engraverSettings,
	};
</script>

<Score {score} {settings} layoutSettings={layoutSettingsState} />
