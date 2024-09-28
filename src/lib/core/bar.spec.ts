import { it, expect, describe, beforeEach, vi } from 'vitest';
import { Bar } from './bar.js';
import { TimeSignature } from './timeSignature.js';
import { Key } from './key.js';
import { Note } from './note.js';
import Fraction from 'fraction.js';
import { DaCapo, Fine } from './data/directions.js';
import type { BarObject } from '$lib/test-types.js';

describe('Bar', () => {
	let standardBar: BarObject;
	beforeEach(() => {
		standardBar = {
			barline: 'regular',
			duration: new Fraction(1),
			startDuration: new Fraction(0),
			timeSignature: { count: 4, unit: 4 },
			key: { rootName: 'c', mode: 'major' },
			showKeySign: false,
			notes: {},
		};
	});
	it('should have correct default style', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		expect(bar).toMatchObject(standardBar);
	});
});

describe('Bar.getVoiceDuration', () => {
	/** @todo should mock Note.getDuration */
	it('should return 0 if voice is empty', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));

		expect(bar.getVoiceDuration('P1', 'V2').valueOf()).equal(0);
		expect(bar.getVoiceDuration('P2', 'V1').valueOf()).equal(0);
	});
	it('should return correct voice duration of bar with single note', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const note = new Note('w', 'c');
		// @ts-expect-error: Redefining readonly property
		bar.notes = { P1: { V1: [note] } };

		expect(bar.getVoiceDuration('P1', 'V1').valueOf()).equal(1);
	});
	it('should return correct voice duration of bar with multiple notes', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const note = new Note('q', 'c');
		const note2 = new Note('q', 'd');
		// @ts-expect-error: Redefining readonly property
		bar.notes = { P1: { V1: [note, note2] } };
		expect(bar.getVoiceDuration('P1', 'V1').toString()).equal('0.5');
	});
	it('should return correct voice duration of bar with duration longer than timeSignature', () => {
		// it is possible to have a bar with duration longer than timeSignature, ie for
		// music theory examples
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const note1 = new Note('h', 'c');
		const note2 = new Note('h', 'c');
		const note3 = new Note('h', 'c');
		// @ts-expect-error: Redefining readonly property
		bar.notes = { P1: { V1: [note1, note2, note3] } };
		expect(bar.getVoiceDuration('P1', 'V1').toString()).equal('1.5');
	});
});

describe('Bar.getMaxVoiceDuration', () => {
	/** @todo should mock Note.getDuration */
	it('should return 0 if notes are empty (no parts in bar)', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		expect(bar.getMaxVoiceDuration().valueOf()).equal(0);
	});
	it('should return correct duration of a bar with a single voice', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const note = new Note('q', 'c');
		// @ts-expect-error: Redefining readonly property
		bar.notes = { P1: { V1: [note] } };
		expect(bar.getMaxVoiceDuration().toString()).equal('0.25');
	});
	it('should return correct duration of a bar with multiple voices in the same part', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const note = new Note('q', 'c');
		const note2 = new Note('h', 'd');
		// @ts-expect-error: Redefining readonly property
		bar.notes = { P1: { V1: [note], V2: [note2] } };
		expect(bar.getMaxVoiceDuration().toString()).equal('0.5');
	});
	it('should return correct duration of a bar with multiple voices in different parts', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const note = new Note('q', 'c');
		const note2 = new Note('h', 'd');
		// @ts-expect-error: Redefining readonly property
		bar.notes = { P1: { V1: [note] }, P2: { V1: [note2] } };
		expect(bar.getMaxVoiceDuration().toString()).equal('0.5');
	});
});

describe('addNote', () => {
	describe('option.overflow = "ignore" | undefined', () => {
		it('should add a single note to bar', () => {
			const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
			const spy = vi.spyOn(bar, 'getVoiceDuration').mockImplementationOnce(() => new Fraction(0));
			const note = new Note('q', 'c');
			bar.addNote('P1', 'V1', note);
			expect(spy).toHaveBeenCalledOnce();
			expect(bar.notes).toStrictEqual({ P1: { V1: [note] } });
		});
	});
	/** @todo implement test */
	//describe('option.overflow = "split"', () => {});
});

describe('Bar.setPickup', () => {
	it('should throw error if bar is already pickup', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		bar['_pickup'] = true;
		expect(() => bar.setPickup()).toThrow();
	});
	it('should throw error if duration is not specified and all voices are empty', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		expect(() => bar.setPickup()).toThrow();
	});
	it('should throw error if duration is not specified and longest voice is equal to time signature', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const note = new Note('w', 'c');
		// @ts-expect-error: Redefining readonly property
		bar.notes = { P1: { V1: [note] } };
		expect(() => bar.setPickup()).toThrow();
	});
	it('should set correct pickup flag', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const note = new Note('q', 'c');
		// @ts-expect-error: Redefining readonly property
		bar.notes = { P1: { V1: [note] } };
		bar.setPickup();
		expect(bar.pickup).equal(true);
	});
	it('should return correct duration change', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const note = new Note('q', 'c');
		// @ts-expect-error: Redefining readonly property
		bar.notes = { P1: { V1: [note] } };
		const durationChange = bar.setPickup();
		expect(durationChange.toString()).equal('0.75');
	});
	it('should set correct duration', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const note = new Note('q', 'c');
		// @ts-expect-error: Redefining readonly property
		bar.notes = { P1: { V1: [note] } };
		bar.setPickup();
		expect(bar.duration.toString()).equal('0.25');
	});
	it('should allow a specified duration to be set even if no notes are present', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		bar.setPickup(new Fraction(1, 4));
		expect(bar.duration.toString()).equal('0.25');
	});
	it('should not allow a specified duration that is shorter than the longest voice', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const note = new Note('q', 'c');
		// @ts-expect-error: Redefining readonly property
		bar.notes = { P1: { V1: [note] } };
		expect(() => bar.setPickup(new Fraction(1, 8))).toThrow();
	});
});

describe('Bar.addDirection', () => {
	it('should add a single direction to bar', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const direction = new DaCapo('fine');
		bar.addDirection(direction);
		expect(bar.directions).toStrictEqual([direction]);
	});
	it('should add multiple directions to bar', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const direction = new DaCapo('fine');
		const direction2 = new Fine();
		bar.addDirection(direction);
		bar.addDirection(direction2);
		expect(bar.directions).toStrictEqual([direction, direction2]);
	});
});

describe('Bar.addTempo', () => {
	it('should add a single tempo to bar', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const tempo = { value: '120' };
		bar.addTempo(tempo.value);
		expect(bar.tempo).toStrictEqual([tempo]);
	});
	it('should add multiple tempos to bar', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const tempo = { value: '120' };
		const tempo2 = { value: '180' };
		bar.addTempo(tempo.value);
		bar.addTempo(tempo2.value);
		expect(bar.tempo).toStrictEqual([tempo, tempo2]);
	});
	it('should add a tempo with position to bar', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const tempo = { value: '120', position: new Fraction(2, 4) };
		bar.addTempo(tempo.value, tempo.position);
		expect(bar.tempo).toStrictEqual([tempo]);
	});
});

describe('Bar.sortTempo', () => {
	it('should leave tempos in order if no positions are specified', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const tempo = { value: '120' };
		const tempo2 = { value: '180' };
		bar.addTempo(tempo.value);
		bar.addTempo(tempo2.value);
		bar['sortTempo']();
		expect(bar.tempo).toStrictEqual([tempo, tempo2]);
	});
	it('should sort tempos by position when position is specified for all tempos', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const tempo = { value: '120', position: new Fraction(2, 4) };
		const tempo2 = { value: '180', position: new Fraction(1, 4) };
		bar.addTempo(tempo.value, tempo.position);
		bar.addTempo(tempo2.value, tempo2.position);
		bar['sortTempo']();
		expect(bar.tempo).toStrictEqual([tempo2, tempo]);
	});
	it('should sort tempos by position when position is specified for some tempos', () => {
		const bar = new Bar(new TimeSignature(), new Key('c', 'major'));
		const tempo = { value: '120', position: new Fraction(2, 4) };
		const tempo2 = { value: '180' };
		bar.addTempo(tempo.value, tempo.position);
		bar.addTempo(tempo2.value);
		bar['sortTempo']();
		expect(bar.tempo).toStrictEqual([tempo2, tempo]);
	});
});
