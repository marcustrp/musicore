import { describe, expect, it } from 'vitest';
import { Key } from './key.js';
import { type KeyMode } from './data/modes.js';
import { type ClefType } from './clef.js';

describe('getAccidentals', () => {
	const modes = [
		['major', 1, '#'],
		['minor', 2, 'b'],
		['ionian', 1, '#'],
		['dorian', 1, 'b'],
		['phrygian', 3, 'b'],
		['lydian', 2, '#'],
		['mixolydian', 0, undefined],
		['aeolian', 2, 'b'],
		['locrian', 4, 'b'],
	];
	for (const index in modes) {
		it('should return correct accidentals for ' + modes[index][0], () => {
			const result = Key.getAccidentals(modes[index][0] as KeyMode, 'g');
			expect(result.type).toBe(modes[index][2]);
			expect(result.count).toBe(modes[index][1]);
		});
	}
});

describe('getCustomAccidentals', () => {
	it('should return correct accidentals for g clef', () => {
		const expectedResult = [{ type: '#', position: 4 }];
		const clef = new Key('c', 'major');
		clef['testSetCustomAccidentals']([{ type: '#', position: 4 }]);
		const result = clef.getCustomAccidentals('g');
		expect(result).toEqual(expectedResult);
	});
	it('should return correct accidentals for f clef', () => {
		const expectedResult = [{ type: '#', position: 8 }];
		const clef = new Key('c', 'major');
		clef.setCustomAccidentals([{ type: '#', position: 6 }], 'major');
		const result = clef.getCustomAccidentals('f');
		expect(result).toEqual(expectedResult);
	});
});

describe('getAccidentalPosition', () => {
	it('should return correct value for first #', () => {
		const result = Key.getAccidentalPosition('#', 0);
		expect(result).toEqual(0);
	});
	it('should return correct value for first b', () => {
		const result = Key.getAccidentalPosition('b', 0);
		expect(result).toEqual(4);
	});
	it('should return correct value for accidental in third column', () => {
		const result = Key.getAccidentalPosition('b', 2);
		expect(result).toEqual(5);
	});
	it('should return correct value for accidental in f clef', () => {
		const result = Key.getAccidentalPosition('b', 1);
		expect(result).toEqual(1);
	});
});

describe('isAccidentalValid', () => {
	it('should return true for valid position (#)', () => {
		expect(Key.isAccidentalValid('#', 0, 0, 'g')).toBe(true);
	});
	it('should return true for valid position (b)', () => {
		expect(Key.isAccidentalValid('b', 1, 1, 'g')).toBe(true);
	});
	it('should return false for invalid position', () => {
		expect(Key.isAccidentalValid('#', 1, 8, 'g')).toBe(false);
	});
});

describe('customAccidentalsValid', () => {
	it('should return true for valid custom accidentals (#)', () => {
		// NOTE: actual key (here f) is not important for this test
		const key = new Key('f', 'major');
		key['testSetCustomAccidentals']([
			{ position: 0, type: '#' },
			{ position: 3, type: '#' },
		]);
		expect(key.customAccidentalsValid()).toBe(true);
	});
	it('should return true for valid custom accidentals (b)', () => {
		// NOTE: actual key (here d) is not important for this test
		const key = new Key('d', 'major');
		key['testSetCustomAccidentals']([{ position: 4, type: 'b' }]);
		expect(key.customAccidentalsValid()).toBe(true);
	});
	it('should return false for invalid type', () => {
		// NOTE: actual key (here f) is not important for this test
		const key = new Key('f', 'major');
		key['testSetCustomAccidentals']([
			{ position: 0, type: '#' },
			{ position: 3, type: 'b' },
		]);
		expect(key.customAccidentalsValid()).toBe(false);
	});
	it('should return false for invalid position', () => {
		const key = new Key('f', 'major');
		key['testSetCustomAccidentals']([{ position: 7, type: 'b' }]);
		expect(key.customAccidentalsValid()).toBe(false);
	});
	it('should return false if invalid, but last is valid', () => {
		const key = new Key('d', 'major');
		key['testSetCustomAccidentals']([
			{ position: 7, type: '#' },
			{ position: 3, type: '#' },
		]);
		expect(key.customAccidentalsValid()).toBe(false);
	});
});

