import Fraction from 'fraction.js';
import ChordSymbol from './chordSymbol.js';
export type NoteType = 'b' | 'l' | 'w' | 'h' | 'q' | '8' | '16' | '32' | '64' | '128' | '256';
export type NoteSize = 'tiny' | 'small' | 'normal' | 'large';
export declare class RhythmElement {
    /** should be readonly, but (at least) musicstring importer needs a fix for that */
    id: string;
    private _type;
    get type(): NoteType;
    set type(type: NoteType);
    /** Size of note. Defaults to normal */
    size?: NoteSize;
    private _dots?;
    get dots(): number | undefined;
    set dots(number: number | undefined);
    /** @todo implement stem */
    stem?: {
        direction: 'up' | 'down';
    };
    /** Chord symbols are always sorterd by offset, level */
    private _chordSymbols?;
    get chordSymbols(): ChordSymbol[] | undefined;
    triplet?: {
        start?: boolean;
        end?: boolean;
        numerator: number;
        denominator: number;
        totalDuration: Fraction;
        noteCount: number;
    };
    lyrics?: [
        {
            text: string;
            syllabic?: 'start' | 'end' | 'continue';
            /** number = 0 is first verse (lyric line) */
            number?: number;
        }
    ];
    invisible?: boolean;
    /** @todo rewrite to lockedProperties, enable editors to lock any property using string keys? */
    locked?: boolean;
    constructor(type: NoteType, dots?: number, id?: string);
    /**
     *
     * @param length
     * @returns
     * @todo move this to a better place, it should be used for quite a lot of elements
     */
    private getNewId;
    getChordSymbol(index?: number): ChordSymbol | undefined;
    /**
     * Returns a chord symbol by offset and/or level.
     * @param offset
     * @param level
     * @returns
     */
    getChordSymbolByPosition(offset?: Fraction, level?: number): ChordSymbol | undefined;
    getChordSymbolIndexByPosition(offset?: Fraction, level?: number): number | undefined;
    private findChordSymbol;
    /** @todo implement */
    getChordSymbolsByOffset(): void;
    /** @todo implement */
    getChoordSymbolsByLevel(): void;
    /**
     * Saves a chord symbol. If a chord symbol with the same offset and level already exists, it will be overwritten.
     * @param chordSymbol
     */
    setChordSymbol(chordSymbol: ChordSymbol): void;
    /**
     * Sorts chord symbols by offset, level. Undefined offset and level are always at the start.
     */
    private sortChordSymbols;
    private sortChordSymbolLevel;
    removeChordSymbols(): void;
    getDuration(ignoreTriplet?: boolean): Fraction;
    /**
     *
     * @param numerator
     * @param denominator
     * @param totalDuration
     * @param noteIndex
     * @param noteCount
     * @todo add error handling
     */
    setTriplet(numerator: number, denominator: number, totalDuration: Fraction, noteIndex: number, noteCount: number): void;
    /**
     *
     * @param items
     * @param numerator
     * @param denominator
     * @returns
     * @todo add error handling
     */
    static calculateTripletDuration(items: RhythmElement[], numerator: number, denominator: number): Fraction;
}
//# sourceMappingURL=rhythmElement.d.ts.map