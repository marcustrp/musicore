import { describe, expect, it } from 'vitest';
import { Note } from '$lib/core/note.js';
import { helpers } from './note.js';
/** 
 * const event: NoteEvent = {
      eventType: 'note',
      position: 0,
      index: 0,
      barIndex: 0,
      clef: 'g',
      note,
      settings: {},
      score: {} as Score
    }
 */

describe('getNoteAction', () => {
	it('Should return toggle if clicked on existing note', () => {
		const note = new Note('w', 'f', undefined, 6);
		const newNote = new Note('w', 'f', undefined, 6);
		const result = helpers.getNoteAction(note, newNote, {});
		expect(result).toEqual({ action: 'toggle' });
	});
	it('Should return update if clicking on non-existing note and maxNotes is reached', () => {
		const note = new Note('w', 'f', undefined, 6);
		const newNote = new Note('w', 'e', undefined, 6);
		const result = helpers.getNoteAction(note, newNote, { maxNotes: 1 });
		expect(result.action).toEqual('update');
	});
	it('Should return update if clicked on non-existing note if note is invisible', () => {
		const note = new Note('w', 'f', undefined, 6);
		note.invisible = true;
		const newNote = new Note('w', 'e', undefined, 6);
		const result = helpers.getNoteAction(note, newNote, {});
		expect(result.action).toEqual('update');
	});
	it('Should return toggle if clicked on non-existing note', () => {
		const note = new Note('w', 'f', undefined, 6);
		const newNote = new Note('w', 'e', undefined, 6);
		const result = helpers.getNoteAction(note, newNote, {});
		expect(result.action).toEqual('toggle');
	});
});

describe('getNearestNote', () => {
	it('Should return main note if no chord notes', () => {
		const note = new Note('w', 'c');
		const newNote = new Note('w', 'd');
		const result = helpers.getNearestNote(note, newNote);
		expect(result).toMatchObject({ root: 'c', octave: 5 });
	});
	it('Should return nearest note (lower) when to notes present', () => {
		const note = new Note('w', 'c');
		note.addChordNote(new Note('w', 'g'));
		const newNote = new Note('w', 'd');
		const result = helpers.getNearestNote(note, newNote);
		expect(result).toMatchObject({ root: 'c', octave: 5 });
	});
	it('Should return nearest note (upper) when to notes present', () => {
		const note = new Note('w', 'c');
		note.addChordNote(new Note('w', 'g'));
		const newNote = new Note('w', 'f');
		const result = helpers.getNearestNote(note, newNote);
		expect(result).toMatchObject({ root: 'g', octave: 5 });
	});
	it('Should return lower note if distance equal to note below and above', () => {
		const note = new Note('w', 'c');
		note.addChordNote(new Note('w', 'g'));
		const newNote = new Note('w', 'e');
		const result = helpers.getNearestNote(note, newNote);
		expect(result).toMatchObject({ root: 'c', octave: 5 });
	});
});
