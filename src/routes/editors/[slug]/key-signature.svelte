<script lang="ts">
	//import { TimeSignature, Clef, Note, Score as MusicoreScore, Key } from '$lib/index.js';
	import Score from '$lib/engraver/Score.svelte';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import type { LayoutSettings } from '$lib/types.js';
	import { BBox } from '$lib/utils/bBox.js';
	import { keySignatureEventHandler } from '$lib/engraver/events/key-signature.js';
	import { MusicStringImporter } from '$lib/index.js';

	/*type Props = {
		showBBoxes: boolean;
	};
	const { showBBoxes }: Props = $props();*/

	/*const key = new Key('d', 'major');
	//const key = new Key('c', 'custom')
	//key.customAccidentals = [{ 'position': 1, type: '#'}]
	const score = new MusicoreScore(key, new TimeSignature(4, 4));

	score.parts.addPart(new Clef('treble'));
	score.parts.getPart(0).addVoice();
	const voice = score.parts.getPart(0).getVoice(0);
	voice.addNotes([new Note('q', 'd')]);
	voice.addNotes([new Note('q', 'e')]);
	voice.addNotes([new Note('h', 'f', '#')]);
	voice.addNotes([new Note('w', 'a')]);
	score.bars.bars[1].barline = 'light-heavy';*/

	const importer = new MusicStringImporter();
	const score = importer.parse('@KDCa iw');

	const layoutSettings: LayoutSettings = {
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
			keySignature: keySignatureEventHandler,
		},
	};
</script>

<h3 class="text-4xl">Key signature</h3>
<Score {score} {settings} {layoutSettings} />
