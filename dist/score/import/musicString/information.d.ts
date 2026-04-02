import { Clef, type ClefType } from '../../../core/clef.js';
import { Key } from '../../../core/key.js';
import { TimeSignature } from '../../../core/timeSignature.js';
import { Scale } from '../../../core/scale.js';
export type InformationData<T> = {
    length: number;
    data: T;
};
export type KeyData = {
    key: Key;
    scale: Scale;
    inputScale: Scale;
};
export type InputMode = 'major' | 'minor' | 'harmonic_minor' | 'melodic_minor' | 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian';
export type StaffLineData = {
    count: number;
    hidden?: boolean;
};
export type InformationItem = {
    key?: Key;
    scale?: Scale;
    inputScale?: Scale;
    timeSignature?: TimeSignature;
    clef?: Clef;
    octave?: number;
    staffLines?: StaffLineData;
    title?: string;
    books?: string[];
    discography?: string[];
    composers?: string[];
    notes?: string;
    origin?: string;
    tempo?: string;
    type?: string;
    source?: string;
    transcriptions?: string[];
};
export declare class InformationParser {
    private errors;
    constructor(errors: string[]);
    parse(input: string, index: number, currentInfo: InformationItem): InformationItem | undefined;
    getString(key: 'T' | 'B' | 'E' | 'D' | 'N' | 'o' | 'Q' | 'R' | 'S' | 'Z', input: string): InformationData<string> | undefined;
    /** @todo implement new syntax, when finalized */
    private getKey;
    private getInputScale;
    private getMode;
    private getStaffLines;
    private getTimeSignature;
    private getTimeSignatureObject;
    private getClef;
    getClefObject(length: number, type: ClefType, line?: number, octaveChange?: 2 | 1 | -1 | -2, staffLines?: number): InformationData<Clef>;
    getOctave(input: string): InformationData<number> | undefined;
    setDefaults(header: InformationItem): InformationItem;
}
//# sourceMappingURL=information.d.ts.map