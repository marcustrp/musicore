import { Staff } from './staff.js';
import { Voice } from './voice.js';
import { Clef } from '../core/clef.js';
import { BarArray } from './barArray.js';
export declare class Part {
    readonly id: string;
    private bars;
    /** @todo implement more properties */
    staves: Staff[];
    voices: Voice[];
    /**
     * Creates a new part with a single staff and voice
     * @param id
     * @param clef
     * @param bars Same BarArray as in the score
     */
    constructor(id: string, clef: Clef, bars: BarArray);
    /**
     * Adds a new staff to the part
     * @param clef
     * @returns
     */
    addStaff(clef: Clef): Staff;
    addVoice(): Voice;
    private getNewVoiceId;
    private getVoiceById;
    private getStaff;
    getStaffCount(): number;
    /**
     *
     * @param staffIndex
     * @param clefIndex @todo implement clefIndex
     * @returns
     */
    getClef(staffIndex: number, _clefIndex: number): Clef;
    getVoice(voiceIndex: number): Voice;
    getVoiceId(voiceIndex: number): string;
    getVoiceCount(): number;
}
//# sourceMappingURL=part.d.ts.map