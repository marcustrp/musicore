import { Staff } from './staff.js';
import { Voice } from './voice.js';
import { Clef } from '../core/clef.js';
import { BarArray } from './barArray.js';
export class Part {
    id;
    bars;
    /** @todo implement more properties */
    /*name?: string;
  abbreviation?: string;
  instrument?: any[];
  midiInstrument?: any[];
*/
    //divisions = 24;
    staves = [];
    voices = [];
    /**
     * Creates a new part with a single staff and voice
     * @param id
     * @param clef
     * @param bars Same BarArray as in the score
     */
    constructor(id, clef, bars) {
        this.id = id;
        this.bars = bars;
        this.addStaff(clef);
        this.addVoice();
    }
    /**
     * Adds a new staff to the part
     * @param clef
     * @returns
     */
    addStaff(clef) {
        const staff = new Staff(clef, this.bars);
        this.staves.push(staff);
        return staff;
    }
    addVoice() {
        const voice = new Voice(this.id, this.getNewVoiceId(), this.bars);
        this.voices.push(voice);
        return voice;
    }
    getNewVoiceId() {
        let i = this.voices.length + 1;
        let id = '';
        do {
            id = 'V' + i++;
        } while (this.getVoiceById(id));
        return id;
    }
    getVoiceById(id) {
        for (let i = 0; i < this.voices.length; i++) {
            if (this.voices[i].id === id)
                return this.voices[i];
        }
        return null;
    }
    getStaff(staffIndex) {
        if (this.staves.length <= staffIndex || staffIndex < 0)
            throw new Error('Staff index out of range');
        return this.staves[staffIndex];
    }
    getStaffCount() {
        return this.staves.length;
    }
    /*getClefCount(staffIndex: number) {
    const staff = this.getStaff(staffIndex);
    return staff.clef.length;
  }*/
    /**
     *
     * @param staffIndex
     * @param clefIndex @todo implement clefIndex
     * @returns
     */
    getClef(staffIndex, _clefIndex) {
        const staff = this.getStaff(staffIndex);
        //if (staff.clef.length <= clefIndex) throw new Error('Clef index out of bounds');
        //return staff.clef[clefIndex];
        return staff.clef;
    }
    getVoice(voiceIndex) {
        if (this.voices.length <= voiceIndex || voiceIndex < 0)
            throw new Error('Voice index out of range');
        return this.voices[voiceIndex];
    }
    getVoiceId(voiceIndex) {
        return this.voices[voiceIndex].id;
    }
    getVoiceCount() {
        return this.voices.length;
    }
}
