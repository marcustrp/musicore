import Fraction from 'fraction.js';
import { Rest } from './rest.js';
import { Note } from './note.js';
import { Duration } from './duration.js';

export type TimeSignatureSymbol = 'cut' | 'common'; // | 'none';

export type BeamGrouping = {
	eights?: number[];
	sixteenths?: number[];
	sixteensSubdivisions?: number[];
	thirtyseconds?: number[];
	thirtysecondsSubdivisions?: number[];
};

export class TimeSignature {
	// MEI support 3+3+2 (regex: "\d+(\.\d+)?(\s*\+\s*\d+(\.\d+)?)*")
	//countCompound?: string // ie 3+3+2

	/** The numerator of the timeSignature */
	count: number;
	private symbol?: TimeSignatureSymbol;
	duration: Fraction;
	private _type: 'simple' | 'compound' | 'irregular';
	get type() {
		return this._type;
	}
	private _beatsPerBar: number;
	get beatsPerBar() {
		return this._beatsPerBar;
	}
	// BB p153
	/**
	 * For beaming, @see BB p153
	 * @todo implement new system for beam grouping, with inspiration from Sibelius "4,4" for 4/4 etc
	 */
	//beamGrouping: BeamGrouping;
	/** The duration of each beam group
	 * @example For 4/4, it is an array of four 1/4 fractions
	 * @example For 5/4, it is an array of two fractions: 3/4 and 1/2 (3+2)
	 * @example For 6/8, it is an array of two 3/8 fractions
	 * @example For 5/8, it is an array of two fractions: 2/8 and 3/8
	 * @todo Add definitions for default groupings for other timeSignatures (see Behind Bars )
	 * @todo How to implement halv note in 4/4 with four 1/4 fractions?
	 */
	beamGroupDurations!: Fraction[];

	/**
	 *
	 * @param count - The numerator of the timeSignature or a supported timeSignature symbol
	 * @param unit - The denominator of the timeSignature
	 *
	 * @todo Add support for compound timeSignature
	 */
	constructor(
		count: number | TimeSignatureSymbol = 4,
		public unit = 4,
	) {
		if (typeof count === 'string') {
			this.symbol = count;
			switch (count) {
				case 'common':
					this.count = 4;
					this.unit = 4;
					break;
				case 'cut':
					this.count = 2;
					this.unit = 2;
					break;
				default:
					throw new Error('Unsupported timeSignature symbol: ' + count);
			}
		} else {
			this.count = count;
		}
		this.duration = new Fraction(this.count, this.unit);
		this.setBeamGroupDuration();
		this._type = this.getType();
		this._beatsPerBar = this.getBeatsPerBar();
	}

