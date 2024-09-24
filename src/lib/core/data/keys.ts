/*type KeyData = { [key: string]: { [key: string]: KeyDataItem } };
type KeyDataItem = { signs: number; type?: '#' | 'b' };
const keyAccidentals: KeyData = {
  major: {
    'f#': { signs: 6, type: '#' },
    b: { signs: 5, type: '#' },
    e: { signs: 4, type: '#' },
    a: { signs: 3, type: '#' },
    d: { signs: 2, type: '#' },
    g: { signs: 1, type: '#' },
    c: { signs: 0 },
    f: { signs: 1, type: 'b' },
    bb: { signs: 2, type: 'b' },
    eb: { signs: 3, type: 'b' },
    ab: { signs: 4, type: 'b' },
    db: { signs: 5, type: 'b' },
    gb: { signs: 6, type: 'b' },
  },
  minor: {
    'd#': { signs: 6, type: '#' },
    'g#': { signs: 5, type: '#' },
    'c#': { signs: 4, type: '#' },
    'f#': { signs: 3, type: '#' },
    b: { signs: 2, type: '#' },
    e: { signs: 1, type: '#' },
    a: { signs: 0 },
    d: { signs: 1, type: 'b' },
    g: { signs: 2, type: 'b' },
    c: { signs: 3, type: 'b' },
    f: { signs: 4, type: 'b' },
    eb: { signs: 6, type: 'b' },
  },
};*/

/**
 * positive = sharps, negative = flats
 */
type KeySignatureData = { [key: string]: number };
const majorKeyAccidentals: KeySignatureData = {
	cb: -7,
	c: 0,
	'c#': 7,
	db: -5,
	d: 2,
	'd#': 9,
	eb: -3,
	e: 4,
	f: -1,
	'f#': 6,
	gb: -6,
	g: 1,
	'g#': 8,
	ab: -4,
	a: 3,
	'a#': 10,
	bb: -2,
	b: 5,
};
const modeOffsets: { [key: string]: number } = {
	major: 0,
	minor: -3,
	ionian: 0,
	dorian: -2,
	phrygian: -4,
	lydian: 1,
	mixolydian: -1,
	aeolian: -3,
	locrian: -5,
};

/**
 * Position 0 is at top line (of normal 5 line staff)
 */
const keySignaturePosition: { [key: string]: number[] } = {
	'#': [0, 3, -1, 2, 5, 1, 4],
	b: [4, 1, 5, 2, 6, 3, 7],
};

// keyAccidentals, KeyData, KeyDataItem
export { keySignaturePosition, majorKeyAccidentals, modeOffsets };
