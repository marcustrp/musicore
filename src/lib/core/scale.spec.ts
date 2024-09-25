import { describe, expect, it } from 'vitest';
import { Scale } from './scale.js';

describe('Scale', () => {
	it('should create a scale', () => {
		const scale = new Scale('eb', 'minor');

		expect(scale.rootName).toBe('eb');
		expect(scale.type).toBe('minor');
		expect(scale.steps).toEqual([0, 2, 3, 5, 7, 8, 10]);
	});
});

describe('fromString()', () => {
	it('should create a scale', () => {
		const scaleString = 'eb minor';

		const scale = Scale.fromString(scaleString);

		expect(scale.rootName).toBe('eb');
		expect(scale.type).toBe('minor');
	});
	it('should accept all valid root names', () => {
		const roots = 'abcdefg';
		const signs = ' b#';

		for (let i = 0; i < roots.length; i++) {
			for (let j = 0; j < signs.length; j++) {
				const root = (roots[i] + signs[j]).trim();
				const scale = Scale.fromString(root + ' major');

				expect(scale.rootName).toBe(root);
			}
		}
	});
	it('should throw an error on invalid root', () => {
		const scaleString = 'h major';

		const resultFn = () => Scale.fromString(scaleString);
		expect(resultFn).toThrowError(/Invalid root name/);
	});
	it('should throw an error on invalid root', () => {
		const scaleString = 'c dur';

		const resultFn = () => Scale.fromString(scaleString);
		expect(resultFn).toThrowError(/Invalid scale type/);
	});
	it('should throw an error if no space in parameter', () => {
		const scaleString = 'cminor';

		const resultFn = () => Scale.fromString(scaleString);
		expect(resultFn).toThrowError(/Invalid rootAndMode/);
	});
	it('should throw an error if parameter is empty', () => {
		const scaleString = '';

		const resultFn = () => Scale.fromString(scaleString);
		expect(resultFn).toThrowError(/Empty rootAndMode/);
	});
	it('should throw an error if parameter is undefined', () => {
		const scaleString = undefined as unknown as string;

		const resultFn = () => Scale.fromString(scaleString);
		expect(resultFn).toThrowError(/Empty rootAndMode/);
	});
	it('should throw an error if parameter has multiple spaces', () => {
		const scaleString = 'c minor major';

		const resultFn = () => Scale.fromString(scaleString);
		expect(resultFn).toThrowError(/Invalid rootAndMode/);
	});
});

describe('Scale.getScaleNumberIndex()', () => {
	it('should return 0 for c4 in c major', () => {
		const scale = new Scale('c', 'major');
		const result = scale.getScaleNumberIndex(60);
		expect(result).toBe(0);
	});
	it('should return 1 for c#4 in c major', () => {
		const scale = new Scale('c', 'major');
		const result = scale.getScaleNumberIndex(61);
		expect(result).toBe(1);
	});
	it('should return 11 for g#4 in a major', () => {
		const scale = new Scale('a', 'major');
		const result = scale.getScaleNumberIndex(68);
		expect(result).toBe(11);
	});
	it('should return -1 for invalid midiNumber', () => {
		const scale = new Scale('a', 'major');
		const result = scale.getScaleNumberIndex(128);
		expect(result).toBe(-1);
	});
});

describe('Scale.getDiaTonicNoteNames()', () => {
	it('should return correct note names for b major', () => {
		const scale = new Scale('b', 'major');
		const result = scale.getDiatonicNoteNames();
		expect(result).toEqual(['b', 'c#', 'd#', 'e', 'f#', 'g#', 'a#']);
	});
	it('should return correct note names for f minor pentatonic', () => {
		const scale = new Scale('f', 'pentatonic_minor');
		const result = scale.getDiatonicNoteNames();
		expect(result).toEqual(['f', 'ab', 'bb', 'c', 'eb']);
	});
});

describe('Scale.getNaturalNoteMapping()', () => {
	it('should return correct mapping for b major', () => {
		const scale = new Scale('b', 'major');
		const result = scale.getNaturalNoteMapping();
		expect(result).toEqual({ b: 'b', c: 'c#', d: 'd#', e: 'e', f: 'f#', g: 'g#', a: 'a#' });
	});
});

describe('getScaleType()', () => {
	it('should return an object for a supported type', () => {
		const result = Scale.getScaleType('major');
		expect(result).toBeTypeOf('object');
	});
	it('should throw an error for an unsupported type', () => {
		const resultFn = () => Scale.getScaleType('unsupported');
		expect(resultFn).toThrowError(/Invalid scale type 'unsupported'/);
	});
});

