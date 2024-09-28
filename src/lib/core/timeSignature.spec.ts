import Fraction from 'fraction.js';
import { beforeEach, describe, expect, it, vi, type MockInstance, afterEach } from 'vitest';
import { TimeSignature } from './timeSignature.js';
import { Note } from './note.js';
import type { TimeSignatureObject } from '$lib/test-types.js';

describe('setBeamGroupDuration()', () => {
	let spy: MockInstance;
	const initSpy = () =>
		vi
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.spyOn(TimeSignature.prototype as any, 'fillBeamGroupDurations')
			.mockImplementationOnce((durations) => {
				return durations;
			});

	beforeEach(() => {
		spy = initSpy();
	});
	afterEach(() => {
		vi.restoreAllMocks();
	});
	it('should set beamGroupDurations for supported time signatures', () => {
		new TimeSignature(4, 4);
		new TimeSignature(2, 8);
		new TimeSignature(3, 8);
		new TimeSignature(6, 8);
		new TimeSignature(9, 8);
		new TimeSignature(12, 8);
		new TimeSignature(5, 8);
		new TimeSignature(7, 8);

		expect(spy).toBeCalledWith([new Fraction(1, 4)]);
		expect(spy).toBeCalledWith([new Fraction(2, 8)]);
		expect(spy).toBeCalledWith([new Fraction(3, 8)]);
		expect(spy).toBeCalledWith([new Fraction(3, 8), new Fraction(3, 8)]);
		expect(spy).toBeCalledWith([new Fraction(3, 8), new Fraction(3, 8), new Fraction(3, 8)]);
		expect(spy).toBeCalledWith([
			new Fraction(3, 8),
			new Fraction(3, 8),
			new Fraction(3, 8),
			new Fraction(3, 8),
		]);
		expect(spy).toBeCalledWith([new Fraction(2, 8), new Fraction(3, 8)]);
		expect(spy).toBeCalledWith([new Fraction(2, 8), new Fraction(2, 8), new Fraction(3, 8)]);
	});
	it('should set default beamGroupDurations for unsupported time signatures', () => {
		new TimeSignature(5, 4);
		expect(spy).toBeCalledWith([new Fraction(1, 4)]);
	});
	it('should use provided duration (single duration)', () => {
		const timeSignature = new TimeSignature(4, 4);
		// init spy again because it was called in the constructor
		spy = initSpy();
		timeSignature.setBeamGroupDuration(new Fraction(1, 2));
		expect(spy).toBeCalledWith([new Fraction(1, 2)]);
	});
	it('should use provided duration (array)', () => {
		const timeSignature = new TimeSignature(3, 4);
		// init spy again because it was called in the constructor
		spy = initSpy();
		timeSignature.setBeamGroupDuration([new Fraction(1, 2), new Fraction(1, 4)]);
		expect(spy).toBeCalledWith([new Fraction(1, 2), new Fraction(1, 4)]);
	});
});

describe('TimeSignature', () => {
	let spy: MockInstance;
	const initSpy = () =>
		vi
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.spyOn(TimeSignature.prototype as any, 'setBeamGroupDuration')
			.mockImplementationOnce((durations) => {
				return durations;
			});

	beforeEach(() => {
		spy = initSpy();
	});
	afterEach(() => {
		vi.restoreAllMocks();
	});
	it('should create a simple instance', () => {
		const timeSignatureObj: TimeSignatureObject = {
			count: 4,
			unit: 4,
			duration: new Fraction(4, 4),
			type: 'simple',
			beatsPerBar: 4,
		};
		const result = new TimeSignature();
		expect(spy).toBeCalledWith();
		expect(result).toMatchObject(timeSignatureObj);
	});
	it('should accept supported symbol "common"', () => {
		const timeSignatureObj: TimeSignatureObject = {
			count: 4,
			unit: 4,
			symbol: 'common',
			duration: new Fraction(4, 4),
			type: 'simple',
			beatsPerBar: 4,
		};
		const result = new TimeSignature('common');
		expect(spy).toBeCalledWith();
		expect(result).toMatchObject(timeSignatureObj);
	});
	it('should accept supported symbol "cut"', () => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		vi.spyOn(TimeSignature.prototype as any, 'getBeatsPerBar').mockImplementationOnce(() => 2);
		const timeSignatureObj2: TimeSignatureObject = {
			count: 2,
			unit: 2,
			symbol: 'cut',
			duration: new Fraction(2, 2),
			type: 'simple',
			beatsPerBar: 2,
		};
		const result2 = new TimeSignature('cut');
		expect(spy).toBeCalledWith();
		expect(result2).toMatchObject(timeSignatureObj2);
	});
});

