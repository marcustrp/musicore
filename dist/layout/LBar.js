import {} from '../index.js';
import {} from '../fonts/types.js';
import { LClef } from './LClef.js';
import { LNote } from './LNote.js';
import { LRest } from './LRest.js';
import { LRhythmElement } from './LRhythmElement.js';
import { LStaffLine } from './LStaffLine.js';
import {} from './LayoutObject.js';
import { LBarline } from './LBarline.js';
import {} from './types.js';
import { BBox } from '../utils/bBox.js';
export class LBar {
    x = 0;
    y = 0;
    index;
    bBox = new BBox();
    //#barlineStyle: BarlineStyle;
    notes;
    barline;
    constructor(font, index, notes, barline, startRepeat, endRepeat) {
        this.notes = notes;
        this.index = index;
        //this.#barlineStyle = barline;
        this.barline = new LBarline(font, barline, startRepeat, endRepeat);
    }
    toObject(settings) {
        let notes = [];
        notes = this.notes.map((note) => {
            if (note instanceof LNote) {
                return note.toObject(this.index);
            }
            else {
                return note.toObject(this.index);
            }
        });
        return {
            x: this.x,
            y: this.y,
            bBox: this.bBox.toObject(),
            notes: notes,
            barline: !settings.render || settings.render.barlines !== false ?
                this.barline.toObject()
                : undefined,
        };
    }
    layout(settings, barIndex, staffLines, clef, x) {
        // do not add padding if barlines are not rendered, except for first bar
        this.x = x;
        if (barIndex === 0 || !settings.render || settings.render.barlines !== false)
            x += settings.staveSpace;
        if (!settings.render || settings.render.barlines !== false)
            x += settings.staveSpace;
        this.y = staffLines[0].y;
        x = LRhythmElement.layout(settings, this.notes, staffLines, clef, x);
        if (!settings.render || settings.render.barlines !== false) {
            x += settings.staveSpace;
            x = this.barline.layout(settings, staffLines, x);
        }
        this.bBox.setXY(this.x, this.y);
        this.bBox.width = x - this.x;
        this.notes.forEach((note) => {
            this.bBox.merge(note.bBox);
        });
        if (!settings.render || settings.render.barlines !== false)
            this.bBox.merge(this.barline.bBox);
        return x;
    }
}
