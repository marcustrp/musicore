import Fraction from 'fraction.js';
import { type ClefType, type NoteType } from '$lib/index.js';
import { type LayoutObject } from './LayoutObject.js';
import { LClef } from './LClef.js';
import { LStaffLine } from './LStaffLine.js';
import { type LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
import type { RhythmElementTypeLayout } from './types.js';
import { LNote } from './LNote.js';

export class LRhythmElement implements LayoutObject {
	x: number = 0;
	y: number = 0;
	index: number;
	paddingRight: number = 0;
	bBox = new BBox();
	type: NoteType;
	dots?: number;
	#duration: Fraction;
	objectType: RhythmElementTypeLayout = 'undefined';
	clef: ClefType;
	constructor(clef: ClefType, index: number, type: NoteType, duration: Fraction, dots?: number) {
		this.type = type;
		this.dots = dots;
		this.#duration = duration;
		this.index = index;
		this.clef = clef;
	}

	/*getPosition(clef?: ClefType) {
		return 0;
	}*/

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	toObject(barIndex: number) {
		throw new Error('Method toObject should be implemented in child classes.');
	}

	/** TODO need much more finesse... (space after note) */
	getSpacing(settings: LayoutSettingsInternal) {
		if (!settings.noteSpacing || settings.noteSpacing.type === 'standard')
			return settings.staveSpace * Math.sqrt(this.#duration.valueOf() * 30);
		if (settings.noteSpacing.type === 'fixed')
			return settings.noteSpacing.value * settings.staveSpace;
		if (settings.noteSpacing.type === 'proportional') throw new Error('Not implemented');
		throw new Error('Invalid note spacing type');
	}

	static layout(
		settings: LayoutSettingsInternal,
		notes: LRhythmElement[],
		staffLines: LStaffLine[],
		clef: LClef,
		x: number,
	) {
		notes.forEach((note) => {
			note.x = x;
			//note.y = staffLines[0].y + note.getPosition(clef.type) * (settings.staveSpace / 2);
			if (note instanceof LNote) {
				x = note.layout(settings, staffLines, x);
			}
		});
		return x;
	}
}