describe('getType', () => {
	const types: { count: number; unit: number; type: string }[] = [
		{ count: 1, unit: 8, type: 'simple' },
		{ count: 2, unit: 4, type: 'simple' },
		{ count: 3, unit: 4, type: 'simple' },
		{ count: 3, unit: 8, type: 'simple' },
		{ count: 4, unit: 4, type: 'simple' },
		{ count: 8, unit: 4, type: 'simple' },
		{ count: 2, unit: 2, type: 'simple' },
		{ count: 6, unit: 8, type: 'compound' },
		{ count: 6, unit: 4, type: 'compound' },
		{ count: 9, unit: 8, type: 'compound' },
		{ count: 12, unit: 8, type: 'compound' },
		{ count: 15, unit: 8, type: 'compound' },
		{ count: 18, unit: 8, type: 'compound' },
		{ count: 5, unit: 4, type: 'irregular' },
		{ count: 7, unit: 4, type: 'irregular' },
	];
	it('should return correct type for the time signature', () => {
		types.forEach((type) => {
			const timeSignature = new TimeSignature(type.count, type.unit);
			expect(timeSignature['getType']()).toBe(type.type);
		});
	});
});

describe('getNotesFromBeamGroup()', () => {
	describe('4/4', () => {
		it('should return a quarter note at beat one', () => {
			const timeSignature = new TimeSignature(4, 4);
			const note = new Note('q', 'c');
			const expectedResult = { notes: [note], overflow: [] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(0), note);
			note.id = result.notes[0].id;
			expect(result).toEqual(expectedResult);
		});
		it('should return a quarter note at beat two', () => {
			const timeSignature = new TimeSignature(4, 4);
			const note = new Note('q', 'c');
			const expectedResult = { notes: [note], overflow: [] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(1, 4), note);
			note.id = result.notes[0].id;
			expect(result).toEqual(expectedResult);
		});
		it('should return a half note at beat three', () => {
			const timeSignature = new TimeSignature(4, 4);
			const note = new Note('h', 'c');
			const expectedResult = { notes: [note], overflow: [] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(2, 4), note);
			note.id = result.notes[0].id;
			expect(result).toEqual(expectedResult);
		});
		it('should return two tied eights at beat one "and"', () => {
			// note that this might be later be rewritten to a quarter note, if the notes surrounding this note are both eight notes. But that is not known at this point.
			const timeSignature = new TimeSignature(4, 4);
			const addNote = new Note('q', 'c');
			const note1 = new Note('8', 'c');
			note1['_tie'] = 'start';
			const note2 = new Note('8', 'c');
			note2['_tie'] = 'end';
			const expectedResult = { notes: [note1, note2], overflow: [] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(1, 8), addNote);
			note1.id = result.notes[0].id;
			note2.id = result.notes[1].id;
			expect(result).toEqual(expectedResult);
		});
		it('should return 16-q-8. for a halv note at beat 1.4', () => {
			const timeSignature = new TimeSignature(4, 4);
			const addNote = new Note('h', 'c');
			const note1 = new Note('16', 'c');
			note1['_tie'] = 'start';
			const note2 = new Note('q', 'c');
			note2['_tie'] = 'continue';
			const note3 = new Note('8', 'c', undefined, undefined, 1);
			note3['_tie'] = 'end';
			const expectedResult = { notes: [note1, note2, note3], overflow: [] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(3, 16), addNote);
			note1.id = result.notes[0].id;
			note2.id = result.notes[1].id;
			note3.id = result.notes[2].id;
			expect(result).toEqual(expectedResult);
		});
		it('should return halv note plus halv note overflow for whole note at beat 3', () => {
			const timeSignature = new TimeSignature(4, 4);
			const addNote = new Note('w', 'c');
			const note1 = new Note('h', 'c');
			note1['_tie'] = 'start';
			const note2 = new Note('h', 'c');
			note2['_tie'] = 'end';
			const expectedResult = { notes: [note1], overflow: [note2] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(2, 4), addNote);
			note1.id = result.notes[0].id;
			note2.id = result.overflow[0].id;
			expect(result).toEqual(expectedResult);
		});
		it('should return eight note at start of bar', () => {
			const timeSignature = new TimeSignature(4, 4);
			const addNote = new Note('8', 'c');
			const expectedResult = { notes: [addNote], overflow: [] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(0), addNote);
			addNote.id = result.notes[0].id;
			expect(result).toEqual(expectedResult);
		});
		it('should return 32 plus overflow q and 8.. for a halv note at beat 4.4', () => {
			const timeSignature = new TimeSignature(4, 4);
			const addNote = new Note('h', 'c');
			const note1 = new Note('32', 'c');
			note1['_tie'] = 'start';
			const note2 = new Note('q', 'c');
			note2['_tie'] = 'continue';
			const note3 = new Note('8', 'c', undefined, undefined, 2);
			note3['_tie'] = 'end';
			const expectedResult = { notes: [note1], overflow: [note2, note3] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(31, 32), addNote);
			note1.id = result.notes[0].id;
			note2.id = result.overflow[0].id;
			note3.id = result.overflow[1].id;
			expect(result).toEqual(expectedResult);
		});
	});
	describe('6/8', () => {
		it('should return a q. note at beat one', () => {
			const timeSignature = new TimeSignature(6, 8);
			const note = new Note('q', 'c', undefined, undefined, 1);
			const expectedResult = { notes: [note], overflow: [] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(0), note);
			note.id = result.notes[0].id;
			expect(result).toEqual(expectedResult);
		});
		it('should return a q. note at beat four', () => {
			const timeSignature = new TimeSignature(6, 8);
			const note = new Note('q', 'c', undefined, undefined, 1);
			const expectedResult = { notes: [note], overflow: [] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(3, 8), note);
			note.id = result.notes[0].id;
			expect(result).toEqual(expectedResult);
		});
		it('should return a h. note at beat one', () => {
			const timeSignature = new TimeSignature(6, 8);
			const note = new Note('h', 'c', undefined, undefined, 1);
			const expectedResult = { notes: [note], overflow: [] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(0), note);
			note.id = result.notes[0].id;
			expect(result).toEqual(expectedResult);
		});
		it('should return a q., 8 on beat 1 for a h', () => {
			const timeSignature = new TimeSignature(6, 8);
			const addNote = new Note('h', 'c');
			const note1 = new Note('q', 'c', undefined, undefined, 1);
			note1['_tie'] = 'start';
			const note2 = new Note('8', 'c');
			note2['_tie'] = 'end';
			const expectedResult = { notes: [note1, note2], overflow: [] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(0), addNote);
			note1.id = result.notes[0].id;
			note2.id = result.notes[1].id;
			expect(result).toEqual(expectedResult);
		});
		it('should return 8, 8 for a q on beat 1.3', () => {
			const timeSignature = new TimeSignature(6, 8);
			const addNote = new Note('q', 'c');
			const note1 = new Note('8', 'c');
			note1['_tie'] = 'start';
			const note2 = new Note('8', 'c');
			note2['_tie'] = 'end';
			const expectedResult = { notes: [note1, note2], overflow: [] };
			const result = timeSignature.getNotesFromBeamGroup(new Fraction(2, 8), addNote);
			note1.id = result.notes[0].id;
			note2.id = result.notes[1].id;
			expect(result).toEqual(expectedResult);
		});
	});
});

