import { SheetMusicLayout, type EngravingData } from '../layout/scoreLayout.js';
import type { LayoutSettings } from '../layout/types.js';
import type { BBox } from '../utils/bBox.js';
import { Score } from '../index.js';
import type { KeySignatureAccidentalEvent, NoteAccidentalEvent, NoteEvent } from './events/types.js';
/**
 * showBBoxes
 * viewBoxMinimum: Set default minimums for viewbox. It is for example useful to set
 * viewBoxMinimum to (0, -1000, 0, 0) to force a minimum y of -1000, to avoid rescaling
 * when adding b accidental to a note on the second ledger line in a note editor
 */
export type EngraverSettings = {
    showBBoxes?: boolean;
    viewBoxMinimum?: BBox;
    events?: {
        keySignature?: (event: KeySignatureAccidentalEvent) => boolean;
        note?: (event: NoteEvent) => boolean;
        noteAccidental?: (event: NoteAccidentalEvent) => boolean;
    };
    renderEditorsOnHover?: boolean;
    hoverState?: boolean;
};
export declare class ScoreEngraver {
    score: Score;
    settings: EngraverSettings;
    layoutSettings: LayoutSettings;
    scoreLayout: SheetMusicLayout;
    subscribed: boolean;
    callback?: (arg0: EngravingData) => void;
    constructor(score: Score, settings: EngraverSettings, layoutSettings: LayoutSettings);
    updateSettings(settings: EngraverSettings): void;
    update(triggerCallback?: boolean): EngravingData;
    private onUpdate;
    register(callback: (arg0: EngravingData) => void): void;
    unregister(): void;
}
//# sourceMappingURL=scoreEngraver.d.ts.map