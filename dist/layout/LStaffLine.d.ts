import { type LayoutObject } from './LayoutObject.js';
import { type Font } from '../fonts/types.js';
import { BBox } from '../utils/bBox.js';
export type StaffLineLayout = ReturnType<LStaffLine['toObject']>;
export declare class LStaffLine implements LayoutObject {
    x: number;
    y: number;
    length: number;
    thickness: number;
    bBox: BBox;
    constructor(font: Font, x: number, y: number, length: number);
    toObject(): {
        x: number;
        y: number;
        length: number;
        thickness: number;
    };
}
//# sourceMappingURL=LStaffLine.d.ts.map