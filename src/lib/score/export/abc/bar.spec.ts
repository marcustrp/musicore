import Fraction from 'fraction.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Bar, type BarlineStyle } from '../../../core/bar.js';
import { Coda, Fine, Segno } from '../../../core/data/directions.js';
import { TimeSignature } from '../../../core/timeSignature.js';
import { Score } from '../../score.js';
import { BarGenerator } from './bar.js';

let score: Score;
let warnings: string[];
const addWarning = (message: string) => {
	warnings.push(message);
};
const throwError = (message: string) => {
	throw new Error(message);
};

const checkWarning = (warnings: string[]) => {
	if (warnings.length > 0) console.log(warnings);
	expect(warnings.length).toBe(0);
};

beforeEach(() => {
	score = new Score();
	score.parts.addPart();
	warnings = [];
});

let generator: BarGenerator;
beforeEach(() => {
	generator = new BarGenerator(addWarning, throwError);
});
describe('getBarline()', () => {
	it('should return correct data for all supported barlines', () => {
		const barlines: { style: BarlineStyle; result: string }[] = [
			{ style: 'light-heavy', result: '|]' },
			{ style: 'heavy-light', result: '[|' },
			{ style: 'heavy-heavy', result: '|][|' },
			{ style: 'light-light', result: '||' },
			{ style: 'none', result: '[|]' },
			{ style: 'dotted', result: '.|' },
			{ style: 'regular', result: '|' },
		];
		for (const barline of barlines) {
			const result = generator['getBarline'](barline.style);
			checkWarning(warnings);
			expect(result).toBe(barline.result);
		}
	});
	it('should return empty string for unsupported barline', () => {
		const result = generator['getBarline']('unsupported' as BarlineStyle);
		expect(warnings.length).toBe(1);
		expect(result).toBe('');
	});
	it('should return empty string for undefined barline', () => {
		const result = generator['getBarline'](undefined as unknown as BarlineStyle);
		expect(warnings.length).toBe(1);
		expect(result).toBe('');
	});
});

describe('getBarDirections()', () => {
	it('should return coda', () => {
		const direction = new Coda('from');
		const result = generator['getBarDirections']([direction]);
		checkWarning(warnings);
		expect(result).toBe('!coda!');
	});
	it('should return segno', () => {
		const direction = new Segno('to');
		const result = generator['getBarDirections']([direction]);
		checkWarning(warnings);
		expect(result).toBe('!segno!');
	});
	it('should return D.S. as fine', () => {
		const direction = new Segno('from', 'fine');
		const result = generator['getBarDirections']([direction]);
		checkWarning(warnings);
		expect(result).toBe('!D.S.alfine!');
	});
	it('should return fine', () => {
		const direction = new Fine();
		const result = generator['getBarDirections']([direction]);
		checkWarning(warnings);
		expect(result).toBe('!fine!');
	});
});

describe('getBarAbc()', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});
	it('should handle start and end repeats', () => {
		const bar = {
			barline: 'light-heavy',
			_duration: new Fraction(1),
			timeSignature: new TimeSignature(4, 4),
			endRepeat: 1,
			startRepeat: 1,
		} as unknown as Bar;
		const expectedResult = {
			start: ':',
			end: ':|]',
			lineBreak: false,
		};

		vi.spyOn(BarGenerator.prototype as any, 'getBarline').mockReturnValueOnce('|]');
		const result = generator.getBarAbc(bar, 1);
		checkWarning(warnings);
		expect(result).toEqual(expectedResult);
	});
	it('should return barline with segno direction', () => {
		const bar = {
			barline: 'regular',
			_duration: new Fraction(1),
			timeSignature: new TimeSignature(4, 4),
			directions: [new Segno('to')],
		} as unknown as Bar;
		const expectedResult = {
			start: '',
			end: '!segno!|',
			lineBreak: false,
		};
		vi.spyOn(BarGenerator.prototype as any, 'getBarline').mockReturnValueOnce('|');
		const result = generator.getBarAbc(bar, 1);
		checkWarning(warnings);
		expect(result).toEqual(expectedResult);
	});
	it('should handle first ending', () => {
		const bar = {
			barline: 'regular',
			_duration: new Fraction(1),
			timeSignature: new TimeSignature(4, 4),
			ending: { start: true, number: 1 },
		} as unknown as Bar;
		const expectedResult = {
			start: '[1',
			end: '|',
			lineBreak: false,
		};
		vi.spyOn(BarGenerator.prototype as any, 'getBarline').mockReturnValueOnce('|');
		const result = generator.getBarAbc(bar, 1);
		checkWarning(warnings);
		expect(result).toEqual(expectedResult);
	});
	it('should handle ending 1-2 with end repeat', () => {
		const bar = {
			barline: 'light-heavy',
			_duration: new Fraction(1),
			timeSignature: new TimeSignature(4, 4),
			endRepeat: 1,
			ending: { start: true, number: '1-2' },
		} as unknown as Bar;
		const expectedResult = {
			start: '[1-2',
			end: ':|]',
			lineBreak: false,
		};
		vi.spyOn(BarGenerator.prototype as any, 'getBarline').mockReturnValueOnce('|]');
		const result = generator.getBarAbc(bar, 1);
		checkWarning(warnings);
		expect(result).toEqual(expectedResult);
	});
	it('should handle ending 1,3', () => {
		const bar = {
			barline: 'regular',
			_duration: new Fraction(1),
			timeSignature: new TimeSignature(4, 4),
			ending: { start: true, number: '1,3' },
		} as unknown as Bar;
		const expectedResult = {
			start: '[1,3',
			end: '|',
			lineBreak: false,
		};
		vi.spyOn(BarGenerator.prototype as any, 'getBarline').mockReturnValueOnce('|');
		const result = generator.getBarAbc(bar, 1);
		checkWarning(warnings);
		expect(result).toEqual(expectedResult);
	});
	it('should handle line break with end repeat', () => {
		const bar = {
			barline: 'light-heavy',
			_duration: new Fraction(1),
			timeSignature: new TimeSignature(4, 4),
			endRepeat: 1,
			lineBreak: true,
		} as unknown as Bar;
		const expectedResult = {
			end: ':|]',
			lineBreak: true,
			start: '',
		};
		vi.spyOn(BarGenerator.prototype as any, 'getBarline').mockReturnValueOnce('|]');
		const result = generator.getBarAbc(bar, 1);
		checkWarning(warnings);
		expect(result).toEqual(expectedResult);
	});
	it('should handle line break without any other options', () => {
		const bar = {
			barline: 'regular',
			_duration: new Fraction(1),
			timeSignature: new TimeSignature(4, 4),
			lineBreak: true,
		} as unknown as Bar;
		const expectedResult = {
			start: '',
			end: '|',
			lineBreak: true,
		};
		vi.spyOn(BarGenerator.prototype as any, 'getBarline').mockReturnValueOnce('|');
		const result = generator.getBarAbc(bar, 1);
		checkWarning(warnings);
		expect(result).toEqual(expectedResult);
	});
});
