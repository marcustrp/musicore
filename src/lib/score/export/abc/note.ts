import Fraction from 'fraction.js';
import * as Notations from '../../../core/data/notations.js';
import { TimeSignature } from '../../../core/timeSignature.js';
import { Note } from '../../../core/note.js';
import { Rest } from '../../../core/rest.js';
import { RhythmElement } from '../../../core/rhythmElement.js';
import { type ReportFunction } from '../abc.js';

export class NoteGenerator {
	constructor(
		private addWarning: ReportFunction,
		private addError: ReportFunction,
	) {}

	getNote(note: Note, scaleNotes: string[], timeSignature: TimeSignature) {
		let abc = this.getNoteBeam(note);

		if (note.slurs) abc += this.getSlurs('start', note.slurs);
		abc += this.getTriplet(note, timeSignature);
		abc += this.getNoteDecorations(note);
		abc += this.getChordSymbols(note);
		abc += this.getAnalysis(note);
		abc += this.getNoteAccidental(note, scaleNotes);
		abc += this.getNoteNameAndOctave(note);
		abc += this.getNoteLength(note, new Fraction(1, 4));
		if (note.tie === 'start') abc += '-';
		if (note.slurs) abc += this.getSlurs('end', note.slurs);
		if (note.size && note.size !== 'normal') console.warn('Note size not supported in ABC');
		return abc;
	}

	getRest(rest: Rest) {
		let abc = 'z';
		abc += this.getChordSymbols(rest);
		abc += this.getNoteLength(rest, new Fraction(1, 4));
		return abc;
	}

	/**
	 * Returns slurs of specified type, if any
	 * @param type which type of slur to get
	 * @param slurs array of slurs (may contain multiple instances of the same type). Can also be empty
	 * @returns
	 */
	private getSlurs(type: 'start' | 'end', slurs: { type: 'start' | 'end'; index?: number }[]) {
		let abc = '';
		if (slurs && slurs.length > 0) {
			slurs.forEach(
				(slur) =>
					(abc +=
						slur.type === type ?
							type === 'start' ?
								'('
							:	')'
						:	''),
			);
		}
		return abc;
	}

	/**
	 * Returns a triplet in ABC notation if the note is the start of a triplet
	 * @param note
	 * @param timeSignature
	 * @returns
	 */
	private getTriplet(note: Note, timeSignature: TimeSignature) {
		if (!note.triplet) return '';
		let abc = '';
		// Triplets in ABC only need to be specified at the start of the triplet
		if (note.triplet.start) {
			// Start of ABC triplet notation (might be left as is if it is a default triplet)
			abc += '(' + note.triplet.numerator;

			const defaultDenomintor = this.getTripletDefaultDenominator(
				note.triplet.numerator,
				timeSignature,
			);
			if (
				note.triplet.noteCount !== note.triplet.numerator &&
				!(note.triplet.denominator && note.triplet.denominator !== defaultDenomintor)
			) {
				// Note count is different from numerator, but denominator is the default value and is therefor omitted
				abc += '::' + note.triplet.noteCount;
			} else if (
				note.triplet.noteCount !== note.triplet.numerator &&
				note.triplet.denominator &&
				note.triplet.denominator !== defaultDenomintor
			) {
				// Both denominator and note count are different from default values
				abc += ':' + note.triplet.denominator + ':' + note.triplet.noteCount;
			} else if (note.triplet.denominator && note.triplet.denominator !== defaultDenomintor) {
				// Only denominator is different from default value
				abc += ':' + note.triplet.denominator;
			}
		}
		return abc;
	}

	/**
	 * Get the default denominator for a triplet in the given timeSignature
	 * @param numerator
	 * @param timeSignature
	 * @returns
	 *
	 * @todo This is used in multiple places. Move to a more generic place
	 */
	private getTripletDefaultDenominator(numerator: number, timeSignature: TimeSignature) {
		switch (numerator) {
			case 2:
			case 4:
			case 8:
				return 3;
			case 3:
			case 6:
				return 2;
			default:
				if (timeSignature.unit === 8) {
					return 3;
				} else {
					return 2;
				}
		}
	}

	/**
	 * Handles whether the note should be beamed. If note is beamed, and is not the first note in the beam group,
	 * a space is added before the note
	 * @param note
	 * @returns
	 */
	private getNoteBeam(note: Note) {
		// As the space is prefixed to the note string, it is only added if the note is beamed and is not the first note in the beam group
		return !note.beam || note.beam.value === 'start' ? ' ' : '';
	}

