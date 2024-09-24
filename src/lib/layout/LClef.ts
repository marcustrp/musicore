import { type ClefType } from '$lib/index.js';
import { Font, type Glyph } from '../fonts/font.js';
import { type LayoutSettingsInternal } from '../types.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
import { BBox } from '../utils/bBox.js';

export type EClef = ReturnType<LClef['toObject']>;

export class LClef implements LayoutObject {
	x: number = 0;
	y: number = 0;
	bBox: BBox;
	type: ClefType;
	glyph: Glyph;
	staffLineIndex: number;

	constructor(
		private font: Font,
		type: ClefType
	) {
		this.type = type;
		switch (type) {
			case 'g':
			case 'treble':
				this.glyph = this.font.getGlyph('gClef');
				this.staffLineIndex = 3;
				break;
			case 'f':
			case 'bass':
				this.glyph = this.font.getGlyph('fClef');
				this.staffLineIndex = 1;
				break;
			case 'c':
			case 'alto':
				this.glyph = this.font.getGlyph('cClef');
				this.staffLineIndex = 2;
				break;
			default:
				throw new Error(`Unsupported clef type: ${type}`);
		}
		console.log('LClef constructor', this.glyph);
		this.bBox = BBox.fromGlyph(this.glyph);
	}

	toObject() {
		return { x: this.x, y: this.y, type: this.type, glyph: this.glyph, bBox: this.bBox.toObject() };
	}

	layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[]) {
		this.x = settings.staveSpace * 0.9; // [BB p. 5]
		this.y = staffLines[this.staffLineIndex].y;
		this.bBox.setXY(this.x + this.glyph.bBox!.x, this.y + this.glyph.bBox!.y);
		return this.x + (this.glyph.horizAdvX ? parseInt(this.glyph.horizAdvX) : 0);
	}
}
