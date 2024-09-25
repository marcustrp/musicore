import { type LayoutObject } from './LayoutObject.js';
import { type Font } from '../fonts/types.js';
import { type LayoutSettingsInternal } from './types.js';
import { LNoteHead } from './LNoteHead.js';
import { BBox } from '../utils/bBox.js';
import type { ClefType } from '$lib/index.js';

export type NoteStemLayout = ReturnType<LNoteStem['toObject']>;

export class LNoteStem implements LayoutObject {
	x: number;
	y: number;
	length: number;
	width: number;
	bBox = new BBox();

	constructor(font: Font, x: number, y: number, length: number) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.width = font.metadata.stemThickness;
	}

	getAverageNotePosition(notes: LNoteHead[], clef: ClefType) {
		let sum = 0;
		for (const note of notes) {
			sum += note.getPosition(clef);
		}
		return sum / notes.length;
	}

	getX(notes: LNoteHead[]) {
		return notes[0].x;
	}

	toObject() {
		return { x: this.x, y: this.y, length: this.length, width: this.width };
	}

	layout(settings: LayoutSettingsInternal, notes: LNoteHead[], clef: ClefType) {
		this.length = settings.staveSpace * 3.5;
		const yBetweenOuter = notes.length > 1 ? notes[0].y - notes[notes.length - 1].y : 0;
		this.length += yBetweenOuter;
		this.y = notes[0].y;
		/** TODO fix so this hack is not needed... */
		type TmpType = { stemUpSE: [number, number]; stemDownNW: [number, number] };
		const item = settings.font.glyphs[notes[0].glyphName].anchors as TmpType;
		if (this.getAverageNotePosition(notes, clef) >= 5) {
			this.x = this.getX(notes) + item.stemUpSE[0] - settings.font.metadata.stemThickness / 2;
			this.y += item.stemDownNW[1];
			/*(note.glyph.horizAdvX ? parseInt(note.glyph.horizAdvX) : 0) -
          (settings.font.metadata.engravingDefaults.stemThickness) / 2;*/
		} else {
			this.x = this.getX(notes) + item.stemDownNW[0] + settings.font.metadata.stemThickness / 2;
			//this.x = x + (font.metadata.engravingDefaults.stemThickness) / 2;
			this.y += -item.stemDownNW[1] + this.length - yBetweenOuter;
		}

		this.bBox = BBox.fromObject({
			x: this.x,
			y: this.y,
			width: this.width,
			height: this.length,
		});
	}
}
