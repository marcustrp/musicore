import type { ClefType } from '$lib/core/clef.js';
import type { KeyAccidental } from '$lib/core/key.js';
import { Note } from '$lib/core/note.js';
import { LNoteHead } from '$lib/layout/LNoteHead.js';
import type { Score } from '$lib/score/score.js';
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
	const oldAccidental = event.score.bars.bars[0].key.getAccidental(event.column);
	const added = event.score.bars.bars[0].key.toggleAccidental(
		event.column,
		event.position,
		event.accidental,
		event.key.mode,
		event.clef,
	);
	updateNotes(event.score, event.position, event.clef, event.accidental, added, settings);
	// if accidental was changed, make sure the old is removed correctly
	if (added && oldAccidental && oldAccidental.position !== undefined)
		updateNotes(
			event.score,
			oldAccidental.position,
			event.clef,
			oldAccidental.type as KeyAccidental,
			added,
			settings,
		);
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
	score: Score,
	position: number,
	clef: ClefType,
	accidental: KeyAccidental,
	added: boolean,
	settings: KeySignatureEventHandlerSettings,
) => {
	const data = LNoteHead.rootAndOctaveFromPosition(position, clef);
	if (!data) return;
	score.parts._parts.forEach((part) => {
		part.voices.forEach((voice) => {
			voice.getNotes().forEach((note) => {
				if (note instanceof Note && note.root === data.root) {
					// always update diatonic note name
					note.setDiatonicNoteName(note.root + (added ? accidental : ''));
					if (settings.updateNotes && added && !note.accidental) {
						note.setAccidental(accidental);
					} else if (
						settings.updateNotes &&
						note.accidental === accidental &&
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
