export const END = Symbol('END');
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
export class Tokenizer {
	#tokenTypes;

	constructor(tokenTypes: TokenType[]) {
		this.#tokenTypes = tokenTypes;
	}

	*tokenize(text: string): Generator<Token, void, unknown> {
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
					} else if (type != null) {
						const token: Token = { type, index };
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
		yield { type: END } as Token;
	}
}
