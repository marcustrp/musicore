import Fraction from 'fraction.js';
import { Note } from '../core/note.js';
import { Rest } from '../core/rest.js';
import { RhythmElement } from '../core/rhythmElement.js';
import { BarArray } from './barArray.js';

export class Voice {
	//notes: RhythmElement[] = [];
	//duration = new Fraction(0);

	/**
	 *
	 * @param partId
	 * @param id
	 * @param defaultStaffIndex
	 * @param bars Same BarArray as in the score
	 */
	constructor(
		public readonly partId: string,
		public readonly id: string,
		private bars: BarArray,
	) {}

	/**
	 * Adds a note to the voice
	 * @param note
	 * @param bar
	 * @param beat
	 * @param ignoreOverflow
	 */
	addNote(note: Note | Rest, bar?: number, beat?: Fraction, ignoreOverflow = false) {
		this.bars.addNote(this.partId, this.id, note, bar, beat, {
			overflow: ignoreOverflow ? 'ignore' : 'split',
		});
	}

	/**
	 * Adds multiple notes to the voice
	 * @param notes
	 * @param bar
	 * @param beat
	 * @param ignoreOverflow
	 */
	addNotes(notes: (Note | Rest)[], bar?: number, beat?: Fraction, ignoreOverflow = false) {
		this.bars.addNotes(this.partId, this.id, notes, bar, beat, ignoreOverflow);
	}

	/**
	 * Adds a "triplet" to the voice
	 * @param notes
	 * @param numerator
	 * @param denominator
	 * @param bar
	 * @param beat
	 * @todo rename, it's not just triplets, what's the correct name?
	 * @todo handle invalid input, e.g. numerator > denominator, totalDuration not a "normal" duration
	 */
	addTriplet(
		notes: (Note | Rest)[],
		numerator: number,
		denominator: number,
		bar?: number,
		beat?: Fraction,
	) {
		let totalDuration = RhythmElement.calculateTripletDuration(notes, numerator, denominator);
		notes.forEach((note, index) => {
			note.setTriplet(numerator, denominator, totalDuration, index, notes.length);
			//console.log('setTriplet', note, notes[index]);
		});
		//console.log('addTriplet', notes);
		this.addNotes(notes, bar, beat);
	}

	/*getVoiceDuration(voiceIndex: number) {
    const voice = this.getVoice(partIndex, voiceIndex);
    return new Fraction(voice.duration);
  }*/

	/**
	 *
	 * @param barIndex if undefined, use last bar
	 * @param noteIndex if undefined, get last note in bar
	 * @returns
	 */
	getNote(barIndex?: number, noteIndex?: number) {
		return this.bars.getNote(this.partId, this.id, barIndex, noteIndex);
	}

	/**
	 * Returns a note by its index in the voice
	 * @param noteIndex
	 * @returns
	 */
	getNoteByIndex(noteIndex: number) {
		return this.bars.getNoteByIndex(this.partId, this.id, noteIndex);
	}

	/** TODO: Add tests and docs */
	getNoteById(id: string) {
		return this.bars.getNoteById(this.partId, this.id, id);
	}
	/**
	 * Get next note or returns undefined if no more notes exist
	 * @param barIndex
	 * @param noteIndex
	 */
	getNextNote(barIndex: number, noteIndex: number) {
		return this.bars.getNextNote(this.partId, this.id, barIndex, noteIndex);
	}

	/**
	 *
	 * @param barIndex if undefined, get last bar
	 * @returns
	 */
	getNotes(barIndex?: number) {
		return this.bars.getNotes(this.partId, this.id, barIndex);
	}

	/**
	 *
	 * @param barIndex
	 * @param noteIndex
	 * @returns
	 * @todo handle tie of note that goes over barline into endings, dal segno, coda...
	 * @todo support ties of chord notes
	 * @todo unit tests
	 */
	addTie(barIndex: number, noteIndex: number) {
		const note = this.getNote(barIndex, noteIndex);
		if (!(note instanceof Note)) throw new Error('Tie can only be set on notes');
		if (note.hasTie(true)) return false;
		const nextNote = this.getNextNote(barIndex, noteIndex);
		if (!(nextNote instanceof Note)) return false;

		note.tie = note.tie === 'end' ? 'continue' : 'start';

		(nextNote as Note).tie = (nextNote as Note).tie === 'start' ? 'continue' : 'end';
	}

	/**
	 *
	 * @param barIndex
	 * @param noteIndex
	 * @returns
	 * @todo handle tie of note that goes over barline into endings, dal segno, coda...
	 * @todo support ties of chord notes
	 * @todo unit tests
	 */
	removeTie(barIndex: number, noteIndex: number) {
		const note = this.getNote(barIndex, noteIndex);
		if (!(note instanceof Note)) throw new Error('Tie can only be set on notes');
		if (!note.hasTie(true)) return false;
		const nextNote = this.getNextNote(barIndex, noteIndex);

		delete note.tie;
		if (!(nextNote instanceof Note)) return;

		if (nextNote.tie === 'continue') {
			nextNote.tie = 'start';
		} else {
			delete nextNote.tie;
		}
	}
}
