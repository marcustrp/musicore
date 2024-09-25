import { it, expect, describe } from 'vitest';
import { LNoteHead } from './LNoteHead.js';

describe('Note.getPosition', () => {
	describe('treble clef', () => {
		it('should return currect position for c, octave 5', () => {
			const result = LNoteHead.getPositionFromRoot('c', 5, 'g');
			expect(result).toEqual(10);
		});
		it('should return currect position for c, octave 6', () => {
			const result = LNoteHead.getPositionFromRoot('c', 6, 'g');
			expect(result).toEqual(3);
		});
		it('should return currect position for c, octave 7', () => {
			const result = LNoteHead.getPositionFromRoot('c', 7, 'g');
			expect(result).toEqual(-4);
		});
	});
	describe('bass clef', () => {
		it('should return currect position for c, octave 4', () => {
			const result = LNoteHead.getPositionFromRoot('c', 4, 'f');
			expect(result).toEqual(5);
		});
	});
});

describe('Note.getPosition', () => {
	describe('treble clef', () => {
		it('should return currect root for position 10 (no given clef)', () => {
			const result = LNoteHead.rootAndOctaveFromPosition(10);
			expect(result).toEqual({ root: 'c', octave: 5 });
		});
		it('should return currect root for position 4 (no given clef)', () => {
			const result = LNoteHead.rootAndOctaveFromPosition(4);
			expect(result).toEqual({ root: 'b', octave: 5 });
		});
		it('should return currect root for position 3 (no given clef)', () => {
			const result = LNoteHead.rootAndOctaveFromPosition(3);
			expect(result).toEqual({ root: 'c', octave: 6 });
		});
		it('should return currect root for position 0 (no given clef)', () => {
			const result = LNoteHead.rootAndOctaveFromPosition(0);
			expect(result).toEqual({ root: 'f', octave: 6 });
		});
		it('should return currect root for position -1 (no given clef)', () => {
			const result = LNoteHead.rootAndOctaveFromPosition(-1);
			expect(result).toEqual({ root: 'g', octave: 6 });
		});
	});
	describe('bass clef', () => {
		it('should return currect root for position 2', () => {
			const result = LNoteHead.rootAndOctaveFromPosition(2, 'f');
			expect(result).toEqual({ root: 'f', octave: 4 });
		});
	});
});
