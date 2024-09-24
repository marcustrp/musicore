import { beforeEach, describe, expect, it } from 'vitest';
import * as abcjs from 'abcjs';
import { AbcImporter } from './abc';
import { Note } from '../../core/note';
import { Clef } from '../../core/clef';
import Fraction from 'fraction.js';

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
			const expectedResult = [new Note('q', 'b', 'b', 5)];
			const tune = abcjs.renderAbc('*', abc)[0];
			parser.initScore(tune);
			parser.score.parts.addPart(new Clef('treble'));
			parser.parseElement(tune.lines[0].staff![0].voices![0]![0], 0, 0, 0);
			expect(parser.score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(expectedResult);
		});
		it('should add chord (multiple notes)', () => {
			const abc = `%abc-2.2\nX:1\nM:3/4\nL: 1/4\nK:Bb\n[BD] c d | e3 |]`;
			const note = new Note('q', 'b', 'b', 5);
			note.addChordNote(new Note('q', 'd', undefined, 5));
			const expectedResult = [note];
			const tune = abcjs.renderAbc('*', abc)[0];
			parser.initScore(tune);
			parser.score.parts.addPart(new Clef('treble'));
			parser.parseElement(tune.lines[0].staff![0].voices![0]![0], 0, 0, 0);
			expect(parser.score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(expectedResult);
		});
	});
	it('should add chord symbol', () => {
		const abc = `%abc-2.2\nX:1\nM:3/4\nL: 1/4\nK:Bb\n"Bb"B c d | e3 |]`;
		const expectedResult = [{ text: 'Bb' }];
		const tune = abcjs.renderAbc('*', abc)[0];
		parser.initScore(tune);
		parser.score.parts.addPart(new Clef('treble'));
		parser.parseElement(tune.lines[0].staff![0].voices![0]![0], 0, 0, 0);
		expect(parser.score.bars.bars[0].notes['P1']['V1'][0]['_chordSymbols']).toEqual(expectedResult);
	});
	it('should add start slur', () => {
		const abc = `%abc-2.2\nX:1\nM:3/4\nL: 1/4\nK:Bb\n(B c) d |]`;
		const expectedResult = [{ type: 'start' }];
		const tune = abcjs.renderAbc('*', abc)[0];
		parser.initScore(tune);
		parser.score.parts.addPart(new Clef('treble'));
		parser.parseElement(tune.lines[0].staff![0].voices![0]![0], 0, 0, 0);
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
		parser.parseElement(tune.lines[0].staff![0].voices![0]![0], 0, 0, 0);
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
		const note1 = new Note('8', 'c');
		note1.triplet = {
			start: true,
			numerator: 3,
			denominator: 2,
			totalDuration: new Fraction(1, 4),
			noteCount: 3,
		};
		note1.beam = { value: 'start' };
		const note2 = new Note('8', 'd');
		note2.triplet = {
			numerator: 3,
			denominator: 2,
			totalDuration: new Fraction(1, 4),
			noteCount: 3,
		};
		note2.beam = { value: 'continue' };
		const note3 = new Note('8', 'e');
		note3.triplet = {
			end: true,
			numerator: 3,
			denominator: 2,
			totalDuration: new Fraction(1, 4),
			noteCount: 3,
		};
		note3.beam = { value: 'end' };
		const expectedResult = [note1, note2, note3];
		const abc = `%abc-2.2\nX:1\nL: 1/8\n(3CDE |]`;
		parser.parse(abc);
		expect(parser.score.bars.bars[0].notes['P1']['V1']).toStrictEqual(expectedResult);
	});
	it('should import two voices', () => {
		const note1 = new Note('w', 'c');
		const note2 = new Note('w', 'd');
		const abc = `%abc-2.2\nX:1\nM: 4/4\nL: 1/8\n%%score (1 2)\nV:1 clef=treble  name="Tenore I"   snm="T.I"\nV:2 clef=treble  name="Tenore II"  snm="T.II"\n[V:1] C8 |]\n[V:2] D8 |]`;
		parser.parse(abc);
		expect(parser.score.bars.bars[0].notes['P1']['V1']).toStrictEqual([note1]);
		expect(parser.score.bars.bars[0].notes['P1']['V2']).toStrictEqual([note2]);
	});
});
