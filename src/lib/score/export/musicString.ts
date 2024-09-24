import { Score } from '../score.js';
import { BodyExporter } from './musicString/body.js';

export type ReportFunction = {
	(message: string): void;
};

export class MusicStringExporter {
	export(score: Score) {
		let musicstring = '';
		const bodyExporter = new BodyExporter();
		musicstring += bodyExporter.export(score);
		return musicstring;
	}
}
