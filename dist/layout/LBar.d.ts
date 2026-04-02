import { type BarlineStyle } from '../index.js';
import { type Font } from '../fonts/types.js';
import { LClef } from './LClef.js';
import { LRhythmElement } from './LRhythmElement.js';
import { LStaffLine } from './LStaffLine.js';
import { type LayoutObject } from './LayoutObject.js';
import { LBarline } from './LBarline.js';
import { type LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
export type BarLayout = ReturnType<LBar['toObject']>;
export declare class LBar implements LayoutObject {
    x: number;
    y: number;
    index: number;
    bBox: BBox;
    notes: LRhythmElement[];
    barline: LBarline;
    constructor(font: Font, index: number, notes: LRhythmElement[], barline: BarlineStyle, startRepeat?: number | string, endRepeat?: number | string);
    toObject(settings: LayoutSettingsInternal): {
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
    };
    layout(settings: LayoutSettingsInternal, barIndex: number, staffLines: LStaffLine[], clef: LClef, x: number): number;
}
//# sourceMappingURL=LBar.d.ts.map