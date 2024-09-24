import { Key } from './key.js';

/** @todo Implement */
export default class FunctionAnalysis {
	function: string;
	bass?: number;
	keyChange?: Key;
	level?: number;

	constructor(func: string) {
		this.function = func;
	}

	clone() {
		const clone = new FunctionAnalysis(this.function);
		clone.bass = this.bass;
		clone.keyChange = this.keyChange;
		clone.level = this.level;
		return clone;
	}
}
