<script lang="ts">
	import { MusicStringImporter, type NoteAccidentals } from '$lib/index.js';
	import Score from '$lib/engraver/Score.svelte';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import type { LayoutSettings } from '$lib/types.js';
	import { noteAccidentalEventHandler } from '$lib/engraver/events/note.js';
	import AccidentalSelector from './accidental-selector.svelte';

	const importer = new MusicStringImporter();
	const score = importer.parse('@KcCg 1w 2w 3w 4w 5w 6w 7w 8w');

	const layoutSettings: LayoutSettings = $state({
		noteSpacing: {
			type: 'fixed',
			value: 2,
		},
		defaultAccidental: 'b',
		render: {
			barlines: false,
			timeSignature: false,
			notes: {
				editorAccidental: { types: ['b', '#'] },
			},
		},
	});
	const settings: EngraverSettings = {
		events: {
			noteAccidental: noteAccidentalEventHandler,
		},
	};

	function setAccidental(accidental: string) {
		layoutSettings.defaultAccidental = accidental as NoteAccidentals;
	}
</script>

<AccidentalSelector currentAccidental={layoutSettings.defaultAccidental || '#'} {setAccidental} />
<Score {score} {settings} {layoutSettings} />
