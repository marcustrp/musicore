import Fraction from 'fraction.js';
import { Duration } from './duration.js';
import ChordSymbol from './chordSymbol.js';

// musicXML type NoteType = '256th' | '128th' | '64th' | '32nd' | '16th' | 'eighth' | 'quarter' | 'half' | 'whole' | 'breve' | 'long'
// MEI: 1, 2, 4 ... 1024, breve, long
export type NoteType = 'b' | 'l' | 'w' | 'h' | 'q' | '8' | '16' | '32' | '64' | '128' | '256';

export type NoteSize = 'tiny' | 'small' | 'normal' | 'large';
export class RhythmElement {
	/** should be readonly, but (at least) musicstring importer needs a fix for that */
	id: string;
	private _type: NoteType;
	get type() {
		return this._type;
	}
	set type(type: NoteType) {
		this._type = type;
	}

	/** Size of note. Defaults to normal */
	size?: NoteSize;

	private _dots?: number;
	get dots() {
		return this._dots || 0;
	}
	set dots(number: number | undefined) {
		if (number && number > 0) {
			this._dots = number;
		} else {
			delete this._dots;
		}
	}

	/** @todo implement stem */
	stem?: {
		direction: 'up' | 'down';
		/** @todo Implement, see MEI 4.2.4.2.2. Stem Modifications */
		//modification: '1slash' | '2slash' | '3slash' | '4slash' | '5slash' | '6slash' | '7slash' | '8slash' | 'sprech' | 'z'
		/** @todo Implement, see MEI note@stem.with */
		// joinWith: ...
	};

	/** Chord symbols are always sorterd by offset, level */
	private _chordSymbols?: ChordSymbol[];
	get chordSymbols() {
		return this._chordSymbols;
	}

	triplet?: {
		start?: boolean;
		end?: boolean;
		numerator: number;
		denominator: number;
		totalDuration: Fraction; // total duration triplet
		noteCount: number;
	};

	// lyrics is handled here in order to support lyrics on rests
	lyrics?: [
		{
			text: string;
			syllabic?: 'start' | 'end' | 'continue';
			/** number = 0 is first verse (lyric line) */
			number?: number;
		},
	];

	invisible?: boolean;
	/** @todo rewrite to lockedProperties, enable editors to lock any property using string keys? */
	locked?: boolean;

	constructor(type: NoteType, dots?: number, id?: string) {
		this._type = type;
		this.dots = dots;
		/** see property comment about id */
		this.id = id ? id : this.getNewId();
	}

	/**
	 *
	 * @param length
	 * @returns
	 * @todo move this to a better place, it should be used for quite a lot of elements
	 */
	private getNewId(length = 10) {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}

	getChordSymbol(index = 0) {
		if (!this._chordSymbols || this._chordSymbols.length <= index) return;
		return this._chordSymbols[index];
	}

	/**
	 * Returns a chord symbol by offset and/or level.
	 * @param offset
	 * @param level
	 * @returns
	 */
	getChordSymbolByPosition(offset?: Fraction, level?: number) {
		if (!this._chordSymbols) return;
		const index = this.getChordSymbolIndexByPosition(offset, level);
		if (index === undefined || index < 0) return;
		return this._chordSymbols[index];
	}

	getChordSymbolIndexByPosition(offset?: Fraction, level?: number) {
		if (!this._chordSymbols) return;
		// both offset and level are undefined instead of 0
		if (offset && offset.equals(0)) offset = undefined;
		if (level === 0) level = undefined;

		return this._chordSymbols.findIndex((chordSymbol) =>
			this.findChordSymbol(chordSymbol, offset, level),
		);
	}

	private findChordSymbol(
		chordSymbol: ChordSymbol,
		offset: Fraction | undefined,
		level: number | undefined,
	) {
		if (
			offset &&
			(!chordSymbol.offset || (chordSymbol.offset && !chordSymbol.offset.equals(offset))) &&
			!(!offset && !chordSymbol.offset)
		)
			return false;
		if (
			level &&
			chordSymbol.level !== level &&
			!(level === undefined && chordSymbol.level === undefined)
		)
			return false;

		return true;
	}

	/** @todo implement */
	getChordSymbolsByOffset(/**offset: Fraction*/) {
		throw new Error('Not implemented');
	}

	/** @todo implement */
	getChoordSymbolsByLevel(/**level: number*/) {
		throw new Error('Not implemented');
	}

	/**
	 * Saves a chord symbol. If a chord symbol with the same offset and level already exists, it will be overwritten.
	 * @param chordSymbol
	 */
	setChordSymbol(chordSymbol: ChordSymbol) {
		if (!this._chordSymbols) {
			this._chordSymbols = [chordSymbol];
		} else {
			const index = this.getChordSymbolIndexByPosition(chordSymbol.offset, chordSymbol.level);
			if (index !== undefined && index >= 0) {
				this._chordSymbols[index] = chordSymbol;
			} else {
				this._chordSymbols.push(chordSymbol);
			}
			this.sortChordSymbols();
		}
	}

	/**
	 * Sorts chord symbols by offset, level. Undefined offset and level are always at the start.
	 */
	private sortChordSymbols(): void {
		if (!this._chordSymbols) return;

		this._chordSymbols.sort((a, b) => {
			if (a.offset === undefined && b.offset === undefined) {
				return this.sortChordSymbolLevel(a.level, b.level);
			} else if (a.offset === undefined) {
				return -1;
			} else if (b.offset === undefined) {
				return 1;
			} else if (a.offset.compare(b.offset) === 0) {
				return this.sortChordSymbolLevel(a.level, b.level);
			} else {
				return a.offset.sub(b.offset).valueOf();
			}
		});
	}

	private sortChordSymbolLevel(a?: number, b?: number) {
		if (a === undefined && b === undefined) {
			return 0;
		} else if (a === undefined) {
			return -1;
		} else if (b === undefined) {
			return 1;
		} else {
			return a - b;
		}
	}

	removeChordSymbols() {
		delete this._chordSymbols;
	}

	getDuration(ignoreTriplet = false) {
		const fraction =
			this.triplet && !ignoreTriplet ?
				new Fraction(this.triplet.denominator, this.triplet.numerator)
			:	new Fraction(1);
		return Duration.getFraction(this.type, this.dots, fraction);
	}

	/**
	 *
	 * @param numerator
	 * @param denominator
	 * @param totalDuration
	 * @param noteIndex
	 * @param noteCount
	 * @todo add error handling
	 */
	setTriplet(
		numerator: number,
		denominator: number,
		totalDuration: Fraction,
		noteIndex: number,
		noteCount: number,
	) {
		this.triplet = {
			numerator: numerator,
			denominator: denominator,
			totalDuration: totalDuration,
			noteCount: noteCount,
		};
		if (noteIndex === 0) this.triplet.start = true;
		if (noteIndex === noteCount - 1) this.triplet.end = true;
	}

	/**
	 *
	 * @param items
	 * @param numerator
	 * @param denominator
	 * @returns
	 * @todo add error handling
	 */
	static calculateTripletDuration(items: RhythmElement[], numerator: number, denominator: number) {
		let totalDuration = new Fraction(0);
		items.forEach((item) => (totalDuration = totalDuration.add(item.getDuration(true))));
		totalDuration = totalDuration.div(numerator).mul(denominator);
		return totalDuration;
	}
}
