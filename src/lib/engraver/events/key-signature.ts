import { Note } from '$lib/core/note.js';
import { LNoteHead } from '$lib/layout/LNoteHead.js';
import type { KeySignatureAccidentalEvent } from './types.js';

export type KeySignatureEventHandlerSettings = {
	/** Weather to update notes or not with the new accidental. Default is true. */
	updateNotes?: boolean;
};

export const keySignatureEventHandler = (
	event: KeySignatureAccidentalEvent,
	dispatchEvent?: (arg0: KeySignatureAccidentalEvent) => void,
	settings?: KeySignatureEventHandlerSettings,
): boolean => {
	if (!settings) settings = {};
	if (!('updateNotes' in settings)) settings.updateNotes = true;
	const added = event.score.bars.bars[0].key.toggleAccidental(
		event.column,
		event.position,
		event.accidental,
		event.key.mode,
		event.clef,
	);
	updateNotes(added, event, settings);
	if (dispatchEvent) dispatchEvent(event);
	return true;
};

/**
 * Update all notes with the changed accidental (if settings.updateNotes is true).
 * All notes have the diatonicNoteName updated regardless of settings.updateNotes
 *
 * When adding
 * - notes with no accidental gets accidental added
 * - other notes are unaffected
 * When removing
 * - notes with the same accidental, but no printed accidental, get accidental removed
 * - other notes are unaffected
 */
const updateNotes = (
	added: boolean,
	event: KeySignatureAccidentalEvent,
	settings: KeySignatureEventHandlerSettings,
) => {
	const data = LNoteHead.rootAndOctaveFromPosition(event.position, event.clef);
	if (!data) return;
	event.score.parts._parts.forEach((part) => {
		part.voices.forEach((voice) => {
			voice.getNotes().forEach((note) => {
				if (note instanceof Note && note.root === data.root) {
					// always update diatonic note name
					note.setDiatonicNoteName(note.root + (added ? event.accidental : ''));
					if (settings.updateNotes && added && !note.accidental) {
						note.setAccidental(event.accidental);
					} else if (
						settings.updateNotes &&
						note.accidental === event.accidental &&
						!note.printedAccidental
					) {
						note.setAccidental(undefined);
					}
				}
			});
		});
	});
};

// Exported only for testing...
const helpers = {
	updateNotes,
};
export { helpers };
