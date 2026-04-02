import { type BarlineStyle } from '../index.js';
import { type Font } from '../fonts/types.js';
import { type LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
export type BarlineLayout = ReturnType<LBarline['toObject']>;
export type RepeatDotsLayout = {
    x: number;
    y1: number;
    y2: number;
    r: number;
};
export type BarlineLineLayout = {
    x: number;
    y: number;
    height: number;
    width: number;
    style: BarlineLineStyleLayout;
    startAtBarline: number;
    lengthStyle: 'full' | 'short' | 'tick';
};
export type BarlineLineStyleLayout = 'solid' | 'dashed' | 'dotted' | 'none' | 'heavy';
export declare class LBarline implements LayoutObject {
    x: number;
    y: number;
    bBox: BBox;
    endRepeat?: RepeatDotsLayout;
    lines: BarlineLineLayout[];
    startRepeat?: RepeatDotsLayout;
    constructor(font: Font, barline: BarlineStyle, startRepeat?: number | string, endRepeat?: number | string);
    /** @todo implement */
    private createRepeatDots;
    private createLines;
    toObject(): {
        x: number;
        y: number;
        bBox: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        startRepeat: RepeatDotsLayout | undefined;
        endRepeat: RepeatDotsLayout | undefined;
        lines: BarlineLineLayout[];
    };
    layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], x: number): number;
    static layoutRepeat(font: Font, repeat: RepeatDotsLayout, staveSpace: number, staffLines: LStaffLine[], x: number): number;
    static layoutLine(font: Font, line: BarlineLineLayout, staveSpace: number, staffLines: LStaffLine[], x: number): number;
}
//# sourceMappingURL=LBarline.d.ts.map