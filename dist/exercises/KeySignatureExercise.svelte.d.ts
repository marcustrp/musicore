import { Score } from '../score/score.js';
import type { KeySignatureAccidentalEvent } from '../engraver/events/types.js';
import { Key } from '../core/key.js';
type Props = {
    score: Score;
    /** Editors off, shown on hover or on (always shown) */
    editorStyle?: 'off' | 'hover' | 'on';
    /** Disable edit (but editors otherwise works) */
    editDisabled?: boolean;
    onevent: (arg0: KeySignatureAccidentalEvent) => void;
    /** Staff size in mm, default is 18 */
    staffSize?: number;
};
declare const KeySignatureExercise: import("svelte").Component<Props, {
    showIncorrect: (questionKey: Key) => void;
    updateKeySignatureColor: (index: number, color: string) => void;
}, "">;
type KeySignatureExercise = ReturnType<typeof KeySignatureExercise>;
export default KeySignatureExercise;
//# sourceMappingURL=KeySignatureExercise.svelte.d.ts.map