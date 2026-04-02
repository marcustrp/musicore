import Fraction from 'fraction.js';
import { type Direction } from './data/directions.js';
import { Key } from './key.js';
import { TimeSignature } from './timeSignature.js';
import { RhythmElement } from './rhythmElement.js';
import { Note } from './note.js';
import { Rest } from './rest.js';
export type AddNoteOptions = {
    /**
     * @default 'split'
     */
    overflow?: 'split' | 'ignore';
};
/**
 * Supported barline styles
 */
export type BarlineStyle = 'dashed' | 'dotted' | 'heavy' | 'heavy-heavy' | 'heavy-light' | 'light-heavy' | 'light-light' | 'none' | 'regular' | 'short' | 'tick';
/**
 * Barline ending.
 * @todo Document end property, what was 'discontinue'?
 *
 */
export type BarlineEnding = {
    start: boolean;
    end?: 'stop' | 'discontinue';
    number: number | string;
};
export type MiddleBarline = {
    /** Location of barline (using duration, 1/4 is a quarter note) */
    position: Fraction;
    style: BarlineStyle;
    isRepeat?: boolean;
};
export type SetKeyOptions = {
    /**
     * Change accidentals to keep pitch of notes after key change.
     */
    keepPitch?: boolean;
    showKeySign?: boolean;
};
export type SetTimeSignatureOptions = object;
/**
 * A bar in a score.
 */
export declare class Bar {
    showKeySign: boolean;
    /** The barline at the *end* of this bar */
    barline: BarlineStyle;
    /** todo: implement + add to abc import (test with http://www.folkwiki.se/Musik/1) */
    barlines: MiddleBarline[] | undefined;
    /** at *beginning* of bar, unless there is a MiddleBarline with isRepeat=true
     * # of times or string (like 'open', 'continue on cue') */
    startRepeat?: number | string;
    /** at *end* of bar, unless there is a MiddleBarline with isRepeat=true
     * # of times or string (like 'open', 'continue on cue') */
    endRepeat?: number | string;
    /** at beginning of bar */
    ending?: BarlineEnding;
    /** Directions, like Al coda and Fine */
    directions?: Direction[];
    /** True if bar is a pickup */
    private _pickup?;
    get pickup(): boolean | undefined;
    /**
     * if _pickup, duration is duration of pickup, but timeSignature.duration
     * is still duration of regular timeSignature
     */
    private _duration;
    get duration(): Fraction;
    /** Position of bar in score
     * @note This might well be removed
     */
    startDuration: Fraction;
    /**
     * Tempo markings, sorted by position (items missing position are sorted first)
     * @todo tempo.value should be refactored, support bpm of notetype, text, rit/acc...
     */
    tempo?: {
        position?: Fraction;
        value: string;
    }[];
    lineBreak?: boolean;
    private _key;
    get key(): Key;
    private _timeSignature;
    get timeSignature(): TimeSignature;
    /** Notes, stored as object {partId: {voiceId: RhythmElement[]}} */
    readonly notes: {
        [partId: string]: {
            [voiceId: string]: RhythmElement[];
        };
    };
    /**
     *
     * @param timeSignature
     * @param key
     * @param showKeySign - if true, key signature is shown at beginning of this bar
     * @param startDuration
     */
    constructor(timeSignature: TimeSignature, key: Key, showKeySign?: boolean, startDuration?: Fraction);
    /**
     * Returns the duration of a voice in this bar. If voice is empty, returns 0.
     * Note that the duration may exceed the bar duration.
     * @param partId
     * @param voiceId
     * @returns
     */
    getVoiceDuration(partId: string, voiceId: string): Fraction;
    /**
     * Returns the duration of the longest voice in this bar.
     * If no voice is present, returns 0.
     * @returns
     */
    getMaxVoiceDuration(): Fraction;
    /**
     *
     * @param key
     * @param options
     * @todo implement options
     */
    setKey(key: Key, options?: SetKeyOptions): void;
    /**
     *
     * @param timeSignature
     * @param options
     * @todo implement options?: SetTimeSignatureOptions
     */
    setTimeSignature(timeSignature: TimeSignature): void;
    addNote(partId: string, voiceId: string, note: Note | Rest, options?: AddNoteOptions): (Note | Rest)[] | undefined;
    /**
     * Rewrites the notes in a voice to conform to the standard notation. This includes
     * beam groups, using half note instead of two tied quarter notes on beat 1 or 3 in 4/4,
     * and using dotted quarter note instead of quarter note tied to eighth note on beat 1 or 3 in 4/4.
     * @param partId
     * @param voiceId
     * @todo implement
     */
    resetNotation(partId: string, voiceId: string): void;
    /**
     * Marks bar as pickup bar.
     * @param duration - If not specified, the duration of the longest voice is used.
     * @returns Fraccion by which the duration of the bar has been reduced
     * @throws Error if bar is already pickup
     * @throws Error if duration is shorter than longest voice
     * @throws Error if duration is not specified and all voices are empty
     * @throws Error if duration is not specified and longest voice is equal to time signature
     */
    setPickup(duration?: Fraction): Fraction;
    addDirection(item: Direction): void;
    addTempo(value: string, position?: Fraction): void;
    updatePrintedAccidentals(): void;
    /**
     * Sorts tempo markings by position. Tempo markings without position are sorted first.
     * @returns
     */
    private sortTempo;
}
//# sourceMappingURL=bar.d.ts.map