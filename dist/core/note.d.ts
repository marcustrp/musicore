import { type Notation } from './data/notations.js';
import FiguredBass from './figuredBass.js';
import FunctionAnalysis from './functionAnalysis.js';
import { type NoteType, RhythmElement } from './rhythmElement.js';
import RomanNumeralAnalysis from './romanNumeralAnalysis.js';
import { Scale } from './scale.js';
export type NoteName = 'c' | 'd' | 'e' | 'f' | 'g' | 'a' | 'b';
export type ScaleNumber = 'b1' | '1' | '#1' | 'b2' | '2' | '#2' | 'b3' | '3' | '#3' | 'b4' | '4' | '#4' | 'b5' | '5' | '#5' | 'b6' | '6' | '#6' | 'bb7' | 'b7' | '7' | '#7' | '8' | '9';
export type ScaleNumberInput = ScaleNumber | 'm3' | 'm6' | 'm7';
export type ScaleNumberParts = {
    number: ScaleNumberNumbers;
    accidental?: ScaleNumberAccidentals;
};
export type ScaleNumberNumbers = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
/**
 * Accidental 'm' in musicString scaleNumber is used to indicate major 3/6/7 i minor
 */
export type ScaleNumberAccidentals = Accidentals | 'm';
export type BeamValue = 'start' | 'continue' | 'end';
export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type Accidentals = '#' | 'b' | 'x' | 'bb';
/** n is natural
 * @todo Support accidentals for microtones
 */