	/**
	 * Set time signature type (simple, compound, irregular)
	 * @returns
	 */
	private getType() {
		switch (this.count) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 8:
				return 'simple';
			case 6:
			case 9:
			case 12:
			case 15:
			case 18:
				return 'compound';
			default:
				return 'irregular';
		}
	}

	/**
	 * Set beats per bar
	 * @returns
	 */
	private getBeatsPerBar() {
		const text = this.toString(true);
		// some cases need to be handled separately, as the beam groups do not
		// need to be equal to the number of beats
		switch (text) {
			case '2/4':
				return 2;
			case '3/4':
				return 3;
			case '4/4':
			case '4/8':
				return 4;
			default:
				return this.beamGroupDurations.length;
		}
	}

	/**
	 * Sets the beamGroupDurations. If no duration is provided it is based on
	 * the count and unit of the timeSignature
	 * @param duration
	 */
	setBeamGroupDuration(duration?: Fraction | Fraction[]) {
		const durations: Fraction[] = [];
		if (Array.isArray(duration)) {
			duration.forEach((d) => durations.push(new Fraction(d)));
		} else if (duration) {
			durations.push(new Fraction(duration));
		} else {
			switch (this.count + '/' + this.unit) {
				case '2/8':
				case '4/8':
					durations.push(new Fraction(2, 8));
					break;
				case '3/8':
				case '6/8':
				case '9/8':
				case '12/8':
					durations.push(new Fraction(3, 8));
					break;
				case '5/8':
					durations.push(new Fraction(2, 8));
					durations.push(new Fraction(3, 8));
					break;
				case '7/8':
					durations.push(new Fraction(2, 8));
					durations.push(new Fraction(2, 8));
					durations.push(new Fraction(3, 8));
					break;
				default:
					durations.push(new Fraction(1, this.unit));
			}
		}
		this.beamGroupDurations = this.fillBeamGroupDurations(durations);
	}

	/**
	 * Matches the duration of the timeSignature with the sum of the durations of the beam groups
	 * Pushes durations[0] until the total duration is equal to the timeSignature duration
	 * If durations[0] is greater than the remaining duration, the remaining duration is pushed as the last duration
	 * @param durations
	 * @example For 4/4, pass [Fraction(1,4)] to get an array of four 1/4 fractions
	 * @throws Error if the sum of the provided durations is greater than the timeSignature duration
	 */
	private fillBeamGroupDurations(durations: Fraction[]) {
		let totalDuration: Fraction = new Fraction(0);
		durations.forEach((d) => (totalDuration = totalDuration.add(d)));
		if (totalDuration.compare(this.duration) > 0) {
			throw new Error(
				'The total duration of the beam group durations is greater than the timeSignature duration',
			);
		}
		while (totalDuration.compare(this.duration) < 0) {
			// If the remaining duration is less than the first duration, add the remaining duration
			if (this.duration.sub(totalDuration).compare(durations[0]) < 0) {
				durations.push(this.duration.sub(totalDuration));
			} else {
				durations.push(new Fraction(durations[0]));
			}
			totalDuration = totalDuration.add(durations[durations.length - 1]);
		}
		return durations;
	}

	/**
	 * Get an array of one or more notes, with ties (if not rest), conforming to the beam group of the timeSignature. Note that this might not be the prefered notation to use, as it doesn't know anything about the surrounding notes.
	 * @param startDuration - Where in the bar to start the note from
	 * @param note
	 * @param overflow - NOT IMPLEMENTED What to do with notes that do not fit in the first bar. Return (default) returns one (or as few as possible) notes (with no tie between notes and overflow), proces returns array of notes that fits with the beam group (with tie between notes and overflow)
	 * @returns An object with two properties: notes and overflow. Notes is an array of notes that fit in the first bar, and overflow any notes that do not fit in the first bar
	 *
	 * @example For 4/4, pass 1/8 and a half note to get tied notes with type [1/8, 1/4, 1/8]
	 * @todo Support for h in 4/4 not implemented, see beamGroupDurations
	 */
	getNotesFromBeamGroup(
		startDuration: Fraction,
		note: Note | Rest,
		overflow: 'process' | 'return' = 'process',
	) {
		if (overflow === 'return') throw new Error('Not implemented');
		if (startDuration.compare(this.duration) >= 0)
			throw new Error('startDuration is greater or equal to the timeSignature duration');
		const data: { notes: (typeof note)[]; overflow: (typeof note)[] } = { notes: [], overflow: [] };
		const beamGroupPos = this.getBeamGroupPosition(startDuration);
		let beamGroupIndex = beamGroupPos.index;
		let currentBeamDuration = beamGroupPos.position.add(this.beamGroupDurations[beamGroupIndex]);
		let currentDuration = new Fraction(startDuration);
		let noteDurationLeft = new Fraction(note.getDuration());

		while (
			noteDurationLeft.compare(0) > 0 &&
			(overflow === 'process' || currentBeamDuration.compare(this.duration) <= 0)
		) {
			const groupDurationLeft = currentBeamDuration.sub(currentDuration);
			let clone: typeof note;
			let addedBeamDuration = new Fraction(0);
			if (groupDurationLeft.compare(noteDurationLeft) > 0) {
				console.log('note fits in beam group');
				// note fits in beam group
				const noteType = Duration.getTypeAndDotsFromFraction(noteDurationLeft);
				clone =
					note instanceof Note ?
						note.clone(noteType.type, undefined, undefined, undefined, noteType.dots)
					:	note.clone(noteType.type, noteType.dots);
				const key = currentDuration.compare(this.duration) >= 0 ? 'overflow' : 'notes';
				data[key].push(clone);
				addedBeamDuration = new Fraction(
					this.beamGroupDurations[beamGroupIndex % this.beamGroupDurations.length],
				);
			} else if (
				groupDurationLeft.compare(
					this.beamGroupDurations[beamGroupIndex % this.beamGroupDurations.length],
				) === 0 &&
				this.beamGroupIndexesInSameBar(beamGroupIndex, beamGroupIndex + 1) &&
				noteDurationLeft.compare(
					groupDurationLeft.add(
						this.beamGroupDurations[(beamGroupIndex + 1) % this.beamGroupDurations.length],
					),
				) >= 0
			) {
				console.log(
					'note is at start of beam group and at least as long as two beam groups, which are in the same bar',
				);
				// note is at start of beam group and at least as long as two beam groups, which are in the same bar
				//let span = 2;
				beamGroupIndex++;
				let tmpGroupDuration = this.beamGroupDurations[
					beamGroupIndex % this.beamGroupDurations.length
				].add(this.beamGroupDurations[(beamGroupIndex + 1) % this.beamGroupDurations.length]);
				while (
					this.beamGroupIndexesInSameBar(beamGroupIndex, beamGroupIndex + 1) &&
					groupDurationLeft
						.add(this.beamGroupDurations[(beamGroupIndex + 1) % this.beamGroupDurations.length])
						.compare(noteDurationLeft) > 0
				) {
					beamGroupIndex++;
					tmpGroupDuration = tmpGroupDuration.add(
						this.beamGroupDurations[beamGroupIndex % this.beamGroupDurations.length],
					);
					//span++;
				}
				const noteType = Duration.getTypeAndDotsFromFraction(tmpGroupDuration);
				clone =
					note instanceof Note ?
						note.clone(noteType.type, undefined, undefined, undefined, noteType.dots)
					:	note.clone(noteType.type, noteType.dots);
				const key = currentDuration.compare(this.duration) >= 0 ? 'overflow' : 'notes';
				data[key].push(clone);
				addedBeamDuration = new Fraction(tmpGroupDuration);
			} else {
				console.log(
					'other cases',
					groupDurationLeft.toString(),
					noteDurationLeft.toString(),
					groupDurationLeft.compare(
						this.beamGroupDurations[beamGroupIndex % this.beamGroupDurations.length],
					),
					this.beamGroupIndexesInSameBar(beamGroupIndex, beamGroupIndex + 1),
					beamGroupIndex,
					noteDurationLeft.compare(
						groupDurationLeft.add(
							this.beamGroupDurations[(beamGroupIndex + 1) % this.beamGroupDurations.length],
						),
					),
				);
				const noteType = Duration.getTypeAndDotsFromFraction(groupDurationLeft);
				clone =
					note instanceof Note ?
						note.clone(noteType.type, undefined, undefined, undefined, noteType.dots)
					:	note.clone(noteType.type, noteType.dots);
				const key = currentDuration.compare(this.duration) >= 0 ? 'overflow' : 'notes';
				data[key].push(clone);
				addedBeamDuration = new Fraction(
					this.beamGroupDurations[beamGroupIndex % this.beamGroupDurations.length],
				);
			}
			beamGroupIndex++;
			noteDurationLeft = noteDurationLeft.sub(clone.getDuration());
			currentBeamDuration = currentBeamDuration.add(addedBeamDuration);
			currentDuration = new Fraction(currentDuration).add(clone.getDuration());
		}
		/**
		 * @todo support splitting return notes if no single note exits for duration
		 */
		/*if (overflow === 'return' && noteDurationLeft.compare(0) > 0) {
      const noteType = Duration.getTypeAndDotsFromFraction(noteDurationLeft);
      const clone =
        note instanceof Note
          ? note.clone(noteType.type, undefined, undefined, undefined, noteType.dots)
          : note.clone(noteType.type, noteType.dots);
      data.overflow.push(clone);
    }*/

		// tie notes
		if (data.notes.length > 1 && data.notes[0] instanceof Note) {
			for (let i = 0; i < data.notes.length; i++) {
				(data.notes[i] as Note).tie =
					i === 0 ? 'start'
					: i < data.notes.length - 1 ? 'continue'
					: 'end';
			}
		}
		if (data.overflow.length > 1 && data.overflow[0] instanceof Note) {
			for (let i = 0; i < data.overflow.length; i++) {
				(data.overflow[i] as Note).tie =
					i === 0 ? 'start'
					: i < data.overflow.length - 1 ? 'continue'
					: 'end';
			}
		}
		if (overflow === 'process' && data.overflow.length > 0 && data.notes[0] instanceof Note) {
			(data.notes[data.notes.length - 1] as Note).tie =
				data.notes.length > 1 ? 'continue' : 'start';
			(data.overflow[0] as Note).tie = data.overflow.length > 1 ? 'continue' : 'end';
		}
		return data;
	}

	/**
	 * Returns the index and the position (duration up to, but not including, that beam group from start of bar) for the beam group that contains the position
	 * @param position
	 * @returns
	 */
	getBeamGroupPosition(position: Fraction) {
		let beamGroupIndex = 0;
		let currentBeamDuration = new Fraction(this.beamGroupDurations[0]);
		while (currentBeamDuration.compare(position) <= 0) {
			currentBeamDuration = currentBeamDuration.add(this.beamGroupDurations[beamGroupIndex]);
			beamGroupIndex++;
		}
		return {
			index: beamGroupIndex,
			position: currentBeamDuration.sub(this.beamGroupDurations[beamGroupIndex]),
		};
	}

	private beamGroupIndexesInSameBar(index1: number, index2: number) {
		return (
			Math.floor(index1 / this.beamGroupDurations.length) ===
			Math.floor(index2 / this.beamGroupDurations.length)
		);
	}

	/**
	 * Returns the timeSignature as a string, either as a symbol or as a count/unit
	 * @param ignoreSymbol - If true, return the count and unit instead of the symbol
	 * @returns
	 */
	toString(ignoreSymbol = false) {
		if (this.symbol && !ignoreSymbol) {
			return this.symbol;
		} else {
			return this.count + '/' + this.unit;
		}
	}
}
