import { type LayoutObject } from './LayoutObject.js';
import { Font } from '../fonts/font.js';
import { BBox } from '../utils/bBox.js';

export type EStaffLine = ReturnType<LStaffLine['toObject']>;

export class LStaffLine implements LayoutObject {
	x: number;
	y: number;
	length: number;
	thickness: number;
	bBox: BBox;

	constructor(font: Font, x: number, y: number, length: number) {
		this.x = x;
		this.y = y;
		this.length = length;
		this.thickness = font.metadata.engravingDefaults.staffLineThickness * 250;
		this.bBox = new BBox(x, y, this.length, this.thickness);
	}

	toObject() {
		return { x: this.x, y: this.y, length: this.length, thickness: this.thickness };
	}
}
