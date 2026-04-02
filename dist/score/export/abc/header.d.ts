import { Score } from '../../score.js';
import { type AbcExporterSettings, type ReportFunction } from '../abc.js';
export declare class HeaderGenerator {
    private addWarning;
    private validateError;
    constructor(addWarning: ReportFunction, validateError: ReportFunction);
    /**
     * Returns the ABC header
     * @param score
     * @returns
     */
    getHeader(score: Score, settings?: AbcExporterSettings): string;
    /**
     * Get the timeSignature of the score in ABC format
     * @param score
     * @returns
     */
    private getTimeSignature;
    /**
     * Get the clef of the score in ABC format
     * @param score
     * @returns
     */
    private getClef;
    /**
     * Returns the length unit to be used
     * @param score (not implemented)
     * @returns
     *
     * @todo: optimize the used length unit
     */
    private getLengthUnit;
    /**
     * Returns the tempo of the bar in ABC format, or empty string if no tempo is set
     * @param bar
     * @returns
     */
    private getTempo;
    /**
     * Returns one row for each item in the data array, prefixed with the field
     * @param field
     * @param data
     * @returns
     */
    private getArray;
    /**
     * Returns the data prefixed with the field
     * @param field
     * @param data
     * @param prefix
     * @returns
     */
    private getString;
    /**
     *
     * @param creators
     * @returns
     *
     * @todo: support other creator types, or at least export as some sort of note
     */
    private getComposers;
}
//# sourceMappingURL=header.d.ts.map