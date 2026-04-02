import { type ClefType } from './clef.js';
import { type KeyMode } from './data/modes.js';
import { type Accidentals, type NoteName } from './note.js';
import { Scale } from './scale.js';
export type KeyAccidental = '#' | 'b';
export type KeyAccidentals = {
    count: number;
    type?: KeyAccidental;
};
/** position 0 is top line in g clef */
export type CustomKeyAccidental = {
    position?: number;
    type: Accidentals;
};
/**
 * key
 * - how handle root when changing accidentals, esp. custom?
 * - scale should support custom accidentals (getting root and mode from key with cust.acc. should work, or at least not return something wrong)
 * - currently both scale and key have method for getting notes...
 */
export declare class Key {
    #private;
    private _rootName;
    get rootName(): NoteName;
    private _rootAccidental?;
    get rootAccidental(): Accidentals | undefined;
    get root(): string;
    get accidentals(): KeyAccidentals;
    colors?: string[];
    _mode: KeyMode;
    get mode(): KeyMode;
    get scale(): Scale;
    get isValid(): boolean;
    constructor(root: string, mode: KeyMode);
    getCustomAccidentals(clef: ClefType): CustomKeyAccidental[];
    /**
     * Sets custom accidentals. Will be converted to key if possible.
     * @param value
     * @param mode Needed when trying to convert to key
     */
    setCustomAccidentals(value: CustomKeyAccidental[], mode: KeyMode): void;
    /** @todo find another way to do unit test instead of this extra function... */
    private testSetCustomAccidentals;
    getAccidental(column: number): CustomKeyAccidental | undefined;
    /**
     * Toggle accidental. If custom accidentals are valid
     * for (any) key, updates key and removes custom
     * accidentals.
     * @param column
     * @param position
     * @param type
     * @param mode Needed when trying to convert to key
     * @param clef
     * @returns true of accidental added, false if removed
     */
    toggleAccidental(column: number, position: number, type: Accidentals, mode: KeyMode, clef?: ClefType): boolean;
    keyToCustomAccidentals(): CustomKeyAccidental[];
    convertCustomAccidentalsToKey(mode: KeyMode): boolean;
    /**
     *
     * @param mode
     * @param clef
     * @returns object if custom accidentals match key signature, otherwise undefined
     * @todo support other modes than major/minor
     */
    customAccidentalsToKey(mode: KeyMode): {
        root: string;
        mode: KeyMode;
        accidentals: KeyAccidentals;
    } | undefined;
    customAccidentalsValid(): boolean;
    static isAccidentalValid(type: KeyAccidental, column: number, position: number, clef: ClefType): boolean;
    /**
     * Get position in sheet music, where position 0 is at bottom line
     * @param type
     * @param column
     * @returns
     */
    static getAccidentalPosition(type: KeyAccidental, column: number, clef?: ClefType): number;
    /** @todo Support modes (dorian etc) */
    static getAccidentals(mode: KeyMode, root: string): KeyAccidentals;
    /** Get note names for c-b with accidentals */
    getNoteNames(): string[];
    setColor(index: number, color: string): void;
    private refreshColorArray;
    /** @todo Support modes (dorian etc) */
    static getAccidentalType(mode: KeyMode, root: string): KeyAccidental | undefined;
    static compare(key1: Key, key2: Key): boolean;
    /**
     * Returns key as string (style:short conformes to ABC format)
     * @returns string
     */
    toString(style?: string): string;
}
//# sourceMappingURL=key.d.ts.map