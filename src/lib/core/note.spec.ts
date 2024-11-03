import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	type NoteAccidentals,
	Note,
	type NoteName,
	type ScaleNumber,
	type ScaleNumberParts,
} from './note.js';
import { Scale } from './scale.js';
import { type Notation } from './data/notations.js';
import ChordSymbol from './chordSymbol.js';
import type { NoteObject } from '$lib/test-types.js';

describe('Note', () => {
	it('should create a simple note instance', () => {
		const noteObj: NoteObject = {
			type: 'q',
			root: 'c',
			octave: 5,
			midiNumber: 60,
			staffIndex: 0,
		};

		const result = new Note('q', 'c');

		expect(result).toMatchObject(noteObj);
	});
	it('should create a more complex note instance', () => {
		const noteObj: NoteObject = {
			type: 'h',
			root: 'e',
			accidental: 'b',
			octave: 3,
			midiNumber: 39,
			dots: 2,
			staffIndex: 1,
		};

		const result = new Note('h', 'e', 'b', 3, 2, 1);

		expect(result).toMatchObject(noteObj);
	});
	it('should create a note in correct octave for b#', () => {
		const noteObj: NoteObject = {
			root: 'b',
			accidental: '#',
			octave: 4,
			midiNumber: 60,
		};

		const result = new Note('h', 'b', '#', 4);

		expect(result).toMatchObject(noteObj);
	});
});

describe('Note.processScaleNumber', () => {
	/** @todo should mock Scale */
	it('should return correct data for 1 in c major', () => {
		const scale = new Scale('c', 'major');
		const scaleNumberParts: ScaleNumberParts = { number: 1, accidental: undefined };
		const result = Note['processScaleNumber'](scaleNumberParts, scale, true);
		expect(result).toEqual({ number: 1, accidental: undefined });
	});
	it('should return correct data for b3 in c major', () => {
		const scale = new Scale('c', 'major');
		const scaleNumberParts: ScaleNumberParts = { number: 3, accidental: 'b' };
		const result = Note['processScaleNumber'](scaleNumberParts, scale, true);
		expect(result).toEqual({ number: 3, accidental: 'b' });
	});
	it('should return correct data for #4 in c major', () => {
		const scale = new Scale('c', 'major');
		const scaleNumberParts: ScaleNumberParts = { number: 4, accidental: '#' };
		const result = Note['processScaleNumber'](scaleNumberParts, scale, true);
		expect(result).toEqual({ number: 4, accidental: '#' });
	});
	it('should return correct data for 3 in c minor (not using scale mode)', () => {
		const scale = new Scale('c', 'minor');
		const scaleNumberParts: ScaleNumberParts = { number: 3 };
		const result = Note['processScaleNumber'](scaleNumberParts, scale, false);
		expect(result).toEqual({ number: 3, accidental: undefined });
	});
	it('should return correct data for 3 in c minor (using scale mode)', () => {
		const scale = new Scale('c', 'minor');
		const scaleNumberParts: ScaleNumberParts = { number: 3 };
		const result = Note['processScaleNumber'](scaleNumberParts, scale, true);
		expect(result).toEqual({ number: 3, accidental: 'b' });
	});
	it('should return correct data for b3 in c minor', () => {
		const scale = new Scale('c', 'minor');
		const scaleNumberParts: ScaleNumberParts = { number: 3, accidental: 'b' };
		const result = Note['processScaleNumber'](scaleNumberParts, scale, true);
		expect(result).toEqual({ number: 3, accidental: 'b' });
	});
	it('should return correct data for m3 in c minor (using scale mode)', () => {
		const scale = new Scale('c', 'minor');
		const scaleNumberParts: ScaleNumberParts = { number: 3, accidental: 'm' };
		const result = Note['processScaleNumber'](scaleNumberParts, scale, true);
		expect(result).toEqual({ number: 3, accidental: undefined });
	});
});

