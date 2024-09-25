import { type BarlineStyle } from '../../../core/bar.js';
import { Coda, DaCapo, type Direction, Fine, Segno } from '../../../core/data/directions.js';
import { Fermata } from '../../../core/data/notations.js';

enum BarMatch {
	DIRECTIONS = 1,
	MATCH1,
	MATCH2,
}

type BarData = {
	data: string;
	directions?: string;
};

export type BarItem = {
	barline?: BarlineStyle;
	repeatStart?: number;
	repeatEnd?: number;
	ending?: string;
	directionsCurrent?: Direction[];
	directionsNext?: Direction[];
	lineBreak?: boolean;
};

export class BarlineParser {
	foundCoda = false;

	constructor(private errors: string[]) {}

	parse(data: string) {
		const match = this.match(data);
		if (match === null) return null;
		if (!match) return;
		const item = this.process(match);
		return item;
	}

	match(item: string) {
		/*
    Identify musicstring bar item
		*/

		const myRegexp = /^(!(?!(?:!|!!)).*!)*(?:([|.|[:\\]{1,10}[0-9-,]*)$|([[\]|:.\\]*))$/g;
		//let myRegexp = /^(!(?!(?:!|!!)).*!)*(?:([|\.\|\[:\/]{1,10}[0-9-,]*)$|([\[\]|:\.\/]*))$/g;
		const items = myRegexp.exec(item);

		if (!items) return;
		if (items[BarMatch.DIRECTIONS] && !items[BarMatch.MATCH1] && !items[BarMatch.MATCH2]) {
			this.addError(0, '!', 'Directions not attached to anything not supported');
			return null; // will make sure it is ignored
		}
		const data: BarData = {
			data: items[BarMatch.MATCH1] ? items[BarMatch.MATCH1] : items[BarMatch.MATCH2],
		};
		if (items[BarMatch.DIRECTIONS]) data.directions = items[BarMatch.DIRECTIONS];
		return data;
	}

	process(item: BarData) {
		const data = this.processData(item.data);
		if (item.directions) {
			const directions = this.processDecorations(item.directions);
			if (directions && directions.current && directions.current.length)
				data.directionsCurrent = directions.current;
			if (directions && directions.next && directions.next.length)
				data.directionsNext = directions.next;
		}
		return data;
	}

	processData(item: string) {
		const data: BarItem = {};
		const state = {
			dot: false,
			startBracket: false,
			ending: '',
			inEnding: false,
			endingNumber: 0,
			endingComma: false,
			endingHypen: false,
		};
		if (item === '::') {
			data.barline = 'heavy-heavy';
			data.repeatEnd = 1;
			data.repeatStart = 1;
		} else {
			for (let i = 0; i < item.length; i++) {
				const char = item.charAt(i);
				if (!state.inEnding) {
					switch (char) {
						case '|':
							if (!data.barline && data.repeatEnd) {
								data.barline = 'light-heavy';
							} else if (!data.barline && state.startBracket) {
								data.barline = 'heavy-light';
								state.startBracket = false;
							} else if (!data.barline) {
								data.barline = 'regular';
							} else if (data.barline === 'light-heavy' && data.repeatEnd) {
								// double barline, no need to change anyghing
							} else if (data.barline === 'regular' && state.dot) {
								data.barline = 'dashed';
								state.dot = false;
							} else if (data.barline === 'regular') {
								data.barline = 'light-light';
							} else if (state.startBracket) {
								if (data.barline === 'light-heavy') {
									data.barline = 'heavy-heavy';
								} else {
									data.barline = 'heavy-light';
								}
								state.startBracket = false;
							} else {
								this.addError(i, char, item);
							}
							break;
						case ':':
							if (!data.barline) {
								if (!data.repeatEnd) data.repeatEnd = 0;
								data.repeatEnd++;
							} else {
								if (!data.repeatStart) data.repeatStart = 0;
								data.repeatStart++;
								if (data.barline === 'light-heavy') {
									data.barline = 'heavy-heavy';
								} else {
									data.barline = 'heavy-light';
								}
							}
							break;
						case '[':
							if (!state.startBracket) {
								state.startBracket = true;
							} else {
								this.addError(i, char, item);
							}
							break;
						case ']':
							if (data.barline === 'heavy-light') {
								data.barline = 'none';
							} else if (data.barline === 'regular') {
								data.barline = 'light-heavy';
							} else if (data.barline === 'light-heavy' && data.repeatEnd) {
								// no change needed
							} else {
								this.addError(i, char, item);
							}
							break;
						case '.':
							if (!state.dot) {
								state.dot = true;
							} else {
								this.addError(i, char, item);
							}
							break;
						case '-':
							break;
						case ',':
						case '1':
						case '2':
						case '3':
						case '4':
						case '5':
						case '6':
						case '7':
						case '8':
						case '9':
							if (state.startBracket) {
								state.inEnding = true;
								data.ending = char;
								state.endingNumber = +char;
							} else if (
								(data.barline === 'regular' || data.barline === 'light-heavy') &&
								!state.dot &&
								!state.startBracket
							) {
								data.barline = 'light-heavy';
								state.inEnding = true;
								data.ending = char;
								state.endingNumber = +char;
							} else {
								this.addError(i, char, item);
							}
							break;
						case '\\':
							data.lineBreak = true;
							break;
					}
				} else {
					if (
						+char >= 1 &&
						+char <= 9 &&
						state.endingNumber === 0 &&
						(state.endingComma || state.endingHypen)
					) {
						state.endingNumber = +char;
						state.endingComma = false;
						state.endingHypen = false;
						data.ending += char;
					} else if (
						char === '-' &&
						state.endingNumber > 0 &&
						state.endingComma === false &&
						state.endingHypen === false
					) {
						state.endingHypen = true;
						state.endingNumber = 0;
						data.ending += char;
					} else if (
						char === ',' &&
						state.endingNumber > 0 &&
						state.endingComma === false &&
						state.endingHypen === false
					) {
						state.endingComma = true;
						state.endingNumber = 0;
						data.ending += char;
					} else {
						this.addError(i, char, item, 'ending');
					}
				}
			}
		}
		return data;
	}

	processDecorations(item: string) {
		if (!item) return;
		const items = item.slice(1, item.length - 1).split('!!');
		const data: { current: Direction[]; next: Direction[] } = { current: [], next: [] };
		items.forEach((item) => {
			if (item === 'coda') {
				data.next.push(new Coda(this.foundCoda ? 'to' : 'from'));
			} else if (item === 'segno') {
				data.next.push(new Segno('to'));
			} else if (item === 'fine') {
				data.current.push(new Fine());
			} else if (item.slice(0, 4) === 'D.S.') {
				const segno = this.getSegno(item);
				if (segno) data.current.push(segno);
			} else if (item.slice(0, 4) === 'D.C.') {
				const dc = this.getDaCapo(item);
				if (dc) data.current.push(dc);
			} else if (item === 'fermata') {
				data.current.push(new Fermata());
			} else if (item === 'invertedfermata') {
				data.current.push(new Fermata(true));
			} else {
				this.addError(0, item.slice(0, 1), item, 'decoration');
			}
		});
		return data;
	}

	getSegno(item: string) {
		const segno = new Segno('from');
		const al = item.slice(6, 10);
		if (al === 'coda') {
			segno.al = 'coda';
		} else if (al === 'fine') {
			segno.al = 'fine';
		} else if (al === '') {
			// do nothing
		} else {
			this.addError(6, item.slice(6, 6), item, 'decoration');
			return;
		}
		if (item.length > 10) segno.extra = item.slice(10);
		return segno;
	}

	getDaCapo(item: string) {
		const dc = new DaCapo();
		const al = item.slice(6, 10);
		if (al === 'coda') {
			dc.al = 'coda';
		} else if (al === 'fine') {
			dc.al = 'fine';
		} else if (al === '') {
			// do nothing
		} else {
			this.addError(6, item.slice(6, 6), item, 'decoration');
			return;
		}
		if (item.length > 10) dc.extra = item.slice(10);
		return dc;
	}

	addError(index: number, char: string, data: string, tokenType = 'barline') {
		this.errors.push(`Invalid ${tokenType} token at char ${index} (${char}) in ${data}`);
	}
}