export type NoteAccidentals = Accidentals | 'n#' | 'nb';
export type PrintedNoteAccidental = NoteAccidentals | 'n';
/** "Continue" means there is a tie both to and from this note */
export type TieType = 'start' | 'end' | 'continue';
export declare class Note extends RhythmElement {
    private _root;
    get root(): NoteName;
    private _accidental?;
    get accidental(): NoteAccidentals | undefined;
    /** name consists of root and optional accidental */
    get name(): string;
    /** Note and accidential, like f#. Defaults to root name of note, but when in context of a bar, should
     * be set to the note name in the scale.
     */
    private _diatonicNoteName;
    get diatonicNoteName(): string;
    /** Use string if for example using custom key that cannot be converted to scale */
    setDiatonicNoteName(scale: Scale | string): void;
    /** @todo Should multiple printedAccidentals be supported? */
    printedAccidental?: {
        value: PrintedNoteAccidental;
        bracket?: boolean;
        cautionary?: boolean;
        editorial?: boolean;
        parentheses?: boolean;
    };
    /** 0-9 */
    _octave: number;
    get octave(): number;
    set octave(octave: number);
    /** @todo Old commented property, something from MusicXML or MEI? */
    /**
     * @todo implement beam break (see MEI beam@breaksec)
     * @todo implement feathered beam (see MEI beam@form)
     * @todo implement cross staff beams (see MEI place="mixed")
     * */
    beam?: {
        value: BeamValue;
    };
    _tie?: TieType;
    get tie(): TieType | undefined;
    set tie(type: TieType | undefined);
    /**
     * A chord has the main note plus this array of notes. Main
     * note is always the lowest note in the chord. Chord notes
     * are the same length as the main note.
     */
    chord?: Note[];
    graceNotes?: Note[];
    /** Unaccented borrows from previous note (plays before this note), Accented
     * plays when this note should play, delaying this note. Unknown can be used
     * when it is not known how the grace is played.
     */
    graceType?: 'unacc' | 'acc' | 'unknown';
    solfege?: string;
    analysis?: {
        romanNumeral?: RomanNumeralAnalysis[];
        function?: FunctionAnalysis[];
    };
    figuredBass?: FiguredBass[];
    /** i.e. fermata, dynamic, articulation and so on */
    notations?: Notation[];
    /** First (outermost) slur is number 0 (or undefined) */
    slurs?: {
        type: 'start' | 'end';
        index?: number;
    }[];
    _midiNumber: number;
    get midiNumber(): number;
    private _staffIndex;
    get staffIndex(): number;
    color?: {
        notehead?: string;
    };
    constructor(type: NoteType, root: NoteName, accidental?: NoteAccidentals, octave?: number, dots?: number, staffIndex?: number, id?: string);
    /**
     *
     * @param scaleNumber also accepts 8 and 9
     * @param scaleRootOctave
     * @param scale
     * @param type
     * @param dots
     * @param useScaleMode
     * @returns
     * @todo Remove useScaleMode, that conversion should be done before calling this function
     */
    static fromScaleNumber(scaleNumber: ScaleNumberInput, scaleRootOctave: Octave, scale: Scale, type?: NoteType, dots?: number, useScaleMode?: boolean): Note;
    /**
     * @param scaleNumberParts
     * @param scale
     * @param useScaleMode
     * @returns
     */
    private static processScaleNumber;
    /**
     * Adds accientials to systemName: a,b is ab, ab,# is a, ab,x is a# and so on
     * currently does NOT handle edge cases like a#,x which would be a triple sharp (will return double sharp)
     * @param systemName
     * @param accidental - x, #, b or bb (otherwise returns systemName unmodified)
     * @return systemName
     *
     * @throws Error if systemName is not valid (root name and accidentals)
     * @todo renname function to something more descriptive
     */
    static systemNameAddAccidentals(systemName: string, accidental: string): string;
    /**
     * Sets the midiNumber from the name and octave
     */
    private setMidiNumberFromName;
    /**
     * Set accidential. printedAccidental is also updated: removed of note name is same as
     * diatonic note name, otherwise set to accidental.
     * @param accidental
     */
    setAccidental(accidental: PrintedNoteAccidental | undefined): void;
    setPrintedAccidental(accidental: PrintedNoteAccidental | undefined): void;
    removePrintedAccidental(): void;
    setPitch(scale: Scale, name: NoteName, accidental?: NoteAccidentals, octave?: number): void;
    /**
     * Adds a chord note to this note, and sets the chord note type and dots to this note.
     * Also removes some properties from the chord note, like chord symbols and chord.
     * @param note
     * @todo support different staffIndex
     * @todo sort chord notes by pitch. Main note should always be the lowest note in the chord,
     * chord notes should be sorted by pitch ascending.r
     */
    addChordNote(note: Note): void;
    /**
     * Adds a note if does not exist in the chord already, or removes it if it does.
     * If note is invisible, it is shown
     * @param note
     */
    toggleNote(note: Note, whenLastIsRemoved?: 'rest' | 'invisible'): void;
    /**
     * Adds notations to this note, like articulations, dynamics, ornaments etc.
     * @param item
     *
     * @throws Error if item is undefined
     */
    addNotation(item: Notation): void;
    /**
     *
     * @param ignoreEnd If true, tie of type 'end' is not considered a tie
     * @returns
     */
    hasTie(ignoreEnd?: boolean): boolean | undefined;
    /**
     * Returns a clone of this note. Parameters overrides the cloned note's values.
     * @param type
     * @param root
     * @param accidental
     * @param octave
     * @param dots
     * @param staffIndex
     * @param id
     * @returns
     * @todo unit test
     */
    clone(type?: NoteType, root?: NoteName, accidental?: NoteAccidentals, octave?: number, dots?: number, staffIndex?: number, id?: string): Note;
    /**
     * Validates a note name, like c, c#, cbb, bbb, bx etc
     * @param name
     * @param allowDoubleAccidentals
     * @returns
     */
    static validateName(name: string, allowDoubleAccidentals?: boolean): boolean;
    /**
     * Returns natural note name from system name, like c# is c, bb is b and so on
     * @param name
     * @returns
     *
     * @throws Error if name is empty
     * @todo validate note name
     */
    static nameToNatural(name: string): NoteName;
    /**
     * Returns accidental from system name, like c# is #, bb is bb and so on
     * @param name
     * @todo validate accidental
     */
    static nameToAccidental(name: string): NoteAccidentals;
    /**
     * Returns 0-11 from note system name, where 0 is same as c, 1 is c#, 2 is d and so on
     * @param name
     * @returns Number from 0-11 or -1 if name is not valid
     */
    static nameToNoteIndex(name: string): number;
    /**
     *
     * @param noteNumber
     * @returns
     * @todo unit test
     * @todo change accidental to Accidentals (needs rewrites of fromScaleNumber)
     */
    static getNumberParts(noteNumber: string): ScaleNumberParts | undefined;
    /**
     * Returns 0-11 for note number.
     * @param noteNumber
     * @returns
     * @example '1' returns 0
     * @example '2' returns 2
     * @example 'b3' returns 3
     * @example '7' returns 11
     */
    static noteNumberToNoteIndex(noteNumber: string): number;
    /**
     * Converts scale number (1, b3, #4, 6) to note name in a major scale (i.e. 3 in c major is e)
     * @param noteNumber
     * @returns
     * @example 3 in c major is e
     * @example b3 in c major is eb
     * @example 5 in eb major is bb
     */
    static noteNumberToNameInScale(scaleRoot: string, noteNumber: string): string | undefined;
    /**
     * Returns the note name for a note index in the major scale of the given root note.
     * Used alterations are #1, b3, #4, b6 and b7.
     * @param scaleRoot
     * @param noteIndex
     * @returns
     * @example Note.noteIndexToNameInScale('c', 0) returns 'c'
     * @example Note.noteIndexToNameInScale('c', 1) returns 'c#'
     * @example Note.noteIndexToNameInScale('e', 8) returns 'c'
     */
    static noteIndexToNameInScale(scaleRoot: string, noteIndex: number): string | undefined;
    /**
     * Calculates number of half steps between two note names.
     * Returns undefined if any of the note names are invalid.
     * @param name1
     * @param name2
     * @returns
     * @todo unit test
     */
    static pitchDiff(name1: string, name2: string): number | undefined;
}
//# sourceMappingURL=note.d.ts.map