describe('Note.fromScaleNumber', () => {
	const scaleMock = {
		get(data: { rootNumber: number; rootName: string }) {
			return {
				root: { number: data.rootNumber },
				rootName: data.rootName,
				getDiatonicNoteName: function () {
					return 'c';
				},
			} as unknown as Scale;
		},
	};
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should create a simple note', () => {
		const scaleData = { rootNumber: 2, rootName: 'd' };
		const noteIndex = 6;
		const noteNumberParts: ScaleNumberParts = { number: 3, accidental: undefined };
		const noteObj: NoteObject = {
			type: 'q',
			root: 'f',
			accidental: '#',
			octave: 4,
			midiNumber: 54,
			staffIndex: 0,
		};
		vi.spyOn(Note, 'nameToNoteIndex').mockImplementationOnce(() => noteIndex);
		vi.spyOn(Note, 'getNumberParts').mockImplementationOnce(() => noteNumberParts);
		vi.spyOn(Note, 'noteNumberToNameInScale').mockImplementationOnce(
			() => noteObj.root + (noteObj.accidental || ''),
		);

		const result = Note.fromScaleNumber(
			((noteNumberParts.accidental || '') + noteNumberParts.number) as ScaleNumber,
			4,
			scaleMock.get(scaleData),
		);

		expect(result).toMatchObject(noteObj);
	});
	it('should create a note using scaleNumber with accidental', () => {
		const scaleData = { rootNumber: 2, rootName: 'd' };
		const noteIndex = 8;
		const noteNumberParts: ScaleNumberParts = { number: 4, accidental: '#' };
		const noteObj: NoteObject = {
			root: 'g',
			accidental: '#',
			octave: 4,
			midiNumber: 56,
		};
		vi.spyOn(Note, 'nameToNoteIndex').mockImplementationOnce(() => noteIndex);
		vi.spyOn(Note, 'getNumberParts').mockImplementationOnce(() => noteNumberParts);
		vi.spyOn(Note, 'noteNumberToNameInScale').mockImplementationOnce(
			() => noteObj.root + (noteObj.accidental || ''),
		);

		const result = Note.fromScaleNumber(
			((noteNumberParts.accidental || '') + noteNumberParts.number) as ScaleNumber,
			4,
			scaleMock.get(scaleData),
		);

		expect(result).toMatchObject(noteObj);
	});
	it('should create a note using minor scale', () => {
		const scaleData = { rootNumber: 2, rootName: 'd' };
		const noteIndex = 5;
		const noteNumberParts: ScaleNumberParts = { number: 3, accidental: undefined };
		const noteObj: NoteObject = {
			root: 'f',
			octave: 5,
			midiNumber: 65,
		};
		vi.spyOn(Note, 'nameToNoteIndex').mockImplementationOnce(() => noteIndex);
		vi.spyOn(Note, 'getNumberParts').mockImplementationOnce(() => noteNumberParts);
		vi.spyOn(Note, 'noteNumberToNameInScale').mockImplementationOnce(() => noteObj.root);
		const result = Note.fromScaleNumber(
			((noteNumberParts.accidental || '') + noteNumberParts.number) as ScaleNumber,
			5,
			scaleMock.get(scaleData),
		);

		expect(result).toMatchObject(noteObj);
	});
	it('should create a note using minor scale with m (major) accidental', () => {
		const scaleData = { rootNumber: 2, rootName: 'd' };
		const noteIndex = 6;
		const noteNumberParts: ScaleNumberParts = { number: 3, accidental: 'm' };
		const noteObj: NoteObject = {
			root: 'f',
			accidental: '#',
			octave: 5,
			midiNumber: 66,
		};
		vi.spyOn(Note, 'nameToNoteIndex').mockImplementationOnce(() => noteIndex);
		vi.spyOn(Note, 'getNumberParts').mockImplementationOnce(() => noteNumberParts);
		vi.spyOn(Note, 'noteNumberToNameInScale').mockImplementationOnce(
			() => noteObj.root + (noteObj.accidental || ''),
		);
		const result = Note.fromScaleNumber(
			((noteNumberParts.accidental || '') + noteNumberParts.number) as ScaleNumber,
			5,
			scaleMock.get(scaleData),
		);

		expect(result).toMatchObject(noteObj);
	});
	it('should create a simple note using scaleNumber 9', () => {
		const scaleData = { rootNumber: 7, rootName: 'g' };
		const noteIndex = 10;
		const noteNumberParts: ScaleNumberParts = { number: 9, accidental: undefined };
		const noteObj: NoteObject = {
			type: 'q',
			root: 'a',
			octave: 6,
			midiNumber: 81,
			staffIndex: 0,
		};
		vi.spyOn(Note, 'nameToNoteIndex').mockImplementationOnce(() => noteIndex);
		vi.spyOn(Note, 'getNumberParts').mockImplementationOnce(() => noteNumberParts);
		vi.spyOn(Note, 'noteNumberToNameInScale').mockImplementationOnce(() => noteObj.root);
		const result = Note.fromScaleNumber(
			((noteNumberParts.accidental || '') + noteNumberParts.number) as ScaleNumber,
			5,
			scaleMock.get(scaleData),
		);

		expect(result).toMatchObject(noteObj);
	});
	it('should create a note in correct octave', () => {
		const scaleData = { rootNumber: 9, rootName: 'a' };
		const noteIndex = 4;
		const noteNumberParts: ScaleNumberParts = { number: 5, accidental: undefined };
		const noteObj: NoteObject = {
			root: 'e',
			octave: 5,
			midiNumber: 64,
		};
		vi.spyOn(Note, 'nameToNoteIndex').mockImplementationOnce(() => noteIndex);
		vi.spyOn(Note, 'getNumberParts').mockImplementationOnce(() => noteNumberParts);
		vi.spyOn(Note, 'noteNumberToNameInScale').mockImplementationOnce(() => noteObj.root);
		const result = Note.fromScaleNumber(
			((noteNumberParts.accidental || '') + noteNumberParts.number) as ScaleNumber,
			4,
			scaleMock.get(scaleData),
		);

		expect(result).toMatchObject(noteObj);
	});
	const edgeCases = [
		{
			systemName: 'b#',
			midiNumber: 72,
			octave: 5,
			scaleNumber: '7' as ScaleNumber,
			scaleRoot: 'c#',
			scaleRootNumber: 1,
		},
		{
			systemName: 'bx',
			midiNumber: 73,
			octave: 5,
			scaleNumber: '#3' as ScaleNumber,
			scaleRoot: 'g#',
			scaleRootNumber: 8,
		},
		{
			systemName: 'cb',
			midiNumber: 71,
			octave: 6,
			scaleNumber: 'b5' as ScaleNumber,
			scaleRoot: 'f',
			scaleRootNumber: 5,
		},
		{
			systemName: 'cbb',
			midiNumber: 70,
			octave: 6,
			scaleNumber: 'b4' as ScaleNumber,
			scaleRoot: 'gb',
			scaleRootNumber: 6,
		},
	];
	edgeCases.forEach((edgeCase) => {
		it('should create a note in correct octave of edge case ' + edgeCase.systemName, () => {
			const noteObj: NoteObject = {
				accidental: edgeCase.systemName.substr(1) as NoteAccidentals,
				root: edgeCase.systemName[0] as NoteName,
				octave: edgeCase.octave,
				midiNumber: edgeCase.midiNumber,
				name: edgeCase.systemName,
			};
			/*vi.spyOn(Note, 'nameToNoteIndex').mockImplementationOnce(() => edgeCase.midiNumber % 12);
      vi.spyOn(Note, 'getNumberParts').mockImplementationOnce(() => {
        return {number: +(edgeCase.scaleNumber.length === 1 ? +edgeCase.scaleNumber : edgeCase.scaleNumber.substr(1)), accidental: edgeCase.scaleNumber.length === 1 ? undefined : edgeCase.scaleNumber[0]}
      })
      vi.spyOn(Note, 'noteNumberToNameInScale').mockImplementationOnce(() => (noteObj._root));
      */
			const result = Note.fromScaleNumber(
				edgeCase.scaleNumber,
				5,
				scaleMock.get({ rootNumber: edgeCase.scaleRootNumber, rootName: edgeCase.scaleRoot }),
			);

			expect(result).toMatchObject(noteObj);
		});
	});
	it('should create a note with correct length', () => {
		const scaleData = { rootNumber: 9, rootName: 'a' };
		const noteIndex = 2;
		const noteNumberParts: ScaleNumberParts = { number: 2, accidental: undefined };
		const noteObj: NoteObject = {
			type: 'h',
			dots: 1,
			root: 'b',
		};
		vi.spyOn(Note, 'nameToNoteIndex').mockImplementationOnce(() => noteIndex);
		vi.spyOn(Note, 'getNumberParts').mockImplementationOnce(() => noteNumberParts);
		vi.spyOn(Note, 'noteNumberToNameInScale').mockImplementationOnce(() => noteObj.root);
		const result = Note.fromScaleNumber(
			((noteNumberParts.accidental || '') + noteNumberParts.number) as ScaleNumber,
			4,
			scaleMock.get(scaleData),
			'h',
			1,
		);

		expect(result).toMatchObject(noteObj);
	});
	it('should throw on invalid input', () => {
		const resultFn = () =>
			Note.fromScaleNumber('none' as ScaleNumber, 5, new Scale('c', 'major'), 'h');

		expect(resultFn).toThrowError(/Invalid scaleNumber/);
	});
});

