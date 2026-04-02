import { type LayoutObject } from './LayoutObject.js';
import { type Font } from '../fonts/types.js';
import { type LayoutSettingsInternal } from './types.js';
import { LNoteHead } from './LNoteHead.js';
import { BBox } from '../utils/bBox.js';
import type { ClefType } from '../index.js';
export type NoteStemLayout = ReturnType<LNoteStem['toObject']>;
export declare class LNoteStem implements LayoutObject {
    x: number;
    y: number;
    length: number;
    width: number;
    bBox: BBox;
    constructor(font: Font, x: number, y: number, length: number);
    getAverageNotePosition(notes: LNoteHead[], clef: ClefType): number;
    getX(notes: LNoteHead[]): number;
    toObject(): {
        x: number;
        y: number;
        length: number;
        width: number;
    };
    layout(settings: LayoutSettingsInternal, notes: LNoteHead[], clef: ClefType): void;
}
//# sourceMappingURL=LNoteStem.d.ts.map