describe('getBeamGroupPosition', () => {
	it('should return correct position for first beat in 4/4', () => {
		const timeSignature = new TimeSignature(4, 4);
		const expectedResult = { index: 0, position: new Fraction(0) };
		const result = timeSignature.getBeamGroupPosition(new Fraction(0));
		expect(result).toEqual(expectedResult);
	});
	it('should return correct position for second beat in 4/4', () => {
		const timeSignature = new TimeSignature(4, 4);
		const expectedResult = { index: 1, position: new Fraction(1, 4) };
		const result = timeSignature.getBeamGroupPosition(new Fraction(1, 4));
		expect(result).toEqual(expectedResult);
	});
	it('should return correct position for second "and" beat in 4/4', () => {
		const timeSignature = new TimeSignature(4, 4);
		const expectedResult = { index: 1, position: new Fraction(1, 4) };
		const result = timeSignature.getBeamGroupPosition(new Fraction(3, 8));
		expect(result).toEqual(expectedResult);
	});
	it('should return correct position for first "and" beat in 6/8', () => {
		const timeSignature = new TimeSignature(6, 8);
		const expectedResult = { index: 0, position: new Fraction(0) };
		const result = timeSignature.getBeamGroupPosition(new Fraction(1, 4));
		expect(result).toEqual(expectedResult);
	});
	it('should return correct position for second beat in 6/8', () => {
		const timeSignature = new TimeSignature(6, 8);
		const expectedResult = { index: 1, position: new Fraction(3, 8) };
		const result = timeSignature.getBeamGroupPosition(new Fraction(3, 8));
		expect(result).toEqual(expectedResult);
	});
	it('should return correct position for second "and" beat in 6/8', () => {
		const timeSignature = new TimeSignature(6, 8);
		const expectedResult = { index: 1, position: new Fraction(3, 8) };
		const result = timeSignature.getBeamGroupPosition(new Fraction(4, 8));
		expect(result).toEqual(expectedResult);
	});
});

