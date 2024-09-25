import { beforeEach, expect, it } from 'vitest';
import { Note } from '../../core/note.js';
import { Score } from '../score.js';
import { MusicStringExporter } from './musicString.js';

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
