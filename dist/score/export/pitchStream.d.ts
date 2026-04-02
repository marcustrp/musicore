import { RhythmElement } from '../../core/rhythmElement.js';
import { Score } from '../score.js';
export type ExportSettingsType = {
    type: 'natural' | 'name' | 'scaleNumber' | 'diffClosest' | 'diffClosestPositive' | 'diffClosest-ignoreRepeating' | 'diffClosestPositive-ignoreRepeating';
    part: number;
    voice: number;
    returnType?: 'string' | 'array';
    /** Ignore will return just numbers, no accidentials */
    scaleNumberRelativeTo?: 'major' | 'scale' | 'ignore';
};
export declare class PitchStreamExporter {
    export(score: Score, settings: ExportSettingsType): string | number[] | string[];
    includeNote(note: RhythmElement): boolean;
    getNames(score: Score, barIndexSequence: number[], settings: ExportSettingsType): string[];
    getNaturals(score: Score, barIndexSequence: number[], settings: ExportSettingsType): string[];
    getScaleNumbers(score: Score, barIndexSequence: number[], settings: ExportSettingsType): string[];
    /**
     * returns -3 to 3, where 0 is no change (positive adds 3 to all values).
     * Ignores octave, so a fifth up is regarded as (the smaller) fourth down
     */
    getScaleNumberChangeClosest(score: Score, barIndexSequence: number[], settings: ExportSettingsType): number[];
}
//# sourceMappingURL=pitchStream.d.ts.map