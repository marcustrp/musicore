import { LRhythmElement } from './LRhythmElement.js';
import type { RhythmElementTypeLayout } from './types.js';

export type RestLayout = ReturnType<LRest['toObject']>;

export class LRest extends LRhythmElement {
	toObject(barIndex: number) {
		const objectType: RhythmElementTypeLayout = 'rest';
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
