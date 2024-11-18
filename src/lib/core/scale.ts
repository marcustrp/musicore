import { type ScaleType } from './data/modes.js';
import { scaleTypes } from './data/scales.js';
import {
	type NoteAccidentals,
	Note,
	type NoteName,
	type ScaleNumber,
	type ScaleNumberNumbers,
} from './note.js';

export class Scale {
	//root: { name: string; number: number };
	private _root: { natural: NoteName; accidental?: NoteAccidentals; number: number };
	get root() {
		return this._root;
	}
	get rootAccidental() {
		return this._root.accidental;
	}
	get rootNumber() {
		return this._root.number;
	}
	get rootName() {
		return this._root.natural + (this._root.accidental || '');
	}

	/**
	 * Number of half steps between notes from root.
	 * @example major: [0, 2, 4, 5, 7, 9, 11]
	 * @example minor: [0, 2, 3, 5, 7, 8, 10]
	 */
	steps: number[] = [];
	/**
	 * Scale numbers for each note in scale.
	 * @example major: ['1', '2', '3', '4', '5', '6', '7']
	 * @example minor: ['1', '2', 'b3', '4', '5', 'b6', 'b7']
	 */
	scaleNumbers: ScaleNumber[] = [];
	/**
	 * Name of scale in swedish, like 'dur' or 'mixolydisk'.
	 * @todo Create a system for internationalization
	 */
	name: string;
	/**
	 * Number of half steps between notes from root, for scales that
	 * have different descending steps than ascending. Undefined for
	 * scales with identical ascending and descending steps.
	 * @example melodic minor: [0, 2, 3, 5, 7, 9, 11]
	 */
	stepsDescending?: number[];
	/**
	 * Scale numbers for each note in scale, for scales that
	 * have different descending steps than ascending. Undefined for
	 * scales with identical ascending and descending steps.
	 * @example melodic minor: ['1', '2', 'b3', '4', '5', '6', '7']
	 */
	scaleNumbersDescending?: string[];

	/**
	 *
	 * @param root name and accidental, like 'c#' or 'eb'
	 * @param type ScaleType or 'custom' (requires customnoteNames)
	 * @param customNoteNames array of notenames (root+accidential) for custom scale, from c to b
	 *
	 * @example new Note('f','custom',['c','d#','e','f','gb','a','b'])
	 *
	 * @throws Error if root is invalid
	 * @throws Error if type is invalid
	 */
	constructor(
		root: string,
		public type: ScaleType,
		customNoteNames?: string[],
	) {
		if (!Note.validateName(root)) throw new Error('Invalid root name');

		// if type is none, which might be used for key signatures with
		// no key, use chromatic in its place. See KeyModes
		this.type = type === 'none' ? 'chromatic' : type;
		if (type === 'custom') {
			if (!customNoteNames) throw new Error('No customNoteNames provided for custom scale.');
			this.name = 'Egendefinierad';
			const major = new Scale(root, 'major');
			//const rootNote = new Note('w',customNoteNames[0].substring(0, 1) as NoteName,
			customNoteNames[0].length > 1 ?
				(customNoteNames[0].substring(1) as NoteAccidentals)
			:	undefined;
			// TODO: loop customNoteNames from provided root, calling getScaleNumberFromNote...
			customNoteNames.forEach((notename) => {
				this.scaleNumbers.push(
					major.getScaleNumberFromNote(
						notename.substring(0, 1) as NoteName,
						notename.length > 1 ? (notename.substring(1) as NoteAccidentals) : undefined,
					) as ScaleNumber,
				);
				const pitchDiff = Note.pitchDiff(notename, customNoteNames[0]);
				if (pitchDiff === undefined) throw new Error('Invalid customNotes');
				this.steps.push((pitchDiff + 12) % 12);
			});
		} else {
			const scaleType = Scale.getScaleType(type);
			this.steps = scaleType.steps;
			this.scaleNumbers = scaleType.scaleNumbers;
			this.name = scaleType.name;
			this.stepsDescending = scaleType.stepsDescending;
			this.scaleNumbersDescending = scaleType.scaleNumbersDescending;
		}
		this._root = {
			natural: Note.nameToNatural(root),
			accidental: Note.nameToAccidental(root),
			number: Note.nameToNoteIndex(root),
		};
	}

