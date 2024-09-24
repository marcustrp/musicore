import Fraction from 'fraction.js';
import { describe, expect, it, vi } from 'vitest';
import { RhythmElement } from './rhythmElement';
import ChordSymbol from './chordSymbol';

describe('RhythmElement', () => {
  it('should create a simple instance', () => {
    const reObj = { _type: 'q' };
    const result = new RhythmElement('q');
    expect(result).toEqual(reObj);
  });
  it('should create an instance with dots', () => {
    const reObj = { _type: 'q', _dots: 2 };
    const result = new RhythmElement('q', 2);
    expect(result).toEqual(reObj);
  });
});

describe('RhythmElement.type', () => {
  describe('get', () => {
    it('should return _type', () => {
      const obj = new RhythmElement('q');
      const result = obj.type;
      expect(result).toBe('q');
    });
  });
  describe('set', () => {
    it('should set _type', () => {
      const obj = new RhythmElement('q');
      obj.type = 'w';
      expect(obj).toHaveProperty('_type');
      expect(obj['_type']).toBe('w');
    });
  });
});

describe('RhythmElement.dots', () => {
  describe('get', () => {
    it('should return 0 if _dots is undefined', () => {
      const obj = new RhythmElement('q');
      const result = obj.dots;
      expect(result).toBe(0);
      expect(obj).not.toHaveProperty('_dots');
    });
    it('should return _dots if defined', () => {
      const obj = new RhythmElement('q', 2);
      const result = obj.dots;
      expect(result).toBe(2);
      expect(obj).toHaveProperty('_dots');
    });
  });
  describe('set', () => {
    it('should set dots if defined', () => {
      const obj = new RhythmElement('q');
      obj.dots = 2;
      expect(obj).toHaveProperty('_dots');
      expect(obj['_dots']).toBe(2);
    });
    it('should delete dots if undefined or 0', () => {
      const obj = new RhythmElement('q', 1);
      obj.dots = 0;
      const obj2 = new RhythmElement('q', 1);
      obj2.dots = undefined;

      expect(obj).not.toHaveProperty('_dots');
      expect(obj2).not.toHaveProperty('_dots');
    });
  });
});

describe('RhythmElement.getChordSymbol', () => {
  it('should return undefined if no chord symbol is set', () => {
    const note = new RhythmElement('q');
    expect(note.getChordSymbol()).toBeUndefined();
  });
  it('should return first chord symbol if set', () => {
    const chordSymbol = { text: 'C' } as any as ChordSymbol;

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol];
    expect(note.getChordSymbol()).toEqual(chordSymbol);
  });
  it('should return chord symbol by index', () => {
    const chordSymbol1 = { text: 'C' } as any as ChordSymbol;
    const chordSymbol2 = { text: 'D' } as any as ChordSymbol;

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol1, chordSymbol2];
    expect(note.getChordSymbol(1)).toEqual(chordSymbol2);
  });
  it('shoudl return undefined if index out of range', () => {
    const chordSymbol = { text: 'C' } as any as ChordSymbol;

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol];
    expect(note.getChordSymbol(2)).toBeUndefined();
  });
});

