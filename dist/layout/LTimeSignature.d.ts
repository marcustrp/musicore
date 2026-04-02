import { type TimeSignatureSymbol } from '../index.js';
import { type Font, type Glyph } from '../fonts/types.js';
import { BBox } from '../utils/bBox.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
export type TimeSignatureLayout = ReturnType<LTimeSignature['toObject']>;
export declare class LTimeSignature implements LayoutObject {
    private font;
    x: number;
    y: number;
    count: number | TimeSignatureSymbol;
    unit: number;
    glyphs: Glyph[];
    bBox: BBox;
    constructor(font: Font, count: number | TimeSignatureSymbol, unit: number);
    toObject(): {
        x: number;
        y: number;
        count: number | TimeSignatureSymbol;
        unit: number;
        glyphs: Glyph[];
        bBox: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
    layout(staveSpace: number, staffLines: LStaffLine[], x: number): number;
}
//# sourceMappingURL=LTimeSignature.d.ts.map