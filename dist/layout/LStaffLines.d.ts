import { type LayoutObject } from './LayoutObject.js';
import { BBox } from '../utils/bBox.js';
import { LStaffLine } from './LStaffLine.js';
import { type LayoutSettingsInternal } from './types.js';
export declare class LStaffLines implements LayoutObject {
    x: number;
    y: number;
    bBox: BBox;
    lines: LStaffLine[];
    constructor(settings: LayoutSettingsInternal, lineCount: number, x: number);
    toObject(): {
        x: number;
        y: number;
        bBox: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        lines: {
            x: number;
            y: number;
            length: number;
            thickness: number;
        }[];
    };
    layout(staveSpace: number, staffMargin: number, x: number): void;
}
//# sourceMappingURL=LStaffLines.d.ts.map