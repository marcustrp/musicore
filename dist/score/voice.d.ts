import Fraction from 'fraction.js';
import { Note } from '../core/note.js';
import { Rest } from '../core/rest.js';
import { RhythmElement } from '../core/rhythmElement.js';
import { BarArray } from './barArray.js';
export declare class Voice {
    readonly partId: string;
    readonly id: string;
    private bars;
    /**
     *
     * @param partId
     * @param id
     * @param defaultStaffIndex
     * @param bars Same BarArray as in the score
     */
    constructor(partId: string, id: string, bars: BarArray);
    /**
     * Adds a note to the voice
     * @param note
     * @param bar
     * @param beat
     * @param ignoreOverflow
     */
    addNote(note: Note | Rest, bar?: number, beat?: Fraction, ignoreOverflow?: boolean): void;
    /**
     * Adds multiple notes to the voice
     * @param notes
     * @param bar
     * @param beat
     * @param ignoreOverflow
     */
    addNotes(notes: (Note | Rest)[], bar?: number, beat?: Fraction, ignoreOverflow?: boolean): void;
    /**
     * Adds a "triplet" to the voice
     * @param notes
     * @param numerator
     * @param denominator
     * @param bar
     * @param beat
     * @todo rename, it's not just triplets, what's the correct name?
     * @todo handle invalid input, e.g. numerator > denominator, totalDuration not a "normal" duration
     */
    addTriplet(notes: (Note | Rest)[], numerator: number, denominator: number, bar?: number, beat?: Fraction): void;
    /**
     *
     * @param barIndex if undefined, use last bar
     * @param noteIndex if undefined, get last note in bar
     * @returns
     */
    getNote(barIndex?: number, noteIndex?: number): RhythmElement | undefined;
    /**
     * Returns a note by its index in the voice
     * @param noteIndex
     * @returns
     */
    getNoteByIndex(noteIndex: number): RhythmElement | undefined;
    /** TODO: Add tests and docs */
    getNoteById(id: string): RhythmElement | undefined;
    /**
     * Get next note or returns undefined if no more notes exist
     * @param barIndex
     * @param noteIndex
     */
    getNextNote(barIndex: number, noteIndex: number): RhythmElement | undefined;
    /**
     *
     * @param barIndex if undefined, get last bar
     * @returns
     */
    getNotes(barIndex?: number): RhythmElement[];
    /**
     *
     * @param barIndex
     * @param noteIndex
     * @returns
     * @todo handle tie of note that goes over barline into endings, dal segno, coda...
     * @todo support ties of chord notes
     * @todo unit tests
     */
    addTie(barIndex: number, noteIndex: number): false | undefined;
    /**
     *
     * @param barIndex
     * @param noteIndex
     * @returns
     * @todo handle tie of note that goes over barline into endings, dal segno, coda...
     * @todo support ties of chord notes
     * @todo unit tests
     */
    removeTie(barIndex: number, noteIndex: number): false | undefined;
}
//# sourceMappingURL=voice.d.ts.map