import { describe, expect, it } from 'vitest';
import { ModifierParser } from './modifiers';

describe('parse', () => {
	it('should parse octave shift down', () => {
		const errors = [];
		const musicString = '-';
		const parser = new ModifierParser(errors);
		const result = parser.parse(musicString);
		expect(errors).toEqual([]);
		expect(result).toEqual({ type: 'octave-shift', data: -1 });
	});
	it('should parse octave shift up', () => {
		const errors = [];
		const musicString = '+';
		const parser = new ModifierParser(errors);
		const result = parser.parse(musicString);
		expect(errors).toEqual([]);
		expect(result).toEqual({ type: 'octave-shift', data: 1 });
	});
});
