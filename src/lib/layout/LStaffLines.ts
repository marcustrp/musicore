import { type LayoutObject } from './LayoutObject.js';
import { BBox } from '../utils/bBox.js';
import { LStaffLine } from './LStaffLine.js';
import { type LayoutSettingsInternal } from '../types.js';

export class LStaffLines implements LayoutObject {
	x: number = 0;
	y: number = 0;
	bBox = new BBox();
	lines: LStaffLine[];

	constructor(settings: LayoutSettingsInternal, lineCount: number, x: number) {
		this.lines = [];
		for (let i = 0; i < lineCount; i++) {
			this.lines.push(new LStaffLine(settings.font, x, settings.staveSpace * i, 100));
		}
	}

	toObject() {
		return {
			x: this.x,
			y: this.y,
			bBox: this.bBox.toObject(),
			lines: this.lines.map((line) => line.toObject()),
		};
	}

	layout(staveSpace: number, staffMargin: number, x: number) {
		console.log('LStaffLines.layout', staveSpace, staffMargin, x);
		this.lines.forEach((staffLine) => {
			//staffLine.y = staffMargin + staveSpace * index;
			staffLine.length = x;
		});

		this.bBox = new BBox(
			this.lines[0].x,
			this.lines[0].y - this.lines[0].thickness / 2,
			this.lines[0].length,
			this.lines[this.lines.length - 1].y - this.lines[0].y + this.lines[0].thickness,
		);
	}
}
