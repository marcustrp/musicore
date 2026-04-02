import { type BarlineStyle } from '../../../core/bar.js';
import { DaCapo, type Direction, Segno } from '../../../core/data/directions.js';
type BarData = {
    data: string;
    directions?: string;
};
export type BarItem = {
    barline?: BarlineStyle;
    repeatStart?: number;
    repeatEnd?: number;
    ending?: string;
    directionsCurrent?: Direction[];
    directionsNext?: Direction[];
    lineBreak?: boolean;
};
export declare class BarlineParser {
    private errors;
    foundCoda: boolean;
    constructor(errors: string[]);
    parse(data: string): BarItem | null | undefined;
    match(item: string): BarData | null | undefined;
    process(item: BarData): BarItem;
    processData(item: string): BarItem;
    processDecorations(item: string): {
        current: Direction[];
        next: Direction[];
    } | undefined;
    getSegno(item: string): Segno | undefined;
    getDaCapo(item: string): DaCapo | undefined;
    addError(index: number, char: string, data: string, tokenType?: string): void;
}
export {};
//# sourceMappingURL=bar.d.ts.map