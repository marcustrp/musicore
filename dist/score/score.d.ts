import { Key } from '../core/key.js';
import { TimeSignature } from '../core/timeSignature.js';
import { Scale } from '../core/scale.js';
import { BarArray } from './barArray.js';
import PartArray from './partArray.js';
export type Creator = {
    type: string;
    text: string;
};
export declare class Score {
    /** @todo implement more properties (not all of these can be stored yet) */
    private _work?;
    get work(): {
        number?: string;
        title?: string;
        subtitle?: string;
        creator?: Creator[];
        history?: {
            creation?: string;
            event?: string;
            eventList?: string;
            history?: string;
        };
    };
    private _information?;
    get information(): {
        books?: string[];
        discography?: string[];
        encoding?: {
            date?: string;
            encoder?: string;
            software?: string;
            description?: string;
        };
        group?: string;
        instruction?: string;
        notes?: string;
        origin?: string;
        rights?: string;
        source?: string;
        transcription?: {
            copyright?: string;
            creator?: string;
            editedBy?: string;
        };
        type?: string;
        url?: string;
    };
    /**
     * @todo Is it relevant to store a scale in score, or just a remnant from old code?
     */
    scale?: Scale;
    /** Block lyrics */
    verses?: {
        number?: number;
        text: string;
    }[];
    /**
     * "The horizontal view of the score", the PartArray keeps track of the
     * voices and staves. Notes are stored in Score.bars, though.
     */
    private _parts;
    get parts(): PartArray;
    /**
     * "The vertical view of the score", the BarArray keeps track of the bars, which in turn contain
     * information about timeSignature, key, barline, notes, etc.
     */
    private _bars;
    get bars(): BarArray;
    constructor(key?: Key, timeSignature?: TimeSignature);
    /**
     * Add work information like title, composer, lyrics, etc.
     * @param type
     * @param value
     * @todo Implement edit and removal of work information
     */
    addWorkInformation(type: 'composer' | 'lyrics' | 'title' | 'subtitle' | 'history', value: string): void;
    /**
     * Add information like books, discography, source, etc.
     * @param type
     * @param value
     * @todo Implement edit and removal of information
     * @todo check implementation of transcription
     */
    addInformation(type: 'books' | 'discography' | 'group' | 'instruction' | 'notes' | 'origin' | 'type' | 'source' | 'url' | 'transcription' | 'transcription.copyright' | 'transcription.creator' | 'transcription.editedBy', value: string): void;
    /**
     * Add block lyrics
     * @param verse
     * @param number
     * @todo Implement edit and removal of verses
     */
    addVerse(verse: string, number?: number): void;
    /**
     * update printedAccidential in all notes
     */
    updatePrintedAccidentals(): void;
}
//# sourceMappingURL=score.d.ts.map