<script lang="ts">
	import type { EngraverSettings, LayoutSettings } from '$lib/index.js';
	import ExampleScore from './ExampleScore.svelte';

	type ExampleType = {
		name: string;
		musicstring: string;
		layoutSettings?: LayoutSettings;
		engraverSettings?: EngraverSettings;
	};
	const examples: ExampleType[] = [
		{
			name: 'Barlines and time signature hidden',
			musicstring: '1w 2w 3w',
			layoutSettings: { render: { barlines: false, timeSignature: false } },
		},
		{
			name: 'Low and high notes',
			musicstring: '--1w +++++1w',
		},
		{
			name: 'Misc...',
			musicstring:
				'@KC 1 #7 +6h [135]h [-135]h 1{color:orange}h [1{color:orange}3{color:red}5{color:blue}]q r',
		},
	];
</script>

{#each examples as example}
	<div>
		{example.name}<br />
		<ExampleScore
			musicstring={example.musicstring}
			layoutSettings={example.layoutSettings}
			engraverSettings={example.engraverSettings}
		/>
	</div>
{/each}
