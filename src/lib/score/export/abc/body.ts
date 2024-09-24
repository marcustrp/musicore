import { Note } from '../../../core/note.js';
import { Rest } from '../../../core/rest.js';
import { Scale } from '../../../core/scale.js';
import { Score } from '../../score.js';
import { ReportFunction } from '../abc.js';
import { BarGenerator } from './bar.js';
import { NoteGenerator } from './note.js';

export class BodyGenerator {
	private barGenerator: BarGenerator;
	private noteGenerator: NoteGenerator;

	constructor(
		private addWarning: ReportFunction,
		private addError: ReportFunction,
	) {
		this.barGenerator = new BarGenerator(addWarning, addError);
		this.noteGenerator = new NoteGenerator(addWarning, addError);
	}

	/**
	 * Generate the body of the ABC score (notes, bars, etc.)
	 * @param score
	 * @returns
	 *
	 */
	getBody(score: Score) {
		const body: string[] = [''];
		let bodyIndex = 0;
		const scale = new Scale(score.bars.bars[0].key.root, score.bars.bars[0].key.mode);
		const scaleNotes = scale.getDiatonicNoteNames();
		score.bars.bars.forEach((bar, index) => {
			const barItems = this.barGenerator.getBarAbc(bar, index);
			if (barItems.start) body[bodyIndex] += barItems.start;
			bar.notes['P1']['V1'].forEach((note) => {
				if (note instanceof Note) {
					body[bodyIndex] += this.noteGenerator.getNote(note, scaleNotes, bar.timeSignature);
				} else {
					body[bodyIndex] += this.noteGenerator.getRest(note as Rest);
				}
			});
			if (barItems.end) body[bodyIndex] += ' ' + barItems.end;
			if (barItems.lineBreak) {
				body.push('');
				bodyIndex++;
			}
		});
		return body
			.map((item) => item.trim())
			.join('\n')
			.trim();
	}
}
