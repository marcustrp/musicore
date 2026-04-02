import { type Glyph } from '../fonts/types.js';
import { type LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
import { LLedgerLines } from './LLedgerLines.js';
import { LStaffLine } from './LStaffLine.js';
import { type LayoutObject } from './LayoutObject.js';
export type ColumnEditorItemLayout = {
    x: number;
    y: number;
    position: number;
    text?: string;
};
export type ColumnEditorLayout = ReturnType<LColumnEditor['toObject']>;
export declare class LColumnEditor implements LayoutObject {
    #private;
    x: number;
    y: number;
    bBox: BBox;
    private items;
    private _fromPosition;
    private _toPosition;
    private _getText?;
    private highlightBBox;
    glyph: Glyph;
    ledgerLines?: {
        above?: LLedgerLines;
        below?: LLedgerLines;
    };
    /**
     *
     * @param settings
     * @param glyph
     * @param fromPosition
     * @param toPosition
     * @param width If not set, the width of the glyph is used
     */
    constructor(settings: LayoutSettingsInternal, glyph: Glyph, fromPosition: number, toPosition: number, drawLedgerLines: boolean, getText?: (position: number) => string, width?: number);
    createLedgerLines(settings: LayoutSettingsInternal): void;
    toObject(barIndex: number, dataValue?: string): {
        items: ColumnEditorItemLayout[];
        glyph: Glyph;
        bBox: BBox;
        dataValue: string | undefined;
        barIndex: number;
        text: {
            x: number;
            y: number;
        } | undefined;
        ledgerLines: {
            above: import("./types.js").LedgerLineLayout[];
            below: import("./types.js").LedgerLineLayout[];
        } | undefined;
    };
    calculateHighlightBBox(settings: LayoutSettingsInternal): void;
    layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], x: number): number;
    layoutLedgerLines(settings: LayoutSettingsInternal, staffLines: LStaffLine[]): void;
}
//# sourceMappingURL=LColumnEditor.d.ts.map