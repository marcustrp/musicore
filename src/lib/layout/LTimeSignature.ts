import { type TimeSignatureSymbol } from '$lib/index.js';
import { type Font, type Glyph } from '../fonts/types.js';
import { BBox } from '../utils/bBox.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';

export type TimeSignatureLayout = ReturnType<LTimeSignature['toObject']>;

export class LTimeSignature implements LayoutObject {
	x: number = 0;
	y: number = 0;
	count: number | TimeSignatureSymbol;
	unit;
	glyphs: Glyph[] = [];
	bBox = new BBox();
	constructor(
		private font: Font,
		count: number | TimeSignatureSymbol,
		unit: number,
	) {
		this.count = count;
		this.unit = unit;
		const glyph = this.font.glyphs['timeSigCommon'];
		this.glyphs.push(glyph);
		this.bBox = BBox.clone(glyph.bBox);
	}

	toObject() {
		return {
			x: this.x,
			y: this.y,
			count: this.count,
			unit: this.unit,
			glyphs: this.glyphs,
			bBox: this.bBox.toObject(),
		};
	}

	layout(staveSpace: number, staffLines: LStaffLine[], x: number) {
		x += staveSpace;
		this.x = x;
		this.y = staffLines[2].y;
		this.bBox.setXY(this.x, this.y);
		return x + this.glyphs[0].horizAdvX;
	}
}
