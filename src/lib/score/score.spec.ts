import Fraction from 'fraction.js';
import { it, expect, describe, beforeEach, vi } from 'vitest';
import { Bar } from '../core/bar';
import { Clef } from '../core/clef';
import { Key } from '../core/key';
import { TimeSignature } from '../core/timeSignature';
import { Note } from '../core/note';
import { Score } from './score';
import { Part } from './part';

/*it('should return correct title', () => {
  const expectedResult = 'test';
  const score = new Score();
  score.work = {title: 'test'};
  expect(score.work.title).toBe(expectedResult);
})*/

describe('constructor', () => {
	it('should use the default key', () => {
		const score = new Score();
		const expectedResult = { root: 'c', mode: 'major' };
		expect(score.bars.bars[0].key.root).toBe(expectedResult.root);
		expect(score.bars.bars[0].key.mode).toBe(expectedResult.mode);
	});

	it('should use the provided key', () => {
		const score = new Score();
		score.bars.bars[0].setKey(new Key('d', 'minor'));
		const expectedResult = { root: 'd', mode: 'minor' };
		expect(score.bars.bars[0].key.root).toBe(expectedResult.root);
		expect(score.bars.bars[0].key.mode).toBe(expectedResult.mode);
	});
	it('should use the default timeSignature', () => {
		const score = new Score();
		const expectedResult = { count: 4, unit: 4 };
		expect(score.bars.bars[0].timeSignature.count).toBe(expectedResult.count);
		expect(score.bars.bars[0].timeSignature.unit).toBe(expectedResult.unit);
	});
	it('should use the provided timeSignature', () => {
		const score = new Score(undefined, new TimeSignature(2, 4));
		const expectedResult = { count: 2, unit: 4 };
		expect(score.bars.bars[0].timeSignature.count).toBe(expectedResult.count);
		expect(score.bars.bars[0].timeSignature.unit).toBe(expectedResult.unit);
	});
});

describe('addWorkInformation()', () => {
	let score: Score;
	beforeEach(() => {
		score = new Score();
	});
	it('should add work information of type composer', () => {
		score.addWorkInformation('composer', 'test');
		const expectedResult = [{ type: 'composer', text: 'test' }];
		expect(score.work.creator).toEqual(expectedResult);
	});
	it('should add work information of type lyrics', () => {
		score.addWorkInformation('lyrics', 'test');
		const expectedResult = [{ type: 'lyrics', text: 'test' }];
		expect(score.work.creator).toEqual(expectedResult);
	});
	it('should add work information of type history', () => {
		score.addWorkInformation('history', 'test');
		const expectedResult = { history: 'test' };
		expect(score.work.history).toEqual(expectedResult);
	});
	it('should add work information of type title', () => {
		score.addWorkInformation('title', 'test');
		const expectedResult = { title: 'test' };
		expect(score.work).toEqual(expectedResult);
	});
	it('should add work information of type subtitle', () => {
		score.addWorkInformation('subtitle', 'test');
		const expectedResult = { subtitle: 'test' };
		expect(score.work).toEqual(expectedResult);
	});
	it('should throw error if type is unknown', () => {
		expect(() => score.addWorkInformation('test' as any, 'test')).toThrowError(
			'Unknown work information type',
		);
	});
});

describe('addInformation()', () => {
	let score: Score;
	beforeEach(() => {
		score = new Score();
	});
	it('should add multiple information of type books', () => {
		score.addInformation('books', 'test');
		score.addInformation('books', 'test2');
		const expectedResult = { books: ['test', 'test2'] };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add multiple information of type discography', () => {
		score.addInformation('discography', 'test');
		score.addInformation('discography', 'test2');
		const expectedResult = { discography: ['test', 'test2'] };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add information of type group', () => {
		score.addInformation('group', 'test');
		const expectedResult = { group: 'test' };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add information of type instruction', () => {
		score.addInformation('instruction', 'test');
		const expectedResult = { instruction: 'test' };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add information of type notes', () => {
		score.addInformation('notes', 'test');
		const expectedResult = { notes: 'test' };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add information of type origin', () => {
		score.addInformation('origin', 'test');
		const expectedResult = { origin: 'test' };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add information of type type', () => {
		score.addInformation('type', 'test');
		const expectedResult = { type: 'test' };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add information of type source', () => {
		score.addInformation('source', 'test');
		const expectedResult = { source: 'test' };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add information of type url', () => {
		score.addInformation('url', 'test');
		const expectedResult = { url: 'test' };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add information of type transcription', () => {
		score.addInformation('transcription', 'test');
		const expectedResult = { transcription: { creator: 'test' } };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add information of type transcription.creator', () => {
		score.addInformation('transcription.creator', 'test');
		const expectedResult = { transcription: { creator: 'test' } };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add information of type transcription.editedBy', () => {
		score.addInformation('transcription.editedBy', 'test');
		const expectedResult = { transcription: { editedBy: 'test' } };
		expect(score.information).toEqual(expectedResult);
	});
	it('should add information of type transcription.copyright', () => {
		score.addInformation('transcription.copyright', 'test');
		const expectedResult = { transcription: { copyright: 'test' } };
		expect(score.information).toEqual(expectedResult);
	});
	it('should overwrite existing information', () => {
		score.addInformation('group', 'test');
		score.addInformation('group', 'test2');
		const expectedResult = { group: 'test2' };
		expect(score.information).toEqual(expectedResult);
	});
});

describe('addVerse()', () => {
	let score: Score;
	beforeEach(() => {
		score = new Score();
	});
	it('should add a verse', () => {
		score.addVerse('test');
		const expectedResult = { text: 'test' };
		expect(Array.isArray(score.verses)).toBeTruthy();
		expect(score.verses![0]).toEqual(expectedResult);
	});
	it('should add multiple verses', () => {
		score.addVerse('test', 2);
		score.addVerse('test2', 3);
		const expectedResult = [
			{ text: 'test', number: 2 },
			{ text: 'test2', number: 3 },
		];
		expect(Array.isArray(score.verses)).toBeTruthy();
		expect(score.verses).toEqual(expectedResult);
	});
});
