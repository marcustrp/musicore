import { type MockInstance, afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Key } from '../core/key.js';
import { Note } from '../core/note.js';
import { BarArray } from './barArray.js';
import { TimeSignature } from '../core/timeSignature.js';
import { Bar } from '../core/bar.js';
import Fraction from 'fraction.js';

let barArray: BarArray;
beforeEach(() => {
	barArray = new BarArray(new TimeSignature(), new Key('c', 'major'));
});

describe('constructor', () => {
	it('should create a barArray with one bar using provided TimeSignature and Key, and set showKey to true', () => {
		expect(barArray.bars.length).toEqual(1);
		expect(barArray.bars[0]).toEqual(new Bar(new TimeSignature(), new Key('c', 'major'), true));
	});
});

describe('appendBar', () => {
	it('should append a bar with same timeSignature and key as last bar @integration', () => {
		barArray = new BarArray(new TimeSignature(6, 8), new Key('d', 'minor'));
		barArray.appendBar();
		expect(barArray.bars.length).toEqual(2);
		expect(barArray.bars[1]).toEqual(
			new Bar(new TimeSignature(6, 8), new Key('d', 'minor'), undefined, new Fraction(6, 8)),
		);
	});
	it('should append a bar with provided timeSignature and key @integration', () => {
		barArray.appendBar(new TimeSignature(2, 4), new Key('e', 'major'));
		expect(barArray.bars.length).toEqual(2);
		expect(barArray.bars[1]).toEqual(
			new Bar(new TimeSignature(2, 4), new Key('e', 'major'), undefined, new Fraction(4, 4)),
		);
	});
});

describe('setKey', () => {
	const key = new Key('e', 'major');
	const spies: MockInstance[] = [];
	beforeEach(() => {
		barArray.bars = [
			new Bar(new TimeSignature(), new Key('d', 'minor'), true),
			new Bar(new TimeSignature(), new Key('d', 'minor')),
			new Bar(new TimeSignature(), new Key('d', 'minor')),
			new Bar(new TimeSignature(), new Key('d', 'minor')),
		];
		spies[0] = vi.spyOn(barArray.bars[0], 'setKey');
		spies[1] = vi.spyOn(barArray.bars[1], 'setKey');
		spies[2] = vi.spyOn(barArray.bars[2], 'setKey');
		spies[3] = vi.spyOn(barArray.bars[3], 'setKey');
	});
	it('should change a negative indexFrom to 0 @integration', () => {
		barArray.setKey(key, -1, 0);
		expect(spies[0]).toHaveBeenCalledTimes(1);
		expect(spies[1]).toHaveBeenCalledTimes(0);
	});
	it('should change a indexFrom larger than last index to last index @integration', () => {
		barArray.setKey(key, 2, 4);
		expect(spies[1]).toHaveBeenCalledTimes(0);
		expect(spies[2]).toHaveBeenCalledTimes(1);
		expect(spies[3]).toHaveBeenCalledTimes(1);
	});
	it('should change key in all bars @integration', () => {
		barArray.setKey(key);
		expect(spies[0]).toHaveBeenCalledTimes(1);
		expect(spies[0]).toBeCalledWith(key, { showKeySign: true });
		expect(spies[1]).toHaveBeenCalledTimes(1);
		expect(spies[1]).toBeCalledWith(key, { showKeySign: false });
		expect(spies[2]).toHaveBeenCalledTimes(1);
		expect(spies[2]).toBeCalledWith(key, { showKeySign: false });
		expect(spies[3]).toHaveBeenCalledTimes(1);
		expect(spies[3]).toBeCalledWith(key, { showKeySign: false });
	});
	it('should set correct data from second to second to last bar @integration', () => {
		barArray.setKey(key, 1, 2);
		expect(spies[1]).toHaveBeenCalledTimes(1);
		expect(spies[1]).toBeCalledWith(key, { showKeySign: true });
		expect(spies[2]).toHaveBeenCalledTimes(1);
		expect(spies[2]).toBeCalledWith(key, { showKeySign: false });
		expect(barArray.bars[3].showKeySign).toEqual(true);
	});
	it('should set key of all bars from indexFrom to last bar @integration', () => {
		barArray.setKey(key, 2);
		expect(spies[2]).toHaveBeenCalledTimes(1);
		expect(spies[2]).toBeCalledWith(key, { showKeySign: true });
		expect(spies[3]).toHaveBeenCalledTimes(1);
		expect(spies[3]).toBeCalledWith(key, { showKeySign: false });
	});
	it('should not set showKeySign to true if previous bar has same key @integration', () => {
		barArray.bars[0]['_key'] = key;
		barArray.bars[1].showKeySign = true;
		barArray.setKey(key, 1, 2);
		expect(spies[1]).toHaveBeenCalledTimes(1);
		expect(spies[1]).toBeCalledWith(key, { showKeySign: false });
		expect(spies[2]).toHaveBeenCalledTimes(1);
		expect(spies[2]).toBeCalledWith(key, { showKeySign: false });
		expect(barArray.bars[3].showKeySign).toEqual(true);
	});
	it('should not set showKeySign to true if next bar has same key @integration', () => {
		barArray.bars[3]['_key'] = key;
		barArray.setKey(key, 1, 2);
		expect(spies[1]).toHaveBeenCalledTimes(1);
		expect(spies[1]).toBeCalledWith(key, { showKeySign: true });
		expect(spies[2]).toHaveBeenCalledTimes(1);
		expect(spies[2]).toBeCalledWith(key, { showKeySign: false });
		expect(barArray.bars[3].showKeySign).toEqual(false);
	});
});

