import type { NoteAccidentalEvent, NoteEvent } from '../engraver/events/types.js';
import type { Score } from '../score/score.js';
import type { NoteAccidentals } from '../core/note.js';
type Props = {
    /** Score, should contain two whole notes */
    score: Score;
    /** Staff size in mm, default is 18 */
    staffSize?: number;
    positionFrom?: number;
    positionTo?: number;
    /** Editors off, shown on hover or on (always shown) */
    editorStyle?: 'off' | 'hover' | 'on';
    /** Disable edit (but editors otherwise works) */
    editDisabled?: boolean;
    /** Array of accidentals to show in AccidentalSelector */
    accidentals?: NoteAccidentals[];
    onevent: (arg0: NoteEvent | NoteAccidentalEvent) => void;
};
/**
 * - Exercise for writing a note on a staff
 *
 * @example
 *
 * ```svelte
 * <NoteExercise
 * 	{score}
 * 	{positionFrom}
 * 	{positionTo}
 * 	{editDisabled}
 * 	editorStyle="hover"
 * 	onevent={(event) => handleEvent(event)}
 * 	bind:this={scoreComponent}
 * />
 * ```
 */
declare const NoteExercise: import("svelte").Component<Props, {
    /**
         * Show the answer
         */ showAnswer: () => void;
    showNoteName: (show?: boolean) => void;
}, "">;
type NoteExercise = ReturnType<typeof NoteExercise>;
export default NoteExercise;
//# sourceMappingURL=NoteExercise.svelte.d.ts.map