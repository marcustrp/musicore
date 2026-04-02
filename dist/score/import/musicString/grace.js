import { Note } from '../../../core/note.js';
import { END, Tokenizer } from '../../../utils/tokenizer.js';
var TOKEN_TYPE;
(function (TOKEN_TYPE) {
    TOKEN_TYPE[TOKEN_TYPE["SPACE"] = 0] = "SPACE";
    TOKEN_TYPE[TOKEN_TYPE["FORWARD_SLASH"] = 1] = "FORWARD_SLASH";
    TOKEN_TYPE[TOKEN_TYPE["LEFT_PARENTHESIS"] = 2] = "LEFT_PARENTHESIS";
    TOKEN_TYPE[TOKEN_TYPE["SCALE_NUMBER"] = 3] = "SCALE_NUMBER";
    TOKEN_TYPE[TOKEN_TYPE["LENGTH"] = 4] = "LENGTH";
    TOKEN_TYPE[TOKEN_TYPE["RIGHT_PARENTHESIS"] = 5] = "RIGHT_PARENTHESIS";
    TOKEN_TYPE[TOKEN_TYPE["OCTAVE_UP"] = 6] = "OCTAVE_UP";
    TOKEN_TYPE[TOKEN_TYPE["OCTAVE_DOWN"] = 7] = "OCTAVE_DOWN";
})(TOKEN_TYPE || (TOKEN_TYPE = {}));
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
    static process(input, octave, scale) {
        const ast = GraceProcessor.parse(input, octave);
        const data = { notes: [], type: ast.type };
        for (const note of ast.notes) {
            data.notes.push(Note.fromScaleNumber(note.scaleNumber, note.octave, scale, note.length === 'e' ? '8' : '16'));
        }
        if (ast.slur) {
            data.notes[0].slurs = [{ type: 'start' }];
            if (ast.slur === 'internal')
                data.notes[data.notes.length - 1].slurs = [{ type: 'end' }];
        }
        return data;
    }
    static parse(input, octave) {
        const data = { notes: [], type: 'unacc' };
        let token;
        const t = GraceProcessor.tokenize(input);
        while ((token = t.next().value)) {
            if (token.type === END)
                break;
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
                    data.notes.forEach((note) => (note.length = token.value));
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
    static tokenize(data) {
        return GraceProcessor.tokenizer.tokenize(data);
    }
}
