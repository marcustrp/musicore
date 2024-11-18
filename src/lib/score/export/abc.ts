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

export type AbcExporterSettings = {
	/** The X: information field of ABC */
	referenceNumber?: number;
	/** Minimal includes only X, K, M and L (useful for preview with single lineCount) */
	header?: 'full' | 'minimal';
	/** Number of lines to include in the output */
	lineCount?: number;
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

	export(score: Score, settings?: AbcExporterSettings) {
		this.score = score;
		validateScore(score, this.addWarning, this.addError);
		const headerGenerator = new HeaderGenerator(this.addWarning, this.addError);
		const header = headerGenerator.getHeader(this.score, settings);
		const bodyGenerator = new BodyGenerator(this.addWarning, this.addError);
		const body = bodyGenerator.getBody(score, settings);
		return `${header}\n${body}`;
	}

	private addError(message: string) {
		throw new Error(message);
	}

	private addWarning(message: string) {
		this.warnings.push(message);
	}
}
