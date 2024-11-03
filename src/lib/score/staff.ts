import { Clef } from '../core/clef.js';
import { BarArray } from './barArray.js';

export class Staff {
	constructor(
		public clef: Clef,
		private bars: BarArray,
		public staffLines = 5,
	) {
		//this.addClef(clef);
	}

	/*addClef(clef: Clef) {
    this.clef.push(clef);
  }*/
}
