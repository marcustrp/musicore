import * as abcjs from 'abcjs';
import {} from '../../../../core/data/modes.js';
import {} from '../../../../core/clef.js';
export const keyMode = {
    '': 'major',
    m: 'minor',
    Dor: 'dorian',
    Mix: 'mixolydian',
    Loc: 'locrian',
    Phr: 'phrygian',
    Lyd: 'lydian',
};
export const accidental = {
    dblflat: 'bb',
    dblsharp: 'x',
    flat: 'b',
    natural: 'n',
    quarterflat: 'qb',
    quartersharp: 'q#',
    sharp: '#',
};
export const clef = {
    treble: { type: 'treble' },
    tenor: { type: 'tenor' },
    bass: { type: 'bass' },
    alto: { type: 'alto' },
    'treble+8': { type: 'treble', octave: 1 },
    'tenor+8': { type: 'tenor', octave: 1 },
    'bass+8': { type: 'bass', octave: 1 },
    'alto+8': { type: 'alto', octave: 1 },
    'treble-8': { type: 'treble', octave: -1 },
    'tenor-8': { type: 'tenor', octave: -1 },
    'bass-8': { type: 'bass', octave: -1 },
    'alto-8': { type: 'alto', octave: -1 },
    none: { type: 'none' },
    perc: { type: 'none' },
};
