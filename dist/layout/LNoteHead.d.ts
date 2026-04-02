import { type ClefType, Note, type NoteAccidentals, type NoteName, type NoteType } from '../index.js';
import { type Glyph } from '../fonts/types.js';
import { type GlyphKey } from '../fonts/glyphKey.js';
import { type LayoutSettingsInternal } from './types.js';
import { LAccidental } from './LAccidental.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
import { LColumnEditor } from './LColumnEditor.js';
import { BBox } from '../utils/bBox.js';
export declare class LNoteHead implements LayoutObject {
    x: number;
    y: number;
    bBox: BBox;
    type: NoteType;
    dots?: number;
    root: NoteName;
    accidental?: LAccidental;
    editor?: LColumnEditor;
    editorGlyph?: Glyph;
    octave: number;
    glyph: Glyph;
    glyphName: GlyphKey;
    clef: ClefType;
    locked: boolean;
    color?: string;
    constructor(settings: LayoutSettingsInternal, note: Note, clef: ClefType);
    setAccidental(settings: LayoutSettingsInternal, type: NoteAccidentals | undefined, clef: ClefType): void;
    getPosition(clef: ClefType): number;
    static getPositionFromRoot(root: NoteName, octave: number, clef: ClefType): number;
    static rootAndOctaveFromPosition(position: number, clef?: ClefType): {
        root: NoteName;
        octave: number;
    } | null;
    toObject(barIndex: number): {
        objectType: "note";
        type: NoteType;
        root: NoteName;
        accidental: {
            x: number;
            y: number | undefined;
            glyph: Glyph;
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
        glyph: Glyph;
        editor: {
            items: import("./LColumnEditor.js").ColumnEditorItemLayout[];
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
        } | undefined;
        color: string | undefined;
    };
    layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], x: number): void;
    static getMinMaxPosition(notes: LNoteHead[], clef: ClefType): number[];
}
//# sourceMappingURL=LNoteHead.d.ts.map