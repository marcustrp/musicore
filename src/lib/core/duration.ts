import Fraction from 'fraction.js';
import { type NoteType } from './rhythmElement.js';

export class Duration {
	/**
	 * Returns the duration of a note as a fraction
	 * @param type
	 * @param dots
	 * @param fractionMultiplier Multiply note fraction with this fraction, useful for tuplets
	 * @returns
	 */
	static getFraction(type: NoteType, dots?: number, fractionMultiplier = new Fraction(1)) {
		const frac = this.getFractionFromType(type);
		return this.addDotsToFraction(frac, dots).mul(fractionMultiplier);
	}

	static getFractionFromType(type: NoteType) {
		let numerator = 1;
		let denominator = 1;
		switch (type) {
			case 'l':
				numerator = 4;
				break;
			case 'b':
				numerator = 2;
				break;
			case 'w':
				break; // do nothing
			case 'h':
				denominator = 2;
				break;
			case 'q':
				denominator = 4;
				break;
			default:
				denominator = +type;
		}
		return new Fraction(numerator, denominator);
	}

	static addDotsToFraction(frac: Fraction, dots: number | undefined) {
		if (dots) {
			const num = dots === 1 ? new Fraction(3, 2) : new Fraction(7, 4);
			return frac.mul(num);
		}
		return frac;
	}

	static getTypeAndDotsFromFraction(fraction: Fraction): { type: NoteType; dots?: number } {
		switch (fraction.toString()) {
			case '7':
				return { type: 'l', dots: 2 };
			case '6':
				return { type: 'l', dots: 1 };
			case '4':
				return { type: 'l' };
			case '3.5':
				return { type: 'b', dots: 2 };
			case '3':
				return { type: 'b', dots: 1 };
			case '2':
				return { type: 'b' };
			case '1.75':
				return { type: 'w', dots: 2 };
			case '1.5':
				return { type: 'w', dots: 1 };
			case '1':
				return { type: 'w' };
			case '0.875':
				return { type: 'h', dots: 2 };
			case '0.75':
				return { type: 'h', dots: 1 };
			case '0.5':
				return { type: 'h' };
			case '0.4375':
				return { type: 'q', dots: 2 };
			case '0.375':
				return { type: 'q', dots: 1 };
			case '0.25':
				return { type: 'q' };
			case '0.21875':
				return { type: '8', dots: 2 };
			case '0.1875':
				return { type: '8', dots: 1 };
			case '0.125':
				return { type: '8' };
			case '0.109375':
				return { type: '16', dots: 2 };
			case '0.09375':
				return { type: '16', dots: 1 };
			case '0.0625':
				return { type: '16' };
			case '0.0546875':
				return { type: '32', dots: 2 };
			case '0.046875':
				return { type: '32', dots: 1 };
			case '0.03125':
				return { type: '32' };
			case '0.02734375':
				return { type: '64', dots: 2 };
			case '0.0234375':
				return { type: '64', dots: 1 };
			case '0.015625':
				return { type: '64' };
			case '0.013671875':
				return { type: '128', dots: 2 };
			case '0.01171875':
				return { type: '128', dots: 1 };
			case '0.0078125':
				return { type: '128' };
			default:
				throw new Error('Unsupported note length ' + fraction);
		}
	}
}
