export declare const END: unique symbol;
export type TokenType = {
    matcher: RegExp;
    /** Using TokenType as type enables recursive tokenization on match. Returned
     * tokens are flattened.
     */
    type?: number | null | TokenType[];
    valueExtractor?: (value: string) => any;
};
export type Token = {
    type: number | symbol;
    index?: number;
    value?: any;
};
/** Based on https://dev.to/ndesmic/writing-a-tokenizer-1j85 */
export declare class Tokenizer {
    #private;
    constructor(tokenTypes: TokenType[]);
    tokenize(text: string): Generator<Token, void, unknown>;
}
//# sourceMappingURL=tokenizer.d.ts.map