describe('Note.nameToNoteIndex', () => {
	it('should return correct number for c', () => {
		const result = Note.nameToNoteIndex('c');

		expect(result).toEqual(0);
	});
	it('should return correct number for c#', () => {
		const result = Note.nameToNoteIndex('c#');

		expect(result).toEqual(1);
	});
	it('should return -1 for invalid note names', () => {
		const result = Note.nameToNoteIndex('none');
		expect(result).toEqual(-1);
	});
	it('should return -1 for empty string', () => {
		const result = Note.nameToNoteIndex('');
		expect(result).toEqual(-1);
	});
	it('should return -1 for undefined', () => {
		const result = Note.nameToNoteIndex(undefined as unknown as string);
		expect(result).toEqual(-1);
	});
});

describe('Note.systemNameAddAccidentals', () => {
	it('should add accidental to root notes', () => {
		const note = 'c';
		const signs = ['bb', 'b', '', '#', 'x'];
		const expecedResult = [
			'cbb',
			'cbb',
			'cbb',
			'cb',
			'c',
			'cbb',
			'cbb',
			'cb',
			'c',
			'c#',
			'cbb',
			'cb',
			'c',
			'c#',
			'cx',
			'cb',
			'c',
			'c#',
			'cx',
			'cx',
			'c',
			'c#',
			'cx',
			'cx',
			'cx',
		];
		const result: string[] = [];
		signs.forEach((sign) => {
			result.push(Note.systemNameAddAccidentals(note + sign, signs[0]));
			result.push(Note.systemNameAddAccidentals(note + sign, signs[1]));
			result.push(Note.systemNameAddAccidentals(note + sign, signs[2]));
			result.push(Note.systemNameAddAccidentals(note + sign, signs[3]));
			result.push(Note.systemNameAddAccidentals(note + sign, signs[4]));
		});

		expect(result).toStrictEqual(expecedResult);
	});
	it('should throw on invalid input', () => {
		const input = 'h';
		const sign = 'd';

		const resultFn = () => Note.systemNameAddAccidentals(input, '#');
		const resultFn2 = () => Note.systemNameAddAccidentals('c', sign);
		const resultFn3 = () => Note.systemNameAddAccidentals(input, sign);

		expect(resultFn).toThrowError(/invalid/);
		expect(resultFn2).toThrowError(/invalid/);
		expect(resultFn3).toThrowError(/invalid/);
	});
});

describe('Note.setMidiNumberFromName', () => {
	it('should set correct number', () => {
		const name = 'c';
		const note = new Note('q', name, undefined, 5);
		note['setMidiNumberFromName']();
		expect(note.midiNumber).toBe(60);
	});
	it('should set correct number on cbb, cb, b# and bx', () => {
		const names = ['cbb', 'cb', 'b#', 'bx'];
		const expecedResult = [58, 59, 72, 73];
		const result: (number | undefined)[] = [];
		names.forEach((name) => {
			const note = new Note('q', Note.nameToNatural(name), Note.nameToAccidental(name), 5);
			note['setMidiNumberFromName']();
			result.push(note.midiNumber);
		});
		expect(result).toEqual(expecedResult);
	});
});

describe('Note.addChordNote', () => {
	it('should add first chord note', () => {
		const noteObj: NoteObject = {
			chord: [
				{
					type: 'q',
					root: 'e',
					octave: 5,
					midiNumber: 64,
					staffIndex: 0,
				},
			],
		};
		const note = new Note('q', 'c', undefined, 5);
		const chordNote = new Note('q', 'e', undefined, 5);
		note.addChordNote(chordNote);

		expect(note).toMatchObject(noteObj);
	});
	it('should change/remove invalid data from chord note', () => {
		const noteObj: NoteObject = {
			chord: [
				{
					type: 'q',
					root: 'e',
					octave: 5,
					midiNumber: 64,
					staffIndex: 0,
					chordSymbols: undefined,
				},
			],
		};
		const note = new Note('q', 'c', undefined, 5);
		const chordNote = new Note('h', 'e', undefined, 5, 1);
		chordNote.addChordNote(new Note('h', 'g'));
		chordNote.setChordSymbol(new ChordSymbol('C'));
		note.addChordNote(chordNote);

		expect(note).toMatchObject(noteObj);
	});
});

