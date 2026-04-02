import {} from '../index.js';
import {} from '../fonts/types.js';
import { BBox } from '../utils/bBox.js';
import {} from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
export class LTimeSignature {
    font;
    x = 0;
    y = 0;
    count;
    unit;
    glyphs = [];
    bBox = new BBox();
    constructor(font, count, unit) {
        this.font = font;
        this.count = count;
        this.unit = unit;
        const glyph = this.font.glyphs['timeSigCommon'];
        this.glyphs.push(glyph);
        this.bBox = BBox.clone(glyph.bBox);
    }
    toObject() {
        return {
            x: this.x,
            y: this.y,
            count: this.count,
            unit: this.unit,
            glyphs: this.glyphs,
            bBox: this.bBox.toObject(),
        };
    }
    layout(staveSpace, staffLines, x) {
        x += staveSpace;
        this.x = x;
        this.y = staffLines[2].y;
        this.bBox.setXY(this.x, this.y);
        return x + this.glyphs[0].horizAdvX;
    }
}
