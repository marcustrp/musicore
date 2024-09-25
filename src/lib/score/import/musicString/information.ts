import { Clef, type ClefType } from '../../../core/clef.js';
import { type KeyMode, type ScaleType } from '../../../core/data/modes.js';
import { Key } from '../../../core/key.js';
import { TimeSignature, type TimeSignatureSymbol } from '../../../core/timeSignature.js';
import { Scale } from '../../../core/scale.js';

export type InformationData<T> = {
	length: number;
	data: T;
};

export type KeyData = { key: Key; scale: Scale; inputScale: Scale };

export type InputMode =
	| 'major'
	| 'minor'
	| 'harmonic_minor'
	| 'melodic_minor'
	| 'ionian'
	| 'dorian'
	| 'phrygian'
	| 'lydian'
	| 'mixolydian'
	| 'aeolian'
	| 'locrian';

const inputScales: { [key: string]: { key: KeyMode; scale: ScaleType; inputScale: InputMode } } = {
	ma: { key: 'major', scale: 'major', inputScale: 'major' },
	mi: { key: 'minor', scale: 'minor', inputScale: 'minor' },
	hm: { key: 'minor', scale: 'harmonic_minor', inputScale: 'minor' },
	mm: { key: 'minor', scale: 'melodic_minor', inputScale: 'minor' },

	io: { key: 'ionian', scale: 'ionian', inputScale: 'major' },
	do: { key: 'dorian', scale: 'dorian', inputScale: 'dorian' },
	ph: { key: 'phrygian', scale: 'phrygian', inputScale: 'phrygian' },
	ly: { key: 'lydian', scale: 'lydian', inputScale: 'lydian' },
	mx: { key: 'mixolydian', scale: 'mixolydian', inputScale: 'mixolydian' },
	ae: { key: 'aeolian', scale: 'aeolian', inputScale: 'minor' },
	lo: { key: 'locrian', scale: 'locrian', inputScale: 'locrian' },

	mp: { key: 'major', scale: 'pentatonic_major', inputScale: 'major' },
	ip: { key: 'minor', scale: 'pentatonic_minor', inputScale: 'minor' },
	mb: { key: 'major', scale: 'blues', inputScale: 'minor' },
	ib: { key: 'minor', scale: 'blues', inputScale: 'minor' },

	no: { key: 'none', scale: 'major', inputScale: 'major' },
};

type ClefTypes = 'g' | 'f' | 'c' | 'a' | 't' | 's' | 'm' | 'p' | 'n';

const clefType: { [key in ClefTypes]: ClefType } = {
	g: 'g',
	f: 'f',
	c: 'c',
	a: 'alto',
	t: 'tenor',
	s: 'soprano',
	m: 'mezzosoprano',
	p: 'perc',
	n: 'none',
};

/** @todo update inHeaderOnly */
const inHeaderOnly = ['T'];

export type InformationItem = {
	key?: Key;
	scale?: Scale;
	inputScale?: Scale;
	timeSignature?: TimeSignature;
	clef?: Clef;
	octave?: number;
	title?: string;
	books?: string[];
	discography?: string[];
	composers?: string[];
	notes?: string;
	origin?: string;
	tempo?: string;
	type?: string; // waltz, reel...
	source?: string;
	transcriptions?: string[];
};

export class InformationParser {
	constructor(private errors: string[]) {}

