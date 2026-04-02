import { type KeyMode, type CustomKeyAccidental, type KeyAccidentals, type ClefType } from '../index.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
import { LAccidental } from './LAccidental.js';
import { type LayoutSettingsInternal } from './types.js';
import { LColumnEditor } from './LColumnEditor.js';
import { type Glyph } from '../fonts/types.js';
import { BBox } from '../utils/bBox.js';
export type KeySignatureLayout = ReturnType<LKeySignature['toObject']>;
export declare class LKeySignature implements LayoutObject {
    x: number;
    y: number;
    width: number;
    clef: ClefType;
    root: string;
    mode: KeyMode;
    accidentals: LAccidental[];
    editors: LColumnEditor[];
    editorGlyph?: Glyph;
    bBox: BBox;
    constructor(settings: LayoutSettingsInternal, clef: ClefType, root: string, mode: KeyMode, accidentals: KeyAccidentals, customAccidentals: CustomKeyAccidental[], colors: string[] | undefined);
    toObject(settings: LayoutSettingsInternal): {
        x: number;
        y: number;
        root: string;
        mode: KeyMode;
        accidentals: {
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
        }[];
        editors: {
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
        }[];
    };
    layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], x: number): number;
}
//# sourceMappingURL=LKeySignature.d.ts.map