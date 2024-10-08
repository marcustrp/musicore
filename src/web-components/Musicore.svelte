<!-- svelte-ignore options_missing_custom_element -->
<svelte:options
	customElement={{
		tag: 'music-score',
		shadow: 'none',
		props: {
			musicString: { reflect: true, type: 'String', attribute: 'music-string' },
			exercise: { reflect: false, type: 'String' },
			editorFrom: { reflect: false, type: 'String', attribute: 'editor-from' },
			editorTo: { reflect: false, type: 'String', attribute: 'editor-to' },
			editorsOnHover: { reflect: false, type: 'String', attribute: 'editors-on-hover' },
		},
	}}
/>

<script lang="ts">
	import {
		MusicStringImporter,
		type EngraverSettings,
		type LayoutSettings,
		type NoteName,
	} from '$lib/index.js';
	import { LNoteHead } from '$lib/layout/LNoteHead.js';
	//import AccidentalSelector from './accidental-selector.svelte';
	import { createEventDispatcher } from 'svelte';
	import type {
		NoteEvent,
		NoteAccidentalEvent,
		KeySignatureAccidentalEvent,
	} from '$lib/engraver/events/types.js';

	import NoteExercise from '$lib/exercises/NoteExercise.svelte';
	import KeySignatureExercise from '$lib/exercises/KeySignatureExercise.svelte';
	import EScore from '$lib/engraver/EScore.svelte';
	import ScaleExercise from '$lib/exercises/ScaleExercise.svelte';

	const dispatch = createEventDispatcher();

	type Props = {
		musicString: string;
		exercise?: string;
		data?: { [key: string]: string };
		editorFrom?: string;
		editorTo?: string;
		editorsOnHover?: string;
	};
	const { musicString, exercise, data, editorFrom, editorTo, editorsOnHover }: Props = $props();
	let scoreComponent: NoteExercise | KeySignatureExercise = $state();

	export const showAnswer = () => {
		editDisabled = true;
		scoreComponent.showAnswer();
	};

	export const showNoteName = (show = true) => {
		scoreComponent.showNoteName(show);
	};

	export const disableEdit = (disable = true) => {
		editDisabled = disable;
	};

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

	const layoutSettings: LayoutSettings = {};
	const settings: EngraverSettings = {};

	// note. editorFrom becomes positionTo
	const positionTo =
		editorFrom ?
			LNoteHead.getPositionFromRoot(
				editorFrom[0] as NoteName,
				parseInt(editorFrom[1]),
				score.parts.getPart(0).getClef(0, 0).type,
			)
		:	0;
	const positionFrom =
		editorTo ?
			LNoteHead.getPositionFromRoot(
				editorTo[0] as NoteName,
				parseInt(editorTo[1]),
				score.parts.getPart(0).getClef(0, 0).type,
			)
		:	0;

	function handleEvent(event: NoteEvent | NoteAccidentalEvent | KeySignatureAccidentalEvent) {
		dispatch('scoreupdate', event);
	}
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

	/*function setAccidental(accidental: string) {
		layoutSettings.defaultAccidental = accidental as NoteAccidentals;
	}*/
</script>

{#if exercise === 'NoteExercise'}
	<NoteExercise
		{score}
		{positionFrom}
		{positionTo}
		{editDisabled}
		editorsOnHover={editorsOnHover === 'true'}
		onevent={(event) => handleEvent(event)}
		bind:this={scoreComponent}
	/>
{:else if exercise === 'KeySignatureExercise'}
	<KeySignatureExercise onevent={(event) => handleEvent(event)} bind:this={scoreComponent} />
{:else if exercise === 'ScaleExercise'}
	<ScaleExercise {score} onevent={(event) => handleEvent(event)} bind:this={scoreComponent} />
{:else if exercise === 'default' || exercise === '' || exercise === undefined}
	<EScore {score} {settings} {layoutSettings} />
{:else}
	Unknown exercise: {exercise}
{/if}

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