describe('customAccidentalsToKey', () => {
	it('should return an object for valid custom accidentals', () => {
		// NOTE: actual key (here f) is not important for this test
		const key = new Key('f', 'major');
		key['testSetCustomAccidentals']([
			{ position: 0, type: '#' },
			{ position: 3, type: '#' },
		]);
		const result = key.customAccidentalsToKey('major');
		expect(result).toBeDefined();
		expect(result?.root).toBe('d');
		expect(result?.mode).toBe('major');
		expect(result?.accidentals.count).toBe(2);
		expect(result?.accidentals.type).toBe('#');
	});
	it('should return an object for valid custom accidentals (minor sharp)', () => {
		// NOTE: actual key (here f) is not important for this test
		const key = new Key('f', 'minor');
		key['testSetCustomAccidentals']([
			{ position: 0, type: '#' },
			{ position: 3, type: '#' },
			{ position: -1, type: '#' },
		]);
		const result = key.customAccidentalsToKey('minor');
		expect(result).toBeDefined();
		expect(result?.root).toBe('f#');
		expect(result?.mode).toBe('minor');
		expect(result?.accidentals.count).toBe(3);
		expect(result?.accidentals.type).toBe('#');
	});
	it('should return an object for valid custom accidentals (minor flat)', () => {
		// NOTE: actual key (here f) is not important for this test
		const key = new Key('f', 'minor');
		key['testSetCustomAccidentals']([
			{ position: 4, type: 'b' },
			{ position: 1, type: 'b' },
		]);
		const result = key.customAccidentalsToKey('minor');
		expect(result).toBeDefined();
		expect(result?.root).toBe('g');
		expect(result?.mode).toBe('minor');
		expect(result?.accidentals.count).toBe(2);
		expect(result?.accidentals.type).toBe('b');
	});
	it('should return undefined for invalid custom accidentals', () => {
		// NOTE: actual key (here f) is not important for this test
		const key = new Key('f', 'major');
		key['testSetCustomAccidentals']([{ position: 7, type: '#' }]);
		const result = key.customAccidentalsToKey('major');
		expect(result).toBeUndefined();
	});
	it('should return undefined for invalid custom accidentals (where last is valid)', () => {
		// NOTE: actual key (here f) is not important for this test
		const key = new Key('d', 'major');
		key['testSetCustomAccidentals']([
			{ position: 1, type: '#' },
			{ position: 3, type: '#' },
		]);
		const result = key.customAccidentalsToKey('major');
		expect(result).toBeUndefined();
	});
});

describe('convertCustomAccidentalsToKey', () => {
	it('should convert valid customAccidentals to key (#)', () => {
		const key = new Key('c', 'major');
		key['testSetCustomAccidentals']([
			{ position: 0, type: '#' },
			{ position: 3, type: '#' },
		]);
		const result = key.convertCustomAccidentalsToKey('major');
		expect(result).toBeTruthy();
		expect(key.root).toEqual('d');
		expect(key.accidentals).toEqual({ count: 2, type: '#' });
		expect(key.mode).toEqual('major');
	});
	it('should convert valid customAccidentals to key (b)', () => {
		const key = new Key('c', 'major');
		key['testSetCustomAccidentals']([
			{ position: 4, type: 'b' },
			{ position: 1, type: 'b' },
		]);
		const result = key.convertCustomAccidentalsToKey('major');
		expect(result).toBeTruthy();
		expect(key.root).toEqual('bb');
		expect(key.accidentals).toEqual({ count: 2, type: 'b' });
		expect(key.mode).toEqual('major');
	});
});

describe('keyToCustomAccidentals', () => {
	it('should return custom accidentals for key (b)', () => {
		const key = new Key('f', 'major');
		const result = key.keyToCustomAccidentals();
		expect(result.length).toBe(1);
		expect(result[0].position).toBe(4);
		expect(result[0].type).toBe('b');
	});
	it('should return custom accidentals for key (#)', () => {
		const key = new Key('d', 'major');
		const result = key.keyToCustomAccidentals();
		expect(result.length).toBe(2);
		expect(result[0].position).toBe(0);
		expect(result[0].type).toBe('#');
		expect(result[1].position).toBe(3);
		expect(result[1].type).toBe('#');
	});
});

describe('toggleAccidental', () => {
	const clefs: ClefType[] = ['g', 'f'];
	const clefAccidentalSharpPositions: { [key: string]: number[] } = {
		g: [0, 3, -1, 2, 5, 1, 4],
		f: [2, 5, 1, 4, 7, 3, 6],
	};
	for (const clef of clefs) {
		it(
			'should set key if custom accidentals are valid for key (single accidental, ' + clef + ')',
			() => {
				// NOTE: actual key (here f) is not important for this test
				const key = new Key('c', 'major');
				const result = key.toggleAccidental(
					0,
					clefAccidentalSharpPositions[clef][0],
					'#',
					'major',
					clef,
				);
				expect(result).toBeTruthy();
				expect(key.accidentals.count).toBe(1);
				expect(key.mode).toBe('major');
				expect(key.root).toBe('g');
			},
		);
		it(
			'should set key if custom accidentals are valid for key (two accidentals, ' + clef + ')',
			() => {
				// NOTE: actual key (here f) is not important for this test
				const key = new Key('f', 'major');
				key.toggleAccidental(0, clefAccidentalSharpPositions[clef][0], '#', 'major', clef);
				key.toggleAccidental(1, clefAccidentalSharpPositions[clef][1], '#', 'major', clef);
				expect(key.accidentals.count).toBe(2);
				expect(key.mode).toBe('major');
				expect(key.root).toBe('d');
			},
		);
		it('should remove last accidental if same as before (' + clef + ')', () => {
			// NOTE: actual key (here f) is not important for this test
			const key = new Key('f', 'major');
			key['testSetCustomAccidentals']([
				{ position: clefAccidentalSharpPositions['g'][0] + 1, type: '#' },
				{ position: clefAccidentalSharpPositions['g'][1] + 1, type: '#' },
			]);
			key.toggleAccidental(1, clefAccidentalSharpPositions[clef][1] + 1, '#', 'major', clef);
			expect(key.getCustomAccidentals(clef).length).toBe(1);
			expect(key.getCustomAccidentals(clef)[0].position).toBe(
				clefAccidentalSharpPositions[clef][0] + 1,
			);
		});
		it('should remove accidental if same as before (' + clef + ')', () => {
			// NOTE: actual key (here f) is not important for this test
			const key = new Key('f', 'major');
			key['testSetCustomAccidentals']([
				{ position: clefAccidentalSharpPositions['g'][0] + 1, type: '#' },
				{ position: clefAccidentalSharpPositions['g'][1], type: '#' },
			]);
			key.toggleAccidental(0, clefAccidentalSharpPositions[clef][0] + 1, '#', 'major', clef);
			expect(key.getCustomAccidentals(clef).length).toBe(2);
			expect(key.getCustomAccidentals(clef)[0].position).toBeUndefined();
			expect(key.getCustomAccidentals(clef)[1]).toEqual({
				position: clefAccidentalSharpPositions[clef][1],
				type: '#',
			});
		});
		it('should remove empty columns when accidental is removed (' + clef + ')', () => {
			// NOTE: actual key (here f) is not important for this test
			const key = new Key('f', 'major');
			key['testSetCustomAccidentals']([
				{ position: clefAccidentalSharpPositions['g'][0] + 1, type: '#' },
				{ position: undefined, type: '#' },
				{ position: clefAccidentalSharpPositions['g'][2] + 1, type: '#' },
			]);
			key.toggleAccidental(2, clefAccidentalSharpPositions[clef][2] + 1, '#', 'major', clef);
			expect(key.getCustomAccidentals(clef).length).toBe(1);
			expect(key.getCustomAccidentals(clef)[0].position).toBe(
				clefAccidentalSharpPositions[clef][0] + 1,
			);
		});
	}
});

describe('getNoteNames', () => {
	it('should return notes without accidentals for c major', () => {
		const key = new Key('c', 'major');
		const result = key.getNoteNames();
		expect(result).toEqual(['c', 'd', 'e', 'f', 'g', 'a', 'b']);
	});
	it('should return f# and c# for d major', () => {
		const key = new Key('d', 'major');
		const result = key.getNoteNames();
		expect(result).toEqual(['c#', 'd', 'e', 'f#', 'g', 'a', 'b']);
	});
	it('should return bb for f major', () => {
		const key = new Key('f', 'major');
		const result = key.getNoteNames();
		expect(result).toEqual(['c', 'd', 'e', 'f', 'g', 'a', 'bb']);
	});
	it('should return bb and eb for g minor', () => {
		const key = new Key('g', 'minor');
		const result = key.getNoteNames();
		expect(result).toEqual(['c', 'd', 'eb', 'f', 'g', 'a', 'bb']);
	});
});