describe('addNote', () => {
	/** @todo implement test */
	//describe('option.overflow = "split"', () => {});
	describe('option.overflow = "ignore"', () => {
		let barAddNoteSpy: MockInstance;
		let spyAppendBar: MockInstance;
		beforeEach(() => {
			barAddNoteSpy = vi.spyOn(Bar.prototype, 'addNote').mockImplementationOnce(() => undefined);
			spyAppendBar = vi.spyOn(BarArray.prototype, 'appendBar');
		});
		afterAll(() => {
			vi.restoreAllMocks();
		});
		it('should add a note', () => {
			const note = new Note('q', 'c');
			barArray.addNote('P1', 'V1', note, undefined, undefined, { overflow: 'ignore' });
			expect(spyAppendBar).not.toHaveBeenCalled();
			expect(barAddNoteSpy).toHaveBeenCalledTimes(1);
			expect(barAddNoteSpy).toBeCalledWith('P1', 'V1', note);
		});
		it('should add a note, even if it is to long for the bar', () => {
			barArray = new BarArray(new TimeSignature(2, 4), new Key('c', 'major'));
			const note = new Note('w', 'c');
			barArray.addNote('P1', 'V1', note, undefined, undefined, { overflow: 'ignore' });
			expect(spyAppendBar).not.toHaveBeenCalled();
			expect(barAddNoteSpy).toHaveBeenCalledTimes(1);
			expect(barAddNoteSpy).toBeCalledWith('P1', 'V1', note);
		});
	});
	describe('option.overflow = "nextBar"', () => {
		let barAddNoteSpy: MockInstance;
		let spyAppendBar: MockInstance;
		let spyGetVoiceDuration: MockInstance;
		beforeEach(() => {
			barAddNoteSpy = vi.spyOn(Bar.prototype, 'addNote').mockImplementationOnce(() => undefined);
			spyAppendBar = vi.spyOn(BarArray.prototype, 'appendBar');
			// return a half note
			spyGetVoiceDuration = vi
				.spyOn(Bar.prototype, 'getVoiceDuration')
				.mockImplementationOnce(() => new Fraction(1, 2));
		});
		afterAll(() => {
			vi.restoreAllMocks();
		});
		it('should add a note that fits in the current bar', () => {
			const note = new Note('h', 'c');
			barArray.addNote('P1', 'V1', note, undefined, undefined, { overflow: 'nextBar' });
			expect(spyAppendBar).not.toHaveBeenCalled();
			expect(barAddNoteSpy).toHaveBeenCalledTimes(1);
			expect(spyGetVoiceDuration).toHaveBeenCalledTimes(1);
			expect(barAddNoteSpy).toBeCalledWith('P1', 'V1', note);
		});
		it('should add a note that does not fit in the current bar to a new bar', () => {
			const note = new Note('w', 'c');
			barArray.addNote('P1', 'V1', note, undefined, undefined, { overflow: 'nextBar' });
			expect(spyAppendBar).toHaveBeenCalledTimes(1);
			expect(barAddNoteSpy).toHaveBeenCalledTimes(1);
			expect(spyGetVoiceDuration).toHaveBeenCalledTimes(1);
			expect(barAddNoteSpy).toBeCalledWith('P1', 'V1', note, { overflow: 'ignore' });
		});
	});
});

