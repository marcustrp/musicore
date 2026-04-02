import { Score } from '../score.js';
/**
 * Function to report a warning or error
 */
export type ReportFunction = {
    (message: string): void;
};
export type AbcExporterSettings = {
    /** The X: information field of ABC */
    referenceNumber?: number;
    /** Minimal includes only X, K, M and L (useful for preview with single lineCount) */
    header?: 'full' | 'minimal';
    /** Number of lines to include in the output */
    lineCount?: number;
};
/**
 * Export a score to ABC notation
 *
 * @todo Add support for multiple parts
 * @todo Add support for multiple voices
 * @todo Add support for multiple staves
 */
export declare class AbcExporter {
    abc: string;
    score: Score;
    warnings: string[];
    export(score: Score, settings?: AbcExporterSettings): string;
    private addError;
    private addWarning;
}
//# sourceMappingURL=abc.d.ts.map