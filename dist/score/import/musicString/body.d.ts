import Fraction from 'fraction.js';
import { Bar } from '../../../core/bar.js';
import * as Notations from '../../../core/data/notations.js';
import { type BeamValue, Note } from '../../../core/note.js';
import { Rest } from '../../../core/rest.js';
import { type NoteType } from '../../../core/rhythmElement.js';
import { Spacer } from './spacer.js';
import { type InformationItem } from './information.js';
type NoteTypeMusicstring = '_' | '__' | NoteType;
export declare enum BodyMatch {
    FULL = 0,// full match
    SLUR_START = 1,
    TRIPLETS_P = 2,
    TRIPLETS_Q = 3,
    TRIPLETS_R = 4,
    NOTATION = 5,
    STEP = 6,// step (analysis)
    CHORD_SYMBOL = 7,// Chord symbol
    LYRICS = 8,
    SOLFA = 9,// solfa
    FUNCTION = 10,// function (analysis)
    GRACE = 11,
    LENGTH = 12,// length
    CHORD_NOTES = 13,// chord, // [octaveShift and scaleNumber] (string without [], i.e. 13#5+1)
    LENGTH_2 = 14,// length
    CHORD_NOTES_2 = 15,// chord [octaveShift, scaleNumber] (string without [], i.e. 13#5+1)
    NOTE = 16,// NEW/ NOT USED (octaveShift + scaleNumber + length)
    LENGTH_3 = 17,// length
    NOTE_2 = 18,// NEW/ NOT USED octaveShift and scaleNumber
    DOTS = 19,// dots
    TIE = 20,// tie
    SLUR_END = 21
}
export type BodyDataTriplet = {
    p: number;
    q?: number;
    r?: number;
};
export type BodyData = {
    items: string;
    rest?: boolean;
    type: NoteTypeMusicstring;
    typeIsDefault?: boolean;
    dots?: number;
    tie?: boolean;
    step?: string;
    chordSymbol?: string;
    lyrics?: string;
    solfa?: string;
    function?: string;
    grace?: string;
    notations?: string;
    beam?: BeamValue;
    slurs?: {
        type: 'start' | 'end';
        index: number;
    }[];
    triplet?: BodyDataTriplet;
};
type TripletState = {
    p: number;
    q: number;
    r: number;
};
export type TripletQueue = {
    numerator: number;
    denominator: number;
    noteCount: number;
    notes: (Note | Rest)[];
};
export type BodyItem = {
    item: Note | Rest;
    triplet?: {
        p: number;
        q: number;
        r: number;
    };
};
export declare class BodyParser {
    errors: string[];
    duration: Fraction;
    openNotations: {
        position: Fraction;
        item: Notations.IDuration;
    }[];
    slurIndex: number;
    tieState: boolean;
    constructor(errors: string[]);
    parse(input: string, info: InformationItem, bar: Bar): BodyItem[] | undefined;
    /**
   * Split musicstring body item into components
        ## SYNTAX, VERSION 4 ##
    #### note group
    two or more notes may be grouped to
    - define beams
    AND
    - simplyfy rhythm

    Base length is q for a note, so (disregaring beaming):
    - 12 is equal to 18 28
    - 1.2 is equal to 18. 216
    - 12. is equal to 116 28
    - 1_23 is equal to 18 216 316 (sim. for 12_3 and 123_)
    - 1234 is equal to 116 216 216 416

    #### single note/chord
        [decoration][step][chordSymbol][lyrics][solfa][function][[octaveShift][scaleNumber]][length][dots][rest][tie]
        decorations: between !, zero or more: !>!!ff!
    step: `step` or empty, i.e. `IVm`
    chordSymbol: "text" or empty, "C/E"
    lyrics: 'text' or empty, i.e. 'Lo-'
    solfa: ´text´ or empty, ´re´
    function: *function* or empty, *D7/3*
        octaveShift: **2; - (octave below), + (octave above) or empty. Matches zero to unlimited of -+
        scaleNumber: *1 *2; 1-9 (prefix with accidental #,x,b,bb or empty) or empty. r for rest, z for spacer, i for invisible
        length: *1; __, _, q, d, w, h, q, e or 8, s or 16, t or 32, 64, 128 or empty (_ doubles default, __ quadruples default, q = longa, d = brevis)
        dots: empty, ., ..
        rest: r or empty
        tie: - or empty. If chord, all notes have tie
        *2: both scaleNumber and length may not be left out at the same time!
    *1: octaveShift and scaleNumber can be encased in [], which indicates chord (multiple notes), but shares other elements

        ## Groups ##
        - See enum BodyMatch
   * @param item
   * @returns
   */
    match(item: string, bar: Bar): BodyData[];
    matchParse(items: string[], inGroup?: boolean): BodyData;
    addSlurs(data: BodyData, type: 'start' | 'end', count: number): void;
    addSlur(data: BodyData, type: 'start' | 'end', index: number): void;
    addTriplet(data: BodyData, p: string, q?: string, r?: string): void;
    getNoteType(items: string[], inGroup: boolean): NoteTypeMusicstring;
    processBodyGroup(group: BodyData[], bar: Bar): void;
    processBodyGroupBeams(group: BodyData[]): void;
    /**
     * handle beaming and automatic length of notes in group
     * @todo support irregular beam groups
     */
    processBodyGroupDuration(group: BodyData[], bar: Bar): BodyData[];
    startTriplet(item: BodyData): TripletState;
    getTripletDefaultQ(_p: number): number;
    getTripletDefaultR(_p: number): number;
    /**
   * Split array of octaveShift and scaleNumber and process one at a time
            0: full match
            1: octaveShift
            2: scaleNumber
            3: note properties
            4: styles
   * @param data
   * @returns
   */
    process(data: BodyData, info: InformationItem): BodyItem | undefined;
    checkTie(data: BodyData, note: Note): void;
    checkTriplet(data: BodyData, item: BodyItem): void;
    addData(item: Note | Spacer, data: BodyData): void;
    private setChordSymbol;
    processNotation(note: Note | Spacer, item: string): void;
    processNotationDuration<T extends Notations.IDuration>(type: Notations.IDurationConstructor<T>, name: string, item: string): T | null | undefined;
    processGrace(note: Note, graceData: string, info: InformationItem): void;
}
export {};
//# sourceMappingURL=body.d.ts.map