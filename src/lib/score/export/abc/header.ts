import { capitalizeFirstChar } from '../../../utils/string.js';
import { type Creator, Score } from '../../score.js';
import { type ReportFunction } from '../abc.js';
import { Bar } from '../../../core/bar.js';

const supportedClefNames = [
	'treble',
	'bass',
	'baritone',
	'tenor',
	'alto',
	'mezzosoprano',
	'soprano',
	'perc',
	'none',
];
const supportedClefSymbols = ['g', 'f', 'c', 'perc', 'none'];

export class HeaderGenerator {
	constructor(
		private addWarning: ReportFunction,
		private validateError: ReportFunction,
	) {}

	/**
	 * Returns the ABC header
	 * @param score
	 * @returns
	 */
	getHeader(score: Score) {
		const abcKey = this.getKey(score);
		const abcClef = this.getClef(score);
		const abcTimeSignature = this.getTimeSignature(score);
		const abcLengthUnit = this.getLengthUnit(score);
		let header = `%abc-2.2
I:abc-charset utf-8
I:abc-creator musicore-0.0.1
X:1`;
		const work = score.work;
		if (work) {
			if (work.title) header += this.getString('T', work.title);
			if (work.subtitle) header += this.getString('T', work.subtitle);
			if (work.creator) header += this.getComposers(work.creator);
		}
		const information = score.information;
		if (information) {
			if (information.books) header += this.getArray('B', information.books);
			if (information.discography) header += this.getArray('D', information.discography);
			if (information.notes) header += this.getString('N', information.notes);
			if (information.origin) header += this.getString('O', information.origin);
			if (information.type) header += this.getString('R', information.type);
			if (information.source) header += this.getString('S', information.source);
			if (information.transcription) {
				if (information.transcription.creator)
					header += this.getString('Z', information.transcription.creator, 'abc-transcription');
				if (information.transcription.editedBy)
					header += this.getString('Z', information.transcription.editedBy, 'abc-edited-by');
				if (information.transcription.copyright)
					header += this.getString('Z', information.transcription.copyright, 'abc-copyright');
			}
		}
		header += `
M:${abcTimeSignature}
L:${abcLengthUnit}`;

		header += this.getTempo(score.bars.bars[0]);
		// key must be last field in header per abc spec.
		header += `\nK:${abcKey}`;
		if (abcClef !== 'treble') header += `clef=${abcClef}`;
		return header;
	}

	/**
	 * Get the timeSignature of the score in ABC format
	 * @param score
	 * @returns
	 */
	private getTimeSignature(score: Score) {
		const timeSignature =
			score.bars.bars[0].pickup ?
				score.bars.bars[1].timeSignature
			:	score.bars.bars[0].timeSignature;
		const abcTimeSignature = timeSignature.toString();
		if (abcTimeSignature === 'common') {
			return 'C';
		} else if (abcTimeSignature === 'cut') {
			return 'C|';
		} else {
			return abcTimeSignature;
		}
	}

	/**
	 * Get the key (mode) of the score in ABC format
	 * @param score
	 * @returns
	 */
	private getKey(score: Score) {
		const key = score.bars.bars[0].key;
		const root = capitalizeFirstChar(key.root);
		const mode = key.mode;
		switch (mode) {
			case 'major':
			case 'ionian':
				return root;
			case 'minor':
			case 'aeolian':
				return root + 'm';
			case 'dorian':
			case 'locrian':
			case 'lydian':
			case 'mixolydian':
			case 'phrygian':
				return root + ' ' + mode;
			case 'none':
				return 'none';
			default:
				throw new Error('Unsupported mode');
		}
	}

	/**
	 * Get the clef of the score in ABC format
	 * @param score
	 * @returns
	 */
	private getClef(score: Score) {
		const clef = score.parts.getPart(0).getClef(0, 0);
		if (clef.name) {
			if (supportedClefNames.includes(clef.name)) {
				return clef.name;
			} else {
				this.addWarning('Unsupported clef name: ' + clef.name);
			}
		}
		if (supportedClefSymbols.includes(clef.symbol)) {
			switch (clef.symbol) {
				case 'g':
					if (!clef.clefLine) {
						return 'treble';
					} else {
						return 'G' + clef.clefLine;
					}
				case 'f':
					if (!clef.clefLine) {
						return 'bass';
					} else {
						return 'F' + clef.clefLine;
					}
				case 'c':
					if (!clef.clefLine) {
						return 'alto';
					} else {
						return 'C' + clef.clefLine;
					}
				case 'none':
				case 'perc':
					return clef.symbol;
				default:
			}
		}

		throw new Error('Unsupported clef');
	}

	/**
	 * Returns the length unit to be used
	 * @param score (not implemented)
	 * @returns
	 *
	 * @todo: optimize the used length unit
	 */
	private getLengthUnit(_score: Score) {
		return '1/4';
	}

	/**
	 * Returns the tempo of the bar in ABC format, or empty string if no tempo is set
	 * @param bar
	 * @returns
	 */
	private getTempo(bar: Bar) {
		if (bar.tempo) return this.getString('Q', bar.tempo[0].value);
		return '';
	}

	/**
	 * Returns one row for each item in the data array, prefixed with the field
	 * @param field
	 * @param data
	 * @returns
	 */
	private getArray(field: string, data: string[]) {
		if (!data) throw new Error('getArray: data empty');
		let abc = '';
		data.forEach((item) => (abc += this.getString(field, item)));
		return abc;
	}

	/**
	 * Returns the data prefixed with the field
	 * @param field
	 * @param data
	 * @param prefix
	 * @returns
	 */
	private getString(field: string, data: string, prefix?: string) {
		return `\n${field}:${prefix ? prefix + ' ' : ''}${data}`;
	}

	/**
	 *
	 * @param creators
	 * @returns
	 *
	 * @todo: support other creator types, or at least export as some sort of note
	 */
	private getComposers(creators: Creator[]) {
		let abc = '';
		creators.forEach((creator) => {
			if (creator.type === 'composer') abc += this.getString('C', creator.text);
		});
		return abc;
	}
}
