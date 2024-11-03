import type { NoteName } from './note.js';

export type ClefType =
	| 'g'
	| 'f'
	| 'c'
	| 'treble'
	| 'bass'
	| 'baritone'
	| 'tenor'
	| 'alto'
	| 'mezzosoprano'
	| 'soprano'
	| 'perc'
	| 'none';

export type ClefSymbol = 'g' | 'f' | 'c' | 'perc' | 'none';

export type ClefData = {
	[key in ClefType]: {
		root: NoteName;
		octave: number;
		/**
		 * 0-indexed from top line (usually bottom line in music theory, but better
		 * for programming (y position) to use top line 0 indexed.
		 */
		clefLine: number;
		symbol: ClefSymbol;
		name?: string;
	};
};

/** 0 is bottom line */
const defaultClefData: ClefData = {
	g: { root: 'g', octave: 5, clefLine: 3, symbol: 'g' },
	treble: { root: 'g', octave: 5, clefLine: 3, symbol: 'g', name: 'treble' },
	f: { root: 'f', octave: 4, clefLine: 1, symbol: 'f' },
	bass: { root: 'f', octave: 4, clefLine: 1, symbol: 'f', name: 'bass' },
	soprano: { root: 'c', octave: 5, clefLine: 4, symbol: 'c', name: 'soprano' },
	mezzosoprano: { root: 'c', octave: 5, clefLine: 3, symbol: 'c', name: 'mezzosoprano' },
	c: { root: 'c', octave: 5, clefLine: 2, symbol: 'c' },
	alto: { root: 'c', octave: 5, clefLine: 2, symbol: 'c', name: 'alto' },
	tenor: { root: 'c', octave: 5, clefLine: 1, symbol: 'c', name: 'tenor' },
	baritone: { root: 'c', octave: 5, clefLine: 0, symbol: 'c', name: 'baritone' },
	perc: { root: 'b', octave: 5, clefLine: 2, symbol: 'perc', name: 'perc' },
	none: { root: 'g', octave: 5, clefLine: 2, symbol: 'none', name: 'none' },
};

export class Clef {
	octaveChange?: 2 | 1 | -1 | -2;
	root: NoteName;
	octave: number;
	/** The line which the clef is positioned on, first line is bottom line */
	clefLine: number;
	/** Number of staff lines @todo: should not be part of clef, todo move elsewhere */
	//staffLines?: number;
	symbol: ClefSymbol;
	name?: string;
	type: ClefType;

	constructor(type: ClefType = 'g', clefLine?: number, octaveChange?: 2 | 1 | -1 | -2) {
		if (!(type in defaultClefData)) throw new Error('Unknown clef type');
		this.type = type;
		this.root = defaultClefData[type].root;
		this.octave = defaultClefData[type].octave;
		this.clefLine = clefLine !== undefined ? clefLine : defaultClefData[type].clefLine;
		this.symbol = defaultClefData[type].symbol;
		if (defaultClefData[type].name) this.name = defaultClefData[type].name;
		if (octaveChange) this.octaveChange = octaveChange;
	}

	/** Return position of the note c within in the system (top line is 0) */
	getCPosition() {
		const roots = ['c', 'b', 'a', 'g', 'f', 'e', 'd'];
		/**
		 * g: c on 3 = clefline (3 * 2 = 6) - root (x=3)
		 * f: c on 5 = clefline (1 * 2 = 2) - root (x=4)
		 * tenor: c on 2 = clefline (1 * 2 = 2) + root (x=0)
		 * alto: c on 4 = clefline (2 * 2 = 4) + root (x=0)
		 */
		return (this.clefLine * 2 - roots.indexOf(this.root) + 7) % 7;
	}

	/** Returns offset to treble clef, disregarding octave. Bass clef is -2
	 * (c in bass clef is two positions below c in g clef)
	 */
	getOffsetToTreble() {
		return this.getCPosition() - new Clef('g').getCPosition();
	}

	clefLineIsDefault() {
		return this.clefLine === defaultClefData[this.type].clefLine;
	}
}
