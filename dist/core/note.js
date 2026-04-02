import {} from './data/notations.js';
import * as noteData from './data/noteData.js';
import FiguredBass from './figuredBass.js';
import FunctionAnalysis from './functionAnalysis.js';
import { RhythmElement } from './rhythmElement.js';
import RomanNumeralAnalysis from './romanNumeralAnalysis.js';
import { Scale } from './scale.js';
export class Note extends RhythmElement {
    _root;
    get root() {
        return this._root;
    }
    // Note: Accidental can never be natural: this is only possible with printedNoteAccidental
    _accidental;
    get accidental() {
        return this._accidental;
    }
    /** name consists of root and optional accidental */
    get name() {
        return this.root + (this.accidental ? this.accidental : '');
    }
    /** Note and accidential, like f#. Defaults to root name of note, but when in context of a bar, should
     * be set to the note name in the scale.
     */
    _diatonicNoteName;
    get diatonicNoteName() {
        return this._diatonicNoteName;
    }
    /** Use string if for example using custom key that cannot be converted to scale */
    setDiatonicNoteName(scale) {
        this._diatonicNoteName = scale instanceof Scale ? scale.getDiatonicNoteName(this._root) : scale;
    }
    /** @todo Should multiple printedAccidentals be supported? */
    printedAccidental;
    /** 0-9 */
    _octave;
    get octave() {
        return this._octave;
    }
    set octave(octave) {
        const octaveChange = this._octave - octave;
        this._octave = octave;
        this._midiNumber += octaveChange * 12;
    }
    /** @todo Old commented property, something from MusicXML or MEI? */
    //alter?: number
    /**
     * @todo implement beam break (see MEI beam@breaksec)
     * @todo implement feathered beam (see MEI beam@form)
     * @todo implement cross staff beams (see MEI place="mixed")
     * */
    beam;
    _tie;
    get tie() {
        return this._tie;
    }
    set tie(type) {
        this._tie = type;
    }
    /**
     * A chord has the main note plus this array of notes. Main
     * note is always the lowest note in the chord. Chord notes
     * are the same length as the main note.
     */
    chord;
    graceNotes;
    /** Unaccented borrows from previous note (plays before this note), Accented
     * plays when this note should play, delaying this note. Unknown can be used
     * when it is not known how the grace is played.
     */
    graceType;
    solfege; // MEI psolfa
    analysis;
    figuredBass;
    /** i.e. fermata, dynamic, articulation and so on */
    notations;
    /** First (outermost) slur is number 0 (or undefined) */
    slurs;
    _midiNumber;
    get midiNumber() {
        return this._midiNumber;
    }
    _staffIndex;
    get staffIndex() {
        return this._staffIndex;
    }
    color;
    constructor(type, root, accidental, octave = 5, dots, staffIndex = 0, id) {
        super(type, dots, id);
        this._root = root;
        if (accidental)
            this.setAccidental(accidental);
        this.octave = octave;
        this._staffIndex = staffIndex;
        this.setMidiNumberFromName();
        this._diatonicNoteName = this.root;
    }
    /**
     *
     * @param scaleNumber also accepts 8 and 9
     * @param scaleRootOctave
     * @param scale
     * @param type
     * @param dots
     * @param useScaleMode
     * @returns
     * @todo Remove useScaleMode, that conversion should be done before calling this function
     */
    static fromScaleNumber(scaleNumber, scaleRootOctave, scale, type = 'q', dots, useScaleMode = false) {
        if (scaleNumber.length === 2 && scaleNumber[0] === 'm') {
            // m is used in minor (when useScaleMode) to indicate 3/6/7 from major
            scaleNumber = scaleNumber[1];
            useScaleMode = false;
        }
        const scaleNumberParts = Note.getNumberParts(scaleNumber);
        if (!scaleNumberParts) {
            console.trace('Invalid scaleNumber: ' + scaleNumber);
            throw new Error('Invalid scaleNumber: ' + scaleNumber);
        }
        const processedParts = Note.processScaleNumber(scaleNumberParts, scale, useScaleMode);
        scaleNumber = ((processedParts.accidental || '') +
            processedParts.number.toString());
        const systemName = Note.noteNumberToNameInScale(scale.rootName, scaleNumber);
        if (!systemName)
            throw new Error('Invalid scaleNumber: ' + scaleNumber);
        let octave = scaleRootOctave + Math.floor((scaleNumberParts.number - 1) / 7);
        if (scale.root.number > Note.nameToNoteIndex(systemName)) {
            octave++;
        }
        if (systemName === 'b#' || systemName === 'bx')
            octave--;
        if (systemName === 'cb' || systemName === 'cbb')
            octave++;
        const note = new Note(type, Note.nameToNatural(systemName), Note.nameToAccidental(systemName), octave, dots);
        note.setDiatonicNoteName(scale);
        return note;
    }
    /**
     * @param scaleNumberParts
     * @param scale
     * @param useScaleMode
     * @returns
     */
    static processScaleNumber(scaleNumberParts, scale, useScaleMode) {
        const scaleNumberMod = scaleNumberParts.number % 7 === 0 ? 7 : scaleNumberParts.number % 7;
        let accidental;
        if (useScaleMode && !scaleNumberParts.accidental) {
            // use default numbers from scale, like 3 is b3 in minor, so m3 is required for normal (major) 3
            const scaleNumber = scale.getModeDefaultScaleNumber(scaleNumberMod);
            if (scaleNumber.length > 1)
                accidental = scaleNumber.slice(0, scaleNumber.length - 1);
        }
        else {
            // always use major as reference for numbers
            accidental = scaleNumberParts.accidental === 'm' ? '' : scaleNumberParts.accidental || '';
        }
        const newScaleNumberParts = { number: scaleNumberMod };
        if (accidental)
            newScaleNumberParts.accidental = accidental;
        return newScaleNumberParts;
    }
    /**
     * Adds accientials to systemName: a,b is ab, ab,# is a, ab,x is a# and so on
     * currently does NOT handle edge cases like a#,x which would be a triple sharp (will return double sharp)
     * @param systemName
     * @param accidental - x, #, b or bb (otherwise returns systemName unmodified)
     * @return systemName
     *
     * @throws Error if systemName is not valid (root name and accidentals)
     * @todo renname function to something more descriptive
     */
    static systemNameAddAccidentals(systemName, accidental) {
        // split accidentals and note root name
        const nameParts = /([a-g])([b#x]{0,2})/gm.exec(systemName);
        if (!nameParts || 'b#x'.indexOf(accidental.substr(0, 1)) < 0) {
            throw new Error('Note.systemNameAddAccidentals: invalid parameters ' + systemName + ' and ' + accidental);
        }
        switch (accidental) {
            case 'x':
                switch (nameParts[2]) {
                    case 'b':
                        return nameParts[1] + '#';
                    case 'bb':
                        return nameParts[1];
                    default:
                        return nameParts[1] + 'x';
                }
            case '#':
                switch (nameParts[2]) {
                    case '':
                    case null:
                        return nameParts[1] + '#';
                    case 'b':
                        return nameParts[1];
                    case 'bb':
                        return nameParts[1] + 'b';
                    default:
                        return nameParts[1] + 'x';
                }
            case 'b':
                switch (nameParts[2]) {
                    case '':
                    case null:
                        return nameParts[1] + 'b';
                    case '#':
                        return nameParts[1];
                    case 'x':
                        return nameParts[1] + '#';
                    default:
                        return nameParts[1] + 'bb';
                }
            case 'bb':
                switch (nameParts[2]) {
                    case '#':
                        return nameParts[1] + 'b';
                    case 'x':
                        return nameParts[1];
                    default:
                        return nameParts[1] + 'bb';
                }
            default:
                return systemName;
        }
    }
    /**
     * Sets the midiNumber from the name and octave
     */
    setMidiNumberFromName() {
        this._midiNumber = noteData.nameToNoteIndex[this.name] + 12 * this.octave;
        if (this.name === 'b#' || this.name === 'bx') {
            this._midiNumber += 12;
        }
        else if (this.name === 'cb' || this.name === 'cbb') {
            this._midiNumber -= 12;
        }
    }
    /**
     * Set accidential. printedAccidental is also updated: removed of note name is same as
     * diatonic note name, otherwise set to accidental.
     * @param accidental
     */
    setAccidental(accidental) {
        if (accidental && accidental !== 'n') {
            this._accidental = accidental;
        }
        else {
            // if no accidental or if natural and diatonicNoteName doesn't have accidental, do not set accidental
            delete this._accidental;
        }
        if (this.name === this.diatonicNoteName) {
            delete this.printedAccidental;
        }
        else {
            this.printedAccidental = { value: this.accidental };
        }
        this.setMidiNumberFromName();
    }
    setPrintedAccidental(accidental) {
        if (!accidental || accidental === 'n') {
            delete this._accidental;
        }
        else {
            this._accidental = accidental;
        }
        if (accidental) {
            this.printedAccidental = { value: accidental };
        }
        else {
            delete this.printedAccidental;
        }
        this.setMidiNumberFromName();
    }
    removePrintedAccidental() {
        delete this.printedAccidental;
        if (this.name !== this.diatonicNoteName) {
            this.setAccidental(this.diatonicNoteName.length === 1 ?
                undefined
                : this.diatonicNoteName.substring(1));
        }
        this.setMidiNumberFromName();
    }
    setPitch(scale, name, accidental, octave) {
        this._root = name;
        this.setDiatonicNoteName(scale);
        this.setAccidental(accidental);
        if (octave !== undefined)
            this.octave = octave;
        this.setMidiNumberFromName();
    }
    /**
     * Adds a chord note to this note, and sets the chord note type and dots to this note.
     * Also removes some properties from the chord note, like chord symbols and chord.
     * @param note
     * @todo support different staffIndex
     * @todo sort chord notes by pitch. Main note should always be the lowest note in the chord,
     * chord notes should be sorted by pitch ascending.r
     */
    addChordNote(note) {
        note.type = this.type;
        note.dots = this.dots;
        if (note.chord)
            delete note.chord;
        note.removeChordSymbols();
        if (!this.chord)
            this.chord = [];
        this.chord.push(note);
    }
    /**
     * Adds a note if does not exist in the chord already, or removes it if it does.
     * If note is invisible, it is shown
     * @param note
     */
    toggleNote(note, whenLastIsRemoved = 'rest') {
        if (this._root === note.root && this._octave === note.octave) {
            if (this.invisible === true) {
                // click on an invicible note, make it visible
                this.invisible = false;
            }
            else if (this.chord && this.chord.length > 0) {
                // above check: chord should never be of length 0 (should be undefined then), but add check just in case
                // main note is removed, move first chord note to main note and remove it from chord
                this._root = this.chord[0].root;
                this._accidental = this.chord[0].accidental;
                this.printedAccidental = this.chord[0].printedAccidental;
                this._midiNumber = this.chord[0].midiNumber;
                this._octave = this.chord[0].octave;
                this.chord.shift();
            }
            else {
                if (whenLastIsRemoved === 'rest') {
                    throw new Error('Note.toggleNote: changing note to rest not implemented');
                }
                else if (whenLastIsRemoved === 'invisible') {
                    this.invisible = true;
                }
                else {
                    throw new Error('Note.toggleNote: invalid whenLastIsRemoved');
                }
            }
        }
        else if (this.chord &&
            this.chord.find((chordNote) => chordNote.root === note.root && chordNote.octave === note.octave)) {
            this.chord = this.chord.filter((chordNote) => chordNote.root !== note.root || chordNote.octave !== chordNote.octave);
        }
        else {
            this.addChordNote(note);
        }
        if (this.chord && this.chord.length === 0)
            this.chord = undefined;
    }
    /**
     * Adds notations to this note, like articulations, dynamics, ornaments etc.
     * @param item
     *
     * @throws Error if item is undefined
     */
    addNotation(item) {
        if (!item)
            throw new Error('Note.addNotation: item is required');
        if (!this.notations)
            this.notations = [];
        this.notations.push(item);
    }
    /**
     *
     * @param ignoreEnd If true, tie of type 'end' is not considered a tie
     * @returns
     */
    hasTie(ignoreEnd = false) {
        return ignoreEnd ? this.tie && this.tie !== 'end' : this.tie !== undefined;
    }
    /**
     * Returns a clone of this note. Parameters overrides the cloned note's values.
     * @param type
     * @param root
     * @param accidental
     * @param octave
     * @param dots
     * @param staffIndex
     * @param id
     * @returns
     * @todo unit test
     */
    clone(type, root, accidental, octave, dots, staffIndex = 0, id) {
        const note = new Note(type || this.type, root || this.root, accidental || this.accidental, octave || this.octave, dots || this.dots, staffIndex || this.staffIndex, id || undefined);
        if (this.printedAccidental)
            note.printedAccidental = { ...this.printedAccidental };
        if (this.beam)
            note.beam = { ...this.beam };
        if (this.tie)
            note.tie = this.tie;
        if (this.graceType)
            note.graceType = this.graceType;
        if (this.solfege)
            note.solfege = this.solfege;
        if (this.chord) {
            note.chord = [];
            this.chord.forEach((chordNote) => note.chord?.push(chordNote.clone()));
        }
        if (this.graceNotes) {
            note.graceNotes = [];
            this.graceNotes.forEach((graceNote) => note.graceNotes?.push(graceNote.clone()));
        }
        if (this.analysis) {
            if (this.analysis.romanNumeral) {
                note.analysis = { romanNumeral: [] };
                this.analysis.romanNumeral.forEach((romanNumeral) => note.analysis?.romanNumeral?.push(romanNumeral.clone()));
            }
            if (this.analysis.function) {
                note.analysis = { function: [] };
                this.analysis.function.forEach((func) => note.analysis?.function?.push(func.clone()));
            }
        }
        if (this.figuredBass) {
            note.figuredBass = [];
            this.figuredBass.forEach((figuredBass) => note.figuredBass?.push(figuredBass.clone()));
        }
        if (this.notations) {
            note.notations = [];
            this.notations.forEach((notation) => note.notations?.push(notation.clone()));
        }
        if (this.slurs) {
            note.slurs = [];
            this.slurs.forEach((slur) => note.slurs?.push({ ...slur }));
        }
        return note;
    }
    /**
     * Validates a note name, like c, c#, cbb, bbb, bx etc
     * @param name
     * @param allowDoubleAccidentals
     * @returns
     */
    static validateName(name, allowDoubleAccidentals = true) {
        if (!name || name.length === 0)
            return false;
        if (allowDoubleAccidentals)
            return /^[abcdefg][b#x]{0,2}$/.exec(name) !== null;
        else
            return /^[abcdefg][b#]?$/.exec(name) !== null;
    }
    /**
     * Returns natural note name from system name, like c# is c, bb is b and so on
     * @param name
     * @returns
     *
     * @throws Error if name is empty
     * @todo validate note name
     */
    static nameToNatural(name) {
        if (!name || name.length === 0)
            throw new Error('Note.nameToNatural: name is required');
        return name.substr(0, 1);
    }
    /**
     * Returns accidental from system name, like c# is #, bb is bb and so on
     * @param name
     * @todo validate accidental
     */
    static nameToAccidental(name) {
        return name.substr(1) || undefined;
    }
    /**
     * Returns 0-11 from note system name, where 0 is same as c, 1 is c#, 2 is d and so on
     * @param name
     * @returns Number from 0-11 or -1 if name is not valid
     */
    static nameToNoteIndex(name) {
        if (!name || !(name in noteData.nameToNoteIndex))
            return -1;
        return noteData.nameToNoteIndex[name];
    }
    /**
     *
     * @param noteNumber
     * @returns
     * @todo unit test
     * @todo change accidental to Accidentals (needs rewrites of fromScaleNumber)
     */
    static getNumberParts(noteNumber) {
        const noteNumberParts = /^([b#x]{0,2})([0-9]$)/gm.exec(noteNumber);
        if (!noteNumberParts)
            return;
        const parts = { number: +noteNumberParts[2] };
        if (noteNumberParts[1].length > 0)
            parts.accidental = noteNumberParts[1];
        return parts;
    }
    /**
     * Returns 0-11 for note number.
     * @param noteNumber
     * @returns
     * @example '1' returns 0
     * @example '2' returns 2
     * @example 'b3' returns 3
     * @example '7' returns 11
     */
    static noteNumberToNoteIndex(noteNumber) {
        if (!(noteNumber in noteData.noteNumberToNoteIndex))
            return -1;
        return noteData.noteNumberToNoteIndex[noteNumber];
    }
    /**
     * Converts scale number (1, b3, #4, 6) to note name in a major scale (i.e. 3 in c major is e)
     * @param noteNumber
     * @returns
     * @example 3 in c major is e
     * @example b3 in c major is eb
     * @example 5 in eb major is bb
     */
    static noteNumberToNameInScale(scaleRoot, noteNumber) {
        const noteNumberParts = Note.getNumberParts(noteNumber);
        if (!noteNumberParts)
            return '';
        const diatonicNoteIndex = Note.noteNumberToNoteIndex(noteNumberParts.number.toString());
        const diatonicNoteName = Note.noteIndexToNameInScale(scaleRoot, diatonicNoteIndex);
        if (!diatonicNoteName)
            return undefined;
        if (noteNumberParts.accidental) {
            return Note.systemNameAddAccidentals(diatonicNoteName, noteNumberParts.accidental);
        }
        else {
            return diatonicNoteName;
        }
    }
    /**
     * Returns the note name for a note index in the major scale of the given root note.
     * Used alterations are #1, b3, #4, b6 and b7.
     * @param scaleRoot
     * @param noteIndex
     * @returns
     * @example Note.noteIndexToNameInScale('c', 0) returns 'c'
     * @example Note.noteIndexToNameInScale('c', 1) returns 'c#'
     * @example Note.noteIndexToNameInScale('e', 8) returns 'c'
     */
    static noteIndexToNameInScale(scaleRoot, noteIndex) {
        if (!(scaleRoot in noteData.noteIndexToNameInScale))
            return;
        if (!(noteIndex in noteData.noteIndexToNameInScale[scaleRoot]))
            return;
        return noteData.noteIndexToNameInScale[scaleRoot][noteIndex].text;
    }
    /**
     * Calculates number of half steps between two note names.
     * Returns undefined if any of the note names are invalid.
     * @param name1
     * @param name2
     * @returns
     * @todo unit test
     */
    static pitchDiff(name1, name2) {
        const pitch1 = Note.nameToNoteIndex(name1);
        const pitch2 = Note.nameToNoteIndex(name2);
        if (pitch1 < 0 || pitch2 < 0)
            return;
        return pitch1 - pitch2;
    }
}