	/**
	 * Create a scale from a string with syntax 'root mode'.
	 * @param rootAndMode 'c major', 'f# minor', 'd lydian'
	 * @returns
	 *
	 * @throws Error if root name is invalid
	 * @throws Error if mode is invalid
	 */
	static fromString(rootAndMode: string) {
		if (!rootAndMode) throw new Error('Empty rootAndMode');
		const data = rootAndMode.split(' ');
		if (data.length !== 2) throw new Error('Invalid rootAndMode');
		const [root, mode] = data;
		if (!root || !mode) throw new Error('Invalid rootAndMode');
		return new Scale(root, mode as ScaleType);
	}

	/**
	 * Returns note index (0-11) in chromatic scale from midi number. Note index
	 * zero is the root of the scale.
	 * @param midiNumber
	 * @returns 0-11 or -1 if midiNumber is invalid
	 *
	 * @example for c scale, midiNumber 60 (c4) returns 0
	 * @example for c scale, midiNumber 61 (c#4) returns 1
	 * @example for a scale, midiNumber 68 (g#4) returns 11
	 */
	getScaleNumberIndex(midiNumber: number) {
		if (midiNumber >= 0 && midiNumber < 128) return (midiNumber - (this.root.number % 12)) % 12;
		else return -1;
	}

	/**
	 * Returns the note names of all the notes in this scale.
	 * @example D major: d e f# g a b c#
	 * @example G minor: g a bb c d eb f g
	 * @example A major pentatonic: a b c# e f#
	 */
	getDiatonicNoteNames() {
		return this.scaleNumbers.map<string>(
			(scaleNumber) => Note.noteNumberToNameInScale(this.rootName, scaleNumber) as string,
		);
	}

	/**
	 * Returns the note name and accidential (if any) for a NoteName in the scale
	 * @param root
	 * @example f in d major return f#, g in d major return g
	 * @example b in g minor returns bb
	 * @returns
	 */
	getDiatonicNoteName(root: NoteName) {
		const item = this.getDiatonicNoteNames().find((name) => name.charAt(0) === root);
		return item || '';
	}

	noteIsDiatonic(note: string) {
		return this.getDiatonicNoteNames().includes(note);
	}

	/**
	 * Returns mapping of natural notes to diatonic notes.
	 * @returns
	 * @example D major: {d: 'd', e: 'e', f: 'f#', ...}
	 */
	getNaturalNoteMapping() {
		const names: { [key: string]: string } = {};
		this.getDiatonicNoteNames().forEach((name) => (names[name.charAt(0)] = name));
		return names;
	}

	/**
	 * Returns scale type data object from string.
	 * @param type
	 * @returns
	 * @throws Error if type is not supported
	 */
	static getScaleType(type: string) {
		if (Scale.validateScaleType(type)) {
			return scaleTypes[type];
		} else {
			throw new Error(`Invalid scale type '${type}'`);
		}
	}

	static validateScaleType(type: string) {
		return type in scaleTypes;
	}

	static modeFromNotes(notes: Note[], requireDescending = true) {
		const rootScale = new Scale(notes[0].name, 'major');
		const scaleNumbers = notes.map((note) =>
			rootScale.getScaleNumberFromNote(note.root, note.accidental),
		);
		const mode = Scale.modeFromScaleNumbers(scaleNumbers, requireDescending);
		return mode;
	}

	static modeFromScaleNumbers(scaleNumbers: string[], requireDescending = true) {
		let mode: string | undefined = undefined;
		const { ascending, descending } = Scale.parseScaleNumberArray(scaleNumbers);
		console.log('asc/desc', ascending, descending, scaleNumbers);
		Object.keys(scaleTypes).forEach((key) => {
			if (!mode && Scale.validateScaleNumbersToMode(scaleTypes[key].scaleNumbers, ascending))
				mode = key;
		});
		if (mode && requireDescending && scaleTypes[mode].scaleNumbersDescending) {
			if (descending) {
				if (!Scale.validateScaleNumbersToMode(scaleTypes[mode].scaleNumbersDescending!, descending))
					mode = undefined;
			} else {
				mode = undefined;
			}
		}
		return mode;
	}

	private static validateScaleNumbersToMode(modeScaleNumbers: string[], scaleNumbers: string[]) {
		let isValid = true;
		modeScaleNumbers.forEach((scaleNumber, i) => (isValid &&= scaleNumber === scaleNumbers[i]));
		return isValid;
	}

