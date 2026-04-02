import {} from '../index.js';
import {} from '../fonts/types.js';
import {} from './types.js';
import { BBox } from '../utils/bBox.js';
import {} from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
export class LAccidental {
    x = 0;
    y = 0;
    type;
    position;
    glyph;
    bBox;
    color;
    /**
     *
     * @param settings
     * @param position if undefined, the accidental is not drawn (probably an editor is active)
     * @param type
     */
    constructor(settings, position, type, color) {
        this.type = type;
        this.position = position;
        if (!type)
            type = settings.defaultAccidental;
        this.glyph = LAccidental.getGlyph(settings, type);
        this.bBox = BBox.clone(this.glyph.bBox);
        this.color = color;
    }
    static getGlyph(settings, type) {
        switch (type) {
            case '#':
                return settings.font.glyphs['accidentalSharp'];
            case 'b':
                return settings.font.glyphs['accidentalFlat'];
            case 'n':
                return settings.font.glyphs['accidentalNatural'];
            case 'bb':
                return settings.font.glyphs['accidentalDoubleFlat'];
            case 'x':
                return settings.font.glyphs['accidentalDoubleSharp'];
            case 'n#':
                return settings.font.glyphs['accidentalNaturalSharp'];
            case 'nb':
                return settings.font.glyphs['accidentalNaturalFlat'];
            default:
                throw new Error(`Unsupported accidental type: ${type}`);
        }
    }
    toObject() {
        return {
            x: this.x,
            y: this.position === undefined ? undefined : this.y, // position undefined = do not draw (probably an editor is active)
            glyph: this.glyph,
            bBox: this.bBox.toObject(),
            color: this.color,
        };
    }
    layout(settings, staffLines, x) {
        if (!this.type)
            return x;
        this.x = x;
        if (this.position !== undefined)
            this.y = staffLines[0].y + this.position * (settings.staveSpace / 2);
        x += this.glyph.horizAdvX;
        this.bBox.setXY(this.x + (this.glyph.bBox?.x || 0), this.y + (this.glyph.bBox?.y || 0));
        return x;
    }
}
