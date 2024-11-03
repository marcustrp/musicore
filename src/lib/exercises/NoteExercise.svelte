<!--
@component

- Exercise for writing a note on a staff

@example

```svelte
	<NoteExercise
		{score}
		{positionFrom}
		{positionTo}
		{editDisabled}
		editorStyle="hover"
		onevent={(event) => handleEvent(event)}
		bind:this={scoreComponent}
	/>
```
-->
<script lang="ts">
	import { noteAccidentalEventHandler, noteEventHandler } from '$lib/engraver/events/note.js';
	import type { NoteAccidentalEvent, NoteEvent } from '$lib/engraver/events/types.js';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import type { LayoutSettings } from '$lib/layout/types.js';
	import { BBox } from '$lib/utils/bBox.js';
	import EScore from '$lib/engraver/EScore.svelte';
	import type { Score } from '$lib/score/score.js';
	import AccidentalSelector from './gui/AccidentalSelector.svelte';
	import type { NoteAccidentals } from '$lib/core/note.js';

	type Props = {
		/** Score, should contain two whole notes */
		score: Score;
		/** Staff size in mm, default is 18 */
		staffSize?: number;
		positionFrom?: number;
		positionTo?: number;
		/** Editors off, shown on hover or on (always shown) */
		editorStyle?: 'off' | 'hover' | 'on';
		/** Disable edit (but editors otherwise works) */
		editDisabled?: boolean;
		/** Array of accidentals to show in AccidentalSelector */
		accidentals?: NoteAccidentals[];
		onevent: (arg0: NoteEvent | NoteAccidentalEvent) => void;
	};
	const {
		score,
		staffSize,
		editDisabled,
		positionFrom,
		positionTo,
		editorStyle,
		accidentals,
		onevent,
	}: Props = $props();
	/**
	 * Show the answer
	 */
	export const showAnswer = () => {
		//scoreComponent.lockNote(0);
		scoreComponent.showNote(1);
		scoreComponent.setNoteHeadColor(0, 'red');
		showNoteName();
		scoreComponent.refresh();
	};
	export const showNoteName = (show = true) => {
		if (layoutSettings.render?.notes?.editorNote)
			layoutSettings.render.notes.editorNote.showNoteName = show;
	};

	let scoreComponent: ReturnType<typeof EScore>;
	const layoutSettings: LayoutSettings = $state({
		staffSize: staffSize ? staffSize : 25,
		noteSpacing: {
			type: 'fixed',
			value: 2,
		},
		defaultAccidental: accidentals ? accidentals[0] : 'b',
		render: {
			keySignature: false,
			clef: true,
			timeSignature: false,
			bars: true,
			barlines: false,
			notes:
				editorStyle !== 'off' ?
					{
						editorAccidental: accidentals ? { types: accidentals } : undefined,
						editorNote: {
							positionFrom: positionFrom !== undefined ? positionFrom : -4,
							positionTo: positionTo !== undefined ? positionTo : 12,
							showNoteName: false,
						},
					}
				:	undefined,
		},
	});
	const settings: EngraverSettings = {
		showBBoxes: false,
		viewBoxMinimum: new BBox(0, -1000, 0, 3000),
		events: {
			note:
				!editDisabled ? (event) => noteEventHandler(event, onevent, { maxNotes: 1 }) : undefined,
			noteAccidental:
				!editDisabled ? (event) => noteAccidentalEventHandler(event, onevent) : undefined,
		},
		renderEditorsOnHover: editorStyle === 'hover',
	};

	function onAccidentalSelect(accidental: NoteAccidentals) {
		layoutSettings.defaultAccidental = accidental;
	}
</script>

<div>
	{#if accidentals}
		<AccidentalSelector {accidentals} onclick={onAccidentalSelect} />
	{/if}
	<div>
		<EScore {score} {settings} {layoutSettings} bind:this={scoreComponent} />
	</div>
</div>
