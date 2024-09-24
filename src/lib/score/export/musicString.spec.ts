import { beforeEach, expect, it } from 'vitest';
import { Clef } from '../../core/clef';
import { Note } from '../../core/note';
import { Score } from '../score';
import { MusicStringExporter } from './musicString';

let exporter: MusicStringExporter;
beforeEach(() => {
	exporter = new MusicStringExporter();
});

it('should export simple music string', () => {
	const expecedResult = '1 2 3h';
	const score = new Score();
	const voice = score.parts.addPart().getVoice(0);
	voice.addNote(new Note('q', 'c'));
	voice.addNote(new Note('q', 'd'));
	voice.addNote(new Note('h', 'e'));
	const result = exporter.export(score);
	expect(result).toBe(expecedResult);
});
