import type { LayoutSettings } from '../../layout/types.js';
import { Key, Note, Score, type ClefType } from '../../index.js';
import type { PrintedNoteAccidental } from '../../core/note.js';
type BaseEvent = {
    eventType: string;
    score: Score;
    settings: LayoutSettings;
};
export type KeySignatureAccidentalEvent = BaseEvent & {
    eventType: 'keySignatureAccidental';
    position: number;
    column: number;
    accidental: PrintedNoteAccidental;
    clef: ClefType;
    key: Key;
};
export type NoteEvent = BaseEvent & {
    eventType: 'note';
    position: number;
    index: number;
    barIndex: number;
    clef: ClefType;
    note: Note;
};
export type NoteAccidentalEvent = BaseEvent & {
    eventType: 'noteAccidental';
    position: number;
    index: number;
    barIndex: number;
    clef: ClefType;
    accidental: PrintedNoteAccidental | undefined;
    note: Note;
};
export type ScoreEvent = KeySignatureAccidentalEvent | NoteEvent | NoteAccidentalEvent;
export {};
//# sourceMappingURL=types.d.ts.map