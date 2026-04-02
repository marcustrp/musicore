import { type ScaleType } from './data/modes.js';
import { type NoteAccidentals, Note, type NoteName, type ScaleNumber, type ScaleNumberNumbers } from './note.js';
export declare class Scale {
    type: ScaleType;
    private _root;
    get root(): {
        natural: NoteName;
        accidental?: NoteAccidentals;
        number: number;
    };
    get rootAccidental(): NoteAccidentals | undefined;
    get rootNumber(): number;
    get rootName(): string;
    /**
     * Number of half steps between notes from root.
     * @example major: [0, 2, 4, 5, 7, 9, 11]
     * @example minor: [0, 2, 3, 5, 7, 8, 10]
     */
    steps: number[];
    /**
     * Scale numbers for each note in scale.
     * @example major: ['1', '2', '3', '4', '5', '6', '7']
     * @example minor: ['1', '2', 'b3', '4', '5', 'b6', 'b7']
     */
    scaleNumbers: ScaleNumber[];
    /**
     * Name of scale in swedish, like 'dur' or 'mixolydisk'.
     * @todo Create a system for internationalization
     */
    name: string;
    /**
     * Number of half steps between notes from root, for scales that
     * have different descending steps than ascending. Undefined for
     * scales with identical ascending and descending steps.
     * @example melodic minor: [0, 2, 3, 5, 7, 9, 11]
     */
    stepsDescending?: number[];
    /**
     * Scale numbers for each note in scale, for scales that
     * have different descending steps than ascending. Undefined for
     * scales with identical ascending and descending steps.
     * @example melodic minor: ['1', '2', 'b3', '4', '5', '6', '7']
     */
    scaleNumbersDescending?: string[];
    /**
     *
     * @param root name and accidental, like 'c#' or 'eb'
     * @param type ScaleType or 'custom' (requires customnoteNames)
     * @param customNoteNames array of notenames (root+accidential) for custom scale, from c to b
     *
     * @example new Note('f','custom',['c','d#','e','f','gb','a','b'])
     *
     * @throws Error if root is invalid
     * @throws Error if type is invalid
     */
    constructor(root: string, type: ScaleType, customNoteNames?: string[]);
    /**
     * Create a scale from a string with syntax 'root mode'.
     * @param rootAndMode 'c major', 'f# minor', 'd lydian'
     * @returns
     *
     * @throws Error if root name is invalid
     * @throws Error if mode is invalid
     */
    static fromString(rootAndMode: string): Scale;
    /**
     * Returns note index (0-11) in chromatic scale from midi number. Note index
     * zero is the root of the scale.
     * @param midiNumber
     * @returns 0-11 or -1 if midiNumber is invalid
     *
     * @example for c scale, midiNumber 60 (c4) returns 0
     * @example for c scale, midiNumber 61 (c#4) returns 1
     * @example for a scale, midiNumber 68 (g#4) returns 11
     */
    getScaleNumberIndex(midiNumber: number): number;
    /**
     * Returns the note names of all the notes in this scale.
     * @example D major: d e f# g a b c#
     * @example G minor: g a bb c d eb f g
     * @example A major pentatonic: a b c# e f#
     */
    getDiatonicNoteNames(): string[];
    /**
     * Returns the note name and accidential (if any) for a NoteName in the scale
     * @param root
     * @example f in d major return f#, g in d major return g
     * @example b in g minor returns bb
     * @returns
     */
    getDiatonicNoteName(root: NoteName): string;
    noteIsDiatonic(note: string): boolean;
    /**
     * Returns mapping of natural notes to diatonic notes.
     * @returns
     * @example D major: {d: 'd', e: 'e', f: 'f#', ...}
     */
    getNaturalNoteMapping(): {
        [key: string]: string;
    };
    /**
     * Returns scale type data object from string.
     * @param type
     * @returns
     * @throws Error if type is not supported
     */
    static getScaleType(type: string): {
        steps: number[];
        scaleNumbers: ScaleNumber[];
        name: string;
        stepsDescending?: number[];
        scaleNumbersDescending?: string[];
        identicalTo?: string;
    };
    static validateScaleType(type: string): boolean;
    static modeFromNotes(notes: Note[], requireDescending?: boolean): undefined;
    static modeFromScaleNumbers(scaleNumbers: string[], requireDescending?: boolean): undefined;
    private static validateScaleNumbersToMode;
    private static parseScaleNumberArray;
    /**
     * Returns default scale number for this mode. In minor, 3
     * is b3, in lydian, 4 is #4 and so on.
     * @param scaleNumber
     * @returns
     */
    getModeDefaultScaleNumber(scaleNumber: ScaleNumberNumbers): ScaleNumber;
    /**
     * Returns scale number for note in this scale. If note is not in scale,
     * returns empty string.
     * @param root
     * @param accidental
     * @param relativeToMajor Default true. If true, always return ScaleNumber relative to major scale
     * @returns
     * @example (relativeToMajor = true) f in d major returns b3, f in d minor returns b3.
     * @example (relativeToMajor = false) f in d major returns b3, f in d minor returns 3.
     * @todo this should be moved, see Note.fromScalenumber regarding useScaleMode. It's more of a extended musicString thing.
     */
    getScaleNumberFromNote(root: NoteName, accidental?: NoteAccidentals, relativeToMajor?: boolean): string;
    /**
     * Returns pitch difference from scale for note in halv steps.
     * @param root
     * @param accidental
     * @example f in d major returns -1, f in d minor returns 0.
     * @returns
     */
    getNotePitchDiffFromScale(root: NoteName, accidental: NoteAccidentals | undefined): number;
    /**
     * Return scale number for note in scale (disregarding accidental for both note and scale).
     * @param root
     * @example 'e' in c minor returns 3
     * @example 'c' in d major returns 7
     * @returns 1-7
     */
    getDiatonicScaleNumberFromNote(root: NoteName, scale?: Scale): ScaleNumberNumbers;
    getNearestDiatonicScale(): Scale;
}
//# sourceMappingURL=scale.d.ts.map