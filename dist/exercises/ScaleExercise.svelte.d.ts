export type ScaleExerciseEditors = {
    note?: {
        positionFrom?: number;
        positionTo?: number;
        mode?: 'first' | 'all';
    };
    noteAccidentals?: boolean;
    keySignature?: boolean;
};
import type { KeySignatureAccidentalEvent, NoteAccidentalEvent, NoteEvent } from '../engraver/events/types.js';
import type { Score } from '../score/score.js';
import { type NoteAccidentals } from '../core/note.js';
type Props = {
    score: Score;
    /** Staff size in mm, default is 18 */
    staffSize?: number;
    editors: ScaleExerciseEditors;
    /** Editors off, shown on hover or on (always shown) */
    editorStyle?: 'off' | 'hover' | 'on';
    editDisabled?: boolean;
    /** Array of accidentals to show in AccidentalSelector */
    accidentals: NoteAccidentals[];
    onevent: (arg0: NoteEvent | NoteAccidentalEvent | KeySignatureAccidentalEvent) => void;
};
/**
 * Exercise for writing scales
 *
 * Note input
 * - prerendered
 * - write first note, rest completes automatically
 * - write all notes (with/without predefined note count)
 *
 * Accidental input
 * - cautionary only
 * - key signature only
 * - key signature with cautionary (when needed)
 */
declare const ScaleExercise: import("svelte").Component<Props, {
    getScale: () => undefined;
}, "">;
type ScaleExercise = ReturnType<typeof ScaleExercise>;
export default ScaleExercise;
//# sourceMappingURL=ScaleExercise.svelte.d.ts.map