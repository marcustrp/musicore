import { beforeEach, describe, expect, it } from 'vitest';
import { Clef } from '../../core/clef';
import { Key } from '../../core/key';
import { TimeSignature } from '../../core/timeSignature';
import { Note } from '../../core/note';
import { Score } from '../score';
import { AbcExporter } from './abc';

let exporter: AbcExporter;
beforeEach(() => {
  exporter = new AbcExporter();
});

describe('export()', () => {
  it('should export simple tune', () => {
    let abc = `%abc-2.2
I:abc-charset utf-8
I:abc-creator musicore-0.0.1
X:1
M:4/4
L:1/4
K:D
D2 E2 | D4 |]`;
    const score = new Score(new Key('d', 'major'), new TimeSignature(4, 4));
    const voice = score.parts.addPart().getVoice(0);
    voice.addNote(new Note('h', 'd'));
    voice.addNote(new Note('h', 'e'));
    voice.addNote(new Note('w', 'd'));
    score.bars.setBarline('light-heavy');
    const result = exporter.export(score);
    expect(result).toBe(abc);
  });
  it('should export simple in common time', () => {
    let abc = `%abc-2.2
I:abc-charset utf-8
I:abc-creator musicore-0.0.1
X:1
M:C
L:1/4
K:D
D2 E2 | D4 |]`;
    const score = new Score(new Key('d', 'major'), new TimeSignature('common'));
    const voice = score.parts.addPart().getVoice(0);
    voice.addNote(new Note('h', 'd'));
    voice.addNote(new Note('h', 'e'));
    voice.addNote(new Note('w', 'd'));
    score.bars.setBarline('light-heavy');
    const result = exporter.export(score);
    expect(result).toBe(abc);
  });
  it('should export simple in cut time', () => {
    let abc = `%abc-2.2
I:abc-charset utf-8
I:abc-creator musicore-0.0.1
X:1
M:C|
L:1/4
K:D
D2 E2 | D4 |]`;
    const score = new Score(new Key('d', 'major'), new TimeSignature('cut'));
    const voice = score.parts.addPart().getVoice(0);
    voice.addNote(new Note('h', 'd'));
    voice.addNote(new Note('h', 'e'));
    voice.addNote(new Note('w', 'd'));
    score.bars.setBarline('light-heavy');
    const result = exporter.export(score);
    expect(result).toBe(abc);
  });
  it('should export tune with repeat and endings', () => {
    let abc = `%abc-2.2
I:abc-charset utf-8
I:abc-creator musicore-0.0.1
X:1
M:4/4
L:1/4
K:D
D2 E2 |[1 F4 :|][2 D4 |]`;
    const score = new Score(new Key('d', 'major'), new TimeSignature(4, 4));
    const voice = score.parts.addPart().getVoice(0);
    voice.addNote(new Note('h', 'd'));
    voice.addNote(new Note('h', 'e'));
    voice.addNote(new Note('w', 'f', '#'));
    voice.addNote(new Note('w', 'd'));
    score.bars.setBarline('light-heavy', 1);
    score.bars.bars[1].endRepeat = 1;
    score.bars.bars[1].ending = { start: true, number: 1 };
    score.bars.bars[2].ending = { start: true, number: 2 };
    score.bars.setBarline('light-heavy');
    const result = exporter.export(score);
    expect(result).toBe(abc);
  });
  it('should export tune with line break', () => {
    let abc = `%abc-2.2
I:abc-charset utf-8
I:abc-creator musicore-0.0.1
X:1
M:4/4
L:1/4
K:D
D2 E2 |
D4 |]`;
    const score = new Score(new Key('d', 'major'), new TimeSignature(4, 4));
    const voice = score.parts.addPart().getVoice(0);
    voice.addNote(new Note('h', 'd'));
    voice.addNote(new Note('h', 'e'));
    voice.addNote(new Note('w', 'd'));
    score.bars.setBarline('light-heavy', 1);
    score.bars.setBarline('light-heavy');
    score.bars.bars[0].lineBreak = true;
    const result = exporter.export(score);
    expect(result).toBe(abc);
  });
});
