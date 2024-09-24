import { it, expect, describe, beforeEach } from 'vitest';
import { Clef, ClefType } from './clef';

describe('Clef', () => {
  it('should have correct default style', () => {
    const standardClef = {
      symbol: 'g',
    };
    const clef = new Clef();
    expect(clef).toEqual(standardClef);
  });
  it('should set octaveChange if defined', () => {
    const clef = new Clef('treble', undefined, 2);
    expect(clef.octaveChange).toBe(2);
  });
});

describe('Clef.setType', () => {
  const clefs = [
    { type: 'treble', symbol: 'g', clefLine: undefined },
    { type: 'g', symbol: 'g', clefLine: undefined },
    { type: 'g', symbol: 'g', clefLine: 3 },
    { type: 'bass', symbol: 'f', clefLine: undefined },
    { type: 'f', symbol: 'f', clefLine: undefined },
    { type: 'f', symbol: 'f', clefLine: 4 },
    { type: 'baritone', symbol: 'f', clefLine: 3 },
    { type: 'tenor', symbol: 'c', clefLine: 4 },
    { type: 'alto', symbol: 'c', clefLine: 3 },
    { type: 'mezzosoprano', symbol: 'c', clefLine: 2 },
    { type: 'soprano', symbol: 'c', clefLine: 1 },
    { type: 'c', symbol: 'c', clefLine: undefined },
    { type: 'c', symbol: 'c', clefLine: 1 },
    { type: 'perc', symbol: 'perc', clefLine: undefined },
    { type: 'none', symbol: 'none', clefLine: undefined },
    { type: 'unknown', symbol: 'g', clefLine: undefined },
  ];
  clefs.forEach((c) => {
    it('should have correct style when set to ' + c.type + ', ' + c.symbol + ', ' + c.clefLine, () => {
      const clef = new Clef();
      clef.setType(c.type as any as ClefType, c.clefLine);
      expect(clef.symbol).toBe(c.symbol);
      expect(clef.symbol).toBe(c.symbol);
      expect(clef.clefLine).toBe(c.clefLine);
    });
  });
});
