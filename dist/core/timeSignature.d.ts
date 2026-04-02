import Fraction from 'fraction.js';
import { Rest } from './rest.js';
import { Note } from './note.js';
export type TimeSignatureSymbol = 'cut' | 'common';
export type BeamGrouping = {
    eights?: number[];
    sixteenths?: number[];
    sixteensSubdivisions?: number[];
    thirtyseconds?: number[];
    thirtysecondsSubdivisions?: number[];
};
export declare class TimeSignature {
    unit: number;
    /** The numerator of the timeSignature */
    count: number;
    private symbol?;
    duration: Fraction;
    private _type;
    get type(): "simple" | "compound" | "irregular";
    private _beatsPerBar;
    get beatsPerBar(): number;
    /**
     * For beaming, @see BB p153
     * @todo implement new system for beam grouping, with inspiration from Sibelius "4,4" for 4/4 etc
     */
    /** The duration of each beam group
     * @example For 4/4, it is an array of four 1/4 fractions
     * @example For 5/4, it is an array of two fractions: 3/4 and 1/2 (3+2)
     * @example For 6/8, it is an array of two 3/8 fractions
     * @example For 5/8, it is an array of two fractions: 2/8 and 3/8
     * @todo Add definitions for default groupings for other timeSignatures (see Behind Bars )
     * @todo How to implement halv note in 4/4 with four 1/4 fractions?
     */
    beamGroupDurations: Fraction[];
    /**
     *
     * @param count - The numerator of the timeSignature or a supported timeSignature symbol
     * @param unit - The denominator of the timeSignature
     *
     * @todo Add support for compound timeSignature
     */
    constructor(count?: number | TimeSignatureSymbol, unit?: number);
    /**
     * Set time signature type (simple, compound, irregular)
     * @returns
     */
    private getType;
    /**
     * Set beats per bar
     * @returns
     */
    private getBeatsPerBar;
    /**
     * Sets the beamGroupDurations. If no duration is provided it is based on
     * the count and unit of the timeSignature
     * @param duration
     */
    setBeamGroupDuration(duration?: Fraction | Fraction[]): void;
    /**
     * Matches the duration of the timeSignature with the sum of the durations of the beam groups
     * Pushes durations[0] until the total duration is equal to the timeSignature duration
     * If durations[0] is greater than the remaining duration, the remaining duration is pushed as the last duration
     * @param durations
     * @example For 4/4, pass [Fraction(1,4)] to get an array of four 1/4 fractions
     * @throws Error if the sum of the provided durations is greater than the timeSignature duration
     */
    private fillBeamGroupDurations;
    /**
     * Get an array of one or more notes, with ties (if not rest), conforming to the beam group of the timeSignature. Note that this might not be the prefered notation to use, as it doesn't know anything about the surrounding notes.
     * @param startDuration - Where in the bar to start the note from
     * @param note
     * @param overflow - NOT IMPLEMENTED What to do with notes that do not fit in the first bar. Return (default) returns one (or as few as possible) notes (with no tie between notes and overflow), proces returns array of notes that fits with the beam group (with tie between notes and overflow)
     * @returns An object with two properties: notes and overflow. Notes is an array of notes that fit in the first bar, and overflow any notes that do not fit in the first bar
     *
     * @example For 4/4, pass 1/8 and a half note to get tied notes with type [1/8, 1/4, 1/8]
     * @todo Support for h in 4/4 not implemented, see beamGroupDurations
     */
    getNotesFromBeamGroup(startDuration: Fraction, note: Note | Rest, overflow?: 'process' | 'return'): {
        notes: (typeof note)[];
        overflow: (typeof note)[];
    };
    /**
     * Returns the index and the position (duration up to, but not including, that beam group from start of bar) for the beam group that contains the position
     * @param position
     * @returns
     */
    getBeamGroupPosition(position: Fraction): {
        index: number;
        position: Fraction;
    };
    private beamGroupIndexesInSameBar;
    /**
     * Returns the timeSignature as a string, either as a symbol or as a count/unit
     * @param ignoreSymbol - If true, return the count and unit instead of the symbol
     * @returns
     */
    toString(ignoreSymbol?: boolean): string;
}
//# sourceMappingURL=timeSignature.d.ts.map