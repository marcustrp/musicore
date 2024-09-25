import { Score } from '../score.js';
import { BodyGenerator } from './abc/body.js';
import { HeaderGenerator } from './abc/header.js';
import { validateScore } from './abc/validate.js';

/**
 * Function to report a warning or error
 */
export type ReportFunction = {
	(message: string): void;
};

/**
 * Export a score to ABC notation
 *
 * @todo Add support for multiple parts
 * @todo Add support for multiple voices
 * @todo Add support for multiple staves
 */
export class AbcExporter {
	abc = '';
	score!: Score;
	warnings: string[] = [];

	export(score: Score) {
		this.score = score;
		validateScore(score, this.addWarning, this.addError);
		const headerGenerator = new HeaderGenerator(this.addWarning, this.addError);
		const header = headerGenerator.getHeader(this.score);
		const bodyGenerator = new BodyGenerator(this.addWarning, this.addError);
		const body = bodyGenerator.getBody(score);
		return `${header}\n${body}`;
	}

	private addError(message: string) {
		throw new Error(message);
	}

	private addWarning(message: string) {
		this.warnings.push(message);
	}
}
