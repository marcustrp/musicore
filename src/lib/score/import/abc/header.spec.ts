import { beforeEach, describe, expect, it } from 'vitest';
import { Key } from '../../../core/key';
import HeaderParser from './header';
import * as abcjs from 'abcjs';
import { TimeSignature } from '../../../core/timeSignature';
import { AbcImportState } from '../abc';
import { Scale } from '../../../core/scale';

/**
 * @vitest-environment happy-dom
 */

let state: AbcImportState;

let parser: HeaderParser;
beforeEach(() => {
	const scale = new Scale('c', 'major');
	state = new AbcImportState(scale, scale.getNaturalNoteMapping(), 0, 0, []);
	parser = new HeaderParser(state);
});

describe('getKey()', () => {
	it('should return correct key', () => {
		const abc = `%abc-2.2\nX:1\nM:3/4\nL: 1/4\nK:Bb\nB c d | e3 |]`;
		const expectedResult = new Key('bb', 'major');
		const tune = abcjs.renderAbc('*', abc)[0];
		const result = parser.getKey(tune.getKeySignature());
		expect(result).toStrictEqual(expectedResult);
	});
});

describe('getTimeSignature()', () => {
	it('should return correct timeSignature', () => {
		const abc = `%abc-2.2\nX:1\nM:3/4\nL: 1/4\nK:Bb\nB c d | e3 |]`;
		const expectedResult = new TimeSignature(3, 4);
		const tune = abcjs.renderAbc('*', abc)[0];
		const result = parser.getTimeSignature(tune.getMeter());
		expect(result).toStrictEqual(expectedResult);
	});
	it('should return correct timeSignature', () => {
		const abc = `%abc-2.2\nX:1\nM:C|\nL: 1/4\nK:Bb\nB c d | e3 |]`;
		const expectedResult = new TimeSignature('cut');
		const tune = abcjs.renderAbc('*', abc)[0];
		const result = parser.getTimeSignature(tune.getMeter());
		expect(result).toStrictEqual(expectedResult);
	});
});
