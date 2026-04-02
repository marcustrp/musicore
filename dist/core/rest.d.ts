import Fraction from 'fraction.js';
import { type NoteType, RhythmElement } from './rhythmElement.js';
export declare class Rest extends RhythmElement {
    /** Offset from default position. Each integer is the
     * distance between two note lines */
    verticalOffset?: Fraction;
    clone(type?: NoteType, dots?: number, id?: string): Rest;
}
//# sourceMappingURL=rest.d.ts.map