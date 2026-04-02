import { type ClefType } from '../index.js';
import { type Font, type Glyph } from '../fonts/types.js';
import { type LayoutSettingsInternal } from './types.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
import { BBox } from '../utils/bBox.js';
export type ClefLayout = ReturnType<LClef['toObject']>;
export declare class LClef implements LayoutObject {
    private font;
    x: number;
    y: number;
    bBox: BBox;
    type: ClefType;
    glyph: Glyph;
    staffLineIndex: number;
    constructor(font: Font, type: ClefType);
    toObject(): {
        x: number;
        y: number;
        type: ClefType;
        glyph: Glyph;
        bBox: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
    layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[]): number;
}
//# sourceMappingURL=LClef.d.ts.map