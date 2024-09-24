import { beforeEach, describe, expect, it } from 'vitest';
import { BarItem, BarlineParser } from './bar';

let parser: BarlineParser;
let errors: string[];

beforeEach(() => {
	errors = [];
	parser = new BarlineParser(errors);
});

describe('match()', () => {
	describe('barlines, repeats and endings', () => {
		const data = ['|', ':|', ':|]||:', '|1', ':|2', ':|][1-2'];
		for (let i = 0; i < data.length; i++) {
			it('should match ' + data[i], () => {
				const result = parser.match('|');
				expect(result!.data).toBe('|');
			});
		}
	});
	it('should match direction', () => {
		const expectedResult = { data: '|', directions: '!coda!' };
		const result = parser.match('!coda!|');
		expect(result).toEqual(expectedResult);
	});
	it('should match line break', () => {
		const expecedResult = { data: '\\' };
		const result = parser.match('\\');
		expect(result).toEqual(expecedResult);
	});
});

describe('process()', () => {
	describe('barlines', () => {
		it('should process single barline', () => {
			const expectedResult: BarItem = { barline: 'regular' };
			const result = parser.process({ data: '|' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
		it('should process double barline', () => {
			const expectedResult: BarItem = { barline: 'light-light' };
			const result = parser.process({ data: '||' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
		it('should process barline ending |]', () => {
			const expectedResult: BarItem = { barline: 'light-heavy' };
			const result = parser.process({ data: '|]' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
		it('should process barline "start" [|', () => {
			const expectedResult: BarItem = { barline: 'heavy-light' };
			const result = parser.process({ data: '[|' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
		it('should process hidden barline [|]', () => {
			const expectedResult: BarItem = { barline: 'none' };
			const result = parser.process({ data: '[|]' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
	});

	describe('repeats', () => {
		describe('repeat start', () => {
			let data = ['|:', '||:', '[|:'];
			let expectedResult: BarItem = { barline: 'heavy-light', repeatStart: 1 };
			for (let i = 0; i < data.length; i++) {
				it('should process single repeat start, ' + data[i], () => {
					const result = parser.process({ data: data[i] });
					if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
					expect(errors.length).toBe(0);
					expect(result).toEqual(expectedResult);
				});
			}
		});
		describe('repeat end', () => {
			let data = [':|', ':||', ':|]'];
			let expectedResult: BarItem = { barline: 'light-heavy', repeatEnd: 1 };
			for (let i = 0; i < data.length; i++) {
				it('should process single repeat end, ' + data[i], () => {
					const result = parser.process({ data: data[i] });
					if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
					expect(errors.length).toBe(0);
					expect(result).toEqual(expectedResult);
				});
			}
		});
		describe('repeat start and end', () => {
			let data = ['::', ':|:', ':|:', ':||:', ':|][|:'];
			let expectedResult: BarItem = { barline: 'heavy-heavy', repeatEnd: 1, repeatStart: 1 };
			for (let i = 0; i < data.length; i++) {
				it('should process single repeat end and start, ' + data[i], () => {
					const result = parser.process({ data: data[i] });
					if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
					expect(errors.length).toBe(0);
					expect(result).toEqual(expectedResult);
				});
			}
		});
	});

	describe('endings', () => {
		it('should process first ending [1', () => {
			const expectedResult: BarItem = { ending: '1' };
			const result = parser.process({ data: '[1' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
		it('should process first ending |[1', () => {
			const expectedResult: BarItem = { barline: 'regular', ending: '1' };
			const result = parser.process({ data: '|[1' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
		it('should process second ending [2', () => {
			const expectedResult: BarItem = { ending: '2' };
			const result = parser.process({ data: '[2' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
		it('should process second ending |2', () => {
			const expectedResult: BarItem = { barline: 'light-heavy', ending: '2' };
			const result = parser.process({ data: '|2' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
		it('should process second ending with repeat :|2', () => {
			const expectedResult: BarItem = { barline: 'light-heavy', ending: '2', repeatEnd: 1 };
			const result = parser.process({ data: ':|2' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
		it('should process ending [1,2', () => {
			const expectedResult: BarItem = { ending: '1,2' };
			const result = parser.process({ data: '[1,2' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
		it('should process ending [1-2', () => {
			const expectedResult: BarItem = { ending: '1-2' };
			const result = parser.process({ data: '[1-2' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
		it('should process ending :|][1-2', () => {
			const expectedResult: BarItem = { barline: 'light-heavy', repeatEnd: 1, ending: '1-2' };
			const result = parser.process({ data: ':|][1-2' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
	});
	describe('line breaks', () => {
		it('should process just a line break', () => {
			const expectedResult: BarItem = { lineBreak: true };
			const result = parser.process({ data: '\\' });
			if (errors.length > 0) errors.forEach((item) => console.log('####' + item));
			expect(errors.length).toBe(0);
			expect(result).toEqual(expectedResult);
		});
	});
});

describe('processDecorations', () => {
	describe('all valid decorations', () => {
		const data: { input: string; object: object }[] = [
			{ input: '!coda!', object: { current: [], next: [{ type: 'from', index: 0 }] } },
			{ input: '!segno!', object: { current: [], next: [{ type: 'to', index: 0 }] } },
			{ input: '!D.S.!', object: { current: [{ type: 'from', index: 0 }], next: [] } },
			{
				input: '!D.S.alcoda!',
				object: { current: [{ type: 'from', _al: 'coda', index: 0 }], next: [] },
			},
			{
				input: '!D.S.alfine!',
				object: { current: [{ type: 'from', _al: 'fine', index: 0 }], next: [] },
			},
			{
				input: '!D.S.alfineconrep!',
				object: { current: [{ type: 'from', _al: 'fine', _extra: 'conrep', index: 0 }], next: [] },
			},
			{ input: '!D.C.!', object: { current: [{}], next: [] } },
			{ input: '!D.C.alcoda!', object: { current: [{ al: 'coda' }], next: [] } },
			{ input: '!D.C.alfine!', object: { current: [{ al: 'fine' }], next: [] } },
			{
				input: '!D.C.alfineconrep!',
				object: { current: [{ al: 'fine', extra: 'conrep' }], next: [] },
			},
			{ input: '!fermata!', object: { current: [{ inverted: undefined }], next: [] } },
			{ input: '!invertedfermata!', object: { current: [{ inverted: true }], next: [] } },
		];
		for (let i = 0; i < data.length; i++) {
			it('should process ' + data[i].input, () => {
				const result = parser.processDecorations(data[i].input);
				expect(errors.length).toBe(0);
				expect(result).toEqual(data[i].object);
			});
		}
	});
	it('should add error on invalid decorator', () => {
		const result = parser.processDecorations('!notvalid!');
		expect(errors.length).toBe(1);
	});
});

describe('processData()', () => {
	it('should process ||\\', () => {
		const data = '||\\';
		const expecedResult: BarItem = { barline: 'light-light', lineBreak: true };
		const result = parser.processData(data);
		expect(errors.length).toBe(0);
		expect(result).toStrictEqual(expecedResult);
	});
	it('should process \\|:', () => {
		const data = '\\|:';
		const expecedResult: BarItem = { barline: 'heavy-light', lineBreak: true, repeatStart: 1 };
		const result = parser.processData(data);
		expect(errors.length).toBe(0);
		expect(result).toStrictEqual(expecedResult);
	});
});
