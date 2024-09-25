import { beforeEach, describe, expect, it } from 'vitest';
import { Scale } from '../../../core/scale.js';
import { AbcImportState } from '../abc.js';
import { BarParser } from './bar.js';
import { Score } from '../../score.js';
import { Key } from '../../../core/key.js';
import { TimeSignature } from '../../../core/timeSignature.js';
import * as direction from '../../../core/data/directions.js';

/**
 * @vitest-environment happy-dom
 */

let state: AbcImportState;
let score: Score;

let parser: BarParser;
beforeEach(() => {
	const scale = new Scale('c', 'major');
	score = new Score(new Key('c', 'major'), new TimeSignature());
	state = new AbcImportState(scale, scale.getNaturalNoteMapping(), 0, 0, []);
	parser = new BarParser(state);
});

describe('parseDecoration()', () => {
	it('should parse D.S.', () => {
		const expectedResult = new direction.Segno('from');
		parser['parseDecoration'](['D.S.'], score);
		expect(score.bars.bars[0].directions).toStrictEqual([expectedResult]);
	});
	it('should parse D.S.alcoda', () => {
		const expectedResult = new direction.Segno('from', 'coda');
		parser['parseDecoration'](['D.S.alcoda'], score);
		expect(score.bars.bars[0].directions).toStrictEqual([expectedResult]);
	});
	it('should parse D.S.alfine', () => {
		const expectedResult = new direction.Segno('from', 'fine');
		parser['parseDecoration'](['D.S.alfine'], score);
		expect(score.bars.bars[0].directions).toStrictEqual([expectedResult]);
	});
});
