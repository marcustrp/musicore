import { type BarlineStyle } from '$lib/index.js';
import { Font } from '../fonts/font.js';
import { LClef } from './LClef.js';
import { LNote } from './LNote.js';
import { LRest, type RestLayout } from './LRest.js';
import { LRhythmElement } from './LRhythmElement.js';
import { LStaffLine } from './LStaffLine.js';
import { type LayoutObject } from './LayoutObject.js';
import { LBarline } from './LBarline.js';
import { type LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
import type { NoteLayout } from './LNote.js';

export type BarLayout = ReturnType<LBar['toObject']>;

export class LBar implements LayoutObject {
	x: number = 0;
	y: number = 0;
	index: number;
	bBox = new BBox();
	//#barlineStyle: BarlineStyle;
	notes: LRhythmElement[];
	barline: LBarline;

	constructor(
		font: Font,
		index: number,
		notes: LRhythmElement[],
		barline: BarlineStyle,
		startRepeat?: number | string,
		endRepeat?: number | string,
	) {
		this.notes = notes;
		this.index = index;
		//this.#barlineStyle = barline;
		this.barline = new LBarline(font, barline, startRepeat, endRepeat);
	}

	toObject(settings: LayoutSettingsInternal) {
		let notes: (NoteLayout | RestLayout)[] = [];
		notes = this.notes.map((note) => {
			if (note instanceof LNote) {
				return (note as LNote).toObject(this.index);
			} else {
				return (note as LRest).toObject(this.index);
			}
		});
		return {
			x: this.x,
			y: this.y,
			bBox: this.bBox.toObject(),
			notes: notes,
			barline:
				!settings.render || settings.render.barlines !== false ?
					this.barline.toObject()
				:	undefined,
		};
	}

	layout(
		settings: LayoutSettingsInternal,
		barIndex: number,
		staffLines: LStaffLine[],
		clef: LClef,
		x: number,
	) {
		// do not add padding if barlines are not rendered, except for first bar
		this.x = x;
		if (barIndex === 0 || !settings.render || settings.render.barlines !== false)
			x += settings.staveSpace;
		if (!settings.render || settings.render.barlines !== false) x += settings.staveSpace;
		this.y = staffLines[0].y;
		x = LRhythmElement.layout(settings, this.notes, staffLines, clef, x);
		if (!settings.render || settings.render.barlines !== false) {
			x += settings.staveSpace;
			x = this.barline.layout(settings, staffLines, x);
		}

		this.bBox.setXY(this.x, this.y);
		this.bBox.width = x - this.x;
		this.notes.forEach((note) => {
			this.bBox.merge(note.bBox);
		});
		if (!settings.render || settings.render.barlines !== false) this.bBox.merge(this.barline.bBox);
		return x;
	}
}
