<!-- svelte-ignore options_missing_custom_element -->
<svelte:options
	customElement={{
		tag: 'music-score',
		shadow: 'none',
		props: {
			musicString: { reflect: true, type: 'String', attribute: 'music-string' },
			staffSizeProp: { reflect: true, type: 'String', attribute: 'staff-size' },
			exercise: { reflect: false, type: 'String' },
			exerciseSettings: { reflect: false, type: 'String', attribute: 'exercise-settings' },
			editorFrom: { reflect: false, type: 'String', attribute: 'editor-from' },
			editorTo: { reflect: false, type: 'String', attribute: 'editor-to' },
			editorStyle: { reflect: false, type: 'String', attribute: 'editor-style' },
		},
	}}
/>

<script lang="ts">
	import {
		Key,
		MusicStringImporter,
		type KeyMode,
		type NoteAccidentals,
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
	import ScaleExercise from '$lib/exercises/ScaleExercise.svelte';
	import WebComponentScore from './WebComponentScore.svelte';

	const dispatch = createEventDispatcher();

	type Props = {
		musicString: string;
		staffSizeProp?: string;
		exercise?: string;
		exerciseSettings?: string;
		data?: { [key: string]: string };
		editorFrom?: string;
		editorTo?: string;
		/** off, hover or on */
		editorStyle?: string;
	};
	const {
		musicString,
		staffSizeProp,
		exercise,
		exerciseSettings: exerciseSettingsProp,
		data,
		editorFrom,
		editorTo,
		editorStyle: editorStyleProps,
	}: Props = $props();
	let staffSize = $derived(
		staffSizeProp && parseFloat(staffSizeProp) > 0 ? parseFloat(staffSizeProp) : undefined,
	);
	let scoreComponent: NoteExercise | KeySignatureExercise = $state();

	const editorStyle =
		editorStyleProps === 'off' || editorStyleProps === 'hover' || editorStyleProps === 'on' ?
			editorStyleProps
		:	undefined;

	const exerciseSettings: { accidentals?: NoteAccidentals[] } = {};
	const exItems = exerciseSettingsProp?.split(';');
	exItems?.forEach((item: string) => {
		const setting = item.split(':');
		if (setting && setting.length === 2) {
			switch (setting[0]) {
				case 'accidentals':
					exerciseSettings.accidentals = [];
					const accidentals = setting[1].split(',');
					accidentals.forEach((accidental) => {
						exerciseSettings.accidentals!.push(accidental as NoteAccidentals);
					});
					break;
			}
		}
	});

	export const showAnswer = () => {
		editDisabled = true;
		scoreComponent.showAnswer();
	};

	export const showIncorrect = (root: string, mode: KeyMode) => {
		const key = new Key(root, mode);
		scoreComponent.showIncorrect(key);
	};

	export const updateKeySignatureColor = (index: number, color: string) => {
		scoreComponent.updateKeySignatureColor(index, color);
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
		/** @todo change to $host().dispatchEvent, https://svelte.dev/docs/svelte/$host */
		dispatch('scoreupdate', event);
	}
</script>

{#if exercise === 'NoteExercise'}
	<NoteExercise
		{score}
		{staffSize}
		{positionFrom}
		{positionTo}
		{editDisabled}
		{editorStyle}
		accidentals={exerciseSettings.accidentals}
		onevent={(event) => handleEvent(event)}
		bind:this={scoreComponent}
	/>
{:else if exercise === 'KeySignatureExercise'}
	<KeySignatureExercise
		{score}
		{editorStyle}
		onevent={(event) => handleEvent(event)}
		bind:this={scoreComponent}
	/>
{:else if exercise === 'ScaleExercise'}
	<ScaleExercise {score} onevent={(event) => handleEvent(event)} bind:this={scoreComponent} />
{:else if exercise === 'default' || exercise === '' || exercise === undefined}
	<WebComponentScore {score} />
{:else}
	Unknown exercise: {exercise}
{/if}

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