	parse(input: string, index: number, currentInfo: InformationItem) {
		if (input.slice(0, 1) !== '@') return;
		input = input.slice(1);
		//let match: InformationData | undefined;
		const item: InformationItem = {};
		let ignore = false;
		while (input) {
			const type = input.slice(0, 1);
			if (index > 0 && inHeaderOnly.includes(type)) {
				this.errors.push(`Information type '${type} is only allowed in header`);
				ignore = true;
			} else {
				ignore = false;
			}
			let data:
				| InformationData<string | number | TimeSignature | Clef | KeyData | Scale>
				| undefined;
			/** @todo: Group (G), History (H), Parts (P) */
			/** @todo improve tempo (Q) parsing, see ABC */
			/** @todo User defined (U), see ABC */
			/** @todo Voice (V), see ABC */
			switch (type) {
				case 'B':
					data = this.getString('B', input);
					if (data?.data) {
						if (!item.books) item.books = [];
						item.books?.push(data.data as string);
					}
					break;
				case 'C':
					data = this.getClef(input);
					if (data?.data) item.clef = data.data as Clef;
					break;
				case 'D':
					data = this.getString('D', input);
					if (data?.data) {
						if (!item.discography) item.discography = [];
						item.discography?.push(data.data as string);
					}
					break;
				case 'E':
					data = this.getString('E', input);
					if (data?.data) {
						if (!item.composers) item.composers = [];
						item.composers.push(data.data as string);
					}
					break;
				case 'I':
					{
						const root =
							currentInfo.key ? currentInfo.key.root
							: item.key ? item.key.root
							: 'c';
						data = this.getInputScale(input, root);
						if (data?.data) item.inputScale = data.data as Scale;
					}
					break;
				case 'K':
					data = this.getKey(input);
					if (data?.data) {
						item.key = (data.data as KeyData).key;
						item.scale = (data.data as KeyData).scale;
						item.inputScale = (data.data as KeyData).inputScale;
					}
					break;
				case 'M':
					data = this.getTimeSignature(input);
					if (data?.data) item.timeSignature = data.data as TimeSignature;
					break;
				case 'N':
					data = this.getString('N', input);
					if (data?.data) item.notes = (data.data as string).replace(/\\n/g, '\n');
					break;
				case 'o':
					data = this.getString('o', input);
					if (data?.data) item.origin = data.data as string;
					break;
				case 'O':
					data = this.getOctave(input);
					if (data?.data) item.octave = data.data as number;
					break;
				case 'Q':
					data = this.getString('Q', input);
					if (data?.data) item.tempo = data.data as string;
					break;
				case 'R':
					data = this.getString('R', input);
					if (data?.data) item.type = data.data as string;
					break;
				case 'S':
					data = this.getString('S', input);
					if (data?.data) item.source = data.data as string;
					break;
				case 'T':
					data = this.getString('T', input);
					if (data?.data && !ignore) item.title = data.data as string;
					break;
				case 'Z':
					data = this.getString('Z', input);
					if (data?.data) {
						if (!item.transcriptions) item.transcriptions = [];
						item.transcriptions?.push(data.data as string);
					}
					break;
				default:
					this.errors.push(
						`Unknown information type '${type}, ignoring rest of information string'`,
					);
					return Object.keys(item).length ? item : undefined;
			}
			if (!data) return Object.keys(item).length ? item : undefined;
			input = input.slice(data.length);
		}
		return Object.keys(item).length > 0 ? item : undefined;
	}

