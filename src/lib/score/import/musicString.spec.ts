import Fraction from 'fraction.js';
import { beforeEach, describe, expect, it } from 'vitest';
import { Key } from '../../core/key';
import { TimeSignature } from '../../core/timeSignature';
import { Note } from '../../core/note';
import { Rest } from '../../core/rest';
import { MusicStringImporter } from './musicString';

let importer: MusicStringImporter;
beforeEach(() => {
  importer = new MusicStringImporter();
});

describe('splitMusicString', () => {
  it('should split simple musicstring by space', () => {
    const musicString = '1 2 3h';
    const expectedResult = ['1', '2', '3h'];
    const result = importer.splitMusicString(musicString);
    expect(result).toStrictEqual(expectedResult);
  });
  it('should split musicstring by space, except spaced in some sort of quote', () => {
    const musicString = '@KcN`Hello world` 1 2 3h';
    const expectedResult = ['@KcN`Hello world`', '1', '2', '3h'];
    const result = importer.splitMusicString(musicString);
    expect(result).toStrictEqual(expectedResult);
  });
});

describe('parse', () => {
  it('should import simple music string', () => {
    const musicString = '1 2 3h';
    const notes: Note[] = [];
    notes.push(new Note('q', 'c'));
    notes.push(new Note('q', 'd'));
    notes.push(new Note('h', 'e'));
    const score = importer.parse(musicString);
    expect(importer.errors.length).toBe(0);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
  });
  it('should import simple music string with per note octave change', () => {
    const musicString = '1/5 /51';
    const notes: Note[] = [];
    notes.push(new Note('8', 'c'));
    notes[0].beam = { value: 'start' };
    notes.push(new Note('8', 'g', undefined, 4));
    notes[1].beam = { value: 'end' };
    notes.push(new Note('8', 'g', undefined, 4));
    notes[2].beam = { value: 'start' };
    notes.push(new Note('8', 'c'));
    notes[3].beam = { value: 'end' };
    const score = importer.parse(musicString);
    expect(importer.errors.length).toBe(0);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
  });
  it('should import simple music string with rest', () => {
    const musicString = '1 r 3h';
    const notes: (Rest | Note)[] = [];
    notes.push(new Note('q', 'c'));
    notes.push(new Rest('q'));
    notes.push(new Note('h', 'e'));
    const score = importer.parse(musicString);
    if (importer.errors) console.log(importer.errors);
    expect(importer.errors.length).toBe(0);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
  });
  it('should import simple music string with timeSignature', () => {
    const musicString = '@M2/4 1 2 3h';
    const notes: Note[] = [];
    const timeSignature = new TimeSignature(2, 4);
    notes.push(new Note('q', 'c'));
    notes.push(new Note('q', 'd'));
    notes.push(new Note('h', 'e'));
    const score = importer.parse(musicString);
    expect(importer.errors.length).toBe(0);
    expect(score.bars.bars[0].timeSignature).toStrictEqual(timeSignature);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
  });
  it('should import simple music string with accidental', () => {
    const musicString = '1 #4 5';
    const notes: Note[] = [];
    const key = new Key('c', 'major');
    notes.push(new Note('q', 'c'));
    notes.push(new Note('q', 'f', '#'));
    notes.push(new Note('q', 'g'));
    const score = importer.parse(musicString);
    expect(importer.errors.length).toBe(0);
    expect(score.bars.bars[0].key).toStrictEqual(key);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
  });
  it('should import simple music string with key', () => {
    const musicString = '@Kf#mi 1 3 5 7';
    const notes: Note[] = [];
    const key = new Key('f#', 'minor');
    notes.push(new Note('q', 'f', '#'));
    notes.push(new Note('q', 'a'));
    notes.push(new Note('q', 'c', '#', 6));
    notes.push(new Note('q', 'e', undefined, 6));
    const score = importer.parse(musicString);
    expect(importer.errors.length).toBe(0);
    expect(score.bars.bars[0].key).toStrictEqual(key);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
    expect(score.scale?.root.natural).toBe('f');
    expect(score.scale?.root.acciental).toBe('#');
  });
  it('should import music string in minor key using minor mode', () => {
    // m accidental is used in minor key to get major version of 3, 6 and 7
    const musicString = '@Kf#mi 1 3 6';
    const notes: Note[] = [];
    const key = new Key('f#', 'minor');
    notes.push(new Note('q', 'f', '#'));
    notes.push(new Note('q', 'a'));
    notes.push(new Note('q', 'd', undefined, 6));
    const score = importer.parse(musicString);
    expect(importer.errors.length).toBe(0);
    expect(score.bars.bars[0].key).toStrictEqual(key);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
    expect(score.scale?.root.natural).toBe('f');
    expect(score.scale?.root.acciental).toBe('#');
  });
  it('should import music string with m accidental in minor key using minor mode', () => {
    // m accidental is used in minor key to get major version of 3, 6 and 7
    const musicString = '@Kf#mi 3 m3 m6';
    const notes: Note[] = [];
    const key = new Key('f#', 'minor');
    notes.push(new Note('q', 'a'));
    notes.push(new Note('q', 'a', '#'));
    notes.push(new Note('q', 'd', '#', 6));
    const score = importer.parse(musicString);
    expect(importer.errors.length).toBe(0);
    expect(score.bars.bars[0].key).toStrictEqual(key);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
    expect(score.scale?.root.natural).toBe('f');
    expect(score.scale?.root.acciental).toBe('#');
  });
  it('should import simple music string with changed octave', () => {
    const musicString = '@O3 1. 2e 3h';
    const notes: Note[] = [];
    notes.push(new Note('q', 'c', undefined, 3, 1));
    notes.push(new Note('8', 'd', undefined, 3));
    notes.push(new Note('h', 'e', undefined, 3));
    const score = importer.parse(musicString);
    expect(importer.errors.length).toBe(0);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
  });
  it('should import simple music string with changed key and octave', () => {
    const musicString = '@KbbmaO4 1. 2e 3h';
    const notes: Note[] = [];
    const key = new Key('bb', 'major');
    notes.push(new Note('q', 'b', 'b', 4, 1));
    notes.push(new Note('8', 'c'));
    notes.push(new Note('h', 'd'));
    const score = importer.parse(musicString);
    expect(importer.errors.length).toBe(0);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
    expect(score.bars.bars[0].key).toStrictEqual(key);
  });
  it('should import simple music string with octave modifier', () => {
    const musicString = '@KD 1 7 +2 -3';
    const notes: Note[] = [];
    const key = new Key('d', 'major');
    notes.push(new Note('q', 'd', undefined, 5));
    notes.push(new Note('q', 'c', '#', 6));
    notes.push(new Note('q', 'e', undefined, 6));
    notes.push(new Note('q', 'f', '#', 5));
    const score = importer.parse(musicString);
    expect(importer.errors.length).toBe(0);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
    expect(score.bars.bars[0].key).toStrictEqual(key);
  });
  it('should import simple music string note field', () => {
    const musicString = '@N`Hello world` 1';
    const notes: Note[] = [];
    const key = new Key('c', 'major');
    notes.push(new Note('q', 'c'));
    const score = importer.parse(musicString);
    expect(importer.errors.length).toBe(0);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
    expect(score.information.notes).toBe('Hello world');
    expect(score.bars.bars[0].key).toStrictEqual(key);
  });
  /* @todo active when setChordSymbol is implemented
  it('should set chord with offset using spacer', () => {
    const musicString = '"C"5w "G/B"yh';
    const notes: Note[] = [];
    const note = new Note('w', 'g');
    note.setChordSymbol('C');
    note.setChordSymbol('G/B', new Fraction(1, 2));
    notes.push(note);
    const score = importer.parse(musicString);
    if (importer.errors.length) console.log('####' + importer.errors);
    expect(importer.errors.length).toBe(0);
    expect(score.parts.getPart(0).getVoice(0).getNotes()).toEqual(notes);
  });*/
  describe('triplets', () => {
    it('should parse eight triplet', () => {
      const musicstring = '3:123';
      const note1 = new Note('8', 'c', undefined, 5);
      note1.beam = { value: 'start' };
      note1.triplet = { start: true, numerator: 3, denominator: 2, totalDuration: new Fraction(1, 4), noteCount: 3 };

      const note2 = new Note('8', 'd', undefined, 5);
      note2.beam = { value: 'continue' };
      note2.triplet = { numerator: 3, denominator: 2, totalDuration: new Fraction(1, 4), noteCount: 3 };

      const note3 = new Note('8', 'e', undefined, 5);
      note3.beam = { value: 'end' };
      note3.triplet = { end: true, numerator: 3, denominator: 2, totalDuration: new Fraction(1, 4), noteCount: 3 };

      const expectedResult = [note1, note2, note3];
      const result = importer.parse(musicstring);
      expect(result.parts.getPart(0).getVoice(0).getNotes()).toEqual(expectedResult);
    });
    it('should parse eight triplet with eight and quarter note', () => {
      const musicstring = '3:2:2:12_';
      const note1 = new Note('8', 'c', undefined, 5);
      note1.triplet = { start: true, numerator: 3, denominator: 2, totalDuration: new Fraction(1, 4), noteCount: 2 };

      const note2 = new Note('q', 'd', undefined, 5);
      note2.triplet = { end: true, numerator: 3, denominator: 4, totalDuration: new Fraction(1, 4), noteCount: 2 };

      const expectedResult = [note1, note2];
      const result = importer.parse(musicstring);
      expect(result.parts.getPart(0).getVoice(0).getNotes()).toEqual(expectedResult);
    });
    it('should parse quarter triplet', () => {
      const musicstring = '3:1 2 3';
      const note1 = new Note('q', 'c', undefined, 5);
      note1.triplet = { start: true, numerator: 3, denominator: 2, totalDuration: new Fraction(1, 2), noteCount: 3 };

      const note2 = new Note('q', 'd', undefined, 5);
      note2.triplet = { numerator: 3, denominator: 2, totalDuration: new Fraction(1, 2), noteCount: 3 };

      const note3 = new Note('q', 'e', undefined, 5);
      note3.triplet = { end: true, numerator: 3, denominator: 2, totalDuration: new Fraction(1, 2), noteCount: 3 };

      const expectedResult = [note1, note2, note3];
      const result = importer.parse(musicstring);
      expect(result.parts.getPart(0).getVoice(0).getNotes()).toEqual(expectedResult);
    });
    it('should parse quarter triplet with eights', () => {
      const musicstring = '3:2:4:12 3 4';
      const note1 = new Note('8', 'c', undefined, 5);
      note1.triplet = { start: true, numerator: 3, denominator: 2, totalDuration: new Fraction(1, 2), noteCount: 4 };

      const note2 = new Note('8', 'd', undefined, 5);
      note2.triplet = { numerator: 3, denominator: 2, totalDuration: new Fraction(1, 2), noteCount: 4 };

      const note3 = new Note('q', 'e', undefined, 5);
      note3.triplet = { end: true, numerator: 3, denominator: 2, totalDuration: new Fraction(1, 2), noteCount: 4 };

      const note4 = new Note('q', 'f', undefined, 5);
      note4.triplet = { end: true, numerator: 3, denominator: 2, totalDuration: new Fraction(1, 2), noteCount: 4 };

      const expectedResult = [note1, note2, note3, note4];
      const result = importer.parse(musicstring);
      expect(result.parts.getPart(0).getVoice(0).getNotes()).toEqual(expectedResult);
    });
  });
  describe('barline, repeats and endings', () => {
    it('should import pickup beat', () => {
      const musicString = '-5e | 1w';
      const expectedBars = [
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'regular',
          _pickup: true,
          _duration: new Fraction(1, 8),
          startDuration: new Fraction(0),
          _key: new Key('c', 'major'),
          showKeySign: true,
          notes: {},
        },
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'light-heavy',
          _duration: new Fraction(4, 4),
          startDuration: new Fraction(1, 8),
          _key: new Key('c', 'major'),
          showKeySign: false,
          notes: {},
        },
      ];
      const notes: Note[] = [];
      const note = new Note('8', 'g', undefined, 4);
      notes.push(note);
      notes.push(new Note('w', 'c'));
      const score = importer.parse(musicString);
      if (importer.errors.length) importer.errors.forEach((item) => console.log('### ' + item));
      score.bars.bars.forEach((bar) => (bar.notes = {})); // ignore data in this test
      expect(importer.errors.length).toBe(0);
      //expect(score.parts.getPart(0).getVoice(0).getNotes()).toStrictEqual(notes);
      expect(score.bars.bars).toEqual(expectedBars);
    });
    it('should not add a start repeat at beginning of tune', () => {
      const musicString = '|:';
      const expectedBars = [
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'light-heavy',
          _duration: new Fraction(4, 4),
          startDuration: new Fraction(0),
          _key: new Key('c', 'major'),
          showKeySign: true,
          notes: {},
        },
      ];
      const score = importer.parse(musicString);
      if (importer.errors.length) importer.errors.forEach((item) => console.log('### ' + item));
      score.bars.bars.forEach((bar) => (bar.notes = {})); // ignore data in this test
      expect(importer.errors.length).toBe(0);
      expect(score.bars.bars).toEqual(expectedBars);
    });
    it('should add a start repeat if pickup beat before', () => {
      const musicString = '5e |: 1w';
      const expectedBars = [
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'heavy-light',
          _duration: new Fraction(1, 8),
          _pickup: true,
          startDuration: new Fraction(0),
          _key: new Key('c', 'major'),
          showKeySign: true,
          notes: {},
        },
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'light-heavy',
          startRepeat: 1,
          _duration: new Fraction(4, 4),
          startDuration: new Fraction(1, 8),
          _key: new Key('c', 'major'),
          showKeySign: false,
          notes: {},
        },
      ];
      const score = importer.parse(musicString);
      if (importer.errors.length) importer.errors.forEach((item) => console.log('### ' + item));
      score.bars.bars.forEach((bar) => (bar.notes = {})); // ignore data in this test
      expect(importer.errors.length).toBe(0);
      expect(score.bars.bars).toEqual(expectedBars);
    });
    it('should add an end repeat', () => {
      const musicString = '1w :|';
      const expectedBars = [
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'light-heavy',
          endRepeat: 1,
          _duration: new Fraction(4, 4),
          startDuration: new Fraction(0),
          _key: new Key('c', 'major'),
          showKeySign: true,
          notes: {},
        },
      ];
      const score = importer.parse(musicString);
      score.bars.bars.forEach((bar) => (bar.notes = {})); // ignore data in this test
      if (importer.errors.length) importer.errors.forEach((item) => console.log('### ' + item));
      expect(importer.errors.length).toBe(0);
      expect(score.bars.bars).toEqual(expectedBars);
    });
    it('should add a double repeat', () => {
      const musicString = '1w :||: 2w';
      const expectedBars = [
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'heavy-heavy',
          endRepeat: 1,
          _duration: new Fraction(4, 4),
          startDuration: new Fraction(0),
          _key: new Key('c', 'major'),
          showKeySign: true,
          notes: {},
        },
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'light-heavy',
          startRepeat: 1,
          _duration: new Fraction(4, 4),
          startDuration: new Fraction(1),
          _key: new Key('c', 'major'),
          showKeySign: false,
          notes: {},
        },
      ];
      const score = importer.parse(musicString);
      score.bars.bars.forEach((bar) => (bar.notes = {})); // ignore data in this test
      if (importer.errors.length) importer.errors.forEach((item) => console.log('### ' + item));
      expect(importer.errors.length).toBe(0);
      expect(score.bars.bars).toEqual(expectedBars);
    });
    it('should add ending', () => {
      const musicString = '1w |[1';
      const expectedBars = [
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'regular',
          _duration: new Fraction(4, 4),
          startDuration: new Fraction(0),
          _key: new Key('c', 'major'),
          showKeySign: true,
          notes: {},
        },
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'light-heavy',
          _duration: new Fraction(4, 4),
          ending: {
            start: true,
            number: '1',
          },
          startDuration: new Fraction(1),
          _key: new Key('c', 'major'),
          showKeySign: false,
          notes: {},
        },
      ];
      const score = importer.parse(musicString);
      if (importer.errors.length) importer.errors.forEach((item) => console.log('### ' + item));
      expect(importer.errors.length).toBe(0);
      score.bars.bars.forEach((bar) => (bar.notes = {})); // ignore data in this test
      expect(score.bars.bars).toEqual(expectedBars);
    });
    it('should parse short tune with first and second ending', () => {
      const musicString = '1w |[1 1w :|[2 1w';
      const expectedBars = [
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'regular',
          _duration: new Fraction(4, 4),
          startDuration: new Fraction(0),
          _key: new Key('c', 'major'),
          showKeySign: true,
          notes: {},
        },
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'light-heavy',
          _duration: new Fraction(4, 4),
          endRepeat: 1,
          ending: {
            start: true,
            number: '1',
          },
          startDuration: new Fraction(1),
          _key: new Key('c', 'major'),
          showKeySign: false,
          notes: {},
        },
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'light-heavy',
          _duration: new Fraction(4, 4),
          ending: {
            start: true,
            number: '2',
          },
          startDuration: new Fraction(2),
          _key: new Key('c', 'major'),
          showKeySign: false,
          notes: {},
        },
      ];
      const score = importer.parse(musicString);
      score.bars.bars.forEach((bar) => (bar.notes = {})); // ignore data in this test
      if (importer.errors.length) importer.errors.forEach((item) => console.log('### ' + item));
      expect(importer.errors.length).toBe(0);
      expect(score.bars.bars).toEqual(expectedBars);
    });
    it('should parse short tune with pickup bar and double bar later', () => {
      const musicString = '1 | 1w || 1w';
      const expectedBars = [
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'regular',
          _duration: new Fraction(1, 4),
          _pickup: true,
          startDuration: new Fraction(0),
          _key: new Key('c', 'major'),
          showKeySign: true,
          notes: {},
        },
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'light-light',
          _duration: new Fraction(4, 4),
          startDuration: new Fraction(1,4),
          _key: new Key('c', 'major'),
          showKeySign: false,
          notes: {},
        },
        {
          _timeSignature: new TimeSignature(4, 4),
          barline: 'light-heavy',
          _duration: new Fraction(4, 4),
          startDuration: new Fraction(5,4),
          _key: new Key('c', 'major'),
          showKeySign: false,
          notes: {},
        },
      ];
      const score = importer.parse(musicString);
      score.bars.bars.forEach((bar) => (bar.notes = {})); // ignore data in this test
      if (importer.errors.length) importer.errors.forEach((item) => console.log('### ' + item));
      expect(importer.errors.length).toBe(0);
      expect(score.bars.bars).toEqual(expectedBars);
    });
    it('should import linebreak', () => {
      const musicString = '1w ||\\ 1w';
      const score = importer.parse(musicString);
      expect(importer.errors.length).toBe(0);
      expect(score.bars.bars[0].lineBreak).toBeTruthy();
    });
  });
  describe('decorations & notations', () => {
    describe('barline', () => {
      it('should add segno, D.S. al fine and fine', () => {
        const musicString = '1w !segno!| 1w !fine!| 1w !D.S.alfine!|';
        const expectedBars = [
          {
            _timeSignature: new TimeSignature(4, 4),
            barline: 'regular',
            _duration: new Fraction(4, 4),
            startDuration: new Fraction(0),
            _key: new Key('c', 'major'),
            showKeySign: true,
            notes: {},
          },
          {
            _timeSignature: new TimeSignature(4, 4),
            barline: 'regular',
            _duration: new Fraction(4, 4),
            directions: [{ type: 'to', index: 0 }, {}],
            startDuration: new Fraction(1),
            _key: new Key('c', 'major'),
            showKeySign: false,
            notes: {},
          },
          {
            _timeSignature: new TimeSignature(4, 4),
            barline: 'light-heavy',
            _duration: new Fraction(4, 4),
            directions: [{ _al: 'fine', type: 'from', index: 0 }],
            startDuration: new Fraction(2),
            _key: new Key('c', 'major'),
            showKeySign: false,
            notes: {},
          },
        ];
        const score = importer.parse(musicString);
        score.bars.bars.forEach((bar) => (bar.notes = {})); // ignore data in this test
        if (importer.errors.length) importer.errors.forEach((item) => console.log('### ' + item));
        expect(importer.errors.length).toBe(0);
        expect(score.bars.bars).toEqual(expectedBars);
      });
    });
    describe('rhythmelement', () => {
      it('should add forte', () => {
        const musicString = '!f!1w';
        const note = {
          _type: 'w',
          _octave: 5,
          _root: 'c',
          _midiNumber: 60,
          notations: [{ text: 'f' }],
          _staffIndex: 0,
        };
        const score = importer.parse(musicString);
        if (importer.errors.length) importer.errors.forEach((item) => console.log('### ' + item));
        expect(importer.errors.length).toBe(0);
        expect(score.parts.getPart(0).getVoice(0).getNotes()).toEqual([note]);
      });
    });
  });

  /*describe('tuplets, triplets', () => {
    it('should handle quarter triplet, 3:1 2 3', () => {
      const musicString = '3:1 2 3';
      const data = [
        { items: '1', triplet: { p: 3 }, type: 'q', typeIsDefault: true },
        { items: '2', type: 'q', typeIsDefault: true },
        { items: '3', type: 'q', typeIsDefault: true },
      ];
      const result = importer.parse(musicString);
      expect(importer.errors.length).toBe(0);
      expect(result).toEqual(data);
    });
  });*/
});
