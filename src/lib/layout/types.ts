import type { NoteLayout } from './LNote.js';
import type { RestLayout } from './LRest.js';
import type { LRhythmElement } from './LRhythmElement.js';
import type { LStaffLines } from './LStaffLines.js';
export type StaffLinesLayout = ReturnType<LStaffLines['toObject']>;

export type RhythmElementLayout = ReturnType<LRhythmElement['toObject']> &
	(NoteLayout | RestLayout);
export type RhythmElementTypeLayout = 'note' | 'rest' | 'undefined';

export type LedgerLineLayout = {
	x: number;
	y: number;
	length: number;
	width: number;
};

import { type NoteAccidentals, type KeyAccidental } from '$lib/index.js';
import { type Font } from '../fonts/types.js';
import type { PrintedNoteAccidental } from '$lib/core/note.js';

export type LayoutSettings = {
	staffSize?: number;
	noteSpacing?: {
		type: 'fixed' | 'proportional' | 'standard'; // proportional is proportional to note length, standard reduces space of longer notes
		value: number; // in stave-space units, used for fixed and proportional. For standard, value is ratio where default is 1.0
	};
	defaultAccidental?: PrintedNoteAccidental;
	render?: {
		stafflines?: boolean;
		clef?: boolean;
		keySignature?: boolean | 'editor';
		timeSignature?: boolean;
		bars?: boolean;
		notes?: {
			render?: boolean;
			editorNote?: { positionFrom: number; positionTo: number; showNoteName?: boolean };
			editorAccidental?: boolean; //{ types: NoteAccidentals[] };
		};
		barlines?: boolean;
	};
};
export type LayoutSettingsInternal = LayoutSettings & {
	staffSize: number;
	staveSpace: number;
	defaultAccidental: PrintedNoteAccidental;
	defaultKeyAccidential: KeyAccidental;
	defaultAccidentalEditorWidth?: number; // only set if an accidental editor is present
	font: Font;
	scale: number;
};