describe('beamGroupIndexesInSameBar', () => {
	it('should return true for 0, 1 in 4/4', () => {
		const timeSignature = new TimeSignature(4, 4);
		const result = timeSignature['beamGroupIndexesInSameBar'](0, 1);
		expect(result).toBe(true);
	});
	it('should return true for 0, 2 in 4/4', () => {
		const timeSignature = new TimeSignature(4, 4);
		const result = timeSignature['beamGroupIndexesInSameBar'](0, 2);
		expect(result).toBe(true);
	});
	it('should return true for 0, 3 in 4/4', () => {
		const timeSignature = new TimeSignature(4, 4);
		const result = timeSignature['beamGroupIndexesInSameBar'](0, 3);
		expect(result).toBe(true);
	});
	it('should return false for 0, 4 in 4/4', () => {
		const timeSignature = new TimeSignature(4, 4);
		const result = timeSignature['beamGroupIndexesInSameBar'](0, 4);
		expect(result).toBe(false);
	});
	it('should return false for 3, 4 in 4/4', () => {
		const timeSignature = new TimeSignature(4, 4);
		const result = timeSignature['beamGroupIndexesInSameBar'](3, 4);
		expect(result).toBe(false);
	});
	it('should return true for 4, 5 in 4/4', () => {
		const timeSignature = new TimeSignature(4, 4);
		const result = timeSignature['beamGroupIndexesInSameBar'](4, 5);
		expect(result).toBe(true);
	});
	it('should return true for 0, 1 in 6/8', () => {
		const timeSignature = new TimeSignature(6, 8);
		const result = timeSignature['beamGroupIndexesInSameBar'](0, 1);
		expect(result).toBe(true);
	});
	it('should return false for 1, 2 in 6/8', () => {
		const timeSignature = new TimeSignature(6, 8);
		const result = timeSignature['beamGroupIndexesInSameBar'](1, 2);
		expect(result).toBe(false);
	});
});

describe('toString()', () => {
	it('should return symbol, if set', () => {
		const timeSignature = new TimeSignature('common');
		const timeSignature2 = new TimeSignature('cut');

		const result = timeSignature.toString();
		const result2 = timeSignature2.toString();

		expect(result).toBe('common');
		expect(result2).toBe('cut');
	});
	it('should not return symbol, if set to false', () => {
		const timeSignature = new TimeSignature('common');
		const timeSignature2 = new TimeSignature('cut');

		const result = timeSignature.toString(true);
		const result2 = timeSignature2.toString(true);

		expect(result).toBe('4/4');
		expect(result2).toBe('2/2');
	});
	it('should return count/unit, if symbol not set', () => {
		const timeSignature = new TimeSignature(4, 4);
		const timeSignature2 = new TimeSignature(2, 8);

		const result = timeSignature.toString();
		const result2 = timeSignature2.toString();

		expect(result).toBe('4/4');
		expect(result2).toBe('2/8');
	});
});
