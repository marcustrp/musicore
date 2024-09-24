import Fraction from 'fraction.js';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import * as Notations from '../../../core/data/notations';
import { Note } from '../../../core/note';
import { Scale } from '../../../core/scale';
import { NoteGenerator } from './note';
import RomanNumeralAnalysis from '../../../core/romanNumeralAnalysis';
import FunctionAnalysis from '../../../core/functionAnalysis';

let generator: NoteGenerator;
let warnings: string[];
let addWarning = (message: string) => {
	warnings.push(message);
};
let throwError = (message: string) => {
	throw new Error(message);
};

const checkWarning = (warnings: string[]) => {
	if (warnings.length > 0) console.log(warnings);
	expect(warnings.length).toBe(0);
};

beforeEach(() => {
	warnings = [];
	generator = new NoteGenerator(addWarning, throwError);
});

describe('getNoteDecorations()', () => {
	describe('should return correct decoration for all possible values without duration', () => {
		const data: { notation: Notations.Notation; decoration: string }[] = [
			{ notation: new Notations.Fermata(), decoration: '!fermata!' },
			{ notation: new Notations.Dynamic('f'), decoration: '!f!' }, // a single dynamic is sufficient
			{ notation: new Notations.Trill(), decoration: '!trill!' },
			{ notation: new Notations.Mordent(), decoration: '!mordent!' },
			{ notation: new Notations.Mordent(true), decoration: '!uppermordent!' },
			{ notation: new Notations.Roll(), decoration: '!roll!' },
			{ notation: new Notations.Turn(), decoration: '!turn!' },
			{ notation: new Notations.Turn(true), decoration: '!invertedturn!' },
			{ notation: new Notations.Turn(undefined, true), decoration: '!turnx!' },
			{ notation: new Notations.Turn(true, true), decoration: '!invertedturnx!' },
			{ notation: new Notations.Arpeggio(), decoration: '!arpeggio!' },
			{ notation: new Notations.Articulation('accent'), decoration: '!>!' },
			{ notation: new Notations.Articulation('marcato'), decoration: '!^!' },
			{ notation: new Notations.Articulation('tenuto'), decoration: '!tenuto!' },
			{ notation: new Notations.Articulation('staccatissimo'), decoration: '!wedge!' },
			{ notation: new Notations.Fingering(1), decoration: '!1!' },
			{ notation: new Notations.Pizzicato(), decoration: '!+!' },
			{ notation: new Notations.Pizzicato('snap'), decoration: '!snap!' },
			{ notation: new Notations.Scoop(), decoration: '!slide!' },
			{ notation: new Notations.Bow('up'), decoration: 'u' },
			{ notation: new Notations.Bow('down'), decoration: 'v' },
			{ notation: new Notations.OpenString(), decoration: '!open!' },
			{ notation: new Notations.Harmonic(), decoration: '!open!' },
			{ notation: new Notations.CelloThumb(), decoration: '!thumb!' },
			{ notation: new Notations.BreathMark(), decoration: '!breath!' },
			// short, medium, longphrase?
		];
		let note: Note;
		beforeEach(() => {
			note = new Note('q', 'c');
		});
		for (let i = 0; i < data.length; i++) {
			const item = data[i];
			it(item.decoration, () => {
				note.addNotation(item.notation);
				const result = generator['getNoteDecorations'](note);
				if (warnings.length) console.log(warnings);
				expect(warnings.length).toBe(0);
				expect(result).toBe(item.decoration);
			});
		}
	});
	//describe('should return correct decoration for all possible values duration', () => {
	// trill, crescendo, diminuendo
	//});
});

describe('getSlurs()', () => {
	it('should return two end slurs', () => {
		const expecedResult = '))';
		const slurs: { type: 'end' | 'start'; index: number }[] = [
			{ type: 'end', index: 1 },
			{ type: 'end', index: 0 },
		];
		const result = generator['getSlurs']('end', slurs);
		expect(result).toBe(expecedResult);
	});
});

describe('getAnalysis()', () => {
	it('should return step analysis', () => {
		const expectedResult = '"^IVm"';
		const note = new Note('q', 'c');
		note.analysis = { romanNumeral: [{ step: 'IVm' } as any as RomanNumeralAnalysis] };
		const result = generator['getAnalysis'](note);
		expect(result).toBe(expectedResult);
	});
	it('should return function analysis', () => {
		const expectedResult = '"_D64"';
		const note = new Note('q', 'c');
		note.analysis = { function: [{ function: 'D64' } as any as FunctionAnalysis] };
		const result = generator['getAnalysis'](note);
		expect(result).toBe(expectedResult);
	});
});

