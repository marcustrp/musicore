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
