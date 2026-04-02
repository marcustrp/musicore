import Fraction from 'fraction.js';
import { type ClefType, type NoteType } from '../index.js';
import { type LayoutObject } from './LayoutObject.js';
import { LClef } from './LClef.js';
import { LStaffLine } from './LStaffLine.js';
import { type LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
import type { RhythmElementTypeLayout } from './types.js';
export declare class LRhythmElement implements LayoutObject {
    #private;
    x: number;
    y: number;
    index: number;
    paddingRight: number;
    bBox: BBox;
    type: NoteType;
    dots?: number;
    objectType: RhythmElementTypeLayout;
    clef: ClefType;
    constructor(clef: ClefType, index: number, type: NoteType, duration: Fraction, dots?: number);
    toObject(barIndex: number): void;
    /** TODO need much more finesse... (space after note) */
    getSpacing(settings: LayoutSettingsInternal): number;
    static layout(settings: LayoutSettingsInternal, notes: LRhythmElement[], staffLines: LStaffLine[], clef: LClef, x: number): number;
}
//# sourceMappingURL=LRhythmElement.d.ts.map