import { Note, type ScaleNumberInput } from '../../../core/note.js';
import type { Scale } from '../../../core/scale.js';
import { Tokenizer, type Token } from '../../../utils/tokenizer.js';
export type GraceData = {
    notes: Note[];
    type: 'unacc' | 'acc';
};
type NoteAST = {
    octave: number;
    scaleNumber: ScaleNumberInput;
    length: 'e' | 's';
};
type GraceAST = {
    notes: NoteAST[];
    type: 'unacc' | 'acc';
    /** Slur can be internal (only grace notes) or continues (grace notes and continues to the following "real" note) */
    slur?: 'internal' | 'continues';
};
export declare class GraceProcessor {
    static tokenizer: Tokenizer;
    static process(input: string, octave: number, scale: Scale): GraceData;
    static parse(input: string, octave: number): GraceAST;
    static tokenize(data: string): Generator<Token, void, unknown>;
}
export {};
//# sourceMappingURL=grace.d.ts.map