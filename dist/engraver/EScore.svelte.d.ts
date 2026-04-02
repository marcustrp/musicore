import { Score } from '../index.js';
import { type EngraverSettings } from './scoreEngraver.js';
import type { LayoutSettings } from '../layout/types.js';
type MyProps = {
    score: Score;
    settings: EngraverSettings;
    layoutSettings: LayoutSettings;
};
declare const EScore: import("svelte").Component<MyProps, {
    showNote: (index: number) => void;
    lockNote: (index: number) => void;
    setNoteHeadColor: (index: number, color: string) => void;
    setKeySignatureColor: (index: number, color: string) => void;
    refresh: () => void;
}, "">;
type EScore = ReturnType<typeof EScore>;
export default EScore;
//# sourceMappingURL=EScore.svelte.d.ts.map