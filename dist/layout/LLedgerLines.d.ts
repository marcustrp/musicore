import type { Glyph } from '../fonts/types.js';
import type { LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
import type { LayoutObject } from './LayoutObject.js';
import type { LStaffLine } from './LStaffLine.js';
import type { LedgerLineLayout } from './types.js';
export declare class LLedgerLines implements LayoutObject {
    x: number;
    y: number;
    bBox: BBox;
    ledgerPosition: 'above' | 'below';
    lines: LedgerLineLayout[];
    private constructor();
    static create(settings: LayoutSettingsInternal, minOrMaxPosition: number): LLedgerLines | undefined;
    private static getCount;
    private createLines;
    layout(settings: LayoutSettingsInternal, glyph: Glyph, stafflines: LStaffLine[], x: number): void;
}
//# sourceMappingURL=LLedgerLines.d.ts.map