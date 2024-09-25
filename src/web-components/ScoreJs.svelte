<svelte:options
	customElement={{
		tag: 'score-js',
		shadow: 'none',
		props: {
			musicString: { reflect: true, type: 'String', attribute: 'music-string' },
			editorFrom: { reflect: false, type: 'String', attribute: 'editor-from' },
			editorTo: { reflect: false, type: 'String', attribute: 'editor-to' },
			editorsOnHover: { reflect: false, type: 'String', attribute: 'editors-on-hover' },
		},
	}}
/>

<script lang="ts">
	import { MusicStringImporter, type NoteName } from '$lib/index.js';
	import Score from '$lib/engraver/EScore.svelte';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import type { LayoutSettings } from '$lib/types.js';
	import { BBox } from '$lib/utils/bBox.js';
	import { noteAccidentalEventHandler, noteEventHandler } from '$lib/engraver/events/note.js';
	import type { NoteAccidentalEvent, NoteEvent } from '$lib/engraver/events/types.js';
	import { LNoteHead } from '$lib/layout/LNoteHead.js';
	//import AccidentalSelector from './accidental-selector.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	type Props = {
		musicString: string;
		data?: { [key: string]: string };
		editorFrom?: string;
		editorTo?: string;
		editorsOnHover?: string;
	};
	const { musicString, data, editorFrom, editorTo, editorsOnHover }: Props = $props();
	console.log('SVELTE musicString', musicString);

	export const showAnswer = () => {
		//scoreComponent.lockNote(0);
		editDisabled = true;
		scoreComponent.showNote(1);
		scoreComponent.setNoteHeadColor(0, 'red');
		showNoteName();
		scoreComponent.refresh();
	};

	export const showNoteName = (show = true) => {
		if (layoutSettings.render?.notes?.editorNote)
			layoutSettings.render.notes.editorNote.showNoteName = show;
	};

	export const disableEdit = (disable = true) => {
		editDisabled = disable;
	};

	let scoreComponent: Score;
	let editDisabled = $state(false);

	$effect(() => {
		console.log('SVELTE data updated', data);
	});

	const importer = new MusicStringImporter();
	//const score = importer.parse('iw iLw');
	/*let score = $derived.by(() => {
		console.log('SVELTE musicString updated (score effect)', musicString);
		return importer.parse(musicString);
	});*/
	let score = importer.parse(musicString); // $state(importer.parse(musicString));

	// note. editorFrom becomes positionTo
	const positionTo = LNoteHead.getPositionFromRoot(
		editorFrom![0] as NoteName,
		parseInt(editorFrom![1]),
		score.parts.getPart(0).getClef(0, 0).type,
	);
	const positionFrom = LNoteHead.getPositionFromRoot(
		editorTo![0] as NoteName,
		parseInt(editorTo![1]),
		score.parts.getPart(0).getClef(0, 0).type,
	);
	console.log('SVELTE editorFROM-TO', editorFrom, editorTo, positionFrom, positionTo);

	/*
	$effect.pre(() => {
		// before DOM update
		musicString;
		console.log('SVELTE musicString PRE updated', musicString);
		untrack(() => (score = importer.parse(musicString)));
	});
	$effect(() => {
		// after DOM update
		console.log('SVELTE musicString updated', musicString);
	});
	$inspect(musicString);*/

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
				//editorAccidental: { types: ['b', '#'] },
				editorNote: {
					positionFrom: positionFrom !== undefined ? positionFrom : -4,
					positionTo: positionTo !== undefined ? positionTo : 12,
					showNoteName: false,
				},
			},
		},
	});
	const settings: EngraverSettings = {
		showBBoxes: false,
		viewBoxMinimum: new BBox(0, -1000, 0, 3000),
		events: {
			note: (event: NoteEvent) => {
				if (editDisabled) return false;
				const eNote = LNoteHead.rootAndOctaveFromPosition(
					event.position,
					score.parts.getPart(0).getClef(0, 0).type,
				);
				if (eNote && (eNote.root !== event.note.root || eNote.octave !== event.note.octave))
					event.note.invisible = true;
				const hasUpdated = noteEventHandler(event);
				if (hasUpdated) {
					console.log('scoreupdate', event);
					dispatch('scoreupdate', { detail: event });
				}
				return hasUpdated;
			},
			noteAccidental: (event: NoteAccidentalEvent) => {
				if (editDisabled) return false;
				const hasUpdated = noteAccidentalEventHandler(event);
				if (hasUpdated) {
					console.log('scoreupdate', event);
					dispatch('scoreupdate', { detail: event });
				}
				return hasUpdated;
			},
		},
		renderEditorsOnHover: editorsOnHover === 'true' ? true : false,
	};

	/*function setAccidental(accidental: string) {
		layoutSettings.defaultAccidental = accidental as NoteAccidentals;
	}*/
</script>

<!--<AccidentalSelector currentAccidental={layoutSettings.defaultAccidental || '#'} {setAccidental} />-->
<Score {score} {settings} {layoutSettings} bind:this={scoreComponent} />

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
