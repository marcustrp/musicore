import Fraction from 'fraction.js';
import { describe, expect, it, vi } from 'vitest';
import { Duration } from './duration';
import { NoteType } from './rhythmElement';

describe('Duration.getFractionFromType', () => {
	it('should return correct fraction for l', () => {
		const frac = new Fraction(4, 1);
		const type: NoteType = 'l';
		const result = Duration.getFractionFromType(type);
		expect(result).toEqual(frac);
	});
	it('should return correct fraction for b', () => {
		const frac = new Fraction(2, 1);
		const type: NoteType = 'b';
		const result = Duration.getFractionFromType(type);
		expect(result).toEqual(frac);
	});
	it('should return correct fraction for w', () => {
		const frac = new Fraction(1, 1);
		const type: NoteType = 'w';
		const result = Duration.getFractionFromType(type);
		expect(result).toEqual(frac);
	});
	it('should return correct fraction for h', () => {
		const frac = new Fraction(1, 2);
		const type: NoteType = 'h';
		const result = Duration.getFractionFromType(type);
		expect(result).toEqual(frac);
	});
	it('should return correct fraction for q', () => {
		const frac = new Fraction(1, 4);
		const type: NoteType = 'q';
		const result = Duration.getFractionFromType(type);
		expect(result).toEqual(frac);
	});
	it('should return correct fraction for 8', () => {
		// notes shorter that 8 use exact same code
		const frac = new Fraction(1, 8);
		const type: NoteType = '8';
		const result = Duration.getFractionFromType(type);
		expect(result).toEqual(frac);
	});
});

describe('Duration.addDotsToFraction', () => {
	it('should correctly dots if undefined', () => {
		const expecedResult = new Fraction(1, 4);
		const frac = new Fraction(1, 4);
		const result = Duration.addDotsToFraction(frac, undefined);
		expect(result).toEqual(expecedResult);
	});
	it('should correctly ignore dots if zero dots', () => {
		const expecedResult = new Fraction(1, 4);
		const frac = new Fraction(1, 4);
		const result = Duration.addDotsToFraction(frac, 0);
		expect(result).toEqual(expecedResult);
	});
	it('should correctly add one dot duration', () => {
		const expecedResult = new Fraction(3, 8);
		const frac = new Fraction(1, 4);
		const result = Duration.addDotsToFraction(frac, 1);
		expect(result).toEqual(expecedResult);
	});
	it('should correctly add two dots duration', () => {
		const expecedResult = new Fraction(7, 16);
		const frac = new Fraction(1, 4);
		const result = Duration.addDotsToFraction(frac, 2);
		expect(result).toEqual(expecedResult);
	});
});

describe('Duration.getTypeAndDotsFromFraction()', () => {
	const data = [
		{
			fraction: '7',
			data: { type: 'l', dots: 2 },
		},
		{
			fraction: '6',
			data: { type: 'l', dots: 1 },
		},
		{ fraction: '4', data: { type: 'l' } },
		{ fraction: '3.5', data: { type: 'b', dots: 2 } },
		{ fraction: '3', data: { type: 'b', dots: 1 } },
		{ fraction: '2', data: { type: 'b' } },
		{ fraction: '1.75', data: { type: 'w', dots: 2 } },
		{ fraction: '1.5', data: { type: 'w', dots: 1 } },
		{ fraction: '1', data: { type: 'w' } },
		{ fraction: '0.875', data: { type: 'h', dots: 2 } },
		{ fraction: '0.75', data: { type: 'h', dots: 1 } },
		{ fraction: '0.5', data: { type: 'h' } },
		{ fraction: '0.4375', data: { type: 'q', dots: 2 } },
		{ fraction: '0.375', data: { type: 'q', dots: 1 } },
		{ fraction: '0.25', data: { type: 'q' } },
		{ fraction: '0.21875', data: { type: '8', dots: 2 } },
		{ fraction: '0.1875', data: { type: '8', dots: 1 } },
		{ fraction: '0.125', data: { type: '8' } },
		{ fraction: '0.109375', data: { type: '16', dots: 2 } },
		{ fraction: '0.09375', data: { type: '16', dots: 1 } },
		{ fraction: '0.0625', data: { type: '16' } },
		{ fraction: '0.0546875', data: { type: '32', dots: 2 } },
		{ fraction: '0.046875', data: { type: '32', dots: 1 } },
		{ fraction: '0.03125', data: { type: '32' } },
		{ fraction: '0.02734375', data: { type: '64', dots: 2 } },
		{ fraction: '0.0234375', data: { type: '64', dots: 1 } },
		{ fraction: '0.015625', data: { type: '64' } },
		{ fraction: '0.013671875', data: { type: '128', dots: 2 } },
		{ fraction: '0.01171875', data: { type: '128', dots: 1 } },
		{ fraction: '0.0078125', data: { type: '128' } },
	];
	data.forEach((item) => {
		it('should return correct type and dots for fraction ' + item.fraction, () => {
			const frac = new Fraction(item.fraction);
			const result = Duration.getTypeAndDotsFromFraction(frac);
			expect(result).toEqual(item.data);
		});
	});

	it('should throw error for invalid fraction', () => {
		const frac = new Fraction(1, 3);
		expect(() => Duration.getTypeAndDotsFromFraction(frac)).toThrowError();
	});
});

describe('Duration.getFraction()', () => {
	it('should return correct fraction with no dots', () => {
		vi.spyOn(Duration as any, 'getFractionFromType').mockReturnValueOnce(new Fraction(1, 4));
		vi.spyOn(Duration as any, 'addDotsToFraction').mockReturnValueOnce(new Fraction(1, 4));
		const frac = new Fraction(1, 4);
		const type: NoteType = 'q';
		const result = Duration.getFraction(type);
		expect(result).toEqual(frac);
	});
	it('should return correct fraction with one dot', () => {
		vi.spyOn(Duration as any, 'getFractionFromType').mockReturnValueOnce(new Fraction(1, 4));
		vi.spyOn(Duration as any, 'addDotsToFraction').mockReturnValueOnce(new Fraction(3, 8));
		const frac = new Fraction(3, 8);
		const type: NoteType = 'q';
		const result = Duration.getFraction(type, 1);
		expect(result).toEqual(frac);
	});
});
