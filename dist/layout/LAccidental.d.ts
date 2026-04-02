import { type NoteAccidentals } from '../index.js';
import { type Glyph } from '../fonts/types.js';
import { type LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
export declare class LAccidental implements LayoutObject {
    x: number;
    y: number;
    type?: NoteAccidentals;
    position?: number | undefined;
    glyph: Glyph;
    bBox: BBox;
    color?: string;
    /**
     *
     * @param settings
     * @param position if undefined, the accidental is not drawn (probably an editor is active)
     * @param type
     */
    constructor(settings: LayoutSettingsInternal, position: number | undefined, type: NoteAccidentals | undefined, color?: string);
    static getGlyph(settings: LayoutSettingsInternal, type: NoteAccidentals): Glyph;
    toObject(): {
        x: number;
        y: number | undefined;
        glyph: Glyph;
        bBox: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        color: string | undefined;
    };
    layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], x: number): number;
}
//# sourceMappingURL=LAccidental.d.ts.map