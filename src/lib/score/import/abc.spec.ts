import { beforeEach, describe, expect, it } from 'vitest';
import * as abcjs from 'abcjs';
import { AbcImporter } from './abc.js';
import { Note } from '../../core/note.js';
import { Clef } from '../../core/clef.js';
import Fraction from 'fraction.js';
import type { NoteObject } from '$lib/test-types.js';

/**
 * @vitest-environment happy-dom
 */

let parser: AbcImporter;
beforeEach(() => {
	parser = new AbcImporter();
});

describe('parseElement()', () => {
	describe('note', () => {
		it('should add note', () => {
			const abc = `%abc-2.2\nX:1\nM:3/4\nL: 1/4\nK:Bb\nB c d | e3 |]`;
			const expectedResult: NoteObject[] = [{ type: 'q', root: 'b', accidental: 'b', octave: 5 }];
			const tune = abcjs.renderAbc('*', abc)[0];
			parser.initScore(tune);
			parser.score.parts.addPart(new Clef('treble'));
			parser.parseElement(tune.lines[0].staff![0].voices![0]![0]);
			expect(parser.score.parts.getPart(0).getVoice(0).getNotes()).toMatchObject(expectedResult);
		});
		it('should add chord (multiple notes)', () => {
			const abc = `%abc-2.2\nX:1\nM:3/4\nL: 1/4\nK:Bb\n[BD] c d | e3 |]`;
			const chordNote: NoteObject = { type: 'q', root: 'd', octave: 5 };
			const note: NoteObject = {
				chord: [chordNote],
			};
			const expectedResult = [note];
			const tune = abcjs.renderAbc('*', abc)[0];
			parser.initScore(tune);
			parser.score.parts.addPart(new Clef('treble'));
			parser.parseElement(tune.lines[0].staff![0].voices![0]![0]);
			expect(parser.score.parts.getPart(0).getVoice(0).getNotes()).toMatchObject(expectedResult);
		});
	});
	it('should add chord symbol', () => {
		const abc = `%abc-2.2\nX:1\nM:3/4\nL: 1/4\nK:Bb\n"Bb"B c d | e3 |]`;
		const expectedResult = [{ text: 'Bb' }];
		const tune = abcjs.renderAbc('*', abc)[0];
		parser.initScore(tune);
		parser.score.parts.addPart(new Clef('treble'));
		parser.parseElement(tune.lines[0].staff![0].voices![0]![0]);
		expect(parser.score.bars.bars[0].notes['P1']['V1'][0]['_chordSymbols']).toEqual(expectedResult);
	});
	it('should add start slur', () => {
		const abc = `%abc-2.2\nX:1\nM:3/4\nL: 1/4\nK:Bb\n(B c) d |]`;
		const expectedResult = [{ type: 'start' }];
		const tune = abcjs.renderAbc('*', abc)[0];
		parser.initScore(tune);
		parser.score.parts.addPart(new Clef('treble'));
		parser.parseElement(tune.lines[0].staff![0].voices![0]![0]);
		expect((parser.score.parts.getPart(0).getVoice(0).getNote() as Note).slurs).toEqual(
			expectedResult,
		);
	});
	it('should add multiple start slurs', () => {
		const abc = `%abc-2.2\nX:1\nM:3/4\nL: 1/4\nK:Bb\n((B c) d) |]`;
		const expectedResult = [{ type: 'start' }, { type: 'start' }];
		const tune = abcjs.renderAbc('*', abc)[0];
		parser.initScore(tune);
		parser.score.parts.addPart(new Clef('treble'));
		parser.parseElement(tune.lines[0].staff![0].voices![0]![0]);
		expect((parser.score.parts.getPart(0).getVoice(0).getNote() as Note).slurs).toEqual(
			expectedResult,
		);
	});
});

describe('parse()', () => {
	it('should beam four 1/16 notes', () => {
		const abc = `%abc-2.2\nX:1\nL: 1/16\ncdef |]`;
		parser.parse(abc);
		expect((parser.score.bars.bars[0].notes['P1']['V1'][0] as Note).beam?.value).toBe('start');
		expect((parser.score.bars.bars[0].notes['P1']['V1'][1] as Note).beam?.value).toBe('continue');
		expect((parser.score.bars.bars[0].notes['P1']['V1'][2] as Note).beam?.value).toBe('continue');
		expect((parser.score.bars.bars[0].notes['P1']['V1'][3] as Note).beam?.value).toBe('end');
	});
	it('should import triplet', () => {
		const note1: NoteObject = {
			beam: { value: 'start' },
			triplet: {
				start: true,
				numerator: 3,
				denominator: 2,
				totalDuration: new Fraction(1, 4),
				noteCount: 3,
			},
		};
		const note2: NoteObject = {
			beam: { value: 'continue' },
			triplet: {
				numerator: 3,
				denominator: 2,
				totalDuration: new Fraction(1, 4),
				noteCount: 3,
			},
		};
		const note3: NoteObject = {
			beam: { value: 'end' },
			triplet: {
				end: true,
				numerator: 3,
				denominator: 2,
				totalDuration: new Fraction(1, 4),
				noteCount: 3,
			},
		};
		const expectedResult = [note1, note2, note3];
		const abc = `%abc-2.2\nX:1\nL: 1/8\n(3CDE |]`;
		parser.parse(abc);
		expect(parser.score.bars.bars[0].notes['P1']['V1']).toMatchObject(expectedResult);
	});
	it('should import two voices', () => {
		const note1: NoteObject = { root: 'c', type: 'w' };
		const note2: NoteObject = { root: 'd', type: 'w' };
		const abc = `%abc-2.2\nX:1\nM: 4/4\nL: 1/8\n%%score (1 2)\nV:1 clef=treble  name="Tenore I"   snm="T.I"\nV:2 clef=treble  name="Tenore II"  snm="T.II"\n[V:1] C8 |]\n[V:2] D8 |]`;
		parser.parse(abc);
		expect(parser.score.bars.bars[0].notes['P1']['V1']).toMatchObject([note1]);
		expect(parser.score.bars.bars[0].notes['P1']['V2']).toMatchObject([note2]);
	});
});
