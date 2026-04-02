import { Score } from '../../score.js';
import { type AbcExporterSettings, type ReportFunction } from '../abc.js';
export declare class BodyGenerator {
    private addWarning;
    private addError;
    private barGenerator;
    private noteGenerator;
    constructor(addWarning: ReportFunction, addError: ReportFunction);
    /**
     * Generate the body of the ABC score (notes, bars, etc.)
     * @param score
     * @returns
     *
     */
    getBody(score: Score, settings?: AbcExporterSettings): string;
}
//# sourceMappingURL=body.d.ts.map