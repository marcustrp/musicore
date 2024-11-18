import { Note } from '$lib/core/note.js';
import { Score } from '$lib/score/score.js';
import { describe, expect, it } from 'vitest';
import { helpers } from './key-signature.js';
import type { KeySignatureAccidentalEvent } from './types.js';

function getScore(notes: Note[]) {
	return {
		parts: {
			_parts: [
				{
					voices: [
						{
							getNotes: () => {
								return notes;
							},
						},
					],
				},
			],
		},
	} as unknown as Score;
}

describe('updateNotes', () => {
	it('Should update affected note when adding accidental but not other note', () => {
		const event = {
			score: getScore([new Note('h', 'c'), new Note('h', 'd')]),
			position: 10,
			accidental: '#',
			clef: 'g',
		} as unknown as KeySignatureAccidentalEvent;
		helpers.updateNotes(event.score, event.position, event.clef, event.accidental, true, {
			updateNotes: true,
		});
		expect(event.score.parts._parts[0].voices[0].getNotes()).toMatchObject([
			{ accidental: '#', _diatonicNoteName: 'c#' },
			{ _diatonicNoteName: 'd' },
		]);
	});
	it('Should update affected note (without printed accidental) when removing accidental', () => {
		const note = new Note('h', 'c', '#');
		note.setDiatonicNoteName('c#');
		note.setPrintedAccidental(undefined);
		const event = {
			score: getScore([note, new Note('h', 'd')]),
			position: 10,
			accidental: '#',
			clef: 'g',
		} as unknown as KeySignatureAccidentalEvent;
		helpers.updateNotes(event.score, event.position, event.clef, event.accidental, false, {
			updateNotes: true,
		});
		expect(event.score.parts._parts[0].voices[0].getNotes()).toMatchObject([
			{ _diatonicNoteName: 'c' },
			{ _diatonicNoteName: 'd' },
		]);
		expect(note.accidental).toBeUndefined();
	});
	it('Should not update affected note (with printed accidental) when removing accidental', () => {
		const note = new Note('h', 'c', '#');
		note.setDiatonicNoteName('c#');
		note.setPrintedAccidental('#');
		const event = {
			score: getScore([note, new Note('h', 'd')]),
			position: 10,
			accidental: '#',
			clef: 'g',
		} as unknown as KeySignatureAccidentalEvent;
		helpers.updateNotes(event.score, event.position, event.clef, event.accidental, false, {
			updateNotes: true,
		});
		expect(event.score.parts._parts[0].voices[0].getNotes()).toMatchObject([
			{ _diatonicNoteName: 'c', accidental: '#', printedAccidental: { value: '#' } },
			{ _diatonicNoteName: 'd' },
		]);
	});
});
