<script lang="ts">
	import { noteAccidentalEventHandler, noteEventHandler } from '$lib/engraver/events/note.js';
	import type {
		KeySignatureAccidentalEvent,
		NoteAccidentalEvent,
		NoteEvent,
	} from '$lib/engraver/events/types.js';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import { LNoteHead } from '$lib/layout/LNoteHead.js';
	import type { LayoutSettings } from '$lib/layout/types.js';
	import { BBox } from '$lib/utils/bBox.js';
	import EScore from '$lib/engraver/EScore.svelte';
	import type { Score } from '$lib/score/score.js';
	import type { NoteAccidentals } from '$lib/core/note.js';
	import AccidentalSelector from './gui/AccidentalSelector.svelte';
	import { keySignatureEventHandler } from '$lib/engraver/events/key-signature.js';

	type Props = {
		score: Score;
		/** Staff size in mm, default is 18 */
		staffSize?: number;
		positionFrom?: number;
		positionTo?: number;
		/** Editors off, shown on hover or on (always shown) */
		editorStyle?: 'off' | 'hover' | 'on';
		editDisabled?: boolean;
		/** Array of accidentals to show in AccidentalSelector */
		accidentals: NoteAccidentals[];
		onevent: (arg0: NoteEvent | NoteAccidentalEvent | KeySignatureAccidentalEvent) => void;
	};
	const {
		score,
		staffSize,
		editDisabled,
		accidentals,
		positionFrom,
		positionTo,
		editorStyle,
		onevent: dispatchEvent,
	}: Props = $props();

	let scoreComponent: ReturnType<typeof EScore>;

	const layoutSettings: LayoutSettings = $state({
		staffSize: staffSize ? staffSize : 25,
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
				/*editorNote: {
					positionFrom: positionFrom !== undefined ? positionFrom : -4,
					positionTo: positionTo !== undefined ? positionTo : 12,
					showNoteName: false,
				},*/
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

	function noteHander(event: NoteEvent) {
		if (editDisabled) return false;
		const eNote = LNoteHead.rootAndOctaveFromPosition(
			event.position,
			score.parts.getPart(0).getClef(0, 0).type,
		);
		if (eNote && (eNote.root !== event.note.root || eNote.octave !== event.note.octave))
			event.note.invisible = true;
		const hasUpdated = noteEventHandler(event);
		if (hasUpdated) dispatchEvent(event);
		return hasUpdated;
	}

	function noteAccidentalEvent(event: NoteAccidentalEvent) {
		if (editDisabled) return false;
		const hasUpdated = noteAccidentalEventHandler(event);
		if (hasUpdated) dispatchEvent(event);
		return hasUpdated;
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
	<AccidentalSelector {accidentals} onclick={onAccidentalSelect} />
	<div>
		<EScore {score} {settings} {layoutSettings} bind:this={scoreComponent} />
	</div>
</div>
