import Fraction from 'fraction.js';
export default class ChordSymbol {
    text: string;
    _offset?: Fraction;
    get offset(): Fraction | undefined;
    set offset(value: Fraction | undefined);
    _level?: number;
    get level(): number | undefined;
    set level(value: number | undefined);
    _parenthesis?: 'start' | 'end' | 'both';
    get parenthesis(): 'start' | 'end' | 'both' | undefined;
    set parenthesis(value: 'start' | 'end' | 'both' | undefined);
    /**
     *
     * @param text
     * @param offset position in relation to note, in Duration
     * @param level horisontal level, 0 or undefined is lowest level
     * @param parenthesis
     *
     * @todo split text into data structure for chord
     */
    constructor(text: string, offset?: Fraction, level?: number, parenthesis?: 'start' | 'end' | 'both');
}
//# sourceMappingURL=chordSymbol.d.ts.map