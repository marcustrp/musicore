import type { ENote } from './LNote.js';
import type { ERest } from './LRest.js';
import type { LRhythmElement } from './LRhythmElement.js';
import type { LStaffLines } from './LStaffLines.js';
export type EStaffLines = ReturnType<LStaffLines['toObject']>;

export type ERhythmElement = ReturnType<LRhythmElement['toObject']> & (ENote | ERest);
export type ERhythmElementType = 'note' | 'rest' | 'undefined';

export type ELedgerLine = {
	x: number;
	y: number;
	length: number;
	width: number;
};
