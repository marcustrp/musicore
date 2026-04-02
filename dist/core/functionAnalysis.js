import { Key } from './key.js';
/** @todo Implement */
export default class FunctionAnalysis {
    function;
    bass;
    keyChange;
    level;
    constructor(func) {
        this.function = func;
    }
    clone() {
        const clone = new FunctionAnalysis(this.function);
        clone.bass = this.bass;
        clone.keyChange = this.keyChange;
        clone.level = this.level;
        return clone;
    }
}
