import Fraction from 'fraction.js';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Bar } from '../core/bar';
import { Key } from '../core/key';
import { TimeSignature } from '../core/timeSignature';
import { Note } from '../core/note';
import { Voice } from './voice';
import { BarArray } from './barArray';
import { RhythmElement } from '../core/rhythmElement';

let voice: Voice;
beforeAll(() => {
	/** @todo should exists nicer way to implement these mocks */
	BarArray.prototype.getNote = vi.fn();
	BarArray.prototype.getNoteByIndex = vi.fn();
	BarArray.prototype.getNextNote = vi.fn();
	BarArray.prototype.getNotes = vi.fn();
});
beforeEach(() => {
	voice = new Voice('P1', 'V1', new BarArray(new TimeSignature(), new Key('c', 'major')));
});
afterEach(() => {
	vi.resetAllMocks();
});

describe('constructor', () => {
	it('should return a simple instance', () => {
		const barArray = new BarArray(new TimeSignature(), new Key('g', 'minor'));
		const voiceObj = {
			bars: barArray,
			partId: 'P1',
			id: 'V1',
		};
		const result = new Voice('P1', 'V1', barArray);
		expect(result).toEqual(voiceObj);
	});
});

describe('addNote', () => {
	it('should class this.bars.addNote with correct parameters @unit', () => {
		const note = new Note('q', 'c');
		const barIndex = 1;
		const beat = new Fraction(1, 2);
		const ignoreOverflow = true;
		voice['bars'].addNote = vi.fn();
		voice.addNote(note, barIndex, beat, ignoreOverflow);
		expect(voice['bars'].addNote).toBeCalledWith('P1', 'V1', note, barIndex, beat, {
			overflow: 'ignore',
		});
	});
});

describe('addNotes', () => {
	it('should class this.bars.addNotes with correct parameters @unit', () => {
		const notes = [new Note('q', 'c'), new Note('q', 'd')];
		const barIndex = 1;
		const beat = new Fraction(1, 2);
		const ignoreOverflow = true;
		voice['bars'].addNotes = vi.fn();
		voice.addNotes(notes, barIndex, beat, ignoreOverflow);
		expect(voice['bars'].addNotes).toBeCalledWith(
			'P1',
			'V1',
			notes,
			barIndex,
			beat,
			ignoreOverflow,
		);
	});
});

