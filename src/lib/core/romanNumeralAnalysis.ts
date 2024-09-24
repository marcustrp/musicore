import { Key } from './key.js';

/** @todo Implement */
export default class RomanNumeralAnalysis {
	step: string;
	secondaryDominant?: string;
	keyChange?: Key;
	level?: number;

	constructor(step: string) {
		this.step = step;
	}

	clone() {
		const clone = new RomanNumeralAnalysis(this.step);
		clone.secondaryDominant = this.secondaryDominant;
		clone.keyChange = this.keyChange;
		clone.level = this.level;
		return clone;
	}
}