	private getNoteDecorations(note: Note) {
		let decorations = '';
		if (!note.notations) return '';
		note.notations.forEach((notation) => {
			if (notation instanceof Notations.Fermata) {
				decorations += `!${notation.inverted ? 'inverted' : ''}fermata!`;
			} else if (notation instanceof Notations.Dynamic) {
				decorations += `!${notation.text}!`;
			} else if (notation instanceof Notations.Mordent) {
				decorations += `!${notation.inverted ? 'upper' : ''}mordent!`;
			} else if (notation instanceof Notations.Roll) {
				decorations += '!roll!';
			} else if (notation instanceof Notations.Turn) {
				decorations += `!${notation.inverted ? 'inverted' : ''}turn${notation.line ? 'x' : ''}!`;
			} else if (notation instanceof Notations.Arpeggio) {
				decorations += '!arpeggio!';
			} else if (notation instanceof Notations.Articulation) {
				decorations += this.getNoteArticulation(notation);
			} else if (notation instanceof Notations.Fingering) {
				decorations += `!${notation.finger}!`;
			} else if (notation instanceof Notations.Pizzicato) {
				if (notation.type === 'snap') {
					decorations += '!snap!';
				} else {
					decorations += '!+!';
				}
			} else if (notation instanceof Notations.Bow) {
				decorations += notation.type === 'down' ? 'v' : 'u';
			} else if (notation instanceof Notations.Scoop) {
				decorations += '!slide!';
			} else if (
				notation instanceof Notations.Harmonic ||
				notation instanceof Notations.OpenString
			) {
				decorations += '!open!';
			} else if (notation instanceof Notations.CelloThumb) {
				decorations += '!thumb!';
			} else if (notation instanceof Notations.BreathMark) {
				decorations += '!breath!';
			} else if (notation instanceof Notations.Trill) {
				if (notation.duration) {
					this.addWarning('Trill decoration with duration not supported');
				} else {
					decorations += '!trill!';
				}
			} else {
				this.addWarning(`Unsupported decoration ${notation.constructor.name}`);
			}
		});
		if (note.printedAccidental) {
			if (note.printedAccidental.editorial) decorations += 'editorial';
			if (note.printedAccidental.parentheses) decorations += 'courtesy';
		}
		return decorations;
	}

	private getChordSymbols(note: Note | Rest) {
		let abc = '';
		const chordSymbols = note.chordSymbols;
		if (chordSymbols) {
			if (chordSymbols.length === 1) {
				abc += `"${chordSymbols[0].text}"`;
			} else {
				this.addWarning('Multiple chord symbols not supported');
			}
		}
		return abc;
	}

	/**
	 * Returns step and/or function analysis for a note
	 * @param note
	 * @returns
	 */
	private getAnalysis(note: Note) {
		let abc = '';
		if (note.analysis) {
			if (note.analysis.romanNumeral) {
				if (note.analysis.romanNumeral.length > 1)
					throw new Error('Multiple roman numerals not supported');
				abc += `"^${note.analysis.romanNumeral[0].step}"`;
			}
			if (note.analysis.function) {
				if (note.analysis.function.length > 1)
					throw new Error('Multiple roman numerals not supported');
				abc += `"_${note.analysis.function[0].function}"`;
			}
		}
		return abc;
	}

	private getNoteAccidental(note: Note, scaleNotes: string[]) {
		if (scaleNotes.includes(note.name)) return '';
		if (note.name.length === 1) return '=';
		return note.name
			.slice(1)
			.replace('bb', '__')
			.replace('b', '_')
			.replace('#', '^')
			.replace('x', '^^');
	}

	private getNoteArticulation(articulation: Notations.Articulation) {
		switch (articulation.type) {
			case 'accent':
				return '!>!';
			case 'marcato':
				return '!^!';
			case 'staccato':
				return '.';
			case 'staccatissimo':
				return '!wedge!';
			case 'tenuto':
				return '!tenuto!';
			default:
				return '';
		}
	}

	/**
	 * Returns note name and octave. If note is part of a chord, the chord notes are also included.
	 * @param note
	 * @returns
	 */
	private getNoteNameAndOctave(note: Note) {
		if (note.chord && note.chord.length > 0) {
			let notes = '';
			notes += this.getPitchNameAndOctave(note);
			note.chord.forEach((chordNote) => (notes += this.getPitchNameAndOctave(chordNote)));
			return `[${notes}]`;
		} else {
			return this.getPitchNameAndOctave(note);
		}
	}

	private getPitchNameAndOctave(note: Note) {
		if (note.octave <= 5) {
			return note.name.slice(0, 1).toUpperCase() + ','.repeat(5 - note.octave);
		} else {
			return note.name.slice(0, 1).toLowerCase() + "'".repeat(note.octave - 6);
		}
	}

	/**
	 * Get note length relative to default length.
	 * @param note
	 * @param defaultLength as defined in the header field L: of the abc file
	 * @returns ABC length modifier, or empty string if length is equal to default length.
	 */
	private getNoteLength(note: RhythmElement, defaultLength: Fraction) {
		// get note duration, ignoring if it's part of a tuplet, and divide by default length
		const frac = note.getDuration(true).div(defaultLength);
		const abc = (frac.n === 1 ? '' : frac.n) + '/' + (frac.d === 1 ? '' : frac.d);
		// remove trailing slash, if any
		if (abc.charAt(abc.length - 1) === '/') return abc.slice(0, abc.length - 1);
		return abc;
	}
}
