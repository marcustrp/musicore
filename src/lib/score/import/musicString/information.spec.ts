import Fraction from 'fraction.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Clef } from '../../../core/clef.js';
import { Key } from '../../../core/key.js';
import { TimeSignature } from '../../../core/timeSignature.js';
import { Scale } from '../../../core/scale.js';
import {
	type InformationData,
	type InformationItem,
	InformationParser,
	type KeyData,
} from './information.js';

let informationParser: InformationParser;
let errors: string[];
beforeEach(() => {
	errors = [];
	informationParser = new InformationParser(errors);
});

afterEach(() => {
	if (errors.length) errors.forEach((error) => console.log(error));
});

describe('getClef()', () => {
	it('should return correct clef', () => {
		const musicstring = 'Cf';
		const expecedResult: InformationData<Clef> = {
			length: musicstring.length,
			data: new Clef('f'),
		};
		const result = informationParser['getClef'](musicstring);
		expect(result).toStrictEqual(expecedResult);
	});
	it('should push error on invalid clef', () => {
		const musicstring = 'Cx';
		informationParser['getClef'](musicstring);
		expect(errors.length).toBe(1);
		errors = [];
	});
});

describe('getInputScale', () => {
	it('should return correct data', () => {
		const musicstring = 'Imx';
		const expectedResult: InformationData<Scale> = {
			length: musicstring.length,
			data: new Scale('db', 'mixolydian'),
		};
		const result = informationParser['getInputScale'](musicstring, 'db');
		expect(result).toStrictEqual(expectedResult);
	});
});

describe('getKey()', () => {
	it('should return correct data', () => {
		const musicstring = 'Kebly';
		const expectedResult: InformationData<KeyData> = {
			length: 5,
			data: {
				key: new Key('eb', 'lydian'),
				scale: new Scale('eb', 'lydian'),
				inputScale: new Scale('eb', 'lydian'),
			},
		};
		const result = informationParser['getKey'](musicstring);
		expect(result).toStrictEqual(expectedResult);
	});
	it('should return correct data (short mode, minor)', () => {
		const musicstring = 'Kd';
		const expectedResult: InformationData<KeyData> = {
			length: musicstring.length,
			data: {
				key: new Key('d', 'minor'),
				scale: new Scale('d', 'minor'),
				inputScale: new Scale('d', 'minor'),
			},
		};
		const result = informationParser['getKey'](musicstring);
		expect(result).toStrictEqual(expectedResult);
	});
	const roots = ['c', 'd', 'e', 'f', 'g', 'a', 'b', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
	for (const index in roots) {
		it('should accept all valid roots for key', () => {
			/** @todo Add all roots (lower&uppercase) to test */
			const root = roots[index];
			const musicstring = 'K' + root;
			const result = informationParser['getKey'](musicstring);
			expect(result?.data.key.root).toBe(root.toLocaleLowerCase());
		});
	}
	const modes = [
		['ma', 'major', 'major', 'major'],
		['mi', 'minor', 'minor', 'minor'],
		['hm', 'harmonic_minor', 'minor', 'minor'],
		['mm', 'melodic_minor', 'minor', 'minor'],
		['io', 'ionian', 'ionian', 'major'],
		['do', 'dorian', 'dorian', 'dorian'],
		['ph', 'phrygian', 'phrygian', 'phrygian'],
		['ly', 'lydian', 'lydian', 'lydian'],
		['mx', 'mixolydian', 'mixolydian', 'mixolydian'],
		['ae', 'aeolian', 'aeolian', 'minor'],
		['lo', 'locrian', 'locrian', 'locrian'],
		['mp', 'pentatonic_major', 'major', 'major'],
		['ip', 'pentatonic_minor', 'minor', 'minor'],
		['mb', 'blues', 'major', 'minor'],
		['ib', 'blues', 'minor', 'minor'],
		['no', 'major', 'none', 'major'],
	];
	for (const index in modes) {
		it('should accept mode ' + modes[index][0], () => {
			/** @todo Add all roots (lower&uppercase) to test */
			const mode = modes[index];
			const musicstring = 'Kc' + mode[0];
			const result = informationParser['getKey'](musicstring);
			expect(errors.length).toBe(0);
			expect(result?.data.key.mode).toBe(mode[2]);
			expect(result?.data.scale.type).toBe(mode[1]);
			expect(result?.data.inputScale.type).toBe(mode[3]);
		});
	}
	it('should not accept invalid key', () => {
		const musicstring = 'Khma';
		const result = informationParser['getKey'](musicstring);
		expect(result?.data).toBeUndefined();
		errors = [];
	});
});

describe('setHeaderDefaults()', () => {
	it('should return correct default header', () => {
		const header = {};
		const defaultHeader: InformationItem = {
			clef: new Clef('g'),
			key: new Key('c', 'major'),
			scale: new Scale('c', 'major'),
			inputScale: new Scale('c', 'major'),
			timeSignature: {
				_beatsPerBar: 4,
				_type: 'simple',
				count: 4,
				unit: 4,
				duration: new Fraction(4, 4),
				beamGroupDurations: [
					new Fraction(1, 4),
					new Fraction(1, 4),
					new Fraction(1, 4),
					new Fraction(1, 4),
				],
			} as unknown as TimeSignature,
			octave: 5,
		};

		const result = informationParser.setDefaults(header);
		/** @todo toStrictEqual? */
		expect(result).toEqual(defaultHeader);
	});
});

describe('getTimeSignature()', () => {
	it('should return undefined if no timeSignature was given', () => {
		const musicstring = 'M';
		const result = informationParser['getTimeSignature'](musicstring);
		expect(result).toBeUndefined();
		errors = [];
	});
	it('should correctly parse common time', () => {
		const musicstring = 'Mc';
		const expecedResult: InformationData<TimeSignature> = {
			length: musicstring.length,
			data: new TimeSignature('common'),
		};
		const result = informationParser['getTimeSignature'](musicstring);
		expect(errors.length).toBe(0);
		expect(result).toStrictEqual(expecedResult);
	});
	it('should correctly parse cut time', () => {
		const musicstring = 'Mt';
		const expecedResult: InformationData<TimeSignature> = {
			length: musicstring.length,
			data: new TimeSignature('cut'),
		};
		const result = informationParser['getTimeSignature'](musicstring);
		expect(errors.length).toBe(0);
		expect(result).toStrictEqual(expecedResult);
	});
	it('should correctly parse single number', () => {
		const musicstring = 'M3';
		const expecedResult: InformationData<TimeSignature> = {
			length: musicstring.length,
			data: new TimeSignature(3, 4),
		};
		const result = informationParser['getTimeSignature'](musicstring);
		expect(errors.length).toBe(0);
		expect(result).toStrictEqual(expecedResult);
	});
	it('should correctly parse double number', () => {
		const musicstring = 'M68';
		const expecedResult: InformationData<TimeSignature> = {
			length: musicstring.length,
			data: new TimeSignature(6, 8),
		};
		const result = informationParser['getTimeSignature'](musicstring);
		expect(errors.length).toBe(0);
		expect(result).toStrictEqual(expecedResult);
	});
	it('should correctly parse normal timeSignature symbol', () => {
		const musicstring = 'M12/8';
		const expecedResult: InformationData<TimeSignature> = {
			length: musicstring.length,
			data: new TimeSignature(12, 8),
		};
		const result = informationParser['getTimeSignature'](musicstring);
		expect(errors.length).toBe(0);
		expect(result).toStrictEqual(expecedResult);
	});
});

describe('getOctave()', () => {
	it('should correctly parse octave', () => {
		const musicstring = 'O3';
		const expecedResult: InformationData<number> = { length: musicstring.length, data: 3 };
		const result = informationParser['getOctave'](musicstring);
		expect(errors.length).toBe(0);
		expect(result).toStrictEqual(expecedResult);
	});
});

describe('parse()', () => {
	it('should parse multiple information fields', () => {
		const musicstring = '@CgKCM2O5';
		const expecedResult: InformationItem = {
			clef: new Clef('g'),
			key: new Key('c', 'major'),
			scale: new Scale('c', 'major'),
			inputScale: new Scale('c', 'major'),
			timeSignature: new TimeSignature(2, 4),
			octave: 5,
		};
		const result = informationParser.parse(musicstring, 0, {});
		expect(result).toStrictEqual(expecedResult);
	});
});

describe('getString', () => {
	it('should return a string', () => {
		const key = 'N';
		const input = 'N`Testing, testing`KC';
		const expectedResult = { data: 'Testing, testing', length: 19 };
		const result = informationParser['getString'](key, input);
		expect(result).toEqual(expectedResult);
	});
});
