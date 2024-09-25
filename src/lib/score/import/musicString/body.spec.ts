import Fraction from 'fraction.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { Bar } from '../../../core/bar.js';
import { Crescendo, Diminuendo, Dynamic, Mordent, Trill } from '../../../core/data/notations.js';
import { Key } from '../../../core/key.js';
import { TimeSignature } from '../../../core/timeSignature.js';
import { Note, type ScaleNumber } from '../../../core/note.js';
import { Rest } from '../../../core/rest.js';
import { type NoteType } from '../../../core/rhythmElement.js';
import { Scale } from '../../../core/scale.js';
import { type BodyData, BodyMatch, BodyParser } from './body.js';
import ChordSymbol from '../../../core/chordSymbol.js';
import RomanNumeralAnalysis from '../../../core/romanNumeralAnalysis.js';
import FunctionAnalysis from '../../../core/functionAnalysis.js';

let parser: BodyParser;
let errors: string[];
let octave: number;
let scale: Scale;
let info: { octave: number; scale: Scale };

beforeEach(() => {
	errors = new Array<string>();
	parser = new BodyParser(errors);
	octave = 5;
	scale = new Scale('c', 'major');
	info = { octave: octave, scale: scale };
});

describe('parse()', () => {
	it('should parse rest', () => {
		const musicstring = 'r';
		const expectedResult = [{ item: new Rest('q') }];
		const result = parser.parse(
			musicstring,
			info,
			new Bar(new TimeSignature(), new Key('c', 'major')),
		);
		expect(result).toStrictEqual(expectedResult);
	});
	it('should parse number with accidental', () => {
		const musicstring = '#4';
		const expectedResult = [{ item: new Note('q', 'f', '#', 5) }];
		const result = parser.parse(
			musicstring,
			info,
			new Bar(new TimeSignature(), new Key('c', 'major')),
		);
		expect(result).toStrictEqual(expectedResult);
	});
	describe('groups', () => {
		it('should return correct octave for 321-7', () => {
			const musicstring = '321-7';
			const note1 = new Note('16', 'e');
			note1.beam = { value: 'start' };
			const note2 = new Note('16', 'd');
			note2.beam = { value: 'continue' };
			const note3 = new Note('16', 'c');
			note3.beam = { value: 'continue' };
			const note4 = new Note('16', 'b', undefined, 4);
			note4.beam = { value: 'end' };
			const expectedResult = [{ item: note1 }, { item: note2 }, { item: note3 }, { item: note4 }];
			const result = parser.parse(
				musicstring,
				info,
				new Bar(new TimeSignature(), new Key('c', 'major')),
			);
			expect(result).toStrictEqual(expectedResult);
		});
		it('should return correct octave for 17+23', () => {
			const musicstring = '17+23';
			const note1 = new Note('16', 'c', undefined, 5);
			note1.beam = { value: 'start' };
			const note2 = new Note('16', 'b', undefined, 5);
			note2.beam = { value: 'continue' };
			const note3 = new Note('16', 'd', undefined, 6);
			note3.beam = { value: 'continue' };
			const note4 = new Note('16', 'e', undefined, 6);
			note4.beam = { value: 'end' };
			const expectedResult = [{ item: note1 }, { item: note2 }, { item: note3 }, { item: note4 }];
			const result = parser.parse(
				musicstring,
				info,
				new Bar(new TimeSignature(), new Key('c', 'major')),
			);
			expect(info.octave).toBe(6);
			expect(result).toStrictEqual(expectedResult);
		});
		it('should return correct octave for 1_/51', () => {
			const musicstring = '1_/51';
			const note1 = new Note('8', 'c', undefined, 5);
			note1.beam = { value: 'start' };
			const note2 = new Note('16', 'g', undefined, 4);
			note2.beam = { value: 'continue' };
			const note3 = new Note('16', 'c', undefined, 5);
			note3.beam = { value: 'end' };
			const expectedResult = [{ item: note1 }, { item: note2 }, { item: note3 }];
			const result = parser.parse(
				musicstring,
				info,
				new Bar(new TimeSignature(), new Key('c', 'major')),
			);
			expect(result).toStrictEqual(expectedResult);
		});
		it('should return correct octave for /75', () => {
			const musicstring = '/75';
			const note1 = new Note('8', 'b', undefined, 4);
			note1.beam = { value: 'start' };
			const note2 = new Note('8', 'g', undefined, 5);
			note2.beam = { value: 'end' };
			const expectedResult = [{ item: note1 }, { item: note2 }];
			const result = parser.parse(
				musicstring,
				info,
				new Bar(new TimeSignature(), new Key('c', 'major')),
			);
			note1['id'] = result![0].item.id;
			note2['id'] = result![1].item.id;
			expect(result).toStrictEqual(expectedResult);
		});
	});
	it('should return correctly parse start of quarter triplet', () => {
		const musicstring = '3:2';
		const note1 = new Note('q', 'd');
		const expectedResult = [{ item: note1, triplet: { p: 3, q: 2, r: 3 } }];
		const result = parser.parse(
			musicstring,
			info,
			new Bar(new TimeSignature(), new Key('c', 'major')),
		);
		note1['id'] = result![0].item.id;
		expect(result).toStrictEqual(expectedResult);
	});
});

