<script lang="ts">
	import { keySignatureEventHandler } from '$lib/engraver/events/key-signature.js';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import type { LayoutSettings } from '$lib/layout/types.js';
	import { Score } from '$lib/score/score.js';
	import EScore from '$lib/engraver/EScore.svelte';
	import { BBox } from '$lib/utils/bBox.js';
	import type { KeySignatureAccidentalEvent } from '$lib/engraver/events/types.js';

	type Props = {
		onevent: (arg0: KeySignatureAccidentalEvent) => void;
		/** Staff size in mm, default is 18 */
		staffSize?: number;
	};
	const { onevent, staffSize }: Props = $props();

	const score = new Score();
	score.parts.addPart();

	let scoreComponent: EScore;

	const layoutSettings: LayoutSettings = {
		staffSize: staffSize ? staffSize : 18,
		noteSpacing: {
			type: 'fixed',
			value: 4,
		},
		render: {
			barlines: true,
			keySignature: 'editor',
			clef: true,
			timeSignature: false,
			bars: false,
		},
	};
	const settings: EngraverSettings = {
		viewBoxMinimum: new BBox(0, -600, 0, 2100),
		events: {
			keySignature: (event) => {
				const hasUpdated = keySignatureEventHandler(event);
				if (hasUpdated) {
					onevent(event);
				}
				return hasUpdated;
			},
		},
	};
</script>

<EScore {score} {settings} {layoutSettings} bind:this={scoreComponent} />