describe('Note.addNotaion', () => {
	it('should add notation', () => {
		const noteObj: NoteObject = {
			notations: [
				{
					type: 'text',
					text: 'test',
				},
			],
		};
		const note = new Note('q', 'c', undefined, 5);
		note.addNotation({ type: 'text', text: 'test' } as unknown as Notation);

		expect(note).toMatchObject(noteObj);
	});
	it('should throw on undefined input', () => {
		const note = new Note('q', 'c');
		const func = () => note.addNotation(undefined as unknown as Notation);
		expect(func).toThrow();
	});
});

describe('Note.hasTie', () => {
	it('should return true if note has tie (of any type)', () => {
		const note = new Note('q', 'c');
		note.tie = 'continue';
		expect(note.hasTie()).toBe(true);
	});
	it('should return false if tie is undefined', () => {
		const note = new Note('q', 'c');
		expect(note.hasTie()).toBe(false);
	});
	it('should return false if tie is of type end and ignoreEnd is true', () => {
		const note = new Note('q', 'c');
		note.tie = 'end';
		expect(note.hasTie(true)).toBe(false);
	});
});

describe('Note.validateName', () => {
	it('should return true for natural note', () => {
		const note = 'c';
		const result = Note.validateName(note);
		expect(result).toBe(true);
	});
	it('should return true for note with b accidental', () => {
		const note = 'eb';
		const result = Note.validateName(note);
		expect(result).toBe(true);
	});
	it('should return true for note with # accidental', () => {
		const note = 'c#';
		const result = Note.validateName(note);
		expect(result).toBe(true);
	});
	it('should return true for note with double sharp accidental', () => {
		const note = 'cx';
		const result = Note.validateName(note);
		expect(result).toBe(true);
	});
	it('should return true for note with double flat accidental', () => {
		const note = 'ebb';
		const result = Note.validateName(note);
		expect(result).toBe(true);
	});
	it('should return false for note with double sharp accidental when allowDoubleAccidentals is false', () => {
		const note = 'cx';
		const result = Note.validateName(note, false);
		expect(result).toBe(false);
	});
	it('should return false for note with double flat accidental when allowDoubleAccidentals is false', () => {
		const note = 'ebb';
		const result = Note.validateName(note, false);
		expect(result).toBe(false);
	});
	it('should return false for empty string', () => {
		const note = '';
		const result = Note.validateName(note);
		expect(result).toBe(false);
	});
	it('should return false for undefined input', () => {
		const note = undefined as unknown as string;
		const result = Note.validateName(note);
		expect(result).toBe(false);
	});
});

describe('Note.nameToNatural', () => {
	it('should return root', () => {
		const note = 'c#';
		const result = Note.nameToNatural(note);
		expect(result).toBe(note[0]);
	});
	it('should throw on empty input string', () => {
		const note = '';
		const func = () => Note.nameToNatural(note);
		expect(func).toThrow();
	});
	it('should throw on undefined input', () => {
		const note = undefined as unknown as string;
		const func = () => Note.nameToNatural(note);
		expect(func).toThrow();
	});
});

describe('Note.nameToAccidental', () => {
	it('should return single accidental', () => {
		const note = 'c#';
		const result = Note.nameToAccidental(note);
		expect(result).toBe(note[1]);
	});
	it('should return double character accidental bb', () => {
		const note = 'cbb';
		const result = Note.nameToAccidental(note);
		expect(result).toBe(note.slice(1));
	});
	it('should return undefined on missing accidental', () => {
		const note = 'c';
		const result = Note.nameToAccidental(note);
		expect(result).toBeUndefined();
	});
});

describe('Note.nameToNoteIndex', () => {
	it('should return correct note index for c', () => {
		const note = 'c';
		const result = Note.nameToNoteIndex(note);
		expect(result).toBe(0);
	});
	it('should return correct note index for c#', () => {
		const note = 'c#';
		const result = Note.nameToNoteIndex(note);
		expect(result).toBe(1);
	});
	it('should return correct note index for b#', () => {
		const note = 'b#';
		const result = Note.nameToNoteIndex(note);
		expect(result).toBe(0);
	});
	it('should return -1 for invalid note', () => {
		const note = 'x';
		const result = Note.nameToNoteIndex(note);
		expect(result).toBe(-1);
	});
	it('should return -1 for undefined input', () => {
		const note = undefined as unknown as string;
		const result = Note.nameToNoteIndex(note);
		expect(result).toBe(-1);
	});
});