describe('convertToPickup', () => {
	it('should set correct duration', () => {
		barArray.convertToPickup(new Fraction(1, 4));
		expect(barArray.bars[0].duration.toString()).toEqual('0.25');
	});
});

/*
describe('addNote', () => {
  it('should add a note', () => {
    const key = new Key('g', 'minor');
    const note = new Note('q', 'g');
    const voice = new Voice('P1', 'V1', new BarArray(new TimeSignature(), key));
    barArray.addNote('P1', 'V1', note);

    expect(voice['bars'].bars[0].notes['P1']['V1'].length).toEqual(1);
    expect(voice['bars'].bars[0].notes['P1']['V1']).toEqual([note]);
  });

  it('should add two notes in two bars', () => {
    const key = new Key('g', 'minor');
    const note1 = new Note('w', 'g');
    const note2 = new Note('w', 'g');
    const voice = new Voice('P1', 'V1', new BarArray(new TimeSignature(), key));
    barArray.addNote('P1', 'V1', note1);
    barArray.addNote('P1', 'V1', note2);

    expect(voice['bars'].bars.length).toEqual(2);
    expect(voice['bars'].bars[0].notes['P1']['V1']).toEqual([note1]);
    expect(voice['bars'].bars[0].notes['P1']['V1']).toEqual([note2]);
  });

  it('should add a note in two voices', () => {
    const key = new Key('g', 'minor');
    const barArray = new BarArray(new TimeSignature(), key);
    const note1 = new Note('w', 'g');
    barArray.addNote('P1', 'V1', note1);
    const note2 = new Note('w', 'c');
    barArray.addNote('P1', 'V2', note2);

    expect(barArray.bars[0].notes['P1']['V1'].length).toEqual(1);
    expect(barArray.bars[0].notes['P1']['V1']).toEqual([note1]);
    expect(barArray.bars[0].notes['P1']['V2']).toEqual([note2]);
  });
  it('should add new bar when neccecary', () => {
    const barArray = new BarArray(new TimeSignature(), new Key('c', 'major'));
    const expectedBars = [
      new Bar(new TimeSignature(4, 4), new Key('c', 'major'), true),
      new Bar(new TimeSignature(4, 4), new Key('c', 'major'), false, new Fraction(1)),
    ];
    barArray.addNote('P1', 'V1', new Note('w', 'c'));
    barArray.addNote('P1', 'V1', new Note('w', 'c'));
    barArray['bars'].forEach((bar) => (bar.notes = {})); // ignore data in this test

    expect(barArray['bars'].length).toEqual(2);
    expect(barArray['bars']).toEqual(expectedBars);
  });
  it('should not add new bar if last bar if full, but not overflowing', () => {
    const barArray = new BarArray(new TimeSignature(), new Key('c', 'major'));
    const expectedBars = [new Bar(new TimeSignature(4, 4), new Key('c', 'major'), true)];
    barArray.addNote('P1', 'V1', new Note('w', 'c'));
    barArray['bars'].forEach((bar) => (bar.notes = {})); // ignore data in this test

    expect(barArray['bars'].length).toEqual(1);
    expect(barArray['bars']).toEqual(expectedBars);
  });
});

describe('addNotes', () => {
  it('should add two notes', () => {
    const barArray = new BarArray(new TimeSignature(), new Key('c', 'major'));
    barArray.addNote = vi.fn();
    const notes = [new Note('q', 'c'), new Note('q', 'd')];
    barArray.addNotes('P1', 'V1', notes);
    expect(barArray.addNote).toBeCalledTimes(2);
    expect(barArray.addNote).toBeCalledWith('P1', 'V1', notes[0], undefined, undefined, false);
  });
});

describe('getNote', () => {
  it('should return correct note', () => {
    const note = new Note('h', 'd', undefined, 5);
    barArray.addNote('P1', 'V1', new Note('w', 'c', undefined, 5));
    barArray.addNote('P1', 'V1', note);
    barArray.addNote('P1', 'V1', new Note('h', 'e', undefined, 5));
    barArray.addNote('P1', 'V1', new Note('w', 'e', undefined, 5));
    const result = barArray.getNote('P1', 'V1', 1, 0);
    expect(result).toEqual(note);
  });
  it('should return last note', () => {
    const note = new Note('h', 'd', undefined, 5);
    barArray.addNote('P1', 'V1', new Note('w', 'c', undefined, 5));
    barArray.addNote('P1', 'V1', new Note('w', 'e', undefined, 5));
    barArray.addNote('P1', 'V1', new Note('h', 'e', undefined, 5));
    barArray.addNote('P1', 'V1', note);
    const result = barArray.getNote('P1', 'V1');
    expect(result).toEqual(note);
  });
});

describe('getNoteByIndex', () => {
  it('should return first note of voice', () => {
    const note = new Note('w', 'c', undefined, 5);
    barArray.addNote('P1', 'V1', note);
    barArray.addNote('P1', 'V1', new Note('h', 'd', undefined, 5));
    barArray.addNote('P1', 'V1', new Note('h', 'e', undefined, 5));
    barArray.addNote('P1', 'V1', new Note('w', 'e', undefined, 5));
    const result = barArray.getNoteByIndex('P1', 'V1', 0);
    expect(result).toEqual(note);
  });
  it('should return first note in second bar', () => {
    const note = new Note('h', 'd', undefined, 5);
    barArray.addNote('P1', 'V1', new Note('w', 'c', undefined, 5));
    barArray.addNote('P1', 'V1', note);
    barArray.addNote('P1', 'V1', new Note('h', 'e', undefined, 5));
    barArray.addNote('P1', 'V1', new Note('w', 'e', undefined, 5));
    const result = barArray.getNoteByIndex('P1', 'V1', 1);
    expect(result).toEqual(note);
  });
  it('should return last note of voice', () => {
    const note = new Note('q', 'b', 'b');
    barArray.addNote('P1', 'V1', new Note('q', 'b', 'b'));
    barArray.addNote('P1', 'V1', new Note('q', 'c'));
    barArray.addNote('P1', 'V1', new Note('q', 'b', 'b'));
    barArray.addNote('P1', 'V1', new Note('q', 'd'));
    barArray.addNote('P1', 'V1', new Note('q', 'b', 'b'));
    barArray.addNote('P1', 'V1', new Note('q', 'e', 'b'));
    barArray.addNote('P1', 'V1', new Note('q', 'b', 'b'));
    barArray.addNote('P1', 'V1', new Note('q', 'f'));
    barArray.addNote('P1', 'V1', new Note('q', 'b', 'b'));
    barArray.addNote('P1', 'V1', note);
    const result = barArray.getNoteByIndex('P1', 'V1', 9);
    expect(result).toEqual(note);
  });
});

describe('getNotes', () => {
  it('should return notes in selected bar', () => {
    const note = new Note('w', 'd', undefined, 5);
    barArray.addNote('P1', 'V1', new Note('w', 'c', undefined, 5));
    barArray.addNote('P1', 'V1', note);
    barArray.addNote('P1', 'V1', new Note('h', 'e', undefined, 5));
    barArray.addNote('P1', 'V1', new Note('h', 'e', undefined, 5));
    const result = barArray.getNotes('P1', 'V1', 1);
    expect(result).toEqual([note]);
  });
  it('should return all notes in a voice', () => {
    const note1 = new Note('w', 'c', undefined, 5);
    const note2 = new Note('w', 'd', undefined, 5);
    const note3 = new Note('h', 'e', undefined, 5);
    const note4 = new Note('h', 'e', undefined, 5);
    barArray.addNote('P1', 'V1', note1);
    barArray.addNote('P1', 'V1', note2);
    barArray.addNote('P1', 'V1', note3);
    barArray.addNote('P1', 'V1', note4);
    const expectedResult = [note1, note2, note3, note4];
    const result = barArray.getNotes('P1', 'V1');
    expect(result).toEqual(expectedResult);
  });
});
*/
