import { Clef } from '../core/clef.js';
import { BarArray } from './barArray.js';
export class Staff {
    clef;
    bars;
    staffLines;
    constructor(clef, bars, staffLines = 5) {
        this.clef = clef;
        this.bars = bars;
        this.staffLines = staffLines;
        //this.addClef(clef);
    }
}
