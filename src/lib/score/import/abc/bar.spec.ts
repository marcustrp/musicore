import { beforeEach, describe, expect, it } from 'vitest';
import { Scale } from '../../../core/scale';
import { AbcImportState } from '../abc';
import { BarParser } from './bar';
import * as abcjs from 'abcjs';
import { Bar } from '../../../core/bar';
import { Score } from '../../score';
import { Key } from '../../../core/key';
import { TimeSignature } from '../../../core/timeSignature';
import * as direction from '../../../core/data/directions';

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
