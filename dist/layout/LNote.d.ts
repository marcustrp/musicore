import { Note, type ClefType } from '../index.js';
import { LNoteStem } from './LNoteStem.js';
import { LRhythmElement } from './LRhythmElement.js';
import { LStaffLine } from './LStaffLine.js';
import { type LayoutSettingsInternal } from './types.js';
import { LNoteHead } from './LNoteHead.js';
import { LColumnEditor } from './LColumnEditor.js';
import { LLedgerLines } from './LLedgerLines.js';
export type NoteLayout = ReturnType<LNote['toObject']>;
export declare class LNote extends LRhythmElement {
    stem?: LNoteStem;
    id: string;
    notes: LNoteHead[];
    ledgerLines?: {
        above?: LLedgerLines;
        below?: LLedgerLines;
    };
    editor?: LColumnEditor;
    invisible?: boolean;
    constructor(clef: ClefType, index: number, settings: LayoutSettingsInternal, note: Note);
    getNoteName(position: number, clef: ClefType): string;
    createLedgerLines(settings: LayoutSettingsInternal): void;
    toObject(barIndex: number): {
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
                bBox: import("../index.js").BBox;
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
            bBox: import("../index.js").BBox;
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
    };
    layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], x: number): number;
    calculateBBox(x: number): void;
    layoutLedgerLines(settings: LayoutSettingsInternal, staffLines: LStaffLine[]): void;
    static create(clef: ClefType, index: number, settings: LayoutSettingsInternal, note: Note): LNote;
}
//# sourceMappingURL=LNote.d.ts.map