import { Score } from '../index.js';
import { LStaffLines } from './LStaffLines.js';
import { LClef, type ClefLayout } from './LClef.js';
import { LKeySignature, type KeySignatureLayout } from './LKeySignature.js';
import { LTimeSignature, type TimeSignatureLayout } from './LTimeSignature.js';
import { LBars, type BarsLayout } from './LBars.js';
import { LNote } from './LNote.js';
import { LRest } from './LRest.js';
import LayoutDocument from './LayoutDocument.js';
import { type Font } from '../fonts/types.js';
import { BBox } from '../utils/bBox.js';
import { type LayoutSettings } from './types.js';
import type { StaffLinesLayout } from './types.js';
export type LayoutData = {
    staffLines: LStaffLines;
    clef: LClef;
    key: LKeySignature;
    timeSignature: LTimeSignature;
    bars: LBars;
};
export type EngravingData = {
    document: {
        scale: number;
        bBox: BBox;
    };
    staffLines?: StaffLinesLayout;
    clef?: ClefLayout;
    keySignature?: KeySignatureLayout;
    timeSignature?: TimeSignatureLayout;
    bars?: BarsLayout;
};
/**
 * Layouts the sheet music (but does not draw it)
 * - Inspired by Behind Bars by Elaine Gould
 * - default staff size is 10 (10 units per stave-space)
 */
export declare class SheetMusicLayout {
    #private;
    private score;
    staffSize: number;
    staveSpace: number;
    font: Font;
    document: LayoutDocument;
    testValue: {
        a: number;
    };
    private _layoutData;
    get layoutData(): LayoutData;
    set layoutData(value: LayoutData);
    engravingData: EngravingData;
    private callback?;
    constructor(score: Score, document?: LayoutDocument);
    setup(score: Score): void;
    calculateStaveSpace(): void;
    /**
     *
     * @param staffSize size of stave in mm
     */
    layout(settings?: LayoutSettings): EngravingData;
    getBBox(): BBox;
    mergeBBox(bBox: BBox | undefined, bBox2: BBox | undefined): BBox | undefined;
    getRhythmElementData(note: LNote | LRest): {
        className: string;
        x: number;
        y: number;
        index: number;
        paddingRight: number;
        bBox: BBox;
        type: import("../index.js").NoteType;
        dots?: number;
        objectType: import("./types.js").RhythmElementTypeLayout;
        clef: import("../index.js").ClefType;
    };
    getNoteData(note: LNote): {
        stem: {
            x: number;
            y: number;
            length: number;
            width: number;
            bBox: BBox;
        } | {};
        className: string;
        id: string;
        notes: import("../index.js").LNoteHead[];
        ledgerLines?: {
            above?: import("./LLedgerLines.js").LLedgerLines;
            below?: import("./LLedgerLines.js").LLedgerLines;
        };
        editor?: import("./LColumnEditor.js").LColumnEditor;
        invisible?: boolean;
        x: number;
        y: number;
        index: number;
        paddingRight: number;
        bBox: BBox;
        type: import("../index.js").NoteType;
        dots?: number;
        objectType: import("./types.js").RhythmElementTypeLayout;
        clef: import("../index.js").ClefType;
    };
    getRestData(rest: LRest): {
        className: string;
        x: number;
        y: number;
        index: number;
        paddingRight: number;
        bBox: BBox;
        type: import("../index.js").NoteType;
        dots?: number;
        objectType: import("./types.js").RhythmElementTypeLayout;
        clef: import("../index.js").ClefType;
    };
    register(callback: (arg0: EngravingData) => void): void;
    unregister(): void;
}
//# sourceMappingURL=scoreLayout.d.ts.map