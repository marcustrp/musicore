import { Bar } from '../core/bar.js';
import { Score } from '../score/score.js';

type JumpType = 'repeat' | 'ending' | 'segno' | 'coda';
export type JumpData = { fromBar: number; toBar: number; type: JumpType };
export type FormData = {
	barSequence: number[];
	jumps: JumpData[];
};
/**
 * Exports array of bar index, taking in to account repeats,
 * endings, segno, codas...
 */
export class FormAnalyser {
	private score: Score = new Score();
	private sequence: number[] = [];
	private jumps: JumpData[] = [];
	private repeat = 0;
	private repeatStart = 0;
	private ending = 0;
	private nextEnding = 0;
	private inEnding = false;

	private iterations = 0;

	parse(score: Score) {
		this.score = score;
		this.sequence = [];
		let index = 0;
		do {
			index = this.scan(index);
			this.iterations++;
		} while (index >= 0 && this.iterations < 100);
		const data: FormData = { barSequence: this.sequence, jumps: this.jumps };
		return data;
	}

	private scan(index: number) {
		for (let i = index; i < this.score.bars.bars.length; i++) {
			const bar = this.score.bars.bars[i];
			if (bar.startRepeat && this.repeat === 0) {
				this.repeatStart = i;
				this.inEnding = false;
			}
			if (bar.ending) {
				if (bar.ending.start) {
					const ending = this.getEnding(bar);
					if (ending === this.ending) {
						this.ending = 0;
						const retIndex = this.nextEnding;
						this.nextEnding = 0;
						this.addJump(i - 1, retIndex, 'ending');
						return retIndex;
					} else {
						this.ending = ending;
						this.inEnding = true;
					}
				}
			}

			this.sequence.push(i);

			if (bar.endRepeat) {
				if (this.repeat === 1) {
					// continue past repeat
					this.repeat = 0;
				} else if (this.repeatStart >= 0) {
					// do repeat
					this.repeat++;
					if (this.inEnding) {
						this.nextEnding = i + 1;
						this.inEnding = false;
					}
					this.addJump(i, this.repeatStart, 'repeat');
					return this.repeatStart;
				}
			}
		}
		return -1;
	}

	private getEnding(bar: Bar) {
		let ending = +bar.ending!.number;
		if (!(ending >= 1)) ending = 1;
		return ending;
	}

	private addJump(fromBar: number, toBar: number, type: JumpType) {
		this.jumps.push({ fromBar, toBar, type });
	}
}
