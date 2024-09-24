import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Clef, ClefType } from '../../../core/clef';
import { Key } from '../../../core/key';
import { TimeSignature } from '../../../core/timeSignature';
import { Score } from '../../score';
import { HeaderGenerator } from './header';

let score: Score;
let generator: HeaderGenerator;
let warnings: string[];
let addWarning = (message: string) => {
	warnings.push(message);
};
let throwError = (message: string) => {
	throw new Error(message);
};

beforeEach(() => {
	score = new Score();
	score.parts.addPart();
	warnings = [];
	generator = new HeaderGenerator(addWarning, throwError);
});

describe('getHeader()', () => {
	let score: Score;
	let header: string;
	beforeEach(() => {
		header = `%abc-2.2
I:abc-charset utf-8
I:abc-creator musicore-0.0.1
X:1
M:3/4
L:1/4
K:G`;
		score = new Score(new Key('g', 'major'), new TimeSignature(3, 4));
		score.parts.addPart();
	});
	it('should return a simple header', () => {
		const result = generator.getHeader(score);
		expect(result).toEqual(header);
	});
	it('should return books', () => {
		const book1 = 'My collection';
		const book2 = 'My collection 2';
		header = header.replace('X:1', `X:1\nB:${book1}\nB:${book2}`);
		score.addInformation('books', book1);
		score.addInformation('books', book2);
		const result = generator.getHeader(score);
		expect(result).toEqual(header);
	});
	it('should return discography', () => {
		const disc1 = 'My collection';
		const disc2 = 'My collection 2';
		header = header.replace('X:1', `X:1\nD:${disc1}\nD:${disc2}`);
		score.addInformation('discography', disc1);
		score.addInformation('discography', disc2);
		const result = generator.getHeader(score);
		expect(result).toEqual(header);
	});
	it('should return notes', () => {
		const note = 'Note';
		header = header.replace('X:1', `X:1\nN:${note}`);
		score.addInformation('notes', note);
		const result = generator.getHeader(score);
		expect(result).toEqual(header);
	});
	it('should return origin', () => {
		const origin = 'Origin';
		header = header.replace('X:1', `X:1\nO:${origin}`);
		score.addInformation('origin', origin);
		const result = generator.getHeader(score);
		expect(result).toEqual(header);
	});
	it('should return rhythm', () => {
		const rhythm = 'Polska';
		header = header.replace('X:1', `X:1\nR:${rhythm}`);
		score.addInformation('type', rhythm);
		const result = generator.getHeader(score);
		expect(result).toEqual(header);
	});
	it('should return source', () => {
		const source = 'Souce';
		header = header.replace('X:1', `X:1\nS:${source}`);
		score.addInformation('source', source);
		const result = generator.getHeader(score);
		expect(result).toEqual(header);
	});
	it('should return transcription', () => {
		// Note: Z:Person1 imports fine, but output contains abc-transcription
		const transcription1 = 'Person1';
		header = header.replace('X:1', `X:1\nZ:abc-transcription ${transcription1}`);
		score.addInformation('transcription', transcription1);
		const result = generator.getHeader(score);
		expect(result).toEqual(header);
	});
	it('should return composers', () => {
		const composers1 = 'Person1';
		const composers2 = 'Person2';
		header = header.replace('X:1', `X:1\nC:${composers1}\nC:${composers2}`);
		score.addWorkInformation('composer', composers1);
		score.addWorkInformation('composer', composers2);
		const result = generator.getHeader(score);
		expect(result).toEqual(header);
	});
});

describe('getTimeSignature()', () => {
	it('should return correct ABC timeSignature', () => {
		const data = [
			{ input: 'common', output: 'C' },
			{ input: 'cut', output: 'C|' },
			{ input: '2/4', output: '2/4' },
		];
		data.forEach((item) => {
			vi.spyOn(score.bars.bars[0].timeSignature, 'toString').mockReturnValueOnce(item.input);
			const result = generator['getTimeSignature'](score);
			expect(result).toBe(item.output);
		});
	});
});

describe('getKey()', () => {
	it('should return correct key', () => {
		const data = [
			{ root: 'f', mode: 'major', result: 'F' },
			{ root: 'c#', mode: 'minor', result: 'C#m' },
			{ root: 'eb', mode: 'dorian', result: 'Eb dorian' },
			{ root: 'c', mode: 'none', result: 'none' },
		];
		data.forEach((item) => {
			score.bars.setKey({ root: item.root, mode: item.mode } as unknown as Key);
			const result = generator['getKey'](score);
			expect(result).toBe(item.result);
		});
	});
	it('should throw if unsupported mode is set', () => {
		score.bars.bars[0].setKey({ root: 'C', mode: 'what' } as unknown as Key);
		const resultFn = () => generator['getKey'](score);
		expect(resultFn).toThrowError(/Unsupported mode/);
	});
});

describe('getClef()', () => {
	describe('should return correct clef for given input', () => {
		const clefs: { clef: ClefType; line?: number; expect: string }[] = [
			{ clef: 'g', expect: 'treble' },
			{ clef: 'treble', expect: 'treble' }, // G2
			{ clef: 'g', line: 1, expect: 'G1' }, // french violin
			{ clef: 'f', line: 5, expect: 'F5' }, // sub bass
			{ clef: 'f', expect: 'bass' }, // F4
			{ clef: 'baritone', expect: 'baritone' }, // F3
			{ clef: 'tenor', expect: 'tenor' },
			{ clef: 'alto', expect: 'alto' },
			{ clef: 'mezzosoprano', expect: 'mezzosoprano' },
			{ clef: 'soprano', expect: 'soprano' },
			{ clef: 'c', expect: 'alto' },
			{ clef: 'perc', expect: 'perc' },
			{ clef: 'none', expect: 'none' },
		];
		for (let i = 0; i < clefs.length; i++) {
			let clef = clefs[i];
			it(`should return correctly parse clef '${clef.clef}'`, () => {
				score = new Score();
				score.parts.addPart(new Clef(clef.clef, clef.line ? clef.line : undefined));
				const result = generator['getClef'](score);
				expect(result).toBe(clef.expect);
			});
		}
	});
});
