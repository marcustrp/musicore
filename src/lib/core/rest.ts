import Fraction from 'fraction.js';
import { type NoteType, RhythmElement } from './rhythmElement.js';

export class Rest extends RhythmElement {
	/** Offset from default position. Each integer is the
	 * distance between two note lines */
	verticalOffset?: Fraction;

	clone(type?: NoteType, dots?: number, id?: string) {
		const clone = new Rest(type || this.type, dots || this.dots, id || undefined);
		return clone;
	}
}
