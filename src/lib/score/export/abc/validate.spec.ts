import { beforeEach, describe, expect, it } from 'vitest';
import { Bar } from '../../../core/bar';
import { Clef } from '../../../core/clef';
import { Key } from '../../../core/key';
import { TimeSignature } from '../../../core/timeSignature';
import { Score } from '../../score';
import { validateScore } from './validate';

let warnings: string[];
let addWarning = (message: string) => {
	warnings.push(message);
};
let throwError = (message: string) => {
	throw new Error(message);
};
let score: Score;

beforeEach(() => {
	score = new Score();
	score.parts.addPart();
	warnings = [];
});

describe('validateScore', () => {
	it('should throw if bars not set', () => {
		score.bars.bars = [];
		const resultFn = () => validateScore(score, addWarning, throwError);
		expect(resultFn).toThrowError(/No bars/);
	});
	it('should pass with multiple bars of same timeSignature', () => {
		score.bars.appendBar();
		const result = validateScore(score, addWarning, throwError);
		expect(result).toBeUndefined();
	});
	it('should throw if multiple timeSignatures set', () => {
		//scoreMock.timeSignature = [{ toString: vi.fn() }, { toString: vi.fn() }];
		const key = new Key('c', 'major');
		score.bars.bars = [new Bar(new TimeSignature(), key), new Bar(new TimeSignature(2, 4), key)];
		const resultFn = () => validateScore(score, addWarning, throwError);
		expect(resultFn).toThrowError(/TimeSignature change/);
	});
});
