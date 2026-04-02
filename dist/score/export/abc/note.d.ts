import { TimeSignature } from '../../../core/timeSignature.js';
import { Note } from '../../../core/note.js';
import { Rest } from '../../../core/rest.js';
import { type ReportFunction } from '../abc.js';
export declare class NoteGenerator {
    private addWarning;
    private addError;
    constructor(addWarning: ReportFunction, addError: ReportFunction);
    getNote(note: Note, scaleNotes: string[], timeSignature: TimeSignature): string;
    getRest(rest: Rest): string;
    /**
     * Returns slurs of specified type, if any
     * @param type which type of slur to get
     * @param slurs array of slurs (may contain multiple instances of the same type). Can also be empty
     * @returns
     */
    private getSlurs;
    /**
     * Returns grace notes if any
     * @param note
     * @returns
     */
    private getGraceNotes;
    /**
     * Returns a triplet in ABC notation if the note is the start of a triplet
     * @param note
     * @param timeSignature
     * @returns
     */
    private getTriplet;
    /**
     * Get the default denominator for a triplet in the given timeSignature
     * @param numerator
     * @param timeSignature
     * @returns
     *
     * @todo This is used in multiple places. Move to a more generic place
     */
    private getTripletDefaultDenominator;
    /**
     * Handles whether the note should be beamed. If note is beamed, and is not the first note in the beam group,
     * a space is added before the note
     * @param note
     * @returns
     */
    private getNoteBeam;
    private getNoteDecorations;
    private getChordSymbols;
    /**
     * Returns step and/or function analysis for a note
     * @param note
     * @returns
     */
    private getAnalysis;
    private getNoteAccidental;
    private getNoteArticulation;
    /**
     * Returns note name and octave. If note is part of a chord, the chord notes are also included.
     * @param note
     * @returns
     */
    private getNoteNameAndOctave;
    private getPitchNameAndOctave;
    /**
     * Get note length relative to default length.
     * @param note
     * @param defaultLength as defined in the header field L: of the abc file
     * @returns ABC length modifier, or empty string if length is equal to default length.
     */
    private getNoteLength;
}
//# sourceMappingURL=note.d.ts.map