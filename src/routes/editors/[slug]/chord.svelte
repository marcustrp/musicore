<script lang="ts">
	import { MusicStringImporter, type NoteAccidentals } from '$lib/index.js';
	import Score from '$lib/engraver/EScore.svelte';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import type { LayoutSettings } from '$lib/types.js';
	import { BBox } from '$lib/utils/bBox.js';
	import { noteAccidentalEventHandler, noteEventHandler } from '$lib/engraver/events/note.js';
	import AccidentalSelector from './accidental-selector.svelte';

	const importer = new MusicStringImporter();
	const score = importer.parse('iw');
	const layoutSettings: LayoutSettings = $state({
		noteSpacing: {
			type: 'fixed',
			value: 2,
		},
		defaultAccidental: 'b',
		render: {
			keySignature: false,
			clef: true,
			timeSignature: false,
			bars: true,
			barlines: false,
			notes: {
				editorAccidental: { types: ['b', '#'] },
				editorNote: { positionFrom: -4, positionTo: 12 },
			},
		},
	});
	const settings: EngraverSettings = {
		showBBoxes: false,
		viewBoxMinimum: new BBox(0, -1000, 0, 3000),
		events: {
			note: noteEventHandler,
			noteAccidental: noteAccidentalEventHandler,
		},
	};

	function setAccidental(accidental: string) {
		layoutSettings.defaultAccidental = accidental as NoteAccidentals;
	}
</script>

<AccidentalSelector currentAccidental={layoutSettings.defaultAccidental || '#'} {setAccidental} />

<Score {score} {settings} {layoutSettings} />
