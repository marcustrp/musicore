export const END = Symbol('END');
/** Based on https://dev.to/ndesmic/writing-a-tokenizer-1j85 */
export class Tokenizer {
    #tokenTypes;
    constructor(tokenTypes) {
        this.#tokenTypes = tokenTypes;
    }
    *tokenize(text) {
        let index = 0;
        while (index < text.length) {
            let hasMatch = false;
            for (const { matcher, type, valueExtractor } of this.#tokenTypes) {
                const currentMatcher = new RegExp(matcher.source, 'y');
                currentMatcher.lastIndex = index;
                const matched = currentMatcher.exec(text);
                if (matched !== null) {
                    index += matched[0].length;
                    if (type !== null && typeof type === 'object') {
                        const subTokenizer = new Tokenizer(type);
                        const subText = matched[0];
                        const subTokens = subTokenizer.tokenize(subText);
                        for (const subToken of subTokens) {
                            if (subToken.type !== END) {
                                // yielding subToken directly to flatten the tokens
                                yield subToken;
                            }
                        }
                    }
                    else if (type != null) {
                        const token = { type, index };
                        if (valueExtractor) {
                            token.value = valueExtractor(matched[0]);
                        }
                        yield token;
                    }
                    hasMatch = true;
                }
            }
            if (!hasMatch) {
                throw new Error(`Unexpected token at index ${index}`);
            }
        }
        yield { type: END };
    }
}
