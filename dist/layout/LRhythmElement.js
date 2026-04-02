import Fraction from 'fraction.js';
import {} from '../index.js';
import {} from './LayoutObject.js';
import { LClef } from './LClef.js';
import { LStaffLine } from './LStaffLine.js';
import {} from './types.js';
import { BBox } from '../utils/bBox.js';
import { LNote } from './LNote.js';
export class LRhythmElement {
    x = 0;
    y = 0;
    index;
    paddingRight = 0;
    bBox = new BBox();
    type;
    dots;
    #duration;
    objectType = 'undefined';
    clef;
    constructor(clef, index, type, duration, dots) {
        this.type = type;
        this.dots = dots;
        this.#duration = duration;
        this.index = index;
        this.clef = clef;
    }
    /*getPosition(clef?: ClefType) {
        return 0;
    }*/
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toObject(barIndex) {
        throw new Error('Method toObject should be implemented in child classes.');
    }
    /** TODO need much more finesse... (space after note) */
    getSpacing(settings) {
        if (!settings.noteSpacing || settings.noteSpacing.type === 'standard')
            return settings.staveSpace * Math.sqrt(this.#duration.valueOf() * 30);
        if (settings.noteSpacing.type === 'fixed')
            return settings.noteSpacing.value * settings.staveSpace;
        if (settings.noteSpacing.type === 'proportional')
            throw new Error('Not implemented');
        throw new Error('Invalid note spacing type');
    }
    static layout(settings, notes, staffLines, clef, x) {
        notes.forEach((note) => {
            note.x = x;
            //note.y = staffLines[0].y + note.getPosition(clef.type) * (settings.staveSpace / 2);
            if (note instanceof LNote) {
                x = note.layout(settings, staffLines, x);
            }
        });
        return x;
    }
}
