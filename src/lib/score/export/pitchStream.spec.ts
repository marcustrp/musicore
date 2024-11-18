import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Key } from '../../core/key.js';
import { Note } from '../../core/note.js';
import { Score } from '../score.js';
import { type ExportSettingsType, PitchStreamExporter } from './pitchStream.js';

let exporter: PitchStreamExporter;

beforeEach(() => {
	exporter = new PitchStreamExporter();
});

describe('different types', () => {
	it('should export scaleNumber stream', () => {
		const expecedResult = '1235';
		const score = new Score();
		const voice = score.parts.addPart().getVoice(0);
		voice.addNote(new Note('q', 'c'));
		voice.addNote(new Note('q', 'd'));
		voice.addNote(new Note('h', 'e'));
		voice.addNote(new Note('w', 'g'));
		const result = exporter.export(score, { type: 'scaleNumber', part: 0, voice: 0 });
		expect(result).toBe(expecedResult);
	});
	it('should export scaleNumber stream (relative to minor)', () => {
		const expecedResult = '1235';
		const score = new Score(new Key('c', 'minor'));
		const voice = score.parts.addPart().getVoice(0);
		voice.addNote(new Note('q', 'c'));
		voice.addNote(new Note('q', 'd'));
		voice.addNote(new Note('h', 'e', 'b'));
		voice.addNote(new Note('w', 'g'));
		const result = exporter.export(score, {
			type: 'scaleNumber',
			part: 0,
			voice: 0,
			scaleNumberRelativeTo: 'scale',
		});
		expect(result).toBe(expecedResult);
	});
	it('should export scaleNumber stream (ignore accidentals)', () => {
		const expecedResult = '1235';
		const score = new Score(new Key('c', 'minor'));
		const voice = score.parts.addPart().getVoice(0);
		voice.addNote(new Note('q', 'c'));
		voice.addNote(new Note('q', 'd'));
		voice.addNote(new Note('h', 'e', 'b'));
		voice.addNote(new Note('w', 'g', '#'));
		const result = exporter.export(score, {
			type: 'scaleNumber',
			part: 0,
			voice: 0,
			scaleNumberRelativeTo: 'ignore',
		});
		expect(result).toBe(expecedResult);
	});
	it('should export noteName stream', () => {
		const expecedResult = 'def#a';
		const score = new Score(new Key('d', 'major'));
		const voice = score.parts.addPart().getVoice(0);
		voice.addNote(new Note('q', 'd'));
		voice.addNote(new Note('q', 'e'));
		voice.addNote(new Note('h', 'f', '#'));
		voice.addNote(new Note('w', 'a'));
		const result = exporter.export(score, { type: 'name', part: 0, voice: 0 });
		expect(result).toBe(expecedResult);
	});
	it('should export natural stream', () => {
		const expecedResult = 'abce';
		const score = new Score(new Key('ab', 'major'));
		const voice = score.parts.addPart().getVoice(0);
		voice.addNote(new Note('q', 'a', 'b'));
		voice.addNote(new Note('q', 'b', 'b'));
		voice.addNote(new Note('h', 'c'));
		voice.addNote(new Note('w', 'e', 'b'));
		const result = exporter.export(score, { type: 'natural', part: 0, voice: 0 });
		expect(result).toBe(expecedResult);
	});
	it('should export natural stream as array', () => {
		const expecedResult = ['a', 'b', 'c', 'e'];
		const score = new Score(new Key('ab', 'major'));
		const voice = score.parts.addPart().getVoice(0);
		voice.addNote(new Note('q', 'a', 'b'));
		voice.addNote(new Note('q', 'b', 'b'));
		voice.addNote(new Note('h', 'c'));
		voice.addNote(new Note('w', 'e', 'b'));
		const result = exporter.export(score, {
			type: 'natural',
			part: 0,
			voice: 0,
			returnType: 'array',
		});
		expect(result).toEqual(expecedResult);
	});
	describe('diffClosest', () => {
		let score: Score;
		beforeAll(() => {
			score = new Score(new Key('bb', 'major'));
			const voice = score.parts.addPart().getVoice(0);
			voice.addNote(new Note('q', 'b', 'b'));
			voice.addNote(new Note('q', 'c'));
			voice.addNote(new Note('q', 'b', 'b'));
			voice.addNote(new Note('q', 'd'));
			voice.addNote(new Note('q', 'b', 'b'));
			voice.addNote(new Note('q', 'e', 'b'));
			voice.addNote(new Note('q', 'b', 'b'));
			voice.addNote(new Note('q', 'f'));
			voice.addNote(new Note('q', 'b', 'b'));
			voice.addNote(new Note('q', 'b', 'b'));
		});
		it('should export diffClosest stream', () => {
			const expecedResult = '1-12-23-3-330';
			const result = exporter.export(score, { type: 'diffClosest', part: 0, voice: 0 });
			expect(result).toBe(expecedResult);
		});
		/*it('should export diffClosestPositive stream', () => {
      const expecedResult = '425160063';
      const result = exporter.export(score, new ExportSettings('diffClosestPositive'));
      expect(result).toBe(expecedResult);
    });
    it('should export diffClosest-ignoreRepeating stream', () => {
      const expecedResult = '1-12-23-3-33';
      const result = exporter.export(score, new ExportSettings('diffClosest-ignoreRepeating'));
      expect(result).toBe(expecedResult);
    });
    it('should export diffClosestPositive-ignoreRepeating stream', () => {
      const expecedResult = '42516006';
      const result = exporter.export(score, new ExportSettings('diffClosestPositive-ignoreRepeating'));
      expect(result).toBe(expecedResult);
    });*/
	});
});
/*
describe('rests, chords, ties', () => {
  describe('should handle rest at beginning', () => {
    let score: Score;
    beforeAll(() => {
      score = new Score();
      const voice = score.parts.addPart().getVoice(0);
      voice.addNote(new Rest('h'));
      voice.addNote(new Note('h', 'c'));
      voice.addNote(new Note('q', 'f'));
      voice.addNote(new Note('q', 'g'));
      voice.addNote(new Note('h', 'c'));
    });
    it('scaleNumber', () => {
      const expectedResult = '1451';
      const result = exporter.export(score);
      expect(result).toBe(expectedResult);
    });
    it('diffClosestPositive', () => {
      const expectedResult = '646';
      const result = exporter.export(score, new ExportSettings('diffClosestPositive'));
      expect(result).toBe(expectedResult);
    });
  });
  describe('should handle tie', () => {
    let score: Score;
    beforeAll(() => {
      score = new Score();
      const voice = score.parts.addPart().getVoice(0);

      voice.addNote(new Note('h', 'c'));
      voice.addNote(new Note('h', 'd'));
      voice.addNote(new Note('q', 'd'));
      voice.addNote(new Note('q', 'g'));
      voice.addNote(new Note('h', 'c'));
      score.setTie(0, 0, 0, 1, 'start');
    });
    it('scaleNumber', () => {
      const expectedResult = '1251';
      const result = exporter.export(score);
      expect(result).toBe(expectedResult);
    });
    it('diffClosestPositive', () => {
      const expectedResult = '466';
      const result = exporter.export(score, new ExportSettings('diffClosestPositive'));
      expect(result).toBe(expectedResult);
    });
    */
/** @todo: add test for special cases like tie into endings, repeats, codas, dal segno... */
//  });
//});

/*it('should handle repeats, endings and D.C.alfine', () => {
  const score = new Score();
  const voice = score.parts.addPart().getVoice(0);
  voice.addNote(0,0,new Note())
})*/
