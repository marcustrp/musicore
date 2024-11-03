import type { LayoutSettings } from '$lib/layout/types.js';
import {
	Key,
	Note,
	Score,
	type ClefType,
	type KeyAccidental,
	type NoteAccidentals,
} from '$lib/index.js';

type BaseEvent = {
	eventType: string;
	score: Score;
	settings: LayoutSettings;
};

export type KeySignatureAccidentalEvent = BaseEvent & {
	//type: 'keySignature';
	//index: number;
	eventType: 'keySignatureAccidental';
	position: number;
	column: number;
	accidental: KeyAccidental;
	clef: ClefType;
	key: Key;
};
export type NoteEvent = BaseEvent & {
	eventType: 'note';
	//type: 'note' | 'accidental';
	position: number;
	index: number;
	barIndex: number;
	clef: ClefType;
	note: Note;
};
export type NoteAccidentalEvent = BaseEvent & {
	eventType: 'noteAccidental';
	//type: 'note' | 'accidental';
	position: number;
	index: number;
	barIndex: number;
	clef: ClefType;
	accidental: NoteAccidentals | undefined;
	note: Note;
};
export type ScoreEvent = KeySignatureAccidentalEvent | NoteEvent | NoteAccidentalEvent;