describe('match()', () => {
	describe('single notes', () => {
		it('should return correct data with only notetype specified', () => {
			const musicString = 'h';
			const data = [{ items: '1', type: 'h' }];
			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(result).toEqual(data);
		});
		it('should return correct data with sharp sign and number', () => {
			const musicString = '#4';
			const data = [{ items: '#4', type: 'q', typeIsDefault: true }];
			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(result).toEqual(data);
		});
		it('should return correct data with flat sign and number', () => {
			const musicString = 'b3';
			const data = [{ items: 'b3', type: 'q', typeIsDefault: true }];
			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(result).toEqual(data);
		});
		it('should return correct data with double dots', () => {
			const musicString = 'q..';
			const data = [{ items: '1', type: 'q', dots: 2 }];
			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(result).toEqual(data);
		});
		it('should return correct data with lyrics', () => {
			const musicString = "'Ta'5h";
			const data = [
				{
					items: '5',
					type: 'h',
					lyrics: 'Ta',
				},
			];

			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));

			expect(result).toEqual(data);
		});
		it('should not return lyrics if empty lyrics supplied', () => {
			const musicString = "''5h";
			const data = [
				{
					items: '5',
					type: 'h',
				},
			];

			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));

			expect(result).toEqual(data);
		});
		it('should return correct data with step (analysis)', () => {
			const musicString = '`IVm`5h';
			const data = [
				{
					items: '5',
					type: 'h',
					step: 'IVm',
				},
			];

			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));

			expect(result).toEqual(data);
		});
		it('should return correct data with chord symbol (function)', () => {
			const musicString = '"Gm"5h';
			const data = [
				{
					items: '5',
					type: 'h',
					chordSymbol: 'Gm',
				},
			];

			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));

			expect(result).toEqual(data);
		});
		it('should return correct data with solfa', () => {
			const musicString = '´Ta´5h';
			const data = [
				{
					items: '5',
					type: 'h',
					solfa: 'Ta',
				},
			];

			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));

			expect(result).toEqual(data);
		});
		it('should return correct data with function (analysis)', () => {
			const musicString = '*D64*5h';
			const data = [
				{
					items: '5',
					type: 'h',
					function: 'D64',
				},
			];

			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));

			expect(result).toEqual(data);
		});
		it('should return a tie', () => {
			const musicString = '1q=';
			const data = [{ items: '1', type: 'q', tie: true }];
			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(result).toEqual(data);
		});
		it('should return rest', () => {
			const musicString = 'r';
			const data = [
				{
					items: 'r',
					type: 'q',
					typeIsDefault: true,
					rest: true,
				},
			];

			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));

			expect(result).toEqual(data);
		});
		it('should return chord notes', () => {
			const musicString = '[-51b35+1]h.';
			const data = [
				{
					items: '-51b35+1',
					type: 'h',
					dots: 1,
				},
			];

			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));

			expect(result).toEqual(data);
		});
		it('should return notation', () => {
			const musicString = '!f!1w';
			const data = [
				{
					items: '1',
					type: 'w',
					notations: '!f!',
				},
			];
			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(result).toEqual(data);
		});
		it('should return spacer', () => {
			const musicString = '"Am"yh.';
			const data = [
				{
					items: 'y',
					chordSymbol: 'Am',
					type: 'h',
					dots: 1,
				},
			];
			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(result).toEqual(data);
		});
		it('should add single start slur', () => {
			const musicString = '(1q';
			const data = [{ items: '1', type: 'q', slurs: [{ type: 'start', index: 0 }] }];
			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(result).toEqual(data);
		});
		it('should add two start slurs', () => {
			const musicString = '((1q';
			const data = [
				{
					items: '1',
					type: 'q',
					slurs: [
						{ type: 'start', index: 0 },
						{ type: 'start', index: 1 },
					],
				},
			];
			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(result).toEqual(data);
		});
		it('should add two end slurs', () => {
			const musicString = '1q))';
			const data = [
				{
					items: '1',
					type: 'q',
					slurs: [
						{ type: 'end', index: 1 },
						{ type: 'end', index: 0 },
					],
				},
			];
			parser.slurIndex = 2;
			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(result).toEqual(data);
		});
		it('should add error message if end slur without start', () => {
			const musicString = '1q))';
			const data = [
				{
					items: '1',
					type: 'q',
					slurs: [{ type: 'end', index: 0 }],
				},
			];
			parser.slurIndex = 1;
			const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(result).toEqual(data);
			expect(parser.errors.length).toBe(1);
			expect(parser.errors[0]).toBe('Missing start of slur');
		});
	});
	describe('note groups', () => {
		describe('2/4, 3/4, 4/4 and so on...', () => {
			it('should return two eight notes with 11', () => {
				const musicString = '11';
				const data = [
					{ items: '1', type: '8', typeIsDefault: true, beam: 'start' },
					{ items: '1', type: '8', typeIsDefault: true, beam: 'end' },
				];
				const result = parser.match(
					musicString,
					new Bar(new TimeSignature(), new Key('c', 'major')),
				);
				expect(result).toEqual(data);
			});
			it('should handle 5643', () => {
				// with old length params using 8, 16, 32, 64... this failed.
				const musicString = '5643';
				const data = [
					{ items: '5', type: '16', typeIsDefault: true, beam: 'start' },
					{ items: '6', type: '16', typeIsDefault: true, beam: 'continue' },
					{ items: '4', type: '16', typeIsDefault: true, beam: 'continue' },
					{ items: '3', type: '16', typeIsDefault: true, beam: 'end' },
				];
				const result = parser.match(
					musicString,
					new Bar(new TimeSignature(), new Key('c', 'major')),
				);
				expect(result).toEqual(data);
			});
			it('should handle 1_', () => {
				const musicString = '1_';
				const data = [{ items: '1', type: 'h' }];
				const result = parser.match(
					musicString,
					new Bar(new TimeSignature(), new Key('c', 'major')),
				);
				expect(result).toEqual(data);
			});
			it('should handle 1_.', () => {
				const musicString = '1_.';
				const data = [{ items: '1', type: 'h', dots: 1 }];
				const result = parser.match(
					musicString,
					new Bar(new TimeSignature(), new Key('c', 'major')),
				);
				expect(result).toEqual(data);
			});
			it('should handle 1__', () => {
				const musicString = '1__';
				const data = [{ items: '1', type: 'w' }];
				const result = parser.match(
					musicString,
					new Bar(new TimeSignature(), new Key('c', 'major')),
				);
				expect(result).toEqual(data);
			});
			it('should handle 1__.', () => {
				const musicString = '1__.';
				const data = [{ items: '1', type: 'w', dots: 1 }];
				const result = parser.match(
					musicString,
					new Bar(new TimeSignature(), new Key('c', 'major')),
				);
				expect(result).toEqual(data);
			});
			it('should handle 2s3s', () => {
				const musicString = '2s3s';
				const data = [
					{ items: '2', type: '16', beam: 'start' },
					{ items: '3', type: '16', beam: 'end' },
				];
				const result = parser.match(
					musicString,
					new Bar(new TimeSignature(), new Key('c', 'major')),
				);
				expect(result).toEqual(data);
			});
			it('should handle 4_64', () => {
				const musicString = '4_64';
				const data = [
					{ items: '4', type: '8', beam: 'start' },
					{ items: '6', type: '16', typeIsDefault: true, beam: 'continue' },
					{ items: '4', type: '16', typeIsDefault: true, beam: 'end' },
				];
				const result = parser.match(
					musicString,
					new Bar(new TimeSignature(), new Key('c', 'major')),
				);
				expect(result).toEqual(data);
			});
			it('should handle r5', () => {
				const musicString = 'r5';
				const data = [
					{ type: '8', items: 'r', rest: true, typeIsDefault: true },
					{ items: '5', type: '8', typeIsDefault: true },
				];
				const result = parser.match(
					musicString,
					new Bar(new TimeSignature(), new Key('c', 'major')),
				);
				expect(result).toEqual(data);
			});
		});
		describe('triplet', () => {
			describe('standard eight triplet', () => {
				/*it('should handle special case 123', () => {
          const musicString = '123';
          const data = [
            { items: '1', triplet: { p: 3 }, type: '8', typeIsDefault: true, beam: 'start' },
            { items: '2', type: '8', typeIsDefault: true, beam: 'continue' },
            { items: '3', type: '8', typeIsDefault: true, beam: 'end' },
          ];
          const result = parser.match(musicString, new Bar(new TimeSignature(), new Key('c', 'major')));
          expect(parser.errors.length).toBe(0);
          expect(result).toEqual(data);
        });*/
				it('should handle 3:123', () => {
					const musicString = '3:123';
					const data = [
						{ items: '1', triplet: { p: 3 }, type: '8', typeIsDefault: true, beam: 'start' },
						{ items: '2', type: '8', typeIsDefault: true, beam: 'continue' },
						{ items: '3', type: '8', typeIsDefault: true, beam: 'end' },
					];
					const result = parser.match(
						musicString,
						new Bar(new TimeSignature(), new Key('c', 'major')),
					);
					expect(parser.errors.length).toBe(0);
					expect(result).toEqual(data);
				});
				it('should handle 3:2:123', () => {
					const musicString = '3:2:123';
					const data = [
						{ items: '1', triplet: { p: 3, q: 2 }, type: '8', typeIsDefault: true, beam: 'start' },
						{ items: '2', type: '8', typeIsDefault: true, beam: 'continue' },
						{ items: '3', type: '8', typeIsDefault: true, beam: 'end' },
					];
					const result = parser.match(
						musicString,
						new Bar(new TimeSignature(), new Key('c', 'major')),
					);
					expect(parser.errors.length).toBe(0);
					expect(result).toEqual(data);
				});
				it('should handle 3:2:3:123', () => {
					const musicString = '3:2:3:123';
					const data = [
						{
							items: '1',
							triplet: { p: 3, q: 2, r: 3 },
							type: '8',
							typeIsDefault: true,
							beam: 'start',
						},
						{ items: '2', type: '8', typeIsDefault: true, beam: 'continue' },
						{ items: '3', type: '8', typeIsDefault: true, beam: 'end' },
					];
					const result = parser.match(
						musicString,
						new Bar(new TimeSignature(), new Key('c', 'major')),
					);
					expect(parser.errors.length).toBe(0);
					expect(result).toEqual(data);
				});
				it('should handle 123:321', () => {
					const musicString = '123:321';
					const data = [
						{ items: '1', type: '16', typeIsDefault: true, beam: 'start' },
						{ items: '2', type: '16', typeIsDefault: true, beam: 'continue' },
						{ items: '3', triplet: { p: 3 }, type: '16', typeIsDefault: true, beam: 'continue' },
						{ items: '2', type: '16', typeIsDefault: true, beam: 'continue' },
						{ items: '1', type: '16', typeIsDefault: true, beam: 'end' },
					];
					const result = parser.match(
						musicString,
						new Bar(new TimeSignature(), new Key('c', 'major')),
					);
					expect(parser.errors.length).toBe(0);
					expect(result).toEqual(data);
				});
				it('should handle 1_3:321', () => {
					const musicString = '1_3:321';
					const data = [
						{ items: '1', type: '8', beam: 'start' },
						{ items: '3', triplet: { p: 3 }, type: '16', typeIsDefault: true, beam: 'continue' },
						{ items: '2', type: '16', typeIsDefault: true, beam: 'continue' },
						{ items: '1', type: '16', typeIsDefault: true, beam: 'end' },
					];
					const result = parser.match(
						musicString,
						new Bar(new TimeSignature(), new Key('c', 'major')),
					);
					expect(parser.errors.length).toBe(0);
					expect(result).toEqual(data);
				});
			});
			describe('standard quarter triplet', () => {
				it('should handle (start of) 3:1 2 3', () => {
					const musicString = '3:1';
					const data = [{ items: '1', triplet: { p: 3 }, type: 'q', typeIsDefault: true }];
					const result = parser.match(
						musicString,
						new Bar(new TimeSignature(), new Key('c', 'major')),
					);
					expect(parser.errors.length).toBe(0);
					expect(result).toEqual(data);
				});
			});
		});
	});
	/** @todo implement note groups for 3/8, 6/8, 9/8, 12/8 */
});

