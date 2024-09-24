import { LNoteHead } from '$lib/layout/LNoteHead.js';
import type { NoteAccidentalEvent, NoteEvent } from './types.js';
import { Note } from '$lib/index.js';

export const noteEventHandler = (event: NoteEvent): boolean => {
	const note = event.note;
	console.log(event.score.bars.bars[0]);
	const data = LNoteHead.rootAndOctaveFromPosition(event.position, event.clef);
	if (!data) return false;
	const coreNote = new Note('q', data.root, undefined, data.octave);
	if (note.invisible) {
		const scale = event.score.bars.bars[event.barIndex].key.scale;
		note.setPitch(scale, coreNote.root, undefined, coreNote.octave);
		note.invisible = false;
	} else {
		note.toggleNote(coreNote, 'invisible');
	}
	return true;
};

export const noteAccidentalEventHandler = (event: NoteAccidentalEvent): boolean => {
	let note = event.note;
	if (event.index > 0) {
		if (!note.chord || note.chord.length <= event.index - 1) throw new Error('Invalid chord index');
		note = note.chord[event.index - 1];
	}

	if (
		(note.accidental || note.printedAccidental) &&
		note.accidental === note.printedAccidental?.value &&
		note.accidental === event.settings.defaultAccidental
	) {
		// remove printed accidental
		note.removePrintedAccidental();
		console.log('REMOVE PRINTED', note.accidental, note.printedAccidental);
	} else {
		console.log('ADD PRINTED', note.accidental, note.printedAccidental);
		// add printed accidental
		note.setPrintedAccidental(event.settings.defaultAccidental);
	}
	/*
	if (note.accidental === note.printedAccidental?.value && !note.printedAccidental?.cautionary) {
		console.log('SAMEEEEE');
		note.accidental =
			note.accidental === event.settings.defaultAccidental
				? undefined
				: event.settings.defaultAccidental === 'n'
					? undefined
					: event.settings.defaultAccidental;
		note.printedAccidental = undefined;
	} else if (note.printedAccidental && note.printedAccidental.cautionary) {
		console.log('CAUTIONARYYYYY');
		note.printedAccidental = undefined;
	} else if (
		note.printedAccidental &&
		!(note.printedAccidental.value === 'n' && !note.accidental)
	) {
		console.log('NOT SAMEEEEE');
		note.accidental =
			event.settings.defaultAccidental === 'n' ? undefined : event.settings.defaultAccidental;
		note.printedAccidental = undefined;
		return true;
	} else if (note.accidental === event.settings.defaultAccidental) {
		console.log('SETTING DEFAULT');
		note.printedAccidental = {
			value: event.settings.defaultAccidental as NoteAccidentals,
			cautionary: true
		};
	} else {
		console.log('ELSE', note.accidental, event.settings.defaultAccidental);
		note.accidental =
			note.accidental === event.settings.defaultAccidental
				? undefined
				: event.settings.defaultAccidental === 'n'
					? undefined
					: event.settings.defaultAccidental;
		note.printedAccidental = undefined;
	}*/
	return true;
};