describe('addTriplet', () => {
	it('should call RhythmElement.calculateTripletDuration with correct parameters @unit', () => {
		const notes = [new Note('8', 'c'), new Note('8', 'd'), new Note('8', 'e')];
		const numerator = 3;
		const denominator = 2;
		RhythmElement.calculateTripletDuration = vi.fn();
		voice.addTriplet(notes, numerator, denominator);
		expect(RhythmElement.calculateTripletDuration).toBeCalledWith(notes, numerator, denominator);
	});
	it('should call notes[0-2].setTriplet with correct parameters @unit', () => {
		const notes = [new Note('8', 'c'), new Note('8', 'd'), new Note('8', 'e')];
		const numerator = 3;
		const denominator = 2;
		const totalDuration = new Fraction(1, 4);
		const noteCount = 3;
		RhythmElement.calculateTripletDuration = vi.fn(() => totalDuration);
		RhythmElement.prototype.setTriplet = vi.fn();
		voice.addTriplet(notes, numerator, denominator);
		expect(RhythmElement.prototype.setTriplet).toBeCalledTimes(3);
		expect(notes[0].setTriplet).toHaveBeenNthCalledWith(
			1,
			numerator,
			denominator,
			totalDuration,
			0,
			noteCount,
		);
		expect(notes[1].setTriplet).toHaveBeenNthCalledWith(
			2,
			numerator,
			denominator,
			totalDuration,
			1,
			noteCount,
		);
		expect(notes[2].setTriplet).toHaveBeenNthCalledWith(
			3,
			numerator,
			denominator,
			totalDuration,
			2,
			noteCount,
		);
	});
	it('should call addNotes with correct parameters @unit', () => {
		const notes = [new Note('8', 'c'), new Note('8', 'd'), new Note('8', 'e')];
		const numerator = 3;
		const denominator = 2;
		const totalDuration = new Fraction(1, 4);
		RhythmElement.calculateTripletDuration = vi.fn(() => totalDuration);
		RhythmElement.prototype.setTriplet = vi.fn();
		voice.addNotes = vi.fn();
		voice.addTriplet(notes, numerator, denominator);
		expect(voice.addNotes).toBeCalledWith(notes, undefined, undefined);
	});

	/**
   * Commented becase 
   * a) it's not a unit test
   * b) currently doesn't work due to the use of mocks above
  it('should add a triplet', async () => {
    const note1 = new Note('8', 'c');
    note1.triplet = { numerator: 3, denominator: 2, start: true, totalDuration: new Fraction(1, 4), noteCount: 3 };
    const note2 = new Note('8', 'd');
    note2.triplet = { numerator: 3, denominator: 2, totalDuration: new Fraction(1, 4), noteCount: 3 };
    const note3 = new Note('8', 'e');
    note3.triplet = { numerator: 3, denominator: 2, end: true, totalDuration: new Fraction(1, 4), noteCount: 3 };
    const expectedResult = [note1, note2, note3];
    voice.addTriplet([new Note('8', 'c'), new Note('8', 'd'), new Note('8', 'e')], 3, 2);
    const result = voice.getNotes();
    expect(result).toStrictEqual(expectedResult);
  }); /*
  it('should add triplet and use correct duration', () => {
    const note1 = new Note('8', 'c');
    note1.triplet = { numerator: 3, denominator: 2, start: true, totalDuration: new Fraction(1, 4), noteCount: 3 };
    const note2 = new Note('8', 'd');
    note2.triplet = { numerator: 3, denominator: 2, totalDuration: new Fraction(1, 4), noteCount: 3 };
    const note3 = new Note('8', 'e');
    note3.triplet = { numerator: 3, denominator: 2, end: true, totalDuration: new Fraction(1, 4), noteCount: 3 };
    const note4 = new Note('h', 'c', undefined, 1);
    const expectedResult = [note1, note2, note3, note4];
    voice.addTriplet([new Note('8', 'c'), new Note('8', 'd'), new Note('8', 'e')], 3, 2);
    voice.addNote(note4);
    const result = voice.getNotes();
    expect(voice['bars']['bars'].length).toBe(1);
    expect(result).toStrictEqual(expectedResult);
  });
  it('should add a quintuplet', () => {
    const note1 = new Note('16', 'c');
    note1.triplet = { numerator: 5, denominator: 4, start: true, totalDuration: new Fraction(1, 4), noteCount: 5 };
    const note2 = new Note('16', 'd');
    note2.triplet = { numerator: 5, denominator: 4, totalDuration: new Fraction(1, 4), noteCount: 5 };
    const note3 = new Note('16', 'e');
    note3.triplet = { numerator: 5, denominator: 4, totalDuration: new Fraction(1, 4), noteCount: 5 };
    const note4 = new Note('16', 'f');
    note4.triplet = { numerator: 5, denominator: 4, totalDuration: new Fraction(1, 4), noteCount: 5 };
    const note5 = new Note('16', 'g');
    note5.triplet = { numerator: 5, denominator: 4, end: true, totalDuration: new Fraction(1, 4), noteCount: 5 };
    const expectedResult = [note1, note2, note3, note4, note5];
    voice.addTriplet(
      [new Note('16', 'c'), new Note('16', 'd'), new Note('16', 'e'), new Note('16', 'f'), new Note('16', 'g')],
      5,
      4,
    );
    const result = voice.getNotes();
    expect(result).toStrictEqual(expectedResult);
  });*/
});

describe('getNote', () => {
	it('should call this.bars.getNote with correct parameters @unit', () => {
		voice.getNote(0, 1);
		expect(voice['bars'].getNote).toBeCalledWith('P1', 'V1', 0, 1);
	});
});

describe('getNoteByIndex', () => {
	it('should call this.bars.getNoteByIndex with correct parameters @unit', () => {
		voice.getNoteByIndex(4);
		expect(voice['bars'].getNoteByIndex).toBeCalledWith('P1', 'V1', 4);
	});
});

describe('getNextNote', () => {
	it('should call this.bars.getNextNote with correct parameters @unit', () => {
		voice.getNextNote(2, 3);
		expect(voice['bars'].getNextNote).toBeCalledWith('P1', 'V1', 2, 3);
	});
});

describe('getNotes', () => {
	it('should call this.bars.getNotes with correct parameters @unit', () => {
		voice.getNotes(3);
		expect(voice['bars'].getNotes).toBeCalledWith('P1', 'V1', 3);
	});
});
