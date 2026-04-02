import { Note } from '../../core/note.js';
import { LNoteHead } from '../../layout/LNoteHead.js';
export const keySignatureEventHandler = (event, dispatchEvent, settings) => {
    if (!settings)
        settings = {};
    if (!('updateNotes' in settings))
        settings.updateNotes = true;
    const oldAccidental = event.score.bars.bars[0].key.getAccidental(event.column);
    const added = event.score.bars.bars[0].key.toggleAccidental(event.column, event.position, event.accidental, event.key.mode, event.clef);
    updateNotes(event.score, event.position, event.clef, event.accidental, added, settings);
    // if accidental was changed, make sure the old is removed correctly
    if (added && oldAccidental && oldAccidental.position !== undefined)
        updateNotes(event.score, oldAccidental.position, event.clef, oldAccidental.type, added, settings);
    if (dispatchEvent)
        dispatchEvent(event);
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
const updateNotes = (score, position, clef, accidental, added, settings) => {
    const data = LNoteHead.rootAndOctaveFromPosition(position, clef);
    if (!data)
        return;
    score.parts._parts.forEach((part) => {
        part.voices.forEach((voice) => {
            voice.getNotes().forEach((note) => {
                if (note instanceof Note && note.root === data.root) {
                    // always update diatonic note name
                    note.setDiatonicNoteName(note.root + (added ? accidental : ''));
                    if (settings.updateNotes && added && !note.accidental) {
                        note.setAccidental(accidental);
                    }
                    else if (settings.updateNotes &&
                        note.accidental === accidental &&
                        !note.printedAccidental) {
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
