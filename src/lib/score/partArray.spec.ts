import { beforeEach, describe, expect, it } from 'vitest';
import { Clef } from '../core/clef';
import { Part } from './part';
import { BarArray } from './barArray';
import PartArray from './partArray';
import { Bar } from '../core/bar';
import { TimeSignature } from '../core/timeSignature';
import { Key } from '../core/key';
import { Note } from '../core/note';
import Fraction from 'fraction.js';

let barArray: BarArray;
let partArray: PartArray;
beforeEach(() => {
  barArray = new BarArray(new TimeSignature(), new Key('c', 'major')); //{} as any as BarArray;
  partArray = new PartArray(barArray);
});

describe('createPartId()', () => {
  it('should create a new part id (no existing parts)', () => {
    const result = partArray['createPartId']();
    expect(result).toBe('P1');
  });
  it('should create a new part id (one existing part)', () => {
    partArray['_parts'] = [{ id: 'P1' } as any as Part];
    const result = partArray['createPartId']();
    expect(result).toBe('P2');
  });
});

describe('addPart()', () => {
  it('should add a new part with default clef', () => {
    partArray.addPart();
    expect(partArray['_parts'].length).toBe(1);
    expect(partArray['_parts'][0]).toBeInstanceOf(Part);
  });
  it('should add a new part with the provided clef', () => {
    const parts = new PartArray(barArray);
    parts.addPart(new Clef('bass'));
    expect(parts['_parts'][0].staves[0].clef.name).toBe('bass');
  });
  it('should add mulitple parts', () => {
    partArray.addPart();
    partArray.addPart();
    expect(partArray['_parts'].length).toBe(2);
  });
});

describe('getPart()', () => {
  it('should return the correct part', () => {
    const part = { id: 'P1' } as any as Part;
    partArray['_parts'] = [part];
    const result = partArray['getPart'](0);
    expect(result).toBe(part);
  });
  it('should throw error if part does not exist (index >= partCount)', () => {
    const part = { id: 'P1' } as any as Part;
    partArray['_parts'] = [part];
    expect(() => partArray['getPart'](1)).toThrow();
  });
  it('should throw an error if partIndex below zero', () => {
    const part = { id: 'P1' } as any as Part;
    partArray['_parts'] = [part];
    expect(() => partArray['getPart'](-1)).toThrow();
  });
  it('should throw an error if partIndex is out of range', () => {
    const part = { id: 'P1' } as any as Part;
    partArray['_parts'] = [part];
    expect(() => partArray['getPart'](1)).toThrow();
  });
});

describe('getPartById()', () => {
  let partArray: PartArray;
  let parts: Part[];
  beforeEach(() => {
    partArray = new PartArray(barArray);
    parts = [{ id: 'P1' } as any as Part, { id: 'P2' } as any as Part];
    partArray['_parts'] = parts;
  });
  it('should return the first part', () => {
    const result = partArray['getPartById']('P1');
    expect(result).toBe(parts[0]);
  });
  it('should return the last part', () => {
    const result = partArray['getPartById']('P2');
    expect(result).toBe(parts[1]);
  });
  it('should return undefined if part does not exist', () => {
    const result = partArray['getPartById']('P3');
    expect(result).toBeUndefined();
  });
});

describe('getPartId()', () => {
  beforeEach(() => {
    const part = { id: 'P1' } as any as Part;
    partArray['_parts'] = [part];
  });
  it('should return the correct part id', () => {
    const result = partArray['getPartId'](0);
    expect(result).toBe('P1');
  });
  it('should return undefined if part does not exist (index >= partCount)', () => {
    const result = partArray['getPartId'](1);
    expect(result).toBeUndefined();
  });
  it('should return undefined if partIndex below zero', () => {
    const result = partArray['getPartId'](-1);
    expect(result).toBeUndefined();
  });
});

describe('getPartCount()', () => {
  it('should return 0 if no parts exist', () => {
    const result = partArray['getPartCount']();
    expect(result).toBe(0);
  });
  it('should return 1 if one part exists', () => {
    partArray.addPart();
    const result = partArray['getPartCount']();
    expect(result).toBe(1);
  });
});