describe('Note.getNumberParts', () => {
	it('should return only note number if no accidental', () => {
		const note = '1';
		const result = Note.getNumberParts(note);
		expect(result).toEqual({ number: 1 });
	});
	it('should return correct number parts for b3', () => {
		const note = 'b3';
		const result = Note.getNumberParts(note);
		expect(result).toEqual({ number: 3, accidental: 'b' });
	});
	it('should return correct number parts for #5', () => {
		const note = '#5';
		const result = Note.getNumberParts(note);
		expect(result).toEqual({ number: 5, accidental: '#' });
	});
	it('should return undefined if empty string', () => {
		const note = '';
		const result = Note.getNumberParts(note);
		expect(result).toBeUndefined();
	});
	it('should return undefined if undefined input', () => {
		const note = undefined as unknown as string;
		const result = Note.getNumberParts(note);
		expect(result).toBeUndefined();
	});
	it('should return undefined if invalid input', () => {
		const note = 'x';
		const result = Note.getNumberParts(note);
		expect(result).toBeUndefined();
	});
});

describe('Note.noteNumberToNoteIndex', () => {
	it('should return correct note index for 1', () => {
		const note = '1';
		const result = Note.noteNumberToNoteIndex(note);
		expect(result).toBe(0);
	});
	it('should return correct note index for b3', () => {
		const note = 'b3';
		const result = Note.noteNumberToNoteIndex(note);
		expect(result).toBe(3);
	});
	it('should return -1 for invalid input', () => {
		const note = 'x';
		const result = Note.noteNumberToNoteIndex(note);
		expect(result).toBe(-1);
	});
});

describe('noteNumberToNameInScale()', () => {
	it('should return correct value for 1 in c scale', () => {
		const result = Note.noteNumberToNameInScale('c', '1');
		expect(result).toBe('c');
	});
	it('should return correct value for 2 in c scale', () => {
		const result = Note.noteNumberToNameInScale('c', '2');
		expect(result).toBe('d');
	});
	it('should return correct value for b3 in e scale', () => {
		const result = Note.noteNumberToNameInScale('e', 'b3');
		expect(result).toBe('g');
	});
});

describe('Note.noteIndexToNameInScale', () => {
	it('should return correct note name for 0 in c', () => {
		const scaleRoot = 'c';
		const noteNumber = 0;
		const result = Note.noteIndexToNameInScale(scaleRoot, noteNumber);
		expect(result).toBe('c');
	});
	it('should return correct note name for 3 in eb', () => {
		const scaleRoot = 'eb';
		const noteNumber = 3;
		const result = Note.noteIndexToNameInScale(scaleRoot, noteNumber);
		expect(result).toBe('gb');
	});
	it('should return undefined for invalid note index', () => {
		const scaleRoot = 'c';
		const noteNumber = 12;
		const result = Note.noteIndexToNameInScale(scaleRoot, noteNumber);
		expect(result).toBeUndefined();
	});
	it('should return undefined for invalid scale root', () => {
		const scaleRoot = 'x';
		const noteNumber = 0;
		const result = Note.noteIndexToNameInScale(scaleRoot, noteNumber);
		expect(result).toBeUndefined();
	});
});

describe('Note.setPrintedAccidental', () => {
	it('Should update midinumber when accidental is changed', () => {
		const noteObj = { _midiNumber: 61 };
		const note = new Note('w', 'c', undefined, 5);
		note.setPrintedAccidental('#');
		expect(note).toMatchObject(noteObj);
	});
});

describe('Note.toggleNote', () => {
	it('Should make note invisible if whenLastIsRemoved = invisible', () => {
		const expectedResult = {
			invisible: true,
		};
		const note = new Note('w', 'c');
		const clickedNote = new Note('w', 'c');
		note.toggleNote(clickedNote, 'invisible');
		expect(note).toMatchObject(expectedResult);
	});
	it('Should make invisible not visible', () => {
		const expectedResult = {
			invisible: false,
		};
		const note = new Note('w', 'c');
		const clickedNote = new Note('w', 'c');
		note.invisible = true;
		note.toggleNote(clickedNote);
		expect(note).toMatchObject(expectedResult);
	});
});
