import type { LayoutSettings } from '$lib/layout/types.js';
import {
	Note,
	Score,
	type ClefType,
	type KeyAccidental,
	type NoteAccidentals,
} from '$lib/index.js';

type BaseEvent = {
	score: Score;
	settings: LayoutSettings;
};

export type KeySignatureAccidentalEvent = BaseEvent & {
	//type: 'keySignature';
	//index: number;
	position: number;
	column: number;
	accidental: KeyAccidental;
	clef: ClefType;
};
export type NoteEvent = BaseEvent & {
	//type: 'note' | 'accidental';
	position: number;
	index: number;
	barIndex: number;
	clef: ClefType;
	note: Note;
};
export type NoteAccidentalEvent = BaseEvent & {
	//type: 'note' | 'accidental';
	position: number;
	index: number;
	barIndex: number;
	clef: ClefType;
	accidental: NoteAccidentals | undefined;
	note: Note;
};
export type ScoreEvent = KeySignatureAccidentalEvent | NoteEvent | NoteAccidentalEvent;
