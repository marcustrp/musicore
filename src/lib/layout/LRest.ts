import { LRhythmElement } from './LRhythmElement.js';
import type { ERhythmElementType } from './types.js';

export type ERest = ReturnType<LRest['toObject']>;

export class LRest extends LRhythmElement {
	toObject(barIndex: number) {
		const objectType: ERhythmElementType = 'rest';
		return {
			objectType: objectType,
			x: this.x,
			y: this.y,
			type: this.type,
			dots: this.dots,
			barIndex,
		};
	}
}
