import type { NoteAccidentalEvent, NoteEvent } from './types.js';
import { Note } from '../../index.js';
export type NoteEventHandlerSettings = {
    maxNotes?: number;
};
/** ### Note event functions ### **/
/**
 * Handles a note click event
 */
export declare const noteEventHandler: (event: NoteEvent, dispatchEvent?: (arg0: NoteEvent) => void, settings?: NoteEventHandlerSettings) => boolean;
/** ### Note accidental event functions ### **/
/** Handles a note accidental event */
export declare const noteAccidentalEventHandler: (event: NoteAccidentalEvent, dispatchEvent?: (arg0: NoteAccidentalEvent) => void) => boolean;
/** Exported only for testing currently... */
declare const helpers: {
    getNoteAction: (currentNote: Note, newNote: Note, settings: NoteEventHandlerSettings) => {
        action: "toggle";
    } | {
        action: "update";
        note: Note;
    };
    getNearestNote: (currentNote: Note, newNote: Note) => Note;
};
export { helpers };
//# sourceMappingURL=note.d.ts.map