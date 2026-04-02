import { Clef } from '../core/clef.js';
import { BarArray } from './barArray.js';
import { Part } from './part.js';
export default class PartArray {
    bars;
    _parts = [];
    constructor(bars) {
        this.bars = bars;
    }
    /**
     * Create a unique id for a part, syntax: P1, P2, P3...
     * @returns
     * @todo duplicate code in createVoiceId() and createPartId()
     */
    createPartId() {
        let i = this._parts.length + 1;
        let id = '';
        do {
            id = 'P' + i++;
        } while (this.getPartById(id));
        return id;
    }
    /**
     * Adds a part to the score.
     * @param clef Defaults to g clef
     * @returns
     * @todo implement remove part
     */
    addPart(clef) {
        if (!clef)
            clef = new Clef();
        const id = this.createPartId();
        const part = new Part(id, clef, this.bars);
        this._parts.push(part);
        return part;
    }
    /**
     * Get a part (by index)
     * @param partIndex
     * @returns
     * @throws Error if partIndex is out of range
     */
    getPart(partIndex) {
        if (partIndex >= this._parts.length || partIndex < 0)
            throw new Error('Part index out of range');
        return this._parts[partIndex];
    }
    /**
     * Get a part by id
     * @param id
     * @returns
     */
    getPartById(id) {
        for (let i = 0; i < this._parts.length; i++) {
            if (this._parts[i].id === id)
                return this._parts[i];
        }
        return undefined;
    }
    /**
     * Get part id from part index
     * @param partIndex
     * @returns
     */
    getPartId(partIndex) {
        if (partIndex < 0 || partIndex >= this._parts.length)
            return undefined;
        return this._parts[partIndex].id;
    }
    /**
     * Returns the number of parts in the score
     * @returns
     */
    getPartCount() {
        return this._parts.length;
    }
}