describe('RhythmElement.getChordSymbolByPosition', () => {
  it('should return undefined if no chord symbol is set', () => {
    const note = new RhythmElement('q');
    expect(note.getChordSymbolByPosition(new Fraction(1, 2))).toBeUndefined();
  });
  it('should return chord symbol with offset but undefined level', () => {
    const offset = new Fraction(1, 2);
    const chordSymbol = { text: 'C', offset: offset } as any as ChordSymbol;

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol];
    expect(note.getChordSymbolByPosition(offset)).toEqual(chordSymbol);
  });
  it('should return chord symbol with offset and level', () => {
    const offset = new Fraction(1, 2);
    const level = 1;
    const chordSymbol = { text: 'C', offset: offset, level: level } as any as ChordSymbol;

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol];
    expect(note.getChordSymbolByPosition(offset, level)).toEqual(chordSymbol);
  });
  it('should return chord symbol with level but undefined offset', () => {
    const level = 1;
    const chordSymbol = { text: 'C', level: level } as any as ChordSymbol;

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol];
    expect(note.getChordSymbolByPosition(undefined, level)).toEqual(chordSymbol);
  });
  it('should return chord symbol with neither offset nor level', () => {
    const chordSymbol = { text: 'C' } as any as ChordSymbol;

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol];
    expect(note.getChordSymbolByPosition()).toEqual(chordSymbol);
  });
  it('should not match chord symbol with undefined offset when offset is set', () => {
    const offset = new Fraction(1, 2);
    const chordSymbol = { text: 'C' } as any as ChordSymbol;

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol];
    expect(note.getChordSymbolByPosition(offset)).toBeUndefined();
  });
  it('should return undefined if offset does not match', () => {
    const offset = new Fraction(1, 2);
    const chordSymbol = { text: 'C', offset: offset } as any as ChordSymbol;

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol];
    expect(note.getChordSymbolByPosition(new Fraction(1, 3))).toBeUndefined();
  });

  it('should not match chord symbol with undefined level when level is set', () => {
    const level = 1;
    const chordSymbol = { text: 'C' } as any as ChordSymbol;

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol];
    expect(note.getChordSymbolByPosition(undefined, level)).toBeUndefined();
  });
  it('should return undefined if level does not match', () => {
    const offset = new Fraction(1, 2);
    const level = 1;
    const chordSymbol = { text: 'C', offset: offset, level: level } as any as ChordSymbol;

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol];
    expect(note.getChordSymbolByPosition(offset, 2)).toBeUndefined();
  });
});

describe('RhythmElement.setChordSymbol', () => {
  it('should set chord symbol', () => {
    const text = 'C';
    const chordSymbol = { text: text };

    const note = new RhythmElement('q');
    note.setChordSymbol(chordSymbol as ChordSymbol);
    expect(note['_chordSymbols']).toEqual([chordSymbol]);
  });
  it('should replace chord symbol with same offset and level', () => {
    const offset = new Fraction(1, 2);
    const level = 1;
    const chordSymbol1 = { text: 'C', offset: offset, level: level };
    const chordSymbol2 = { text: 'D', offset: offset, level: level };

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol1 as ChordSymbol];
    note.setChordSymbol(chordSymbol2 as ChordSymbol);
    expect(note['_chordSymbols']).toEqual([chordSymbol2]);
  });
  it('should set chord two chord symbols, second with offset', () => {
    const text = ['C', 'F'];
    const offset = [new Fraction(0), new Fraction(1, 2)];
    const chordSymbols = [{ text: text[0] }, { text: text[1], offset: offset[1] }];

    vi.spyOn(RhythmElement.prototype as any, 'sortChordSymbols').mockImplementationOnce(() => {});
    const note = new RhythmElement('q');
    note.setChordSymbol({ text: text[0] } as ChordSymbol);
    note.setChordSymbol({ text: text[1], offset: offset[1] } as ChordSymbol);

    expect(note['_chordSymbols']?.length).toEqual(2);
    expect(note['_chordSymbols']).toEqual(chordSymbols);
  });
});

describe('RhythmElement.sortChordSymbols', () => {
  it('should sort chord symbols by offset', () => {
    const text = ['C', 'F'];
    const offset = new Fraction(1, 2);
    const chordSymbol1 = { text: text[0] };
    const chordSymbol2 = { text: text[1], offset: offset };

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol2 as ChordSymbol, chordSymbol1 as ChordSymbol];
    note['sortChordSymbols']();

    expect(note['_chordSymbols']).toEqual([chordSymbol1, chordSymbol2]);
  });
  it('should sort chord symbols with same offset by level', () => {
    const text = ['C', 'F'];
    const offset = new Fraction(1, 2);
    const level = 1;
    const chordSymbol1 = { text: text[0], offset: offset, level: level };
    const chordSymbol2 = { text: text[1], offset: offset, level: level + 1 };

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol2 as ChordSymbol, chordSymbol1 as ChordSymbol];
    note['sortChordSymbols']();

    expect(note['_chordSymbols']).toEqual([chordSymbol1, chordSymbol2]);
  });
  it('should sort chord symbol with undefined offset first', () => {
    const text = ['C', 'F'];
    const offset = new Fraction(1, 2);
    const chordSymbol1 = { text: text[0] };
    const chordSymbol2 = { text: text[1], offset: offset };

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol2 as ChordSymbol, chordSymbol1 as ChordSymbol];
    note['sortChordSymbols']();

    expect(note['_chordSymbols']).toEqual([chordSymbol1, chordSymbol2]);
  });
  it('should sort chord symbol with undefined level first', () => {
    const text = ['C', 'F'];
    const offset = new Fraction(1, 2);
    const chordSymbol1 = { text: text[0], offset: offset };
    const chordSymbol2 = { text: text[1], offset: offset, level: 1 };

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol2 as ChordSymbol, chordSymbol1 as ChordSymbol];
    note['sortChordSymbols']();

    expect(note['_chordSymbols']).toEqual([chordSymbol1, chordSymbol2]);
  });
  it('should leave the order the same if offset and level are the same', () => {
    const text = ['C', 'F'];
    const offset = new Fraction(1, 2);
    const level = 1;
    const chordSymbol1 = { text: text[0], offset: offset, level: level };
    const chordSymbol2 = { text: text[1], offset: offset, level: level };

    const note = new RhythmElement('q');
    note['_chordSymbols'] = [chordSymbol2 as ChordSymbol, chordSymbol1 as ChordSymbol];
    note['sortChordSymbols']();

    expect(note['_chordSymbols']).toEqual([chordSymbol2, chordSymbol1]);
  });
});

