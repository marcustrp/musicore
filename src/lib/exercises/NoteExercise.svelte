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
		editorsOnHover="true"
		onevent={(event) => handleEvent(event)}
		bind:this={scoreComponent}
	/>
```
-->
<script lang="ts">
	import { noteAccidentalEventHandler, noteEventHandler } from '$lib/engraver/events/note.js';
	import type { NoteAccidentalEvent, NoteEvent } from '$lib/engraver/events/types.js';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import { LNoteHead } from '$lib/layout/LNoteHead.js';
	import type { LayoutSettings } from '$lib/layout/types.js';
	import { BBox } from '$lib/utils/bBox.js';
	import EScore from '$lib/engraver/EScore.svelte';
	import type { Score } from '$lib/score/score.js';

	type Props = {
		/** Score, should contain two whole notes */
		score: Score;
		/** Staff size in mm, default is 18 */
		staffSize?: number;
		positionFrom?: number;
		positionTo?: number;
		/** Always show editors (false) or only on hover (true) */
		editorsOnHover?: boolean;
		/** Disable edit (but editors otherwise works) */
		editDisabled?: boolean;
		onevent: (arg0: NoteEvent | NoteAccidentalEvent) => void;
	};
	const {
		score,
		staffSize,
		editDisabled,
		positionFrom,
		positionTo,
		editorsOnHover,
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

	let scoreComponent: EScore;

	const layoutSettings: LayoutSettings = $state({
		staffSize: staffSize ? staffSize : 18,
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
					//console.log('scoreupdate', event);
					//dispatch('scoreupdate', { detail: event });
					onevent(event);
				}
				return hasUpdated;
			},
			noteAccidental: (event: NoteAccidentalEvent) => {
				if (editDisabled) return false;
				const hasUpdated = noteAccidentalEventHandler(event);
				if (hasUpdated) {
					console.log('scoreupdate', event);
					//dispatch('scoreupdate', { detail: event });
					onevent(event);
				}
				return hasUpdated;
			},
		},
		renderEditorsOnHover: editorsOnHover,
	};
</script>

<!--<AccidentalSelector currentAccidental={layoutSettings.defaultAccidental || '#'} {setAccidental} />-->
<EScore {score} {settings} {layoutSettings} bind:this={scoreComponent} />