	getString(key: 'T' | 'B' | 'E' | 'D' | 'N' | 'o' | 'Q' | 'R' | 'S' | 'Z', input: string) {
		if (input.slice(0, 1) === key) {
			const match = /^`([^`]*)`/g.exec(input.slice(1));
			if (match) {
				// length is including the backticks and key, so +3
				return { length: match[1].length + 3, data: match[1] } as InformationData<string>;
			}
		}
		this.errors.push(`Info type '${key}, empty or invalid data: ${input}`);
	}

	/** @todo implement new syntax, when finalized */
	private getKey(input: string) {
		const match = /^K([a-gA-G])(?:([#b])?([a-z]{2})?)?/g.exec(input);
		if (match && match.length > 0) {
			const keyData = this.getMode(
				match[3] ? match[3]
				: /[A-Z]/.test(match[1]) ? 'ma'
				: 'mi',
			);
			const key = new Key((match[1] + (match[2] ? match[2] : '')).toLocaleLowerCase(), keyData.key);
			const scale = new Scale(key.root, keyData.scale);
			const inputScale = new Scale(key.root, keyData.inputScale);
			const data: KeyData = { key, scale, inputScale: inputScale };
			const result: InformationData<KeyData> = { length: match[0].length, data };
			return result;
		} else {
			this.errors.push(`Key: empty or invalid data: ${input}`);
		}
	}

	private getInputScale(input: string, root: string) {
		const match = /^I([a-z]{2})/g.exec(input);
		if (match && match.length > 0) {
			const keyData = this.getMode(match[1]);
			const inputScale = new Scale(root, keyData.inputScale);
			const result: InformationData<Scale> = { length: match[0].length, data: inputScale };
			return result;
		} else {
			this.errors.push(`Key: empty or invalid data: ${input}`);
		}
	}

	private getMode(mode: string) {
		if (!Object.keys(inputScales).includes(mode)) {
			mode = 'ma';
			this.errors.push(`Unknown mode '${mode}, defaulting to major`);
		}
		return inputScales[mode];
	}

	private getTimeSignature(input: string) {
		const match = /^M(?:([CcTt])|(?:([0-9]{1,2})\/([0-9]{1,2}))|(?:([1-9])([1248]))|([1-9]))/g.exec(
			input,
		);
		if (match) {
			if (match[1]) {
				if (match[1].toLocaleLowerCase() === 'c') {
					return this.getTimeSignatureObject(match[0].length, 4, 4, 'common');
				} else {
					return this.getTimeSignatureObject(match[0].length, 2, 2, 'cut');
				}
			} else if (+match[6] > 0) {
				return this.getTimeSignatureObject(match[0].length, +match[6], 4);
			} else if (+match[4] > 0 && +match[5] > 0) {
				return this.getTimeSignatureObject(match[0].length, +match[4], +match[5]);
			} else if (+match[2] > 0 && +match[3] > 0) {
				return this.getTimeSignatureObject(match[0].length, +match[2], +match[3]);
			}
		}
		this.errors.push(`TimeSignature: empty or invalid data: ${input}`);
	}

	private getTimeSignatureObject(
		length: number,
		count: number,
		unit: number,
		symbol?: TimeSignatureSymbol,
	) {
		const data: InformationData<TimeSignature> = {
			length,
			data: new TimeSignature(symbol ? symbol : count, unit),
		};
		return data;
	}

	private getClef(input: string) {
		const match = /^C([gfcatsmpn])([0-5])?([+-](?:8|15))?/g.exec(input);
		if (match) {
			if (match[1] === 'p' || match[1] === 'n') {
				const staffLines = +match[2] >= 0 && +match[2] <= 5 ? +match[2] : undefined;
				return this.getClefObject(
					match[0].length,
					clefType[match[1] as ClefTypes],
					undefined,
					undefined,
					staffLines,
				);
			} else if (match[1]) {
				const line = +match[2] >= 1 && +match[2] <= 5 ? +match[2] : undefined;
				let octaveChange: 2 | 1 | -1 | -2 | undefined;
				if (+match[3] >= 0 && +match[3] <= 5) {
					if (match[3] === '+15') {
						octaveChange = 2;
					} else if (match[3] === '+8') {
						octaveChange = 1;
					} else if (match[3] === '-8') {
						octaveChange = -1;
					} else if (match[3] === '-15') {
						octaveChange = -2;
					}
				}
				return this.getClefObject(
					match[0].length,
					clefType[match[1] as ClefTypes],
					line,
					octaveChange,
				);
			}
		}
		this.errors.push(`Clef: empty or invalid data: ${input}`);
	}

	getClefObject(
		length: number,
		type: ClefType,
		line?: number,
		octaveChange?: 2 | 1 | -1 | -2,
		staffLines?: number,
	) {
		const clef = new Clef(type, line, octaveChange);
		if (staffLines && staffLines >= 0) clef.staffLines = staffLines;
		const data: InformationData<Clef> = { length, data: clef };
		return data;
	}

	getOctave(input: string) {
		const octave = /O([0-9])/g.exec(input);
		if (octave && +octave[1] >= 0 && +octave[1] <= 9) {
			const data: InformationData<number> = { length: octave[0].length, data: +octave[1] };
			return data;
		} else {
			this.errors.push(`Clef: empty or invalid data: ${input}`);
		}
	}

	setDefaults(header: InformationItem) {
		const clef = header.clef ? header.clef : new Clef('g');
		const scale = header.scale ? header.scale : new Scale('c', 'major');
		const inputScale = header.inputScale ? header.inputScale : new Scale('c', 'major');
		const key = header.key ? header.key : new Key('c', 'major');
		const timeSignature = header.timeSignature ? header.timeSignature : new TimeSignature(4, 4);
		const octave = header.octave ? header.octave : 5;
		const item: InformationItem = {
			...header,
			clef,
			scale,
			inputScale,
			key,
			timeSignature,
			octave,
		};
		return item;
	}
}
