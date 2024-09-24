<script lang="ts">
	import { MusicStringImporter, Key, type NoteAccidentals } from '$lib/index.js';
	import Score from '$lib/engraver/Score.svelte';
	import MusicFont from '$lib/engraver/MusicFont.svelte';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import type { LayoutSettings } from '$lib/types.js';
	import { noteAccidentalEventHandler, noteEventHandler } from '$lib/engraver/events/note.js';
	import { keySignatureEventHandler } from '$lib/engraver/events/key-signature.js';

	const importer = new MusicStringImporter();
	const score = importer.parse('[1b35]w');

	const layoutSettings: LayoutSettings = $state({
		noteSpacing: {
			type: 'fixed',
			value: 2,
		},
		defaultAccidental: 'b',
		render: {
			keySignature: 'editor',
			clef: true,
			timeSignature: false,
			bars: true,
			barlines: false,
			notes: {
				editorAccidental: { types: ['b', '#'] },
				editorNote: { positionFrom: -2, positionTo: 12 },
			},
		},
	});

	const settings: EngraverSettings = {
		events: {
			note: noteEventHandler,
			noteAccidental: noteAccidentalEventHandler,
			keySignature: keySignatureEventHandler,
		},
	};

	function setAccidental(accidental: string) {
		layoutSettings.defaultAccidental = accidental as NoteAccidentals;
	}
</script>

<button onclick={() => setAccidental('#')}>
	<MusicFont char="accidentalSharp" />
</button>
<button onclick={() => setAccidental('b')}>
	<MusicFont char="accidentalFlat" />
</button>
<Score {score} {settings} {layoutSettings} />
