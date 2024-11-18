import { Clef, type ClefType } from './clef.js';
import { majorKeyAccidentals, modeOffsets, keySignaturePosition } from './data/keys.js';
import { type KeyMode } from './data/modes.js';
import { type Accidentals, Note, type NoteName } from './note.js';
import { Scale } from './scale.js';

export type KeyAccidental = '#' | 'b';
export type KeyAccidentals = { count: number; type?: KeyAccidental };
/** position 0 is top line in g clef */
export type CustomKeyAccidental = { position?: number; type: Accidentals };

/**
 * key
 * - how handle root when changing accidentals, esp. custom?
 * - scale should support custom accidentals (getting root and mode from key with cust.acc. should work, or at least not return something wrong)
 * - currently both scale and key have method for getting notes...
 */

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

	#customAccidentals?: CustomKeyAccidental[];
	/** TODO was readonly, now updated in setAccidental */
	#accidentals: KeyAccidentals;
	get accidentals() {
		return this.#accidentals;
	}

	colors?: string[];

	_mode: KeyMode;
	get mode() {
		return this._mode;
	}
	get scale() {
		return new Scale(this.root, this._mode);
	}

	get isValid() {
		return this.#customAccidentals && this.#customAccidentals.length > 0 ? false : true;
	}

	constructor(root: string, mode: KeyMode) {
		if (!Note.validateName(root)) throw new Error('Invalid root name');

		this._rootName = Note.nameToNatural(root);
		/** @todo fix accidental/noteAccidental problem */
		const accidental = Note.nameToAccidental(root) as Accidentals;
		if (accidental) this._rootAccidental = accidental;

		this._mode = mode;
		this.#accidentals = Key.getAccidentals(mode, root);
	}

	getCustomAccidentals(clef: ClefType) {
		if (!this.#customAccidentals) return [];
		// customAccidentals always stored with regard to g clef
		if (clef === 'g' || clef === 'treble') return this.#customAccidentals;
		const customAccidentals: CustomKeyAccidental[] = [];
		this.#customAccidentals.forEach((a) => {
			customAccidentals.push({
				position:
					a.position === undefined ? undefined : a.position + new Clef(clef).getOffsetToTreble(),
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
	setCustomAccidentals(value: CustomKeyAccidental[], mode: KeyMode) {
		this.#customAccidentals = value;
		this.convertCustomAccidentalsToKey(mode);
	}

	/** @todo find another way to do unit test instead of this extra function... */
	private testSetCustomAccidentals(value: CustomKeyAccidental[]) {
		this.#customAccidentals = value;
		// test function does not try to convert to key, to support testing of
		// underlying functions...
	}

	getAccidental(column: number) {
		const accidentals =
			this.#customAccidentals && this.#customAccidentals.length > 0 ?
				this.#customAccidentals
			:	this.keyToCustomAccidentals();
		if (column >= accidentals.length) return undefined;
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
	toggleAccidental(
		column: number,
		position: number,
		type: Accidentals,
		mode: KeyMode,
		clef: ClefType = 'g',
	) {
		let added = true;
		if (!this.#customAccidentals) {
			this.#customAccidentals = this.keyToCustomAccidentals();
		}
		if (column < 0 || column > this.#customAccidentals.length) throw new Error('Invalid column');

		// position is always with regard to treble clef
		position -= new Clef(clef).getOffsetToTreble();

		if (column === this.#customAccidentals.length) {
			this.#customAccidentals.push({ position, type });
		} else if (
			this.#customAccidentals[column].position === position &&
			this.#customAccidentals[column].type === type
		) {
			added = false;
			if (column === this.#customAccidentals.length - 1) {
				// Remove last accidental (will be cleared later)
				this.#customAccidentals[column] = { position: undefined, type: '#' };
			} else {
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
				} else {
					break;
				}
			}
		} else {
			this.#customAccidentals[column] = {
				position: position,
				type,
			};
			added = true;
		}
		this.convertCustomAccidentalsToKey(mode);
		if (this.colors) this.refreshColorArray();
		return added;
	}

	keyToCustomAccidentals() {
		const custom: CustomKeyAccidental[] = [];
		for (let i = 0; i < this.accidentals.count; i++) {
			const type = this.accidentals.type || '#';
			const position = Key.getAccidentalPosition(type, i, 'g');
			custom.push({ position, type });
		}
		return custom;
	}

	convertCustomAccidentalsToKey(mode: KeyMode) {
		const data = this.customAccidentalsToKey(mode);
		if (data) {
			// Remove custom accidentals and use key signature
			this.#customAccidentals = undefined;
			this.#accidentals = data.accidentals;
			this._rootName = data.root[0] as NoteName;
			this._rootAccidental = data.root.length > 1 ? (data.root[1] as Accidentals) : undefined;
			this._mode = mode;
		} else {
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
	customAccidentalsToKey(mode: KeyMode) {
		if (!this.#customAccidentals || this.#customAccidentals.length === 0) {
			// no custom accidentals set, just return
			return {
				root: this.root,
				mode: this.mode,
				accidentals: <KeyAccidentals>{ count: 0, type: '#' },
			};
		}

		// check if type and position is valid
		if (!this.customAccidentalsValid()) return undefined;

		const accidentalCount =
			this.#customAccidentals.length * (this.#customAccidentals[0].type === '#' ? 1 : -1);
		const rootAndCount = Object.entries(majorKeyAccidentals).find(
			([_, accidental]) => accidental === accidentalCount - modeOffsets[mode],
		);
		if (!rootAndCount) return undefined;
		const keyObj = {
			accidentals: <KeyAccidentals>{
				count: Math.abs(accidentalCount),
				type: this.#customAccidentals[0].type,
			},
			root: rootAndCount[0],
			mode: mode,
		};
		return keyObj;
	}

	customAccidentalsValid() {
		if (!this.#customAccidentals) return true;
		let isValid = true;
		const type = (this.#customAccidentals![0].type as KeyAccidental) || '#';
		this.#customAccidentals.forEach((accidental, index) => {
			isValid =
				isValid &&
				accidental.position !== undefined &&
				type === accidental.type &&
				Key.isAccidentalValid(type, index, accidental.position, 'g');
		});
		return isValid;
	}

	static isAccidentalValid(type: KeyAccidental, column: number, position: number, clef: ClefType) {
		const validPosition = Key.getAccidentalPosition(type, column, clef);
		return validPosition === position;
	}

	/**
	 * Get position in sheet music, where position 0 is at bottom line
	 * @param type
	 * @param column
	 * @returns
	 */
	static getAccidentalPosition(type: KeyAccidental, column: number, clef?: ClefType) {
		const position = keySignaturePosition[type][column];
		return position + new Clef(clef).getOffsetToTreble();
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

	/** Get note names for c-b with accidentals */
	getNoteNames() {
		const notes = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
		const accidentals =
			this.#customAccidentals ? this.#customAccidentals : this.keyToCustomAccidentals();
		accidentals.forEach((data) => {
			if (data.position === undefined) return;
			// convert position of accidental to index (c=0,b=6)
			const index = Math.abs((data.position * -1 + 10) % 7);
			notes[index] += data.type;
		});
		return notes;
	}

	setColor(index: number, color: string) {
		const count =
			this.#customAccidentals && this.#customAccidentals.length > 0 ?
				this.#customAccidentals.length
			:	this.accidentals.count;
		if (index >= count) return;
		this.refreshColorArray();
		if (this.colors) this.colors[index] = color;
	}

	private refreshColorArray() {
		const count =
			this.#customAccidentals && this.#customAccidentals.length > 0 ?
				this.#customAccidentals.length
			:	this.accidentals.count;
		if (!this.colors || this.colors.length !== count) {
			const oldColors = this.colors || [];
			this.colors = [];
			for (let i = 0; i < count; i++) {
				this.colors.push(i < oldColors.length ? oldColors[i] : '');
			}
		}
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
