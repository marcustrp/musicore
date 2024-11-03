import { LNoteHead } from '$lib/layout/LNoteHead.js';
import type { NoteAccidentalEvent, NoteEvent } from './types.js';
import { Note } from '$lib/index.js';

export type NoteEventHandlerSettings = {
	maxNotes?: number;
};

/** ### Note event functions ### **/

/**
 * Handles a note click event
 */
export const noteEventHandler = (
	event: NoteEvent,
	dispatchEvent?: (arg0: NoteEvent) => void,
	settings?: NoteEventHandlerSettings,
): boolean => {
	if (!settings) settings = {};
	const note = event.note;
	const data = LNoteHead.rootAndOctaveFromPosition(event.position, event.clef);
	if (!data) return false;
	const newNote = new Note(note.type, data.root, undefined, data.octave);
	const action = getNoteAction(note, newNote, settings);

	if (action.action === 'update') {
		const scale = event.score.bars.bars[event.barIndex].key.scale;
		action.note.setPitch(scale, newNote.root, undefined, newNote.octave);
	} else {
		note.toggleNote(newNote, 'invisible');
	}
	note.invisible = false;
	if (dispatchEvent) dispatchEvent(event);
	return true;
};

/** Returns what action to take (update/toggle) */
const getNoteAction = (
	currentNote: Note,
	newNote: Note,
	settings: NoteEventHandlerSettings,
): { action: 'toggle' } | { action: 'update'; note: Note } => {
	if (newNote.root === currentNote.root && newNote.octave === currentNote.octave) {
		// clicked on existing note
		return { action: 'toggle' };
	} else {
		// new note
		if (currentNote.invisible) return { action: 'update', note: currentNote };
		const noteCount = 1 + (currentNote.chord ? currentNote.chord?.length : 0);
		// get nearest note, if maxnote is reached
		const note =
			settings.maxNotes && noteCount >= settings.maxNotes ?
				getNearestNote(currentNote, newNote)
			:	undefined;
		if (note) {
			// max notes reached, update nearest note
			return { action: 'update', note: note };
		} else {
			return { action: 'toggle' };
		}
	}
};

/**
 * Return nearest note to newNote (root note or in chord). If equal distance,
 * lower note is returned
 * @param currentNote
 * @param newNote
 * @returns
 */
const getNearestNote = (currentNote: Note, newNote: Note) => {
	let index = 0;
	const newPos = Math.abs(LNoteHead.getPositionFromRoot(newNote.root, newNote.octave, 'g'));
	let distance = Math.abs(
		LNoteHead.getPositionFromRoot(currentNote.root, currentNote.octave, 'g') - newPos,
	);
	currentNote.chord?.forEach((note, i) => {
		if (Math.abs(LNoteHead.getPositionFromRoot(note.root, note.octave, 'g') - newPos) < distance) {
			index = i + 1;
			distance = Math.abs(LNoteHead.getPositionFromRoot(note.root, note.octave, 'g') - newPos);
		}
	});
	return index === 0 ? currentNote : currentNote.chord![index - 1];
};

/** ### Note accidental event functions ### **/

/** Handles a note accidental event */
export const noteAccidentalEventHandler = (
	event: NoteAccidentalEvent,
	dispatchEvent?: (arg0: NoteAccidentalEvent) => void,
): boolean => {
	let note = event.note;
	if (event.index > 0) {
		// index > 0 means chord note[index - 1]
		if (!note.chord || note.chord.length <= event.index - 1) throw new Error('Invalid chord index');
		note = note.chord[event.index - 1];
	}

	if (
		(note.accidental || note.printedAccidental) &&
		note.accidental === note.printedAccidental?.value &&
		note.accidental === event.settings.defaultAccidental
	) {
		// if printed accidental is same as the added one, remove accidental
		note.removePrintedAccidental();
	} else {
		note.setPrintedAccidental(event.settings.defaultAccidental);
	}

	if (dispatchEvent) dispatchEvent(event);
	return true;
};

/** Exported only for testing currently... */
const helpers = {
	getNoteAction,
	getNearestNote,
};
export { helpers };
