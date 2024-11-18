import * as abcjs from 'abcjs';
import * as abcjsTypes from '../../utils/abcjs-types.js';
import { Score } from '../score.js';
import { Clef } from '../../core/clef.js';
import { Scale } from '../../core/scale.js';
import * as mappers from './abc/data/mappers.js';
import HeaderParser from './abc/header.js';
import { NoteParser } from './abc/note.js';
import { BarParser } from './abc/bar.js';
import { MetaTextParser } from './abc/metatext.js';
import Fraction from 'fraction.js';

export class AbcImportState {
	constructor(
		public currentScale: Scale = new Scale('c', 'major'),
		public scaleNoteNames: { [key: string]: string } = {},
		public partIndex: number = 0,
		public voiceIndex: number = 0,
		public errors: string[] = [],
	) {}
}

export class AbcImporter {
	score!: Score;
	state = new AbcImportState();

	headerParser = new HeaderParser(this.state);
	noteParser = new NoteParser(this.state);
	barParser = new BarParser(this.state);
	metaTextParser = new MetaTextParser(this.state);

	parse(abc: string) {
		const tunes = abcjs.renderAbc('*', abc);
		/** @abcjs incomplete type */
		if (!tunes || (tunes.length as number) === 0) {
			throw new Error('Parse error or no tune');
		} else {
			const tune = tunes[0];
			this.initScore(tune);
			let staffCreated = false;
			tune.lines.forEach((line) => {
				if (line.columns) {
					this.state.errors.push('line.columns not implemented');
				}
				if (line.image) {
					this.state.errors.push('line.image not implemented');
				}
				if (line.newpage) {
					this.state.errors.push('line.newpage not implemented');
				}
				if (line.separator) {
					this.state.errors.push('line.separator not implemented');
				}
				if (line.staff) {
					line.staff.forEach((staff) => {
						staff.voices?.forEach((voice, voiceIndex) => {
							this.state.voiceIndex = voiceIndex;
							if (!staffCreated) {
								const clefType: abcjs.Clef = staff.clef ? staff.clef.type : 'treble';
								const clef = new Clef(
									mappers.clef[clefType].type,
									undefined,
									mappers.clef[clefType].octave,
								);
								this.score.parts.addPart(clef);
								staffCreated = true;
							}
							if (voiceIndex >= this.score.parts.getPart(0).getVoiceCount())
								this.score.parts.getPart(0).addVoice();
							voice.forEach((item) => {
								this.parseElement(item); //), 0, staffIndex, voiceIndex);
							});
						});
					});
				}
				//if (line.staffGroups) {
				/** @ todo */
				//}
				if (line.staffbreak) {
					this.state.errors.push('line.staffbreak not implemented');
				}
				if (line.subtitle) {
					this.score.addWorkInformation('subtitle', line.subtitle.text);
				}
				if (line.text) {
					this.state.errors.push('line.text not implemented');
				}
				if (line.vskip) {
					this.state.errors.push('line.text not implemented');
				}
			});
		}
		return this.score;
	}

	initScore(tune: abcjs.TuneObject) {
		const key = this.headerParser.getKey(tune.getKeySignature());
		const timeSignature = this.headerParser.getTimeSignature(tune.getMeter());
		this.score = new Score(key, timeSignature);
		const pickupLength = tune.getPickupLength();
		if (pickupLength > 0) this.score.bars.convertToPickup(new Fraction(pickupLength));

		const scale = new Scale(key.root, key.mode);
		this.state.currentScale = scale;
		this.state.scaleNoteNames = scale.getNaturalNoteMapping();

		if (tune.metaText) this.metaTextParser.parse(tune.metaText, this.score);
	}

	/** @todo implement more... */
	parseElement(
		item: abcjs.VoiceItem /*, partIndex: number, staffIndex: number, voiceIndex: number*/,
	) {
		switch (item.el_type) {
			case 'bar':
				this.barParser.parse(item, this.score);
				break;
			case 'clef':
				//const clef = new Clef(clefMapper[item.type].type, undefined, clefMapper[item.type].octave);
				break;
			case 'gap':
				return;
			case 'key':
				return;
			case 'meter':
				break;
			case 'midi':
				break;
			case 'note':
				/** @abcjs incomplete type */
				this.noteParser.parse(item as abcjsTypes.VoiceItemNote_FIX, this.score);
				break;
			case 'overlay':
				break;
			case 'part':
				break;
			case 'scale':
				break;
			case 'style':
				break;
			case 'stem':
				break;
			case 'tempo':
				break;
			case 'transpose':
				break;
		}
	}
}
