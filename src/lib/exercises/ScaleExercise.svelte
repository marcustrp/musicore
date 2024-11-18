<script module>
	export type ScaleExerciseEditors = {
		note?: {
			positionFrom?: number;
			positionTo?: number;
			mode?: 'first' | 'all';
		};
		noteAccidentals?: boolean;
		keySignature?: boolean;
	};
</script>

<script lang="ts">
	import { noteAccidentalEventHandler, noteEventHandler } from '$lib/engraver/events/note.js';
	import type {
		KeySignatureAccidentalEvent,
		NoteAccidentalEvent,
		NoteEvent,
	} from '$lib/engraver/events/types.js';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import type { LayoutSettings } from '$lib/layout/types.js';
	import { BBox } from '$lib/utils/bBox.js';
	import EScore from '$lib/engraver/EScore.svelte';
	import type { Score } from '$lib/score/score.js';
	import { Note, type NoteAccidentals } from '$lib/core/note.js';
	import AccidentalSelector from './gui/AccidentalSelector.svelte';
	import { keySignatureEventHandler } from '$lib/engraver/events/key-signature.js';
	import { Scale } from '$lib/core/scale.js';

	type Props = {
		score: Score;
		/** Staff size in mm, default is 18 */
		staffSize?: number;
		editors: ScaleExerciseEditors;
		/** Editors off, shown on hover or on (always shown) */
		editorStyle?: 'off' | 'hover' | 'on';
		editDisabled?: boolean;
		/** Array of accidentals to show in AccidentalSelector */
		accidentals: NoteAccidentals[];
		onevent: (arg0: NoteEvent | NoteAccidentalEvent | KeySignatureAccidentalEvent) => void;
	};
	let {
		score,
		staffSize,
		editDisabled,
		accidentals,
		editors,
		editorStyle,
		onevent: dispatchEvent,
	}: Props = $props();

	export function getScale() {
		/**
		 * - fix "auto-complete" scale on writing first note
		 *   - lock notes, but allow editing of accidental
		 * - how to handle melodic minor descending (require printed accidentals on descending b7 and b6)
		 * - notecount if penta/blues? now fixed to 8 (+7 descending)...
		 */
		const notes = score.bars.getNotes('P1', 'V1') as Note[];
		return Scale.modeFromNotes(notes);
	}

	let scoreComponent: ReturnType<typeof EScore>;
	let showDownwards = $state(false);
	const downwardNotes: Note[] = [];

	if (!editors || Object.keys(editors).length === 0) {
		console.error('No editors defined, using default values');
		editors = { noteAccidentals: true };
	}

	const layoutSettings: LayoutSettings = $state({
		staffSize: staffSize ? staffSize : 18,
		noteSpacing: {
			type: 'fixed',
			value: 0.5,
		},
		defaultAccidental: accidentals ? accidentals[0] : 'b',
		render: {
			keySignature: editors.keySignature ? 'editor' : true,
			clef: true,
			timeSignature: false,
			bars: true,
			barlines: false,
			notes: {
				editorAccidental: editors.noteAccidentals,
				editorNote:
					editors.note ?
						{
							positionFrom:
								editors.note.positionFrom !== undefined ? editors.note.positionFrom : -4,
							positionTo: editors.note.positionTo !== undefined ? editors.note.positionTo : 12,
							showNoteName: false,
						}
					:	undefined,
			},
		},
	});
	const settings: EngraverSettings = {
		showBBoxes: false,
		viewBoxMinimum: new BBox(0, -1000, 0, 3000),
		events: {
			note:
				!editDisabled ?
					(event) => noteEventHandler(event, dispatchEvent, { maxNotes: 1 })
				:	undefined,
			noteAccidental:
				!editDisabled ? (event) => noteAccidentalEventHandler(event, dispatchEvent) : undefined,
			keySignature:
				!editDisabled ? (event) => keySignatureEventHandler(event, dispatchEvent) : undefined,
		},
		renderEditorsOnHover: editorStyle === 'hover',
	};

	function onAccidentalSelect(accidental: NoteAccidentals) {
		layoutSettings.defaultAccidental = accidental;
	}

	function toggleDownwards() {
		showDownwards = !showDownwards;
		if (showDownwards) {
			if (downwardNotes.length === 0) {
				for (let i = 0; i < 7; i++) {
					const note = new Note('w', 'c');
					note.invisible = true;
					downwardNotes.push(note);
				}
			}
			while (downwardNotes.length > 0) score.bars.addNote('P1', 'V1', downwardNotes.shift()!);
		} else {
			let previousNumber = 0;
			let index = 0;
			const notes = score.bars.getNotes('P1', 'V1').slice(8);
			notes.forEach((note) => downwardNotes.push(note as Note));
			score.bars.removeBars(8);
		}
		scoreComponent.refresh();
	}
</script>

<!--
@component
Exercise for writing scales

Note input
- prerendered
- write first note, rest completes automatically
- write all notes (with/without predefined note count)

Accidental input
- cautionary only
- key signature only
- key signature with cautionary (when needed)

-->

<div>
	<div>
		<AccidentalSelector {accidentals} onclick={onAccidentalSelect} />
		<button onclick={toggleDownwards}>{showDownwards ? 'Dölj nedväg' : 'Visa nedväg'}</button>
	</div>
	<div>
		<EScore {score} {settings} {layoutSettings} bind:this={scoreComponent} />
	</div>
</div>
