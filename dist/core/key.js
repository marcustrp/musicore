import { capitalizeFirstChar } from '../utils/string.js';
import { Clef } from './clef.js';
import { majorKeyAccidentals, modeOffsets, keySignaturePosition } from './data/keys.js';
import {} from './data/modes.js';
import { Note } from './note.js';
import { Scale } from './scale.js';
/**
 * key
 * - how handle root when changing accidentals, esp. custom?
 * - scale should support custom accidentals (getting root and mode from key with cust.acc. should work, or at least not return something wrong)
 * - currently both scale and key have method for getting notes...
 */
export class Key {
    _rootName;
    get rootName() {
        return this._rootName;
    }
    _rootAccidental;
    get rootAccidental() {
        return this._rootAccidental;
    }
    get root() {
        return this._rootName + (this._rootAccidental || '');
    }
    #customAccidentals;
    /** TODO was readonly, now updated in setAccidental */
    #accidentals;
    get accidentals() {
        return this.#accidentals;
    }
    colors;
    _mode;
    get mode() {
        return this._mode;
    }
    get scale() {
        return new Scale(this.root, this._mode);
    }
    get isValid() {
        return this.#customAccidentals && this.#customAccidentals.length > 0 ? false : true;
    }
    constructor(root, mode) {
        if (!Note.validateName(root))
            throw new Error('Invalid root name');
        this._rootName = Note.nameToNatural(root);
        /** @todo fix accidental/noteAccidental problem */
        const accidental = Note.nameToAccidental(root);
        if (accidental)
            this._rootAccidental = accidental;
        this._mode = mode;
        this.#accidentals = Key.getAccidentals(mode, root);
    }
    getCustomAccidentals(clef) {
        if (!this.#customAccidentals)
            return [];
        // customAccidentals always stored with regard to g clef
        if (clef === 'g' || clef === 'treble')
            return this.#customAccidentals;
        const customAccidentals = [];
        this.#customAccidentals.forEach((a) => {
            customAccidentals.push({
                position: a.position === undefined ? undefined : a.position + new Clef(clef).getOffsetToTreble(),
                type: a.type,
            });
        });
        return customAccidentals ? customAccidentals : [];
    }
    /**
     * Sets custom accidentals. Will be converted to key if possible.
     * @param value
     * @param mode Needed when trying to convert to key
     */
    setCustomAccidentals(value, mode) {
        this.#customAccidentals = value;
        this.convertCustomAccidentalsToKey(mode);
    }
    /** @todo find another way to do unit test instead of this extra function... */
    testSetCustomAccidentals(value) {
        this.#customAccidentals = value;
        // test function does not try to convert to key, to support testing of
        // underlying functions...
    }
    getAccidental(column) {
        const accidentals = this.#customAccidentals && this.#customAccidentals.length > 0 ?
            this.#customAccidentals
            : this.keyToCustomAccidentals();
        if (column >= accidentals.length)
            return undefined;
        return accidentals[column];
    }
    /**
     * Toggle accidental. If custom accidentals are valid
     * for (any) key, updates key and removes custom
     * accidentals.
     * @param column
     * @param position
     * @param type
     * @param mode Needed when trying to convert to key
     * @param clef
     * @returns true of accidental added, false if removed
     */
    toggleAccidental(column, position, type, mode, clef = 'g') {
        let added = true;
        if (!this.#customAccidentals) {
            this.#customAccidentals = this.keyToCustomAccidentals();
        }
        if (column < 0 || column > this.#customAccidentals.length)
            throw new Error('Invalid column');
        // position is always with regard to treble clef
        position -= new Clef(clef).getOffsetToTreble();
        if (column === this.#customAccidentals.length) {
            this.#customAccidentals.push({ position, type });
        }
        else if (this.#customAccidentals[column].position === position &&
            this.#customAccidentals[column].type === type) {
            added = false;
            if (column === this.#customAccidentals.length - 1) {
                // Remove last accidental (will be cleared later)
                this.#customAccidentals[column] = { position: undefined, type: '#' };
            }
            else {
                // Remove accidental (leave empty column)
                this.#customAccidentals[column] = { position: undefined, type: '#' };
                // no need to check if valid, as it cannot be valid
                // when having an empty column
                return false;
            }
            // remove empty columns form the end
            for (let i = this.#customAccidentals.length - 1; i >= 0; i--) {
                if (this.#customAccidentals[i].position === undefined) {
                    this.#customAccidentals.pop();
                }
                else {
                    break;
                }
            }
        }
        else {
            this.#customAccidentals[column] = {
                position: position,
                type,
            };
            added = true;
        }
        this.convertCustomAccidentalsToKey(mode);
        if (this.colors)
            this.refreshColorArray();
        return added;
    }
    keyToCustomAccidentals() {
        const custom = [];
        for (let i = 0; i < this.accidentals.count; i++) {
            const type = this.accidentals.type || '#';
            const position = Key.getAccidentalPosition(type, i, 'g');
            custom.push({ position, type });
        }
        return custom;
    }
    convertCustomAccidentalsToKey(mode) {
        const data = this.customAccidentalsToKey(mode);
        if (data) {
            // Remove custom accidentals and use key signature
            this.#customAccidentals = undefined;
            this.#accidentals = data.accidentals;
            this._rootName = data.root[0];
            this._rootAccidental = data.root.length > 1 ? data.root[1] : undefined;
            this._mode = mode;
        }
        else {
            this._mode = 'custom';
        }
        return data !== undefined;
    }
    /**
     *
     * @param mode
     * @param clef
     * @returns object if custom accidentals match key signature, otherwise undefined
     * @todo support other modes than major/minor
     */
    customAccidentalsToKey(mode) {
        if (!this.#customAccidentals || this.#customAccidentals.length === 0) {
            // no custom accidentals set, just return
            return {
                root: this.root,
                mode: this.mode,
                accidentals: { count: 0, type: '#' },
            };
        }
        // check if type and position is valid
        if (!this.customAccidentalsValid())
            return undefined;
        const accidentalCount = this.#customAccidentals.length * (this.#customAccidentals[0].type === '#' ? 1 : -1);
        const rootAndCount = Object.entries(majorKeyAccidentals).find(([_, accidental]) => accidental === accidentalCount - modeOffsets[mode]);
        if (!rootAndCount)
            return undefined;
        const keyObj = {
            accidentals: {
                count: Math.abs(accidentalCount),
                type: this.#customAccidentals[0].type,
            },
            root: rootAndCount[0],
            mode: mode,
        };
        return keyObj;
    }
    customAccidentalsValid() {
        if (!this.#customAccidentals)
            return true;
        let isValid = true;
        const type = this.#customAccidentals[0].type || '#';
        this.#customAccidentals.forEach((accidental, index) => {
            isValid =
                isValid &&
                    accidental.position !== undefined &&
                    type === accidental.type &&
                    Key.isAccidentalValid(type, index, accidental.position, 'g');
        });
        return isValid;
    }
    static isAccidentalValid(type, column, position, clef) {
        const validPosition = Key.getAccidentalPosition(type, column, clef);
        return validPosition === position;
    }
    /**
     * Get position in sheet music, where position 0 is at bottom line
     * @param type
     * @param column
     * @returns
     */
    static getAccidentalPosition(type, column, clef) {
        const position = keySignaturePosition[type][column];
        return position + new Clef(clef).getOffsetToTreble();
    }
    /** @todo Support modes (dorian etc) */
    static getAccidentals(mode, root) {
        const major = majorKeyAccidentals[root];
        if (major !== undefined) {
            const accidentalCount = major + modeOffsets[mode];
            if (accidentalCount > 0) {
                return { count: accidentalCount, type: '#' };
            }
            else if (accidentalCount < 0) {
                return { count: -accidentalCount, type: 'b' };
            }
            return { count: 0 };
        }
        throw new Error('Not implemented for mode ' + mode);
    }
    /** Get note names for c-b with accidentals */
    getNoteNames() {
        const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
        const accidentals = this.#customAccidentals ? this.#customAccidentals : this.keyToCustomAccidentals();
        accidentals.forEach((data) => {
            if (data.position === undefined)
                return;
            // convert position of accidental to index (c=0,b=6)
            const index = Math.abs((data.position * -1 + 10) % 7);
            notes[index] += data.type;
        });
        return notes;
    }
    setColor(index, color) {
        const count = this.#customAccidentals && this.#customAccidentals.length > 0 ?
            this.#customAccidentals.length
            : this.accidentals.count;
        if (index >= count)
            return;
        this.refreshColorArray();
        if (this.colors)
            this.colors[index] = color;
    }
    refreshColorArray() {
        const count = this.#customAccidentals && this.#customAccidentals.length > 0 ?
            this.#customAccidentals.length
            : this.accidentals.count;
        if (!this.colors || this.colors.length !== count) {
            const oldColors = this.colors || [];
            this.colors = [];
            for (let i = 0; i < count; i++) {
                this.colors.push(i < oldColors.length ? oldColors[i] : '');
            }
        }
    }
    /** @todo Support modes (dorian etc) */
    static getAccidentalType(mode, root) {
        return Key.getAccidentals(mode, root).type;
    }
    static compare(key1, key2) {
        if (key1.rootName !== key2.rootName)
            return false;
        if (key1.rootAccidental !== key2.rootAccidental)
            return false;
        if (key1.mode !== key2.mode)
            return false;
        return true;
    }
    /**
     * Returns key as string (style:short conformes to ABC format)
     * @returns string
     */
    toString(style = 'short') {
        const root = capitalizeFirstChar(this.root);
        const mode = this.mode;
        switch (mode) {
            case 'major':
            case 'ionian':
                return root;
            case 'minor':
            case 'aeolian':
                return root + 'm';
            case 'dorian':
            case 'locrian':
            case 'lydian':
            case 'mixolydian':
            case 'phrygian':
                return root + ' ' + mode;
            case 'none':
                return 'none';
            default:
                throw new Error('Unsupported mode');
        }
    }
}
