import type Fraction from 'fraction.js';
import type ChordSymbol from './core/chordSymbol.js';
import type { NoteType } from './core/rhythmElement.js';
import type { BeamValue, NoteAccidentals, NoteName, TieType } from './core/note.js';
import type { Key } from './core/key.js';
import type { BarlineEnding, BarlineStyle } from './core/bar.js';
import type { TimeSignature, TimeSignatureSymbol } from './core/timeSignature.js';

/**
 * This file is used to define types for testing purposes.
 *
 * Tried to use export type KeyObject = Partial<Key>, but it
 * seems to be to much work to get it working with complex
 * classes like Note.
 */
export type RhythmElementObject = Partial<{
	type: NoteType;
	dots: number;
	stem: 'up' | 'down';
	chordSymbols: ChordSymbolObject[];
	triplet: {
		start?: boolean;
		end?: boolean;
		numerator: number;
		denominator: number;
		totalDuration: Fraction; // total duration triplet
		noteCount: number;
	};
	lyrics: {
		text: string;
		syllabic: 'start' | 'end' | 'continue';
		number: number;
	}[];
	invisible: boolean;
	locked: boolean;
}>;
export type NoteObject = RhythmElementObject &
	Partial<{
		root: NoteName;
		accidental: NoteAccidentals;
		name: string;
		diatonicNoteName: string;
		printedAccidental: {
			value: NoteAccidentals;
			bracket?: boolean;
			cautionary?: boolean;
			editorial?: boolean;
			parentheses?: boolean;
		};
		octave: number;
		beam: { value: BeamValue };
		tie: TieType;
		chord: NoteObject[];
		graceNotes: NoteObject[];
		solfege: string;
		analysis: unknown /** @todo define */;
		figuredBass: unknown /** @todo define */;
		notations: object[];
		slurs: { type: 'start' | 'end'; index: number }[];
		midiNumber: number;
		staffIndex: number;
		color: { notehead: string };
	}>;
export type RestObject = RhythmElementObject &
	Partial<{
		verticalOffset?: Fraction;
	}>;
/** @todo define */
export type ChordSymbolObject = Partial<ChordSymbol>;
export type KeyObject = Partial<Key>;
export type TimeSignatureObject = Partial<TimeSignature> & { symbol?: TimeSignatureSymbol };
export type BarObject = Partial<{
	barline: BarlineStyle;
	startRepeat: number | string;
	endRepeat: number | string;
	ending: BarlineEnding;
	directions: object[];
	pickup: boolean;
	duration: Fraction;
	startDuration: Fraction;
	tempo: { position?: Fraction; value: string }[];
	lineBreak: boolean;
	key: KeyObject;
	showKeySign: boolean;
	timeSignature: TimeSignatureObject;
	notes: { [partId: string]: { [voiceId: string]: RhythmElementObject[] } };
}>;