describe('getModeDefaultScaleNumber()', () => {
	it('should return b3 for minor default scale number 3', () => {
		const scaleNumber = 3;
		const expecedResult = 'b3';
		const scale = new Scale('c', 'minor');
		const result = scale.getModeDefaultScaleNumber(scaleNumber);
		expect(result).toBe(expecedResult);
	});
	it('should return #4 for lydian default scale number 4', () => {
		const scaleNumber = 4;
		const expecedResult = '#4';
		const scale = new Scale('a', 'lydian');
		const result = scale.getModeDefaultScaleNumber(scaleNumber);
		expect(result).toBe(expecedResult);
	});
});

/** @todo has been refactored, write tests for functions this function is calling */
describe('getScaleNumberFromNote', () => {
	it('should return correct value (b5, ebb in ab)', () => {
		const scale = new Scale('ab', 'major');
		const result = scale.getScaleNumberFromNote('e', 'bb');
		expect(result).toBe('b5');
	});
	it('should return correct value (5, eb in ab)', () => {
		const scale = new Scale('ab', 'major');
		const result = scale.getScaleNumberFromNote('e', 'b');
		expect(result).toBe('5');
	});
	it('should return correct value (#5, e in ab)', () => {
		const scale = new Scale('ab', 'major');
		const result = scale.getScaleNumberFromNote('e');
		expect(result).toBe('#5');
	});
	it('should return correct value (b5, f in b)', () => {
		const scale = new Scale('b', 'major');
		const result = scale.getScaleNumberFromNote('f');
		expect(result).toBe('b5');
	});
	it('should return correct value (5, f# in b)', () => {
		const scale = new Scale('b', 'major');
		const result = scale.getScaleNumberFromNote('f', '#');
		expect(result).toBe('5');
	});
	it('should return correct value (#5, fx in b)', () => {
		const scale = new Scale('b', 'major');
		const result = scale.getScaleNumberFromNote('f', 'x');
		expect(result).toBe('#5');
	});
});
describe('getNotePitchDiffFromScale', () => {
	it('should return correct value (0, f# in d major)', () => {
		const scale = new Scale('d', 'major');
		const result = scale.getNotePitchDiffFromScale('f', '#');
		expect(result).toBe(0);
	});
	it('should return correct value (-1, f in d major)', () => {
		const scale = new Scale('d', 'major');
		const result = scale.getNotePitchDiffFromScale('f', undefined);
		expect(result).toBe(-1);
	});
	it('should return correct value (0, f in d minor)', () => {
		const scale = new Scale('d', 'minor');
		const result = scale.getNotePitchDiffFromScale('f', undefined);
		expect(result).toBe(0);
	});
	it('should return correct value (1, b in f major)', () => {
		const scale = new Scale('f', 'major');
		const result = scale.getNotePitchDiffFromScale('b', undefined);
		expect(result).toBe(1);
	});
	it('should return correct value (-2, fb in d major)', () => {
		const scale = new Scale('d', 'major');
		const result = scale.getNotePitchDiffFromScale('f', 'b');
		expect(result).toBe(-2);
	});
	// this one crosses octaves
	it('should return correct value (-2, cb in d major)', () => {
		const scale = new Scale('d', 'major');
		const result = scale.getNotePitchDiffFromScale('c', 'b');
		expect(result).toBe(-2);
	});
	// this one crosses octaves
	it('should return correct value (2, b# in f major)', () => {
		const scale = new Scale('f', 'major');
		const result = scale.getNotePitchDiffFromScale('b', '#');
		expect(result).toBe(2);
	});
});

describe('getDiatonicScaleNumberFromNote', () => {
	it('should return correct value (3, f in d major)', () => {
		const scale = new Scale('d', 'major');
		const result = scale.getDiatonicScaleNumberFromNote('f');
		expect(result).toBe(3);
	});
	it('should return correct value (3, f in d minor)', () => {
		const scale = new Scale('d', 'minor');
		const result = scale.getDiatonicScaleNumberFromNote('f');
		expect(result).toBe(3);
	});
	it('should return correct value (4, b in f major)', () => {
		const scale = new Scale('f', 'major');
		const result = scale.getDiatonicScaleNumberFromNote('b');
		expect(result).toBe(4);
	});
});
