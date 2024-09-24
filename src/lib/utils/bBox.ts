import { type Glyph } from '../fonts/font.js';

export class BBox {
	x: number;
	y: number;
	height: number;
	width: number;

	constructor(x?: number, y?: number, width?: number, height?: number) {
		this.x = x || 0;
		this.y = y || 0;
		this.width = width || 0;
		this.height = height || 0;
	}

	setXY(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	merge(bbox: BBox) {
		const x2 = Math.max(this.x + this.width, bbox.x + bbox.width);
		const y2 = Math.max(this.y + this.height, bbox.y + bbox.height);
		this.x = Math.min(this.x, bbox.x);
		this.y = Math.min(this.y, bbox.y);
		this.width = x2 - this.x;
		this.height = y2 - this.y;
		return this;
	}

	toObject() {
		return { x: this.x, y: this.y, width: this.width, height: this.height };
	}

	static fromObject(obj: { x: number; y: number; width: number; height: number }) {
		return new BBox(obj.x, obj.y, obj.width, obj.height);
	}
	static fromGlyph(glyph?: Glyph) {
		return glyph?.bBox ? glyph.bBox.clone() : new BBox();
	}

	clone() {
		return new BBox(this.x, this.y, this.width, this.height);
	}
}
