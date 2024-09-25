import { type ClefType } from '$lib/index.js';
import { type Font, type Glyph } from '../fonts/types.js';
import { type LayoutSettingsInternal } from './types.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
import { BBox } from '../utils/bBox.js';

export type ClefLayout = ReturnType<LClef['toObject']>;

export class LClef implements LayoutObject {
	x: number = 0;
	y: number = 0;
	bBox: BBox;
	type: ClefType;
	glyph: Glyph;
	staffLineIndex: number;

	constructor(
		private font: Font,
		type: ClefType,
	) {
		this.type = type;
		switch (type) {
			case 'g':
			case 'treble':
				this.glyph = this.font.glyphs['gClef'];
				this.staffLineIndex = 3;
				break;
			case 'f':
			case 'bass':
				this.glyph = this.font.glyphs['fClef'];
				this.staffLineIndex = 1;
				break;
			case 'c':
			case 'alto':
				this.glyph = this.font.glyphs['cClef'];
				this.staffLineIndex = 2;
				break;
			default:
				throw new Error(`Unsupported clef type: ${type}`);
		}
		console.log('LClef constructor', this.glyph);
		this.bBox = BBox.clone(this.glyph.bBox);
	}

	toObject() {
		return { x: this.x, y: this.y, type: this.type, glyph: this.glyph, bBox: this.bBox.toObject() };
	}

	layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[]) {
		this.x = settings.staveSpace * 0.9; // [BB p. 5]
		this.y = staffLines[this.staffLineIndex].y;
		this.bBox.setXY(this.x + this.glyph.bBox!.x, this.y + this.glyph.bBox!.y);
		return this.x + this.glyph.horizAdvX;
	}
}
