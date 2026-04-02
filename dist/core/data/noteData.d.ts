import { type NoteAccidentals } from '../note.js';
export declare const stepToAccidental: {
    [key: number]: NoteAccidentals;
};
export declare const accidentalToStep: {
    [key in NoteAccidentals]: number;
};
declare const naturalNoteNames: {
    name: string;
    stepsFromPrevious: number;
}[];
/**
 * All 7 natural note names, with number of halv steps from previous natural note
 * @example naturalNoteNames[0] is {name: 'c', stepsFromPrevious: 1}
 */
export { naturalNoteNames };
declare const nameToNoteIndex: {
    [key: string]: number;
};
declare const noteNumberToNoteIndex: {
    [key: string]: number;
};
/**
 * Object with noteName to note number for all notes with up to two accidentals
 * @example nameToNoteIndex['c'] is 0
 * @example nameToNoteIndex['bbb'] is 9
 * @example nameToNoteIndex['bb'] is 10
 * @example nameToNoteIndex['b'] is 11
 * @example nameToNoteIndex['b#'] is 0
 * @example nameToNoteIndex['bx'] is 1
 * @todo variable might need to be renamed
 */
export { nameToNoteIndex };
/**
 * Object with scaleNumber to note number for all notes with up to two accidentals
 * @example noteNumberToNoteIndex['1'] is 0
 * @example noteNumberToNoteIndex['b2'] is 1)
 * @example noteNumberToNoteIndex['7'] is 11
 * @todo variable might need to be renamed
 */
export { noteNumberToNoteIndex };
declare const noteIndexToNameInScale: {
    [key: string]: {
        [key: number]: {
            text: string;
            html: string;
        };
    };
};
/**
 * Default note names for all notes in a standard major scale.
 * Used alterations are #1, b3, #4, b6 and b7.
 * @example noteIndexToNameInScale['c#'][0] is {text: 'c#', ...}
 * @example noteIndexToNameInScale['a'][3] is {text: 'c', ...}
 * @todo remove html from this object
 */
export { noteIndexToNameInScale as noteIndexToNameInScale };
//# sourceMappingURL=noteData.d.ts.map