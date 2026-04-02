import type { NoteName } from './note.js';
export type ClefType = 'g' | 'f' | 'c' | 'treble' | 'bass' | 'baritone' | 'tenor' | 'alto' | 'mezzosoprano' | 'soprano' | 'perc' | 'none';
export type ClefSymbol = 'g' | 'f' | 'c' | 'perc' | 'none';
export type ClefData = {
    [key in ClefType]: {
        root: NoteName;
        octave: number;
        /**
         * 0-indexed from top line (usually bottom line in music theory, but better
         * for programming (y position) to use top line 0 indexed.
         */
        clefLine: number;
        symbol: ClefSymbol;
        name?: string;
    };
};
export declare class Clef {
    octaveChange?: 2 | 1 | -1 | -2;
    root: NoteName;
    octave: number;
    /** The line which the clef is positioned on, first line is bottom line */
    clefLine: number;
    /** Number of staff lines @todo: should not be part of clef, todo move elsewhere */
    symbol: ClefSymbol;
    name?: string;
    type: ClefType;
    constructor(type?: ClefType, clefLine?: number, octaveChange?: 2 | 1 | -1 | -2);
    /** Return position of the note c within in the system (top line is 0) */
    getCPosition(): number;
    /** Returns offset to treble clef, disregarding octave. Bass clef is -2
     * (c in bass clef is two positions below c in g clef)
     */
    getOffsetToTreble(): number;
    clefLineIsDefault(): boolean;
}
//# sourceMappingURL=clef.d.ts.map