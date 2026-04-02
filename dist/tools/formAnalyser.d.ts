import { Score } from '../score/score.js';
type JumpType = 'repeat' | 'ending' | 'segno' | 'coda';
export type JumpData = {
    fromBar: number;
    toBar: number;
    type: JumpType;
};
export type FormData = {
    barSequence: number[];
    jumps: JumpData[];
};
/**
 * Exports array of bar index, taking in to account repeats,
 * endings, segno, codas...
 */
export declare class FormAnalyser {
    private score;
    private sequence;
    private jumps;
    private repeat;
    private repeatStart;
    private ending;
    private nextEnding;
    private inEnding;
    private iterations;
    parse(score: Score): FormData;
    private scan;
    private getEnding;
    private addJump;
}
export {};
//# sourceMappingURL=formAnalyser.d.ts.map