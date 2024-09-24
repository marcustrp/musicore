import { beforeEach, describe, expect, it } from 'vitest';
import { Clef } from '../../core/clef';
import { Note } from '../../core/note';
import { Score } from '../score';
import { FormAnalyser, FormData, JumpData } from './formAnalyser';

let parser: FormAnalyser;
beforeEach(() => {
	parser = new FormAnalyser();
});

describe('parse()', () => {
	it('should parse a single repeat from the beginning', () => {
		const expectedResult: FormData = {
			barSequence: [0, 1, 2, 0, 1, 2],
			jumps: [{ fromBar: 2, toBar: 0, type: 'repeat' }],
		};
		const score = new Score();
		const voice = score.parts.addPart().getVoice(0);
		voice.addNote(new Note('w', 'c'));
		voice.addNote(new Note('w', 'c'));
		voice.addNote(new Note('w', 'c'));
		score.bars.setRepeatEnd(1, 2);
		const result = parser.parse(score);
		expect(result).toEqual(expectedResult);
	});
	it('should parse a single repeat from the beginning, with endings', () => {
		const expectedResult: FormData = {
			barSequence: [0, 1, 2, 0, 1, 3],
			jumps: [
				{ fromBar: 2, toBar: 0, type: 'repeat' },
				{ fromBar: 1, toBar: 3, type: 'ending' },
			],
		};
		const score = new Score();
		const voice = score.parts.addPart().getVoice(0);
		voice.addNote(new Note('w', 'c'));
		voice.addNote(new Note('w', 'c'));
		voice.addNote(new Note('w', 'c'));
		voice.addNote(new Note('w', 'c'));
		score.bars.setRepeatEnd(1, 2);
		score.bars.setEnding(1, 2);
		score.bars.setEnding(2, 3);
		const result = parser.parse(score);
		expect(result).toEqual(expectedResult);
	});
});