describe('RhythmElement.removeChordSymbols', () => {
  it('should remove chord all chord symbols', () => {
    const text = ['C', 'F'];
    const offset = [new Fraction(0), new Fraction(1, 2)];
    const chordSymbols = [{ text: text[0] }, { text: text[1], offset: offset[1] }];

    const note = new RhythmElement('q');
    note['_chordSymbols'] = chordSymbols as ChordSymbol[];
    note.removeChordSymbols();

    expect(note['_chordSymbols']).toBeUndefined();
  });
});

describe('getDuration()', () => {
  it('should return correct duration', () => {
    const expectedDuration = new Fraction(3, 8);
    const item = new RhythmElement('q', 1);
    const result = item.getDuration();
    expect(result).toEqual(expectedDuration);
  });
  it('should return correct duration of triplet note', () => {
    const expectedDuration = new Fraction(1, 6);
    const item = new RhythmElement('q');
    item.triplet = { numerator: 3, denominator: 2, totalDuration: new Fraction(1, 2), noteCount: 3 };
    const result = item.getDuration();
    expect(result).toEqual(expectedDuration);
  });
  it('should return correct duration with triplet ignored', () => {
    const expectedDuration = new Fraction(1, 4);
    const item = new RhythmElement('q');
    item.triplet = { numerator: 3, denominator: 2, totalDuration: new Fraction(1, 2), noteCount: 3 };
    const result = item.getDuration(true);
    expect(result).toEqual(expectedDuration);
  });
});

describe('setTriplet()', () => {
  it('should correctly set first note in triplet', () => {
    const item = new RhythmElement('q');
    item.setTriplet(3, 2, new Fraction(1, 4), 0, 3);
    const expectedResult = {
      numerator: 3,
      denominator: 2,
      start: true,
      totalDuration: new Fraction(1, 4),
      noteCount: 3,
    };
    expect(item.triplet).toEqual(expectedResult);
  });
  it('should correctly set second note in triplet', () => {
    const item = new RhythmElement('q');
    item.setTriplet(3, 2, new Fraction(1, 4), 1, 3);
    const expectedResult = { numerator: 3, denominator: 2, totalDuration: new Fraction(1, 4), noteCount: 3 };
    expect(item.triplet).toEqual(expectedResult);
  });
  it('should correctly set last note in triplet', () => {
    const item = new RhythmElement('q');
    item.setTriplet(3, 2, new Fraction(1, 4), 2, 3);
    const expectedResult = { numerator: 3, denominator: 2, end: true, totalDuration: new Fraction(1, 4), noteCount: 3 };
    expect(item.triplet).toEqual(expectedResult);
  });
});

describe('calculateTripletDuration()', () => {
  it('should return correct duration', () => {
    const expectedResult = new Fraction(1, 2);
    const result = RhythmElement.calculateTripletDuration(
      [new RhythmElement('q'), new RhythmElement('q'), new RhythmElement('q')],
      3,
      2,
    );
    expect(result).toEqual(expectedResult);
  });
});
