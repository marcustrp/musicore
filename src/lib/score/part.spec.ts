import { beforeEach, describe, expect, it } from 'vitest';
import { Bar } from '../core/bar';
import { Clef } from '../core/clef';
import { Key } from '../core/key';
import { TimeSignature } from '../core/timeSignature';
import { Part } from './part';
import { BarArray } from './barArray';
import { Note } from '../core/note';
import Fraction from 'fraction.js';

let part: Part;
beforeEach(() => {
  part = new Part('P1', new Clef(), new BarArray(new TimeSignature(), new Key('c', 'major')));
});

describe('constructor()', () => {
  it('should create simple instance', () => {
    const clef = new Clef('g');
    const timeSignature = new TimeSignature(4, 4);
    const barArray = new BarArray(timeSignature, new Key('c', 'major'));

    const partObj = {
      id: 'P1',
      //bar: [bar],
      bars: barArray,
      staves: [
        {
          clef: clef,
          bars: barArray,
        },
      ],
      voices: [
        {
          id: 'V1',
          partId: 'P1',
          bars: barArray,
        },
      ],
    };

    const result = new Part('P1', clef, barArray);

    expect(result).toEqual(partObj);
  });
});

describe('addStaff', () => {
  it('should add new staff and return it', () => {
    const clef = new Clef('g');
    const clef2 = new Clef('f');
    const key = new Key('c', 'major');
    const barArray = new BarArray(new TimeSignature(), key);
    const staffObj = {
      clef: clef,
      bars: barArray,
    };
    const staffObj2 = {
      clef: clef2,
      bars: barArray,
    };

    const part = new Part('P1', clef, barArray);
    const result = part.addStaff(clef2);

    expect(result).toEqual(staffObj2);
    expect(part.staves).toEqual([staffObj, staffObj2]);
  });
});

describe('addVoice()', () => {
  it('should add new voice and return it', () => {
    const clef = new Clef('f');
    const key = new Key('c', 'major');
    const barArray = new BarArray(new TimeSignature(), key);
    const voiceObj = {
      bars: barArray,
      id: 'V1',
      partId: 'P1',
    };
    const voiceObj2 = {
      bars: barArray,
      id: 'V2',
      partId: 'P1',
    };

    const part = new Part('P1', clef, barArray);
    const result = part.addVoice();

    expect(result).toEqual(voiceObj2);
    expect(part.voices).toEqual([voiceObj, voiceObj2]);
  });
});

describe('get*', () => {
  beforeEach(() => {});
  describe('getVoice()', () => {
    it('should throw error if partIndex out of bound', () => {
      const resultFn = () => part['getVoice'](1);
      expect(resultFn).toThrowError(/Voice index/);
    });
    it('should throw error if partIndex below zero', () => {
      const resultFn = () => part['getVoice'](-1);
      expect(resultFn).toThrowError(/Voice index/);
    });
  });
  describe('getStaff()', () => {
    it('should throw error if partIndex out of bound', () => {
      const resultFn = () => part['getStaff'](1);
      expect(resultFn).toThrowError(/Staff index/);
    });
    it('should throw error if partIndex below zero', () => {
      const resultFn = () => part['getStaff'](-1);
      expect(resultFn).toThrowError(/Staff index/);
    });
  });
});
