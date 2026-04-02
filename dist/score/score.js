import { Key } from '../core/key.js';
import { TimeSignature } from '../core/timeSignature.js';
import { Scale } from '../core/scale.js';
import { BarArray } from './barArray.js';
import PartArray from './partArray.js';
export class Score {
    /** @todo implement more properties (not all of these can be stored yet) */
    _work;
    get work() {
        return { ...this._work };
    }
    _information;
    get information() {
        return { ...this._information };
    }
    /**
     * @todo Is it relevant to store a scale in score, or just a remnant from old code?
     */
    scale; // not part of MEI / MusicXML?
    /** Block lyrics */
    verses;
    /**
     * "The horizontal view of the score", the PartArray keeps track of the
     * voices and staves. Notes are stored in Score.bars, though.
     */
    _parts;
    get parts() {
        return this._parts;
    }
    /**
     * "The vertical view of the score", the BarArray keeps track of the bars, which in turn contain
     * information about timeSignature, key, barline, notes, etc.
     */
    _bars;
    get bars() {
        return this._bars;
    }
    constructor(key = new Key('c', 'major'), timeSignature = new TimeSignature(4, 4)) {
        this._bars = new BarArray(timeSignature, key);
        this._parts = new PartArray(this._bars);
    }
    /**
     * Add work information like title, composer, lyrics, etc.
     * @param type
     * @param value
     * @todo Implement edit and removal of work information
     */
    addWorkInformation(type, value) {
        if (!this._work)
            this._work = {};
        if (type === 'composer' || type === 'lyrics') {
            const data = { type, text: value };
            if (!this._work.creator) {
                this._work.creator = [data];
            }
            else {
                this._work.creator.push(data);
            }
        }
        else if (type === 'history') {
            /** @todo do a proper implementation of history */
            if (!this._work.history)
                this._work.history = {};
            this._work.history.history = value;
        }
        else if (type === 'title' || type === 'subtitle') {
            this._work[type] = value;
        }
        else {
            throw new Error('Unknown work information type');
        }
    }
    /**
     * Add information like books, discography, source, etc.
     * @param type
     * @param value
     * @todo Implement edit and removal of information
     * @todo check implementation of transcription
     */
    addInformation(type, value) {
        if (!this._information)
            this._information = {};
        switch (type) {
            case 'books':
            case 'discography':
                if (!this._information[type])
                    this._information[type] = [];
                this._information[type].push(value);
                break;
            case 'transcription':
            case 'transcription.copyright':
            case 'transcription.creator':
            case 'transcription.editedBy':
                if (!this._information.transcription)
                    this._information.transcription = {};
                switch (type) {
                    case 'transcription.copyright':
                        this._information.transcription.copyright = value;
                        break;
                    case 'transcription.editedBy':
                        this._information.transcription.editedBy = value;
                        break;
                    default:
                        this._information.transcription.creator = value;
                        break;
                }
                break;
            case 'group':
            case 'instruction':
            case 'notes':
            case 'origin':
            case 'type':
            case 'source':
            case 'url':
                this._information[type] = value;
                break;
            default:
                throw new Error('Unknown information type');
        }
    }
    /**
     * Add block lyrics
     * @param verse
     * @param number
     * @todo Implement edit and removal of verses
     */
    addVerse(verse, number) {
        const data = { text: verse };
        if (number)
            data.number = number;
        if (!this.verses)
            this.verses = [];
        this.verses.push(data);
    }
    /**
     * update printedAccidential in all notes
     */
    updatePrintedAccidentals() {
        this.bars.updatePrintedAccidentals();
    }
}
