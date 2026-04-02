import { LRhythmElement } from './LRhythmElement.js';
export class LRest extends LRhythmElement {
    toObject(barIndex) {
        const objectType = 'rest';
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
