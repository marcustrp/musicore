import { Score } from '../score.js';
import { BodyGenerator } from './abc/body.js';
import { HeaderGenerator } from './abc/header.js';
import { validateScore } from './abc/validate.js';
/**
 * Export a score to ABC notation
 *
 * @todo Add support for multiple parts
 * @todo Add support for multiple voices
 * @todo Add support for multiple staves
 */
export class AbcExporter {
    abc = '';
    score;
    warnings = [];
    export(score, settings) {
        this.score = score;
        validateScore(score, this.addWarning, this.addError);
        const headerGenerator = new HeaderGenerator(this.addWarning, this.addError);
        const header = headerGenerator.getHeader(this.score, settings);
        const bodyGenerator = new BodyGenerator(this.addWarning, this.addError);
        const body = bodyGenerator.getBody(score, settings);
        return `${header}\n${body}`;
    }
    addError(message) {
        throw new Error(message);
    }
    addWarning(message) {
        this.warnings.push(message);
    }
}