describe('getNoteAccidental()', () => {
	describe('flat scale note', () => {
		let scaleNotes: string[];
		beforeAll(() => {
			const scale = new Scale('ab', 'major');
			scaleNotes = scale.getDiatonicNoteNames();
		});
		it('should return correct accidental for dbb', () => {
			const note = new Note('q', 'd', 'bb', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('__');
		});
		it('should return correct accidental for db', () => {
			const note = new Note('q', 'd', 'b', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('');
		});
		it('should return correct accidental for d', () => {
			const note = new Note('q', 'd', undefined, 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('=');
		});
		it('should return correct accidental for d#', () => {
			const note = new Note('q', 'd', '#', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('^');
		});
		it('should return correct accidental for dx', () => {
			const note = new Note('q', 'd', 'x', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('^^');
		});
	});
	describe('natural scale note', () => {
		let scaleNotes: string[];
		beforeAll(() => {
			const scale = new Scale('d', 'major');
			scaleNotes = scale.getDiatonicNoteNames();
		});
		it('should return correct accidental for dbb', () => {
			const note = new Note('q', 'd', 'bb', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('__');
		});
		it('should return correct accidental for db', () => {
			const note = new Note('q', 'd', 'b', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('_');
		});
		it('should return correct accidental for d', () => {
			const note = new Note('q', 'd', undefined, 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('');
		});
		it('should return correct accidental for d#', () => {
			const note = new Note('q', 'd', '#', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('^');
		});
		it('should return correct accidental for dx', () => {
			const note = new Note('q', 'd', 'x', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('^^');
		});
	});
	describe('sharp scale note', () => {
		let scaleNotes: string[];
		beforeAll(() => {
			const scale = new Scale('e', 'major');
			scaleNotes = scale.getDiatonicNoteNames();
		});
		it('should return correct accidental for dbb', () => {
			const note = new Note('q', 'd', 'bb', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('__');
		});
		it('should return correct accidental for db', () => {
			const note = new Note('q', 'd', 'b', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('_');
		});
		it('should return correct accidental for d', () => {
			const note = new Note('q', 'd', undefined, 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('=');
		});
		it('should return correct accidental for d#', () => {
			const note = new Note('q', 'd', '#', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('');
		});
		it('should return correct accidental for dx', () => {
			const note = new Note('q', 'd', 'x', 5);
			const result = generator['getNoteAccidental'](note, scaleNotes);
			expect(result).toBe('^^');
		});
	});
});

describe('getNoteNameAndOctave', () => {
	it('should return correct value of octave 3', () => {
		const note = new Note('q', 'c', undefined, 3);
		const result = generator['getNoteNameAndOctave'](note);
		expect(result).toBe('C,,');
	});
	it('should return correct value of octave 4', () => {
		const note = new Note('q', 'c', undefined, 4);
		const result = generator['getNoteNameAndOctave'](note);
		expect(result).toBe('C,');
	});
	it('should return correct value of octave 5', () => {
		const note = new Note('q', 'c', undefined, 5);
		const result = generator['getNoteNameAndOctave'](note);
		expect(result).toBe('C');
	});
	it('should return correct value of octave 6', () => {
		const note = new Note('q', 'c', undefined, 6);
		const result = generator['getNoteNameAndOctave'](note);
		expect(result).toBe('c');
	});
	it('should return correct value of octave 7', () => {
		const note = new Note('q', 'c', undefined, 7);
		const result = generator['getNoteNameAndOctave'](note);
		expect(result).toBe("c'");
	});
	it('should return correct value for b#', () => {
		const note = new Note('q', 'b', '#', 5);
		const result = generator['getNoteNameAndOctave'](note);
		expect(result).toBe('B');
	});
	it('should return chord', () => {
		const note = new Note('w', 'c');
		note.addChordNote(new Note('w', 'e'));
		note.addChordNote(new Note('w', 'g'));
		const result = generator['getNoteNameAndOctave'](note);
		expect(warnings.length).toBe(0);
		expect(result).toBe('[CEG]');
	});
});

describe('getNoteLength()', () => {
	it('should return empty string when note length equal to default length', () => {
		const note = new Note('q', 'c', undefined, 5);
		const result = generator['getNoteLength'](note, new Fraction(1, 4));
		expect(result).toBe('');
	});
	it('should return correct length for 8', () => {
		const note = new Note('8', 'c', undefined, 5);
		const result = generator['getNoteLength'](note, new Fraction(1, 4));
		expect(result).toBe('/2');
	});
	it('should return correct length for 8.', () => {
		const note = new Note('8', 'c', undefined, 5, 1);
		const result = generator['getNoteLength'](note, new Fraction(1, 4));
		expect(result).toBe('3/4');
	});
	it('should return correct length for h', () => {
		const note = new Note('h', 'c', undefined, 5);
		const result = generator['getNoteLength'](note, new Fraction(1, 4));
		expect(result).toBe('2');
	});
	it('should return correct length for q..', () => {
		const note = new Note('q', 'c', undefined, 5, 2);
		const result = generator['getNoteLength'](note, new Fraction(1, 4));
		expect(result).toBe('7/4');
	});
});
