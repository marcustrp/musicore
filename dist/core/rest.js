import Fraction from 'fraction.js';
import { RhythmElement } from './rhythmElement.js';
export class Rest extends RhythmElement {
    /** Offset from default position. Each integer is the
     * distance between two note lines */
    verticalOffset;
    clone(type, dots, id) {
        const clone = new Rest(type || this.type, dots || this.dots, id || undefined);
        return clone;
    }
}
