import { Bar } from '../../../core/bar.js';
import { type ReportFunction } from '../abc.js';
export declare class BarGenerator {
    private addWarning;
    private addError;
    constructor(addWarning: ReportFunction, addError: ReportFunction);
    /**
     * Convert MusiCore bar to ABC bar (barlines, repeat signs, directions, endings, line breaks)
     * @param bar
     * @param index
     * @returns
     */
    getBarAbc(bar: Bar, index: number, onNewLine?: boolean): {
        start: string;
        end: string;
        lineBreak: boolean;
    };
    /**
     * Convert MusiCore barline to ABC barline
     * @param barline
     * @returns
     */
    private getBarline;
    /**
     * Converts MusiCore directions to ABC directions (e.g. coda, segno, fine)
     * @param directions
     * @returns
     */
    private getBarDirections;
}
//# sourceMappingURL=bar.d.ts.map