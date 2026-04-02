import Fraction from 'fraction.js';
import { Bar, type BarlineStyle } from '../core/bar.js';
import { TimeSignature } from '../core/timeSignature.js';
import { Key } from '../core/key.js';
import { RhythmElement } from '../core/rhythmElement.js';
import { type Direction } from '../core/data/directions.js';
import { Note } from '../core/note.js';
import { Rest } from '../core/rest.js';
export type AddNoteOptions = {
    /**
     * How to handle overflow
     * @default 'split'
     * Split: split note over multiple bars, with ties
     * Ignore: add note to selected bar, even if it overflows
     * nextBar: add note to next bar
     */
    overflow?: 'split' | 'ignore' | 'nextBar';
};
export declare class BarArray {
    bars: Bar[];
    duration: Fraction;
    get last(): Bar;
    constructor(timeSignature: TimeSignature, key: Key);
    appendBar(timeSignature?: TimeSignature, key?: Key, showKeySign?: boolean): void;
    removeBars(indexFrom: number, indexTo?: number): void;
    /**
     * Sets the key of all bars from indexFrom to indexTo. If indexTo is undefined,
     * sets the key of all bars from indexFrom to last bar. If bar prior to indexFrom has
     * different key, showKeySign is set to true for indexFrom. If bar after indexTo
     * has different key, showKeySign is set to true for that bar.
     * @param key
     * @param indexFrom
     * @param indexTo
     */
    setKey(key: Key, indexFrom?: number, indexTo?: number): void;
    /**
     *
     * @param partId
     * @param voiceId
     * @param note
     * @param bar - if undefined, add note after the voice's last note
     * @param beat - if undefined, add note after the voice's last note in the selected bar
     * @param options
     * @todo Add support for insert note, currently only append
     */
    addNote(partId: string, voiceId: string, note: Note | Rest, bar?: number, beat?: Fraction, options?: AddNoteOptions): void;
    /**
     *
     * @param partId
     * @param voiceId
     * @param note
     * @param bar
     * @param beat
     * @param ignoreOverflow
     * @todo support insert notes, currently only append
     */
    addNotes(partId: string, voiceId: string, notes: (Note | Rest)[], bar?: number, beat?: Fraction, ignoreOverflow?: boolean): void;
    addLineBreak(barIndex?: number): void;
    getBarNotesDuration(partId: string, voiceId: string, bar: Bar): Fraction;
    getNote(partId: string, voiceId: string, barIndex?: number, noteIndex?: number): RhythmElement | undefined;
    getNoteByIndex(partId: string, voiceId: string, noteIndex: number): RhythmElement | undefined;
    getNoteById(partId: string, voiceId: string, noteId: string): RhythmElement | undefined;
    getNextNote(partId: string, voiceId: string, barIndex: number, noteIndex: number): RhythmElement | undefined;
    getNotes(partId: string, voiceId: string, barIndex?: number): RhythmElement[];
    private getLastBarWithVoice;
    private getLastNoteInBar;
    /**
     * Converts first bar to pickup bar. Leave duration empty to use longest note
     * duration of first bar in all parts and voices.
     *
     * If duration is specified, bars may currently be left in overflowed state.
     * This behavior will probably be changed
     */
    convertToPickup(duration?: Fraction): void;
    /**
     * @param barIndex If undefined, last bar is selected
     */
    setBarline(barline: BarlineStyle, barIndex?: number): void;
    /**
     * @param barIndex If undefined, last bar is selected
     */
    setRepeatStart(repeat: number | string, barIndex?: number): void;
    /**
     * @param barIndex If undefined, last bar is selected
     */
    setRepeatEnd(repeat: number | string, barIndex?: number): void;
    /**
     * @param barIndex If undefined, last bar is selected
     */
    setEnding(number: number | string, barIndex?: number): void;
    /**
     * @param barIndex If undefined, last bar is selected
     */
    addDirection(item: Direction, barIndex?: number): void;
    setTempo(value: string, barIndex?: number, position?: Fraction): void;
    updatePrintedAccidentals(): void;
}
//# sourceMappingURL=barArray.d.ts.map