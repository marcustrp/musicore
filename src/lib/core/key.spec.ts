import { describe, expect, it } from 'vitest';
import { Key } from './key';
import { KeyMode } from './data/modes';
import { ClefType } from './clef';

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

describe('toggleAccidental', () => {
	const clefs: ClefType[] = ['g', 'f'];
	const clefAccidentalSharpPositions = { g: [0, 3, -1, 2, 5, 1, 4], f: [2, 5, 1, 4, 7, 3, 6] };
	for (const clef of clefs) {
		it('should set key if custom accidentals are valid for key (' + clef + ')', () => {
			// NOTE: actual key (here f) is not important for this test
			const key = new Key('f', 'major');
			key.toggleAccidental(0, clefAccidentalSharpPositions[clef][0], '#', clef);
			key.toggleAccidental(1, clefAccidentalSharpPositions[clef][1], '#', clef);
			expect(key.root).toBe('d');
			expect(key.mode).toBe('major');
			expect(key.accidentals.count).toBe(2);
		});
		it('should remove last accidental if same as before (' + clef + ')', () => {
			// NOTE: actual key (here f) is not important for this test
			const key = new Key('f', 'major');
			key['customAccidentals'] = [
				{ position: 1, type: '#' },
				{ position: 3, type: '#' },
			];
			key.toggleAccidental(1, 3, '#', clef);
			expect(key.customAccidentals.length).toBe(1);
			expect(key.customAccidentals[0].position).toBe(1);
		});
		it('should remove accidental if same as before (' + clef + ')', () => {
			// NOTE: actual key (here f) is not important for this test
			const key = new Key('f', 'major');
			key['customAccidentals'] = [
				{ position: 1, type: '#' },
				{ position: 3, type: '#' },
			];
			key.toggleAccidental(0, 1, '#', clef);
			console.log('key', key.customAccidentals);
			expect(key.customAccidentals.length).toBe(2);
			expect(key.customAccidentals[0].position).toBeUndefined();
			expect(key.customAccidentals[1]).toEqual({ position: 3, type: '#' });
		});
		it('should remove empty columns when accidental is removed (' + clef + ')', () => {
			// NOTE: actual key (here f) is not important for this test
			const key = new Key('f', 'major');
			key['customAccidentals'] = [
				{ position: 1, type: '#' },
				{ position: undefined, type: '#' },
				{ position: 3, type: '#' },
			];
			key.toggleAccidental(2, 3, '#', clef);
			expect(key.customAccidentals.length).toBe(1);
			expect(key.customAccidentals[0].position).toBe(1);
		});
	}
});

describe('keyToCustomAccidentals', () => {
	it('should return custom accidentals for key (b)', () => {
		const key = new Key('f', 'major');
		const result = key.keyToCustomAccidentals('treble');
		expect(result.length).toBe(1);
		expect(result[0].position).toBe(4);
		expect(result[0].type).toBe('b');
	});
	it('should return custom accidentals for key (#)', () => {
		const key = new Key('d', 'major');
		const result = key.keyToCustomAccidentals('treble');
		expect(result.length).toBe(2);
		expect(result[0].position).toBe(0);
		expect(result[0].type).toBe('#');
		expect(result[1].position).toBe(3);
		expect(result[1].type).toBe('#');
	});
});

describe('customAccidentalsToKey', () => {
	it('should return an object for valid custom accidentals', () => {
		// NOTE: actual key (here f) is not important for this test
		const key = new Key('f', 'major');
		key.customAccidentals = [
			{ position: 0, type: '#' },
			{ position: 3, type: '#' },
		];
		const result = key.customAccidentalsToKey('major', 'treble');
		expect(result).toBeDefined();
		expect(result?.root).toBe('d');
		expect(result?.mode).toBe('major');
		expect(result?.accidentals.count).toBe(2);
		expect(result?.accidentals.type).toBe('#');
	});
	it('should return undefined for invalid custom accidentals', () => {
		// NOTE: actual key (here f) is not important for this test
		const key = new Key('f', 'major');
		key.customAccidentals = [{ position: 1, type: '#' }];
		const result = key.customAccidentalsToKey('major', 'treble');
		expect(result).toBeUndefined();
	});
});

describe('customAccidentalsValid', () => {
	it('should return true for valid custom accidentals (#)', () => {
		// NOTE: actual key (here f) is not important for this test
		const key = new Key('f', 'major');
		key.customAccidentals = [
			{ position: 0, type: '#' },
			{ position: 3, type: '#' },
		];
		expect(key.customAccidentalsValid('treble')).toBe(true);
	});
	it('should return true for valid custom accidentals (b)', () => {
		// NOTE: actual key (here d) is not important for this test
		const key = new Key('d', 'major');
		key.customAccidentals = [{ position: 4, type: 'b' }];
		expect(key.customAccidentalsValid('treble')).toBe(true);
	});
	it('should return false for invalid type', () => {
		// NOTE: actual key (here f) is not important for this test
		const key = new Key('f', 'major');
		key.customAccidentals = [
			{ position: 0, type: '#' },
			{ position: 3, type: 'b' },
		];
		expect(key.customAccidentalsValid('treble')).toBe(false);
	});
	it('should return false for invalid position', () => {
		const key = new Key('f', 'major');
		key.customAccidentals = [{ position: 1, type: 'b' }];
		expect(key.customAccidentalsValid('treble')).toBe(false);
	});
});
