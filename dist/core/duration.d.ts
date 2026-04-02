import Fraction from 'fraction.js';
import { type NoteType } from './rhythmElement.js';
export declare class Duration {
    /**
     * Returns the duration of a note as a fraction
     * @param type
     * @param dots
     * @param fractionMultiplier Multiply note fraction with this fraction, useful for tuplets
     * @returns
     */
    static getFraction(type: NoteType, dots?: number, fractionMultiplier?: Fraction): Fraction;
    static getFractionFromType(type: NoteType): Fraction;
    static addDotsToFraction(frac: Fraction, dots: number | undefined): Fraction;
    static getTypeAndDotsFromFraction(fraction: Fraction): {
        type: NoteType;
        dots?: number;
    };
}
//# sourceMappingURL=duration.d.ts.map