import { Clef } from '../core/clef.js';
import { BarArray } from './barArray.js';
import { Part } from './part.js';
export default class PartArray {
    private bars;
    _parts: Part[];
    constructor(bars: BarArray);
    /**
     * Create a unique id for a part, syntax: P1, P2, P3...
     * @returns
     * @todo duplicate code in createVoiceId() and createPartId()
     */
    private createPartId;
    /**
     * Adds a part to the score.
     * @param clef Defaults to g clef
     * @returns
     * @todo implement remove part
     */
    addPart(clef?: Clef): Part;
    /**
     * Get a part (by index)
     * @param partIndex
     * @returns
     * @throws Error if partIndex is out of range
     */
    getPart(partIndex: number): Part;
    /**
     * Get a part by id
     * @param id
     * @returns
     */
    private getPartById;
    /**
     * Get part id from part index
     * @param partIndex
     * @returns
     */
    private getPartId;
    /**
     * Returns the number of parts in the score
     * @returns
     */
    getPartCount(): number;
}
//# sourceMappingURL=partArray.d.ts.map