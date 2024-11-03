import { it, expect, describe } from 'vitest';
import { Clef, type ClefSymbol, type ClefType } from './clef.js';

describe('Clef', () => {
	it('should have correct default style', () => {
		const standardClef = {
			symbol: 'g',
		};
		const clef = new Clef();
		expect(clef).toMatchObject(standardClef);
	});
	it('should set octaveChange if defined', () => {
		const clef = new Clef('treble', undefined, 2);
		expect(clef.octaveChange).toBe(2);
	});
	const clefs: { type: ClefType; symbol: ClefSymbol; clefLine?: number }[] = [
		{ type: 'treble', symbol: 'g', clefLine: 3 },
		{ type: 'g', symbol: 'g', clefLine: 3 },
		{ type: 'g', symbol: 'g', clefLine: 3 },
		{ type: 'bass', symbol: 'f', clefLine: 1 },
		{ type: 'f', symbol: 'f', clefLine: 1 },
		{ type: 'baritone', symbol: 'c', clefLine: 0 },
		{ type: 'tenor', symbol: 'c', clefLine: 1 },
		{ type: 'alto', symbol: 'c', clefLine: 2 },
		{ type: 'mezzosoprano', symbol: 'c', clefLine: 3 },
		{ type: 'soprano', symbol: 'c', clefLine: 4 },
		{ type: 'c', symbol: 'c', clefLine: 2 },
		{ type: 'perc', symbol: 'perc', clefLine: 2 },
		{ type: 'none', symbol: 'none', clefLine: 2 },
	];
	clefs.forEach((c) => {
		it(
			'should have correct style when set to ' + c.type + ', ' + c.symbol + ', ' + c.clefLine,
			() => {
				const clef = new Clef(c.type);
				expect(clef.symbol).toBe(c.symbol);
				expect(clef.symbol).toBe(c.symbol);
				expect(clef.clefLine).toBe(c.clefLine);
			},
		);
	});
	it('should throw if invalid clef type', () => {
		const clef = () => new Clef('unknown' as ClefType);
		expect(clef).toThrowError('Unknown clef type');
	});
});

describe('getCPosition', () => {
	it('Should return correct position of c for g clef', () => {
		const clef = new Clef('g');
		const result = clef.getCPosition();
		expect(result).toEqual(3);
	});
	it('Should return correct position of c for f clef', () => {
		const clef = new Clef('f');
		const result = clef.getCPosition();
		expect(result).toEqual(5);
	});
	it('Should return correct position of c for tenor clef', () => {
		const clef = new Clef('tenor');
		const result = clef.getCPosition();
		expect(result).toEqual(2);
	});
});

describe('getOffsetToTreble', () => {
	it('should return 2 for bass', () => {
		const result = new Clef('bass').getOffsetToTreble();
		expect(result).toEqual(2);
	});
	it('should return 2 for f', () => {
		const result = new Clef('f').getOffsetToTreble();
		expect(result).toEqual(2);
	});
	it('should return 1 for alto', () => {
		const result = new Clef('alto').getOffsetToTreble();
		expect(result).toEqual(1);
	});
});
