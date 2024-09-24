import { Clef } from '../core/clef.js';
import { BarArray } from './barArray.js';

export class Staff {
	//clef: Clef[] = [];
	constructor(
		public clef: Clef,
		private bars: BarArray,
	) {
		//this.addClef(clef);
	}

	/*addClef(clef: Clef) {
    this.clef.push(clef);
  }*/
}
