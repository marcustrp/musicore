import { Score } from '../index.js';
import { type LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
import { type LayoutObject } from './LayoutObject.js';
import { LBar } from './LBar.js';
import { LClef } from './LClef.js';
import { LStaffLine } from './LStaffLine.js';
export type BarsLayout = ReturnType<LBars['toObject']>;
export declare class LBars implements LayoutObject {
    x: number;
    y: number;
    bBox: BBox;
    bars: LBar[];
    constructor(settings: LayoutSettingsInternal, score: Score);
    toObject(settings: LayoutSettingsInternal): {
        x: number;
        y: number;
        bBox: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        bars: {
            x: number;
            y: number;
            bBox: {
                x: number;
                y: number;
                width: number;
                height: number;
            };
            notes: ({
                id: string;
                objectType: "note";
                index: number;
                type: import("../index.js").NoteType;
                dots: number | undefined;
                x: number;
                y: number | undefined;
                bBox: {
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                };
                stem: {
                    x: number;
                    y: number;
                    length: number;
                    width: number;
                } | undefined;
                notes: {
                    objectType: "note";
                    type: import("../index.js").NoteType;
                    root: import("../index.js").NoteName;
                    accidental: {
                        x: number;
                        y: number | undefined;
                        glyph: import("../fonts/types.js").Glyph;
                        bBox: {
                            x: number;
                            y: number;
                            width: number;
                            height: number;
                        };
                        color: string | undefined;
                    } | undefined;
                    octave: number;
                    dots: number | undefined;
                    x: number;
                    y: number;
                    bBox: {
                        x: number;
                        y: number;
                        width: number;
                        height: number;
                    };
                    glyph: import("../fonts/types.js").Glyph;
                    editor: {
                        items: import("./LColumnEditor.js").ColumnEditorItemLayout[];
                        glyph: import("../fonts/types.js").Glyph;
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
                    } | undefined;
                    color: string | undefined;
                }[];
                ledgerLines: {
                    above: import("./types.js").LedgerLineLayout[];
                    below: import("./types.js").LedgerLineLayout[];
                } | undefined;
                editor: {
                    items: import("./LColumnEditor.js").ColumnEditorItemLayout[];
                    glyph: import("../fonts/types.js").Glyph;
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
                } | undefined;
            } | {
                objectType: "rest";
                x: number;
                y: number;
                type: import("../index.js").NoteType;
                dots: number | undefined;
                barIndex: number;
            })[];
            barline: {
                x: number;
                y: number;
                bBox: {
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                };
                startRepeat: import("./LBarline.js").RepeatDotsLayout | undefined;
                endRepeat: import("./LBarline.js").RepeatDotsLayout | undefined;
                lines: import("./LBarline.js").BarlineLineLayout[];
            } | undefined;
        }[];
    };
    layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], clef: LClef, x: number): number;
    calculateBBox(): undefined;
}
//# sourceMappingURL=LBars.d.ts.map