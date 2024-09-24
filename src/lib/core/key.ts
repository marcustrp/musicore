import { ClefType } from './clef.js';
import { majorKeyAccidentals, modeOffsets, keySignaturePosition } from './data/keys.js';
import { KeyMode } from './data/modes.js';
import { Accidentals, Note, NoteName } from './note.js';
import { Scale } from './scale.js';

export type KeyAccidental = '#' | 'b';
export type KeyAccidentals = { count: number; type?: KeyAccidental };
export type CustomKeyAccidental = { position?: number; type: Accidentals };
export class Key {
  private _rootName: NoteName;
  get rootName() {
    return this._rootName;
  }
  private _rootAccidental?: Accidentals;
  get rootAccidental() {
    return this._rootAccidental;
  }
  get root() {
    return this._rootName + (this._rootAccidental || '');
  }

  private _customAccidentals?: CustomKeyAccidental[];
  get customAccidentals() {
    return this._customAccidentals ? this._customAccidentals : [];
  }
  set customAccidentals(value: CustomKeyAccidental[]) {
    this._customAccidentals = value;
  }
  /** TODO was readonly, now updated in setAccidental */
  accidentals: KeyAccidentals;

  _mode: KeyMode;
  get mode() {
    return this._mode;
  }
  get scale() {
    return new Scale(this.root, this._mode);
  }

  get isValid() {
    return this._customAccidentals && this._customAccidentals.length > 0 ? false : true;
  }

  constructor(root: string, mode: KeyMode) {
    if (!Note.validateName(root)) throw new Error('Invalid root name');

    this._rootName = Note.nameToNatural(root);
    /** @todo fix accidental/noteAccidental problem */
    const accidental = Note.nameToAccidental(root) as Accidentals;
    if (accidental) this._rootAccidental = accidental;

    this._mode = mode;
    this.accidentals = Key.getAccidentals(mode, root);
  }

  /**
   * Toggle accidental. If custom accidentals are valid
   * for (any) key, updates key and removes custom
   * accidentals.
   * @param column
   * @param position
   * @param type
   * @param clef
   * @returns
   */
  toggleAccidental(column: number, position: number, type: Accidentals, clef: ClefType = 'g') {
    if (!this._customAccidentals) {
      this._customAccidentals = this.keyToCustomAccidentals(clef);
    }
    if (column < 0 || column > this._customAccidentals.length) throw new Error('Invalid column');
    if (column === this._customAccidentals.length) {
      this._customAccidentals.push({ position, type });
    } else if (this._customAccidentals[column].position === position && this._customAccidentals[column].type === type) {
      if (column === this._customAccidentals.length - 1) {
        // Remove last accidental (will be cleared later)
        this._customAccidentals[column] = { position: undefined, type: '#' };
      } else {
        // Remove accidental (leave empty column)
        this._customAccidentals[column] = { position: undefined, type: '#' };
        // no need to check if valid, as it cannot be valid
        // when having an empty column
        return;
      }
      // remove empty columns form the end
      for (let i = this._customAccidentals.length - 1; i >= 0; i--) {
        if (this._customAccidentals[i].position === undefined) {
          this._customAccidentals.pop();
        } else {
          break;
        }
      }
    } else {
      this._customAccidentals[column] = { position, type };
    }
    const data = this.customAccidentalsToKey(this._mode, clef);
    if (data) {
      // Remove custom accidentals and use key signature
      this._customAccidentals = undefined;
      this.accidentals = data.accidentals;
      this._rootName = data.root[0] as NoteName;
      this._rootAccidental = data.root.length > 1 ? (data.root[1] as Accidentals) : undefined;
    }
  }

  keyToCustomAccidentals(clef: ClefType) {
    const custom: CustomKeyAccidental[] = [];
    for (let i = 0; i < this.accidentals.count; i++) {
      const type = this.accidentals.type || '#';
      const position = Key.getAccidentalPosition(type, i, clef);
      custom.push({ position, type });
    }
    return custom;
  }

  customAccidentalsToKey(mode: KeyMode, clef: ClefType) {
    if (!this._customAccidentals || this.customAccidentals.length === 0) {
      /** TODO: support other modes than major/minor */
      return { root: mode === 'major' ? 'c' : 'a', mode, accidentals: <KeyAccidentals>{ count: 0, type: '#' } };
    }

    // check if type and position is valid
    if (!this.customAccidentalsValid(clef)) return undefined;

    let accidentalCount = this._customAccidentals.length * (this._customAccidentals[0].type === '#' ? 1 : -1);
    accidentalCount += modeOffsets[mode];
    const rootAndCount = Object.entries(majorKeyAccidentals).find(([_, accidental]) => accidental === accidentalCount);
    if (!rootAndCount) return undefined;
    const keyObj = {
      accidentals: <KeyAccidentals>{ count: Math.abs(accidentalCount), type: this._customAccidentals[0].type },
      root: rootAndCount[0],
      mode: mode,
    };
    return keyObj;
  }

  customAccidentalsValid(clef: ClefType) {
    let isValid = true;
    let type = (this._customAccidentals![0].type as KeyAccidental) || '#';
    this.customAccidentals.forEach((accidental, index) => {
      // False if different type is used
      if (accidental.type !== type) isValid = false;
      const position = Key.getAccidentalPosition(type, index, clef);
      // False if position is not valid
      if (position !== accidental.position) isValid = false;
    });
    return isValid;
  }

  /**
   * Get position in sheet music, where position 0 is at top line (of normal 5 line staff)
   * @param type
   * @param column
   * @returns
   */
  static getAccidentalPosition(type: KeyAccidental, column: number, clef?: ClefType) {
    const position = keySignaturePosition[type][column];
    if (!clef || clef === 'treble' || clef === 'g') {
      return position;
    } else if (clef === 'bass' || clef === 'f') {
      return position + 2;
    } else if (clef === 'alto') {
      return position + 1;
    }
    throw new Error('Clef not supported: ' + clef);
  }

  /** @todo Support modes (dorian etc) */
  static getAccidentals(mode: KeyMode, root: string): KeyAccidentals {
    const major = majorKeyAccidentals[root];
    if (major !== undefined) {
      const accidentalCount = major + modeOffsets[mode];
      if (accidentalCount > 0) {
        return { count: accidentalCount, type: '#' };
      } else if (accidentalCount < 0) {
        return { count: -accidentalCount, type: 'b' };
      }
      return { count: 0 };
    }
    throw new Error('Not implemented for mode ' + mode);
  }

  /** @todo Support modes (dorian etc) */
  static getAccidentalType(mode: KeyMode, root: string) {
    return Key.getAccidentals(mode, root).type;
  }

  static compare(key1: Key, key2: Key) {
    if (key1.rootName !== key2.rootName) return false;
    if (key1.rootAccidental !== key2.rootAccidental) return false;
    if (key1.mode !== key2.mode) return false;
    return true;
  }
}