	private static parseScaleNumberArray(scaleNumbers: string[]) {
		const ascending: string[] = [];
		const descending: string[] = [];
		let isDescending = false;
		scaleNumbers.forEach((scaleNumber) => {
			if (!isDescending && ascending.length > 0 && scaleNumber === '1') {
				isDescending = true;
			} else if (isDescending) {
				descending.push(scaleNumber);
			} else {
				ascending.push(scaleNumber);
			}
		});
		return { ascending, descending: descending.length > 1 ? descending : undefined };
	}

	/**
	 * Returns default scale number for this mode. In minor, 3
	 * is b3, in lydian, 4 is #4 and so on.
	 * @param scaleNumber
	 * @returns
	 */
	getModeDefaultScaleNumber(scaleNumber: ScaleNumberNumbers) {
		const modeScaleNumber = this.scaleNumbers.find(
			(item) => item.indexOf(scaleNumber.toString()) >= 0,
		);
		if (modeScaleNumber) {
			return modeScaleNumber;
		} else {
			return scaleNumber.toString() as ScaleNumber;
		}
	}

	/**
	 * Returns scale number for note in this scale. If note is not in scale,
	 * returns empty string.
	 * @param root
	 * @param accidental
	 * @param relativeToMajor Default true. If true, always return ScaleNumber relative to major scale
	 * @returns
	 * @example (relativeToMajor = true) f in d major returns b3, f in d minor returns b3.
	 * @example (relativeToMajor = false) f in d major returns b3, f in d minor returns 3.
	 * @todo this should be moved, see Note.fromScalenumber regarding useScaleMode. It's more of a extended musicString thing.
	 */
	getScaleNumberFromNote(root: NoteName, accidental?: NoteAccidentals, relativeToMajor = true) {
		const scale =
			relativeToMajor ?
				new Scale(this.root.natural + (this.root.accidental ? this.root.accidental : ''), 'major')
			:	this;
		const scaleNumber = scale.getDiatonicScaleNumberFromNote(root);
		const pitchDiff = scale.getNotePitchDiffFromScale(root, accidental);
		switch (pitchDiff) {
			case -2:
				return 'bb' + scaleNumber;
			case -1:
				return 'b' + scaleNumber;
			case 0:
				return '' + scaleNumber;
			case 1:
				return '#' + scaleNumber;
			case 2:
				return 'x' + scaleNumber;
			default:
				return '';
		}
	}

	/**
	 * Returns pitch difference from scale for note in halv steps.
	 * @param root
	 * @param accidental
	 * @example f in d major returns -1, f in d minor returns 0.
	 * @returns
	 */
	getNotePitchDiffFromScale(root: NoteName, accidental: NoteAccidentals | undefined) {
		const noteNumber = this.getDiatonicScaleNumberFromNote(root);
		const noteNames = this.getNearestDiatonicScale().getDiatonicNoteNames();
		const diff =
			Note.nameToNoteIndex(root + (accidental || '')) -
			Note.nameToNoteIndex(noteNames[noteNumber - 1]);
		return (
			diff > 6 ? diff - 12
			: diff < -6 ? diff + 12
			: diff
		);
	}

	/**
	 * Return scale number for note in scale (disregarding accidental for both note and scale).
	 * @param root
	 * @example 'e' in c minor returns 3
	 * @example 'c' in d major returns 7
	 * @returns 1-7
	 */
	getDiatonicScaleNumberFromNote(root: NoteName, scale?: Scale): ScaleNumberNumbers {
		// Non-diatonic scales need to be "converted" to closest diatonic scales,
		// as we do want to support using any note, regardless of scale
		scale = this.getNearestDiatonicScale();
		const noteNames = scale.getDiatonicNoteNames();
		return (noteNames.findIndex((item) => item.charAt(0) === root) + 1) as ScaleNumberNumbers;
	}

	getNearestDiatonicScale() {
		let scale: Scale | undefined;
		switch (this.type) {
			case 'blues':
			case 'pentatonic_minor':
				scale = new Scale(this.rootName, 'minor');
				break;
			case 'pentatonic_major':
				scale = new Scale(this.rootName, 'major');
				break;
		}
		return scale || this;
	}
}
