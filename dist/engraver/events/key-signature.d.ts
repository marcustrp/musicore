import type { ClefType } from '../../core/clef.js';
import type { KeyAccidental } from '../../core/key.js';
import type { Score } from '../../score/score.js';
import type { KeySignatureAccidentalEvent } from './types.js';
export type KeySignatureEventHandlerSettings = {
    /** Weather to update notes or not with the new accidental. Default is true. */
    updateNotes?: boolean;
};
export declare const keySignatureEventHandler: (event: KeySignatureAccidentalEvent, dispatchEvent?: (arg0: KeySignatureAccidentalEvent) => void, settings?: KeySignatureEventHandlerSettings) => boolean;
declare const helpers: {
    updateNotes: (score: Score, position: number, clef: ClefType, accidental: KeyAccidental, added: boolean, settings: KeySignatureEventHandlerSettings) => void;
};
export { helpers };
//# sourceMappingURL=key-signature.d.ts.map