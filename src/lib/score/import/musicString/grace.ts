import { Note, type Octave, type ScaleNumberInput } from '$lib/core/note.js';
import type { Scale } from '$lib/core/scale.js';
import { END, Tokenizer, type Token } from '$lib/utils/tokenizer.js';

const enum TOKEN_TYPE {
	SPACE,
	FORWARD_SLASH,
	LEFT_PARENTHESIS,
	SCALE_NUMBER,
	LENGTH,
	RIGHT_PARENTHESIS,
	OCTAVE_UP,
	OCTAVE_DOWN,
}

export type GraceData = {
	notes: Note[];
	type: 'unacc' | 'acc';
};

type NoteAST = { octave: number; scaleNumber: ScaleNumberInput; length: 'e' | 's' };

type GraceAST = {
	notes: NoteAST[];
	type: 'unacc' | 'acc';
	/** Slur can be internal (only grace notes) or continues (grace notes and continues to the following "real" note) */
	slur?: 'internal' | 'continues';
};

export class GraceProcessor {
	static tokenizer = new Tokenizer([
		{ matcher: /[ \t]+/, type: null }, // remove white space
		{ matcher: /\//, type: TOKEN_TYPE.FORWARD_SLASH },
		{ matcher: /\(/, type: TOKEN_TYPE.LEFT_PARENTHESIS },
		{
			matcher: /([+-]{0,5}[bm#]?[1-9])+/,
			type: [
				{ matcher: /\+/, type: TOKEN_TYPE.OCTAVE_UP },
				{ matcher: /-/, type: TOKEN_TYPE.OCTAVE_DOWN },
				{ matcher: /[bm#]?[1-9]/, type: TOKEN_TYPE.SCALE_NUMBER, valueExtractor: (match) => match },
			],
		},
		{
			matcher: /[es]?\)?$/,
			type: [
				{ matcher: /\)/, type: TOKEN_TYPE.RIGHT_PARENTHESIS },
				{ matcher: /[es]/, type: TOKEN_TYPE.LENGTH, valueExtractor: (match) => match },
			],
		},
	]);

	static process(input: string, octave: number, scale: Scale): GraceData {
		const ast = GraceProcessor.parse(input, octave);
		const data: GraceData = { notes: [], type: ast.type };
		for (const note of ast.notes) {
			data.notes.push(
				Note.fromScaleNumber(
					note.scaleNumber,
					note.octave as Octave,
					scale,
					note.length === 'e' ? '8' : '16',
				),
			);
		}
		if (ast.slur) {
			data.notes[0].slurs = [{ type: 'start' }];
			if (ast.slur === 'internal') data.notes[data.notes.length - 1].slurs = [{ type: 'end' }];
		}
		return data;
	}

	static parse(input: string, octave: number) {
		const data: GraceAST = { notes: [], type: 'unacc' };

		let token: Token | void;
		const t = GraceProcessor.tokenize(input);
		while ((token = t.next().value)) {
			if (token.type === END) break;
			switch (token.type) {
				case TOKEN_TYPE.FORWARD_SLASH:
					data.type = 'acc';
					break;
				case TOKEN_TYPE.LEFT_PARENTHESIS:
					data.slur = 'continues';
					break;
				case TOKEN_TYPE.OCTAVE_UP:
					octave += 1;
					break;
				case TOKEN_TYPE.OCTAVE_DOWN:
					octave -= 1;
					break;
				case TOKEN_TYPE.SCALE_NUMBER:
					// length is set to 's' by default
					data.notes.push({ octave, scaleNumber: token.value, length: 's' });
					break;
				case TOKEN_TYPE.LENGTH:
					data.notes.forEach((note) => (note.length = token!.value));
					break;
				case TOKEN_TYPE.RIGHT_PARENTHESIS:
					data.slur = 'internal';
					break;
				default:
					throw new Error(`Unexpected token: ${String(token.type)}`);
			}
		}

		return data;
	}

	static tokenize(data: string) {
		return GraceProcessor.tokenizer.tokenize(data);
	}
}
