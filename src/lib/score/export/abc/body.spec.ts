import { beforeEach, describe, expect, it } from 'vitest';
import { Note } from '../../../core/note.js';
import { Score } from '../../score.js';
import { BodyGenerator } from './body.js';

let score: Score;
let generator: BodyGenerator;
let warnings: string[];
const addWarning = (message: string) => {
	warnings.push(message);
};
const throwError = (message: string) => {
	throw new Error(message);
};

const _checkWarning = (warnings: string[]) => {
	if (warnings.length > 0) console.log(warnings);
	expect(warnings.length).toBe(0);
};

beforeEach(() => {
	score = new Score();
	score.parts.addPart();
	warnings = [];
	generator = new BodyGenerator(addWarning, throwError);
});

describe('getBody()', () => {
	it('should beam two eight notes', () => {
		const expectedResult = 'C/2D/2 |]';
		const note = new Note('8', 'c');
		note.beam = { value: 'start' };
		const note2 = new Note('8', 'd');
		note2.beam = { value: 'end' };
		const voice = score.parts.getPart(0).getVoice(0);
		voice.addNote(note);
		voice.addNote(note2);
		score.bars.setBarline('light-heavy', 0);
		const result = generator.getBody(score);
		expect(result).toEqual(expectedResult);
	});
	describe('line count', () => {
		beforeEach(() => {
			const note = new Note('h', 'c');
			const note2 = new Note('h', 'd');
			const note3 = new Note('h', 'e');
			const note4 = new Note('h', 'f');
			const voice = score.parts.getPart(0).getVoice(0);
			voice.addNotes([note, note2, note3, note4]);
			score.bars.setBarline('light-heavy', 1);
			score.bars.bars[0].lineBreak = true;
		});

		it('should handle line breaks', () => {
			const expectedResult = 'C2 D2 |\nE2 F2 |]';
			const result = generator.getBody(score);
			expect(result).toEqual(expectedResult);
		});
		it('should export one line only', () => {
			const expectedResult = 'C2 D2 |';
			const result = generator.getBody(score, { lineCount: 1 });
			expect(result).toEqual(expectedResult);
		});
	});
});
