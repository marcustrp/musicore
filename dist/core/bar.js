import Fraction from 'fraction.js';
import {} from './data/directions.js';
import { Key } from './key.js';
import { TimeSignature } from './timeSignature.js';
import { RhythmElement } from './rhythmElement.js';
import { Note } from './note.js';
import { Rest } from './rest.js';
import { accidentalToStep, stepToAccidental } from './data/noteData.js';
/**
 * A bar in a score.
 */
export class Bar {
    showKeySign;
    /** The barline at the *end* of this bar */
    barline = 'regular';
    /** todo: implement + add to abc import (test with http://www.folkwiki.se/Musik/1) */
    barlines;
    /** at *beginning* of bar, unless there is a MiddleBarline with isRepeat=true
     * # of times or string (like 'open', 'continue on cue') */
    startRepeat;
    /** at *end* of bar, unless there is a MiddleBarline with isRepeat=true
     * # of times or string (like 'open', 'continue on cue') */
    endRepeat;
    /** at beginning of bar */
    ending;
    /** Directions, like Al coda and Fine */
    directions;
    /** True if bar is a pickup */
    _pickup;
    get pickup() {
        return this._pickup;
    }
    /**
     * if _pickup, duration is duration of pickup, but timeSignature.duration
     * is still duration of regular timeSignature
     */
    _duration;
    get duration() {
        const fraction = new Fraction(this._duration);
        return fraction;
    }
    /** Position of bar in score
     * @note This might well be removed
     */
    startDuration;
    /**
     * Tempo markings, sorted by position (items missing position are sorted first)
     * @todo tempo.value should be refactored, support bpm of notetype, text, rit/acc...
     */
    tempo;
    lineBreak;
    _key;
    get key() {
        return this._key;
    }
    _timeSignature;
    get timeSignature() {
        return this._timeSignature;
    }
    /** Notes, stored as object {partId: {voiceId: RhythmElement[]}} */
    notes = {};
    /**
     *
     * @param timeSignature
     * @param key
     * @param showKeySign - if true, key signature is shown at beginning of this bar
     * @param startDuration
     */
    constructor(timeSignature, key, showKeySign = false, startDuration) {
        this.showKeySign = showKeySign;
        this._timeSignature = timeSignature;
        this._key = key;
        this._duration = new Fraction(timeSignature.duration);
        this.startDuration = startDuration ? startDuration : new Fraction(0);
    }
    /**
     * Returns the duration of a voice in this bar. If voice is empty, returns 0.
     * Note that the duration may exceed the bar duration.
     * @param partId
     * @param voiceId
     * @returns
     */
    getVoiceDuration(partId, voiceId) {
        if (!(partId in this.notes))
            return new Fraction(0);
        if (!(voiceId in this.notes[partId]))
            return new Fraction(0);
        let duration = new Fraction(0);
        this.notes[partId][voiceId].forEach((b) => (duration = duration.add(b.getDuration())));
        return duration;
    }
    /**
     * Returns the duration of the longest voice in this bar.
     * If no voice is present, returns 0.
     * @returns
     */
    getMaxVoiceDuration() {
        let maxDuration = new Fraction(0);
        Object.entries(this.notes).forEach(([partId, parts]) => {
            Object.keys(parts).forEach((voiceId) => {
                const duration = this.getVoiceDuration(partId, voiceId);
                if (duration.compare(maxDuration) > 0)
                    maxDuration = duration;
            });
        });
        return maxDuration;
    }
    /**
     *
     * @param key
     * @param options
     * @todo implement options
     */
    setKey(key, options) {
        this._key = key;
        if (!options)
            return;
        if (typeof options.showKeySign === 'boolean')
            this.showKeySign = options.showKeySign;
    }
    /**
     *
     * @param timeSignature
     * @param options
     * @todo implement options?: SetTimeSignatureOptions
     */
    setTimeSignature(timeSignature) {
        this._timeSignature = timeSignature;
    }
    addNote(partId, voiceId, note, options) {
        let returnValue;
        if (!(partId in this.notes))
            this.notes[partId] = {};
        if (!(voiceId in this.notes[partId]))
            this.notes[partId][voiceId] = [];
        // create and set value for note.diatonicName
        if (!options || options.overflow === 'split') {
            const voiceDuration = this.getVoiceDuration(partId, voiceId);
            const availableDuration = this.duration.sub(voiceDuration);
            if (availableDuration.compare(note.getDuration()) >= 0) {
                this.notes[partId][voiceId].push(note);
            }
            else {
                // note does not fit in bar, split note
                const splitData = this.timeSignature.getNotesFromBeamGroup(voiceDuration, note);
                splitData.notes.forEach((splitNote) => this.notes[partId][voiceId].push(splitNote));
                returnValue = splitData.overflow;
            }
        }
        else {
            this.notes[partId][voiceId].push(note);
        }
        return returnValue;
    }
    /**
     * Rewrites the notes in a voice to conform to the standard notation. This includes
     * beam groups, using half note instead of two tied quarter notes on beat 1 or 3 in 4/4,
     * and using dotted quarter note instead of quarter note tied to eighth note on beat 1 or 3 in 4/4.
     * @param partId
     * @param voiceId
     * @todo implement
     */
    resetNotation(partId, voiceId) {
        if (!(partId in this.notes))
            return;
        if (!(voiceId in this.notes[partId]))
            return;
        throw new Error('Not implemented');
    }
    /**
     * Marks bar as pickup bar.
     * @param duration - If not specified, the duration of the longest voice is used.
     * @returns Fraccion by which the duration of the bar has been reduced
     * @throws Error if bar is already pickup
     * @throws Error if duration is shorter than longest voice
     * @throws Error if duration is not specified and all voices are empty
     * @throws Error if duration is not specified and longest voice is equal to time signature
     */
    setPickup(duration) {
        if (this.pickup)
            throw new Error('Bar is already pickup');
        if (!duration) {
            duration = this.getMaxVoiceDuration();
        }
        else if (duration.compare(this.getMaxVoiceDuration()) < 0) {
            throw new Error('Duration is shorter than longest voice');
        }
        if (duration.valueOf() === 0)
            throw new Error('Duration is not specified and all voices are empty');
        if (duration.compare(this.duration) === 0)
            throw new Error('Duration is not specified and longest voice is equal to time signature');
        this._pickup = true;
        const durationChange = this.duration.sub(duration);
        this._duration = new Fraction(duration);
        return durationChange;
    }
    addDirection(item) {
        if (!this.directions)
            this.directions = [];
        this.directions.push(item);
    }
    addTempo(value, position) {
        if (!this.tempo)
            this.tempo = [];
        const tempo = { value };
        if (position)
            tempo.position = position;
        this.tempo.push(tempo);
        this.sortTempo();
    }
    updatePrintedAccidentals() {
        //const currentNotenames = this.key.scale.getDiatonicNoteNames();
        const currentNotenames = this.key.getNoteNames();
        Object.entries(this.notes).forEach(([_, parts]) => {
            Object.entries(parts).forEach(([_, notes]) => {
                notes.forEach((rhythmElement) => {
                    if (rhythmElement instanceof Rest)
                        return;
                    const note = rhythmElement;
                    const index = currentNotenames.findIndex((name) => name[0] === note.name[0]);
                    const item = currentNotenames[index];
                    if (item === undefined)
                        throw new Error('Note not found in scale');
                    if (item !== note.name) {
                        // note has different accidental than current used accidental for this note in the bar
                        const diff = (note.accidental ? accidentalToStep[note.accidental] : 0) -
                            (item.length > 1 ? accidentalToStep[item[1]] : 0);
                        const newAccidental = Note.systemNameAddAccidentals(item, stepToAccidental[diff]).substring(1);
                        note.printedAccidental = {
                            value: newAccidental === '' ? 'n' : newAccidental,
                        };
                        currentNotenames[index] = currentNotenames[index][0] + newAccidental;
                    }
                });
            });
        });
    }
    /**
     * Sorts tempo markings by position. Tempo markings without position are sorted first.
     * @returns
     */
    sortTempo() {
        if (!this.tempo)
            return;
        this.tempo.sort((a, b) => {
            if (!b.position)
                return 1;
            if (!a.position)
                return -1;
            return a.position.compare(b.position);
        });
    }
}
