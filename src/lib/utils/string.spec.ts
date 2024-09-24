import { describe, expect, it } from 'vitest';
import { capitalizeFirstChar } from './string';

describe('capitalizeFirstLetter()', () => {
	it('should capitalize first letter', () => {
		const data = 'test';
		const expResult = 'Test';
		const result = capitalizeFirstChar(data);
		expect(result).toBe(expResult);
	});
	it('should return empty string on empty input', () => {
		const data = '';
		const expResult = '';
		const result = capitalizeFirstChar(data);
		expect(result).toBe(expResult);
	});
});
