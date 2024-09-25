import { Note, Score } from '$lib/index.js';
import { type LayoutSettingsInternal } from '../types.js';
import { BBox } from '../utils/bBox.js';
import { type LayoutObject } from './LayoutObject.js';
import { LBar } from './LBar.js';
import { LClef } from './LClef.js';
import { LNote } from './LNote.js';
import { LRest } from './LRest.js';
import { LStaffLine } from './LStaffLine.js';

export type BarsLayout = ReturnType<LBars['toObject']>;

export class LBars implements LayoutObject {
	x: number = 0;
	y: number = 0;
	bBox = new BBox();
	bars: LBar[];

	constructor(settings: LayoutSettingsInternal, score: Score) {
		let noteIndex = -1;
		const clef = score.parts.getPart(0).getClef(0, 0).type;
		this.bars = score.bars.bars.map((bar, index) => {
			const notes = score.parts
				.getPart(0)
				.getVoice(0)
				.getNotes(index)
				.map((note) => {
					noteIndex++;
					if (note instanceof Note) {
						return LNote.create(clef, noteIndex, settings, note);
					} else {
						return new LRest(clef, noteIndex, note.type, note.getDuration(), note.dots);
					}
				});
			return new LBar(settings.font, index, notes, bar.barline);
		});
	}

	toObject(settings: LayoutSettingsInternal) {
		return {
			x: this.x,
			y: this.y,
			bBox: this.bBox.toObject(),
			bars: this.bars.map((bar) => bar.toObject(settings)),
		};
	}

	layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], clef: LClef, x: number) {
		this.bars.forEach((bar, index) => {
			x = bar.layout(settings, index, staffLines, clef, x);
		});
		this.calculateBBox();
		return x;
	}

	calculateBBox() {
		if (this.bars.length === 0) return undefined;
		this.bBox = this.bars[0].bBox.clone();
		for (let i = 1; i < this.bars.length; i++) {
			this.bBox.merge(this.bars[i].bBox);
		}
	}
}
