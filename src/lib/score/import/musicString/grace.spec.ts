import { beforeEach, describe, expect, it } from 'vitest';
import { Scale } from '$lib/core/scale.js';
import { GraceProcessor } from './grace.js';
import { END } from '$lib/utils/tokenizer.js';

const enum TOKEN_TYPE {
	SPACE,
	FORWARD_SLASH,
	LEFT_PARENTHESIS,
	SCALE_NUMBER,
	LENGTH,
	RIGHT_PARENTHESIS,
	OCTAVE_UP,
	OCTAVE_DOWN,
}

describe('tokenizer', () => {
	it('can parse space', () => {
		const tokens = [...GraceProcessor.tokenize('  ')];
		expect(tokens).toEqual([{ type: END }]);
	});
	it('can parse forward slash', () => {
		const tokens = [...GraceProcessor.tokenize('/')];
		expect(tokens).toEqual([{ type: TOKEN_TYPE.FORWARD_SLASH, index: 1 }, { type: END }]);
	});
	it('can parse left parenthesis', () => {
		const tokens = [...GraceProcessor.tokenize('(')];
		expect(tokens).toEqual([{ type: TOKEN_TYPE.LEFT_PARENTHESIS, index: 1 }, { type: END }]);
	});
	it('can parse simple note', () => {
		const tokens = [...GraceProcessor.tokenize('1')];
		expect(tokens).toEqual([
			{ type: TOKEN_TYPE.SCALE_NUMBER, index: 1, value: '1' },
			{ type: END },
		]);
	});
	it('can parse notes', () => {
		const tokens = [...GraceProcessor.tokenize('+#12-b7')];
		expect(tokens).toEqual([
			{ type: TOKEN_TYPE.OCTAVE_UP, index: 1 },
			{ type: TOKEN_TYPE.SCALE_NUMBER, index: 3, value: '#1' },
			{ type: TOKEN_TYPE.SCALE_NUMBER, index: 4, value: '2' },
			{ type: TOKEN_TYPE.OCTAVE_DOWN, index: 5 },
			{ type: TOKEN_TYPE.SCALE_NUMBER, index: 7, value: 'b7' },
			{ type: END },
		]);
	});
	it('can parse length', () => {
		const tokens = [...GraceProcessor.tokenize('e')];
		expect(tokens).toEqual([{ type: TOKEN_TYPE.LENGTH, index: 1, value: 'e' }, { type: END }]);
	});
	it('can parse right parenthesis', () => {
		const tokens = [...GraceProcessor.tokenize(')')];
		expect(tokens).toEqual([{ type: TOKEN_TYPE.RIGHT_PARENTHESIS, index: 1 }, { type: END }]);
	});
});

describe('parse', () => {
	it('can parse simple grace note', () => {
		const data = GraceProcessor.parse('1', 4);
		expect(data).toMatchObject({
			notes: [{ scaleNumber: '1', octave: 4, length: 's' }],
			type: 'unacc',
		});
	});
	it('can parse slur', () => {
		const data = GraceProcessor.parse('(12)', 4);
		expect(data).toMatchObject({
			notes: [
				{ scaleNumber: '1', octave: 4, length: 's' },
				{ scaleNumber: '2', octave: 4, length: 's' },
			],
			type: 'unacc',
			slur: 'internal',
		});
	});
});

describe('process', () => {
	it('can process simple grace notes', () => {
		const data = GraceProcessor.process('1', 4, new Scale('c', 'major'));
		expect(data).toMatchObject({
			notes: [{ root: 'c', _octave: 4, _type: '16' }],
			type: 'unacc',
		});
	});
	it('can process more complex grace notes', () => {
		const data = GraceProcessor.process('-7+2#1', 4, new Scale('c', 'major'));
		expect(data).toMatchObject({
			notes: [
				{ root: 'b', _octave: 3, _type: '16' },
				{ root: 'd', _octave: 4, _type: '16' },
				{ root: 'c', _octave: 4, _type: '16', accidental: '#' },
			],
			type: 'unacc',
		});
	});

	it('can process complex grace notes', () => {
		const data = GraceProcessor.process('/(+#12--b7e)', 4, new Scale('c', 'major'));
		expect(data).toMatchObject({
			notes: [
				{ _root: 'c', _octave: 5, _type: '8', slurs: [{ type: 'start' }] },
				{ _root: 'd', _octave: 5, _type: '8' },
				{ _root: 'b', _octave: 3, _type: '8', slurs: [{ type: 'end' }] },
			],
			type: 'acc',
		});
	});
	it('can process slur of type continues', () => {
		const data = GraceProcessor.process('(1', 4, new Scale('c', 'major'));
		expect(data).toMatchObject({
			notes: [{ _root: 'c', _octave: 4, _type: '16', slurs: [{ type: 'start' }] }],
			type: 'unacc',
		});
	});
});
