import Fraction from 'fraction.js';
import { Bar, BarlineStyle } from '../core/bar.js';
import { TimeSignature } from '../core/timeSignature.js';
import { Key } from '../core/key.js';
import { RhythmElement } from '../core/rhythmElement.js';
import { Direction } from '../core/data/directions.js';
import { Note } from '../core/note.js';
import { Rest } from '../core/rest.js';

export type AddNoteOptions = {
	/**
	 * How to handle overflow
	 * @default 'split'
	 * Split: split note over multiple bars, with ties
	 * Ignore: add note to selected bar, even if it overflows
	 * nextBar: add note to next bar
	 */
	overflow?: 'split' | 'ignore' | 'nextBar';
	/**
	 * @todo Implement
	 */
	//mode: 'insert' | 'overwrite';
};

export class BarArray {
	public bars: Bar[];
	public duration = new Fraction(0);

	public get last() {
		return this.bars[this.bars.length - 1];
	}

	constructor(timeSignature: TimeSignature, key: Key) {
		this.bars = [new Bar(timeSignature, key, true)];
		this.duration = new Fraction(timeSignature.duration);
	}

	appendBar(timeSignature?: TimeSignature, key?: Key, showKeySign = false) {
		if (!timeSignature) timeSignature = this.bars[this.bars.length - 1].timeSignature;
		if (!key)
			key = this.bars.length > 0 ? this.bars[this.bars.length - 1].key : new Key('c', 'major');
		this.bars.push(new Bar(timeSignature, key, showKeySign, new Fraction(this.duration)));
		this.duration = this.duration.add(new Fraction(timeSignature!.duration));
	}

	/**
	 * Sets the key of all bars from indexFrom to indexTo. If indexTo is undefined,
	 * sets the key of all bars from indexFrom to last bar. If bar prior to indexFrom has
	 * different key, showKeySign is set to true for indexFrom. If bar after indexTo
	 * has different key, showKeySign is set to true for that bar.
	 * @param key
	 * @param indexFrom
	 * @param indexTo
	 */
	setKey(key: Key, indexFrom: number = 0, indexTo?: number) {
		if (indexFrom < 0) indexFrom = 0;
		if (indexTo === undefined || indexTo >= this.bars.length) indexTo = this.bars.length - 1;
		// change first bar and show key sign if previous bar has different key
		this.bars[indexFrom].setKey(key, {
			showKeySign: indexFrom > 0 && Key.compare(key, this.bars[indexFrom - 1].key) ? false : true,
		});
		// change all bars from indexFrom + 1 to indexTo
		let curIndex = indexFrom;
		while (++curIndex <= indexTo) {
			this.bars[curIndex].setKey(key, { showKeySign: false });
		}
		// show key sign for bar after indexTo if it has different key
		if (++indexTo <= this.bars.length - 1 && !Key.compare(key, this.bars[indexTo].key))
			this.bars[indexTo].showKeySign = true;
	}

	/**
	 *
	 * @param partId
	 * @param voiceId
	 * @param note
	 * @param bar - if undefined, add note after the voice's last note
	 * @param beat - if undefined, add note after the voice's last note in the selected bar
	 * @param options
	 * @todo Add support for insert note, currently only append
	 */
	addNote(
		partId: string,
		voiceId: string,
		note: Note | Rest,
		bar?: number,
		beat?: Fraction,
		options?: AddNoteOptions,
	) {
		if (bar !== undefined || beat !== undefined) throw new Error('Not implemented');

		if (
			options &&
			(options.overflow === 'ignore' ||
				this.last.duration
					.sub(this.last.getVoiceDuration(partId, voiceId))
					.compare(note.getDuration()) >= 0)
		) {
			this.last.addNote(partId, voiceId, note);
		} else if (options && options.overflow === 'nextBar') {
			this.appendBar();
			this.last.addNote(partId, voiceId, note, { overflow: 'ignore' });
		} else {
			// overflow === 'split'
			// add new bar if current bar is full
			if (this.last.duration.compare(this.last.getVoiceDuration(partId, voiceId)) <= 0)
				this.appendBar();
			// add note to current bar. If note is longer than what's left in the bar, remaining note(s) are returned, with
			// ties added (unless note is rest)
			const notesLeft = this.last.addNote(partId, voiceId, note, { overflow: 'split' });
			if (notesLeft && notesLeft.length > 0) {
				// recursively add remaining notes
				notesLeft.forEach((newNote) => {
					this.addNote(partId, voiceId, newNote, bar, beat, options);
				});
			}
			/*
      let curBar = this.last;
      let insertDurationLeft = note.getDuration();
      let duration = curBar.duration.sub(this.getBarNotesDuration(partId, voiceId, curBar));
      while (duration.compare(insertDurationLeft) < 0) {
        this.appendBar();
        curBar = this.last;
        insertDurationLeft = insertDurationLeft.sub(curBar.duration);
        duration = curBar.duration;
      }
      this.last.addNote(partId, voiceId, note);
      */
		}
	}

	/**
	 *
	 * @param partId
	 * @param voiceId
	 * @param note
	 * @param bar
	 * @param beat
	 * @param ignoreOverflow
	 * @todo support insert notes, currently only append
	 */
	addNotes(
		partId: string,
		voiceId: string,
		notes: (Note | Rest)[],
		bar?: number,
		beat?: Fraction,
		ignoreOverflow = false,
	) {
		if (bar !== undefined || beat !== undefined) throw new Error('Not implemented');
		notes.forEach((note) =>
			this.addNote(partId, voiceId, note, bar, beat, {
				overflow: ignoreOverflow ? 'ignore' : 'split',
			}),
		);
	}

	addLineBreak(barIndex?: number) {
		if (barIndex === undefined) barIndex = this.bars.length - 1;
		this.bars[barIndex].lineBreak = true;
	}

	getBarNotesDuration(partId: string, voiceId: string, bar: Bar) {
		if (!bar) throw new Error('Bar is undefined');
		return bar.getVoiceDuration(partId, voiceId);
	}

	getNote(partId: string, voiceId: string, barIndex?: number, noteIndex?: number) {
		if (!partId || !voiceId) throw new Error('Voice not found');
		if (barIndex === undefined) barIndex = this.getLastBarWithVoice(partId, voiceId);
		if (barIndex === undefined || barIndex < 0 || barIndex >= this.bars.length)
			throw new Error('Bar index out of range');
		if (noteIndex === undefined) return this.getLastNoteInBar(barIndex, partId, voiceId);
		if (noteIndex === undefined) throw new Error('Note does not exist');
		if (
			!(partId in this.bars[barIndex].notes && voiceId in this.bars[barIndex].notes[partId]) ||
			noteIndex >= this.bars[barIndex].notes[partId][voiceId].length
		)
			throw new Error('Note index out of range');
		return this.bars[barIndex].notes[partId][voiceId][noteIndex];
	}

	getNoteByIndex(partId: string, voiceId: string, noteIndex: number) {
		if (!partId || !voiceId) throw new Error('Voice not found');
		let index = 0;
		let barIndex = 0;
		do {
			if (partId in this.bars[barIndex].notes && voiceId in this.bars[barIndex].notes[partId]) {
				const notes = this.bars[barIndex].notes[partId][voiceId];
				if (index + notes.length > noteIndex) {
					return notes[noteIndex - index];
				}
				index += notes.length;
			}
			barIndex++;
		} while (barIndex < this.bars.length);
	}

	getNoteById(partId: string, voiceId: string, noteId: string) {
		if (!partId || !voiceId) throw new Error('Voice not found');
		for (let barIndex = 0; barIndex < this.bars.length; barIndex++) {
			if (partId in this.bars[barIndex].notes && voiceId in this.bars[barIndex].notes[partId]) {
				const note = this.bars[barIndex].notes[partId][voiceId].find((note) => note.id === noteId);
				if (note) return note;
			}
		}
		return undefined;
	}

	getNextNote(partId: string, voiceId: string, barIndex: number, noteIndex: number) {
		let nextNote: RhythmElement | undefined = undefined;
		if (noteIndex + 1 < this.bars[barIndex].notes[partId][voiceId].length) {
			nextNote = this.bars[barIndex].notes[partId][voiceId][noteIndex + 1];
		} else if (
			barIndex + 1 < this.bars.length &&
			voiceId in this.bars[barIndex + 1].notes &&
			this.bars[barIndex].notes[partId][voiceId].length > 0
		) {
			nextNote = this.bars[barIndex + 1].notes[partId][voiceId][0];
		}
		return nextNote;
	}

	getNotes(partId: string, voiceId: string, barIndex?: number) {
		/** @todo Improve get notes of specific bar */

		if (!partId || !voiceId) throw new Error('Voice not found');
		if (barIndex === undefined) {
			//return voice.notes;
			const notes: RhythmElement[] = [];
			this.bars.forEach((bar) => {
				if (partId in bar.notes && voiceId in bar.notes[partId])
					bar.notes[partId][voiceId].forEach((note) => notes.push(note));
			});
			return notes;
		} else {
			if (!(partId in this.bars[barIndex].notes && voiceId in this.bars[barIndex].notes[partId]))
				return [];
			return this.bars[barIndex].notes[partId][voiceId];
		}
	}

	private getLastBarWithVoice(partId: string, voiceId: string) {
		for (let i = this.bars.length - 1; i >= 0; i--) {
			if (partId in this.bars[i].notes) {
				if (voiceId in this.bars[i].notes[partId]) return i;
			}
		}
		return undefined;
	}

	private getLastNoteInBar(barIndex: number, partId: string, voiceId: string) {
		if (barIndex < 0 || barIndex >= this.bars.length) throw new Error('Bar index out of range');
		if (!(partId in this.bars[barIndex].notes && voiceId in this.bars[barIndex].notes[partId]))
			return undefined;
		return this.bars[barIndex].notes[partId][voiceId][
			this.bars[barIndex].notes[partId][voiceId].length - 1
		];
	}

	/**
	 * Converts first bar to pickup bar. Leave duration empty to use longest note
	 * duration of first bar in all parts and voices.
	 *
	 * If duration is specified, bars may currently be left in overflowed state.
	 * This behavior will probably be changed
	 */
	convertToPickup(duration?: Fraction) {
		console.log('convertToPickup', this.duration, duration, this.bars[0].duration);
		const durChange = this.bars[0].setPickup(duration);
		console.log('durChange', durChange, this.duration, this.duration.sub(durChange));
		this.duration = this.duration.sub(durChange);
	}
	/**
	 * @param barIndex If undefined, last bar is selected
	 */
	setBarline(barline: BarlineStyle, barIndex?: number) {
		if (barIndex === undefined) barIndex = this.bars.length - 1;
		this.bars[barIndex].barline = barline;
	}

	/**
	 * @param barIndex If undefined, last bar is selected
	 */
	setRepeatStart(repeat: number | string, barIndex?: number) {
		if (barIndex === undefined) barIndex = this.bars.length - 1;
		this.bars[barIndex].startRepeat = repeat;
	}

	/**
	 * @param barIndex If undefined, last bar is selected
	 */
	setRepeatEnd(repeat: number | string, barIndex?: number) {
		if (barIndex === undefined) barIndex = this.bars.length - 1;
		this.bars[barIndex].endRepeat = repeat;
	}

	/**
	 * @param barIndex If undefined, last bar is selected
	 */
	setEnding(number: number | string, barIndex?: number) {
		if (barIndex === undefined) barIndex = this.bars.length - 1;
		this.bars[barIndex].ending = {
			start: true,
			number: number,
		};
	}
	/**
	 * @param barIndex If undefined, last bar is selected
	 */
	addDirection(item: Direction, barIndex?: number) {
		if (barIndex === undefined) barIndex = this.bars.length - 1;
		if (barIndex < 0 || barIndex >= this.bars.length) throw new Error('BarIndex out of bounds');
		this.bars[barIndex].addDirection(item);
	}

	setTempo(value: string, barIndex = 0, position?: Fraction) {
		if (barIndex >= this.bars.length) throw new Error('Bar index out of bounds');
		this.bars[barIndex].addTempo(value, position);
	}

	updatePrintedAccidentals() {
		this.bars.forEach((bar) => bar.updatePrintedAccidentals());
	}
}