describe('matchParse()', () => {
	it('should parse a tie', () => {
		const data = [];
		data[BodyMatch.NOTE] = '1';
		data[BodyMatch.TIE] = '=';
		const expectedResult = { items: '1', tie: true, type: 'q', typeIsDefault: true };
		const result = parser.matchParse(data);
		expect(result).toEqual(expectedResult);
	});
});

describe('processBodyGroup()', () => {
	describe('groups of 1/4', () => {
		it('should handle xx', () => {
			const input: BodyData[] = [
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', typeIsDefault: true, items: '1', beam: 'start' },
				{ type: '8', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x_xx', () => {
			const input: BodyData[] = [
				{ type: '_', items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', items: '1', beam: 'start' },
				{ type: '16', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '16', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle xxx_', () => {
			const input: BodyData[] = [
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: '_', items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '16', typeIsDefault: true, items: '1', beam: 'start' },
				{ type: '16', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '8', items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle xxxx', () => {
			const input: BodyData[] = [
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '16', typeIsDefault: true, items: '1', beam: 'start' },
				{ type: '16', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '16', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '16', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x.x', () => {
			const input: BodyData[] = [
				{ type: 'q', dots: 1, typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', dots: 1, typeIsDefault: true, items: '1', beam: 'start' },
				{ type: '16', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x_.x', () => {
			const input: BodyData[] = [
				{ type: 'q', dots: 2, typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', dots: 2, typeIsDefault: true, items: '1', beam: 'start' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x_.xx', () => {
			const input: BodyData[] = [
				{ type: '_', dots: 1, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', dots: 1, items: '1', beam: 'start' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x_.xx', () => {
			const input: BodyData[] = [
				{ type: '_', dots: 2, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', dots: 2, items: '1', beam: 'start' },
				{ type: '64', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '64', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x__xxxx', () => {
			const input: BodyData[] = [
				{ type: '__', items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', items: '1', beam: 'start' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x__x_xx', () => {
			const input: BodyData[] = [
				{ type: '__', items: '1' },
				{ type: '_', items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', items: '1', beam: 'start' },
				{ type: '16', items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x__x_xx', () => {
			const input: BodyData[] = [
				{ type: '__', items: '1' },
				{ type: '_', items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', items: '1', beam: 'start' },
				{ type: '16', items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x_x_x_xx', () => {
			const input: BodyData[] = [
				{ type: '_', items: '1' },
				{ type: '_', items: '1' },
				{ type: '_', items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '16', items: '1', beam: 'start' },
				{ type: '16', items: '1', beam: 'continue' },
				{ type: '16', items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle xx_xx_xx', () => {
			const input: BodyData[] = [
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: '_', items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: '_', items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '32', typeIsDefault: true, items: '1', beam: 'start' },
				{ type: '16', items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '16', items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x.xx_x_', () => {
			const input: BodyData[] = [
				{ type: 'q', dots: 1, typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: '_', items: '1' },
				{ type: '_', items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '16', dots: 1, typeIsDefault: true, items: '1', beam: 'start' },
				{ type: '32', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '16', items: '1', beam: 'continue' },
				{ type: '16', items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
	});
	describe('groups of 3/8', () => {
		it('should handle xxx', () => {
			const input: BodyData[] = [
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', typeIsDefault: true, items: '1', beam: 'start' },
				{ type: '8', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '8', typeIsDefault: true, items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(3, 8), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x.xx_', () => {
			const input: BodyData[] = [
				{ type: 'q', dots: 1, typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: '_', items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', dots: 1, typeIsDefault: true, items: '1', beam: 'start' },
				{ type: '16', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '8', items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(3, 8), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
		it('should handle x_xxx_', () => {
			const input: BodyData[] = [
				{ type: '_', items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: 'q', typeIsDefault: true, items: '1' },
				{ type: '_', items: '1' },
			];
			const expectedResult: BodyData[] = [
				{ type: '8', items: '1', beam: 'start' },
				{ type: '16', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '16', typeIsDefault: true, items: '1', beam: 'continue' },
				{ type: '8', items: '1', beam: 'end' },
			];
			parser.processBodyGroup(input, new Bar(new TimeSignature(3, 8), new Key('c', 'major')));
			expect(input).toEqual(expectedResult);
		});
	});
});

describe('process()', () => {
	it('should return a note', () => {
		const data = {
			items: '2',
			type: 'h' as NoteType,
		};
		const note = Note.fromScaleNumber(data.items as ScaleNumber, 5, scale, data.type);
		const expectedResult = { item: note };
		const result = parser.process(data, info);
		note['id'] = result!.item.id;
		expect(result).toEqual(expectedResult);
	});
	it('should return a note with sharp accidental', () => {
		const data = {
			items: '#4',
			type: 'q' as NoteType,
		};
		const note = Note.fromScaleNumber(data.items as ScaleNumber, 5, scale, data.type);
		const expectedResult = { item: note };
		const result = parser.process(data, info);
		note['id'] = result!.item.id;
		expect(result).toEqual(expectedResult);
	});
	/*it('should correct octave for b#', () => {
    scale = new Scale('minor', 'g');
    const data = {
      items: '#3',
      type: 'q' as NoteType,
    };
    const note = Note.fromScaleNumber(data.items as ScaleNumber, 5, scale, data.type);
    const expectedResult = { item: note };
    const result = parser.process(data, info);
    expect(result).toEqual(expectedResult);
    expect((result!.item as Note).octave).toEqual(5);
  });*/
	it('should return a note with tie', () => {
		const data = {
			items: '2',
			type: 'h' as NoteType,
			tie: true,
		};
		const note = Note.fromScaleNumber(data.items as ScaleNumber, 5, scale, data.type);
		note.tie = 'start';
		const expectedResult = { item: note };
		const result = parser.process(data, info);
		note['id'] = result!.item.id;
		expect(result).toEqual(expectedResult);
	});
	/*it('should return a note with chord notes', () => {
    const data = {
      items: '1b35',
      type: 'h' as NoteType,
    };
    const note = Note.fromScaleNumber('1', 5, scale, data.type);
    const chordNote1 = Note.fromScaleNumber('b3', 5, scale, data.type);
    const chordNote2 = Note.fromScaleNumber('5', 5, scale, data.type);
    note.addChordNote(chordNote1);
    note.addChordNote(chordNote2);
    const expectedResult = { item: note };
    const result = parser.process(data, info);
    expect(result).toEqual(expectedResult);
  });
  it('should return a note with chord notes, where all notes are tied', () => {
    const data = {
      items: '1b35',
      type: 'h' as NoteType,
      tie: true,
    };
    const note = Note.fromScaleNumber('1', 5, scale, data.type);
    note.tie = 'start';
    const chordNote1 = Note.fromScaleNumber('b3', 5, scale, data.type);
    chordNote1.tie = 'start';
    const chordNote2 = Note.fromScaleNumber('5', 5, scale, data.type);
    chordNote2.tie = 'start';
    note.addChordNote(chordNote1);
    note.addChordNote(chordNote2);
    const expectedResult = { item: note };
    const result = parser.process(data, info);
    expect(result).toEqual(expectedResult);
  });*/
	it('should return a rest', () => {
		const data = {
			items: 'r',
			type: 'q' as NoteType,
			typeIsDefault: true,
			rest: true,
		};
		const rest = new Rest(data.type);
		const expectedResult = { item: rest };
		const result = parser.process(data, info);
		rest['id'] = result!.item.id;
		expect(result).toEqual(expectedResult);
	});
	it('should return a note with step (analysis)', () => {
		const data = {
			items: '2',
			type: 'h' as NoteType,
			step: 'IVm',
		};
		const note = Note.fromScaleNumber(data.items as ScaleNumber, 5, scale, data.type);
		note.analysis = { romanNumeral: [{ step: 'IVm' } as any as RomanNumeralAnalysis] };
		const expectedResult = { item: note };
		const result = parser.process(data, info);
		note['id'] = result!.item.id;
		expect(result).toEqual(expectedResult);
	});
	it('should return a note/rest with chord symbol', () => {
		const data = [
			{ items: '2', type: 'h' as NoteType, chordSymbol: 'Eb' },
			{ items: '1', rest: true, type: 'h' as NoteType, chordSymbol: 'F#' },
		];
		const note = Note.fromScaleNumber(data[0].items as ScaleNumber, 5, scale, data[0].type);
		note['_chordSymbols'] = [{ text: 'Eb' } as ChordSymbol];
		const expectedResult = { item: note };
		const result = parser.process(data[0], info);

		const note2 = new Rest(data[1].type);
		note2['_chordSymbols'] = [{ text: 'F#' } as ChordSymbol];
		const expectedResult2 = { item: note2 };
		const result2 = parser.process(data[1], info);

		note['id'] = result!.item.id;
		note2['id'] = result2!.item.id;
		expect(result).toEqual(expectedResult);
		expect(result2).toEqual(expectedResult2);
	});
	it('should return a note with lyrics', () => {
		const data = {
			items: '2',
			type: 'h' as NoteType,
			lyrics: 'Yes!',
		};
		const note = Note.fromScaleNumber(data.items as ScaleNumber, 5, scale, data.type);
		note.lyrics = [{ text: 'Yes!' }];
		const expectedResult = { item: note };
		const result = parser.process(data, info);
		note['id'] = result!.item.id;
		expect(result).toEqual(expectedResult);
	});
	it('should return a note with solfa', () => {
		const data = {
			items: '2',
			type: 'h' as NoteType,
			solfa: 'Ta',
		};
		const note = Note.fromScaleNumber(data.items as ScaleNumber, 5, scale, data.type);
		note.solfege = 'Ta';
		const expectedResult = { item: note };
		const result = parser.process(data, info);
		note['id'] = result!.item.id;
		expect(result).toEqual(expectedResult);
	});
	it('should return a note with function (analysis)', () => {
		const data = {
			items: '2',
			type: 'h' as NoteType,
			function: 'T5',
		};
		const note = Note.fromScaleNumber(data.items as ScaleNumber, 5, scale, data.type);
		note.analysis = { function: [{ function: 'T5' } as FunctionAnalysis] };
		const expectedResult = { item: note };
		const result = parser.process(data, info);
		note['id'] = result!.item.id;
		expect(result).toEqual(expectedResult);
	});
	it('should return a note with notation', () => {
		const data = {
			items: '2',
			type: 'h' as NoteType,
			notations: '!f!',
		};
		const note = {
			_type: 'h',
			_octave: 5,
			_root: 'd',
			_midiNumber: 62,
			notations: [{ text: 'f' }],
			_staffIndex: 0,
		};
		const expectedResult = { item: note };
		const result = parser.process(data, info);
		delete result!.item['id'];
		expect(result).toEqual(expectedResult);
	});
});

describe('processNotation()', () => {
	describe('should process all valid notations without duration', () => {
		const data: { input: string; object: object }[] = [
			{ input: '!pppp!', object: new Dynamic('pppp') },
			{ input: '!ppp!', object: new Dynamic('ppp') },
			{ input: '!pp!', object: new Dynamic('pp') },
			{ input: '!p!', object: new Dynamic('p') },
			{ input: '!mp!', object: new Dynamic('mp') },
			{ input: '!mf!', object: new Dynamic('mf') },
			{ input: '!f!', object: new Dynamic('f') },
			{ input: '!ff!', object: new Dynamic('ff') },
			{ input: '!fff!', object: new Dynamic('fff') },
			{ input: '!ffff!', object: new Dynamic('ffff') },
			{ input: '!fp!', object: new Dynamic('fp') },
			{ input: '!sfz!', object: new Dynamic('sfz') },
			{ input: '!trill!', object: new Trill() },
			{ input: '!mordent!', object: new Mordent() },
			{ input: '!invertedmordent!', object: new Mordent(true) },
		];
		for (let i = 0; i < data.length; i++) {
			it('should process ' + data[i].input, () => {
				const note = new Note('q', 'c');
				parser.processNotation(note, data[i].input);
				expect(errors.length).toEqual(0);
				expect(note.notations).toStrictEqual([data[i].object]);
			});
		}
	});
	describe('should process all valid notations with duration', () => {
		const data: { start: string; end: string; object: object }[] = [
			{ start: '!trill(!', end: '!trill)!', object: new Trill(new Fraction(1, 4)) },
			{ start: '!crescendo(!', end: '!crescendo)!', object: new Crescendo(new Fraction(1, 4)) },
			{ start: '!diminuendo(!', end: '!diminuendo)!', object: new Diminuendo(new Fraction(1, 4)) },
		];
		for (let i = 0; i < data.length; i++) {
			it(`should process ${data[i].start} and ${data[i].end}`, () => {
				const note = new Note('q', 'c');
				const note2 = new Note('h', 'c');
				parser.processNotation(note, data[i].start);
				parser.duration = new Fraction(1, 4);
				parser.processNotation(note2, data[i].end);
				if (errors.length > 0) console.log(errors);
				expect(errors.length).toEqual(0);
				expect(note.notations).toStrictEqual([data[i].object]);
			});
		}
	});
	it('should add error if ending notation supplied without prior starting notation', () => {
		const note = new Note('q', 'c');
		parser.processNotation(note, '!trill)!');
		expect(errors.length).toBe(1);
	});
	it('should add editorial accidental', () => {
		const note = new Note('q', 'c', '#');
		const expectedNote = new Note('q', 'c', '#');
		expectedNote.printedAccidental = { value: '#', editorial: true };
		parser.processNotation(note, '!editorial!');
		note['id'] = expectedNote.id;
		expect(note).toStrictEqual(expectedNote);
	});
	it('should add courtesy accidental', () => {
		const note = new Note('q', 'c', '#');
		const expectedNote = new Note('q', 'c', '#');
		expectedNote.printedAccidental = { value: '#', parentheses: true };
		parser.processNotation(note, '!courtesy!');
		note['id'] = expectedNote.id;
		expect(note).toStrictEqual(expectedNote);
	});
});
