import { Score } from '$lib/index.js';
import { LStaffLines } from './layout/LStaffLines.js';
import { LClef, type EClef } from './layout/LClef.js';
import { LKeySignature, type EKeySignature } from './layout/LKeySignature.js';
import { LTimeSignature, type ETimeSignature } from './layout/LTimeSignature.js';
import { LBars, type EBars } from './layout/LBars.js';
import { LNote } from './layout/LNote.js';
import { LRest } from './layout/LRest.js';
import LayoutDocument from './layout/LayoutDocument.js';
import { Font } from './fonts/font.js';
import { LAccidental } from './layout/LAccidental.js';
import { BBox } from './utils/bBox.js';
import { type LayoutSettings, type LayoutSettingsInternal } from './types.js';
import type { EStaffLines } from './layout/types.js';

export type LayoutData = {
	document: { width: number; height: number };
	staffLines: LStaffLines;
	clef: LClef;
	key: LKeySignature;
	timeSignature: LTimeSignature;
	bars: LBars;
};

export type EngravingData = {
	document: { width: number; height: number; bBox: BBox };
	staffLines?: EStaffLines;
	clef?: EClef;
	keySignature?: EKeySignature;
	timeSignature?: ETimeSignature;
	bars?: EBars;
};

/*
export type Data = {
  clef: { [K in keyof LClef]: LClef[K] };
  key: { [K in keyof LKeySignature]: LKeySignature[K] };
  timeSignature: { [K in keyof LTimeSignature]: LTimeSignature[K] };
  bars: { [K in keyof LBar]: LBar[K] }[];
};*/

/**
 * Layouts the sheet music (but does not draw it)
 * - Inspired by Behind Bars by Elaine Gould
 * - default staff size is 10 (10 units per stave-space)
 */
export class SheetMusicLayout {
	#layoutSettings!: LayoutSettingsInternal;
	staffSize: number = 7; // size of stave in mm (5 line staff, from top to bottom line)
	staveSpace: number = 250; // space between staves, staffSize 7mm gives 250 units per stave-space

	font: Font;

	document: LayoutDocument;

	testValue = { a: 1 };

	private _layoutData!: LayoutData;
	get layoutData() {
		return this._layoutData;
	}
	set layoutData(value: LayoutData) {
		this._layoutData = value;
	}

	engravingData: EngravingData = { document: { width: 0, height: 0, bBox: new BBox() } };

	private callback?: (arg0: EngravingData) => void;

	constructor(
		private score: Score,
		//data: LayoutData,
		document: LayoutDocument = new LayoutDocument(),
	) {
		this.font = new Font('bravura');
		this.document = document;
	}

	setup(score: Score) {
		if (
			this.#layoutSettings.render?.notes?.editorAccidental ||
			this.#layoutSettings.render?.keySignature === 'editor'
		) {
			const horizAdvX = LAccidental.getGlyph(this.#layoutSettings, '#').horizAdvX;
			this.#layoutSettings.defaultAccidentalEditorWidth = horizAdvX ? parseInt(horizAdvX) : 0;
		}

		score.updatePrintedAccidentals();

		const staffLines = new LStaffLines(this.#layoutSettings, 5, this.document.margin.left);
		const clef = new LClef(this.font, score.parts.getPart(0).staves[0].clef.type);
		const key = new LKeySignature(
			this.#layoutSettings,
			clef.type,
			score.bars.bars[0].key.root,
			score.bars.bars[0].key.mode,
			score.bars.bars[0].key.accidentals,
			score.bars.bars[0].key.customAccidentals,
		);
		const timeSignature = new LTimeSignature(
			this.font,
			score.bars.bars[0].timeSignature.count,
			score.bars.bars[0].timeSignature.unit,
		);
		const bars = new LBars(this.#layoutSettings, score);

		/*data.staffLines = staffLines;
    data.clef = clef;
    data.key = key;
    data.timeSignature = timeSignature;
    data.bars = bars;
    this._layoutData = data;*/
		this._layoutData = {
			document: { width: 0, height: 0 },
			staffLines,
			clef,
			key,
			timeSignature,
			bars,
		};
	}

	calculateStaveSpace() {
		this.staveSpace = 250; //(this.staffSize / 7) * 250;
	}

	/**
	 *
	 * @param staffSize size of stave in mm
	 */
	layout(settings?: LayoutSettings) {
		if (!settings) settings = { staffSize: 7 };
		this.staffSize = settings.staffSize!;
		this.calculateStaveSpace();
		this.#layoutSettings = {
			...settings,
			staffSize: settings.staffSize!,
			defaultAccidental: settings.defaultAccidental || '#',
			defaultKeyAccidential:
				settings.defaultAccidental === '#' || settings.defaultAccidental === 'b' ?
					settings.defaultAccidental
				:	'#',
			staveSpace: this.staveSpace,
			font: this.font,
			scale: this.staffSize / 7,
		};
		console.log('LAYOUTSETTINSG', this.#layoutSettings);
		/** Setup everything each rendering... (for testing, need more optimized way later) */
		this.setup(this.score);

		const staffMargin = 0; //(this._layoutData.clef.glyph.bBox?.y1 || 0) * this.staveSpace;
		//this._layoutData.staffLines.layout(this.staveSpace, staffMargin);

		let x = 0;
		if (!settings.render || settings.render.clef !== false)
			x = this._layoutData.clef.layout(this.#layoutSettings, this._layoutData.staffLines.lines);

		if (!settings.render || settings.render.keySignature !== false)
			x = this._layoutData.key.layout(this.#layoutSettings, this._layoutData.staffLines.lines, x);

		if (!settings.render || settings.render.timeSignature !== false)
			x = this._layoutData.timeSignature.layout(
				this.staveSpace,
				this._layoutData.staffLines.lines,
				x,
			);

		if (!settings.render || settings.render.bars !== false) {
			x = this._layoutData.bars.layout(
				this.#layoutSettings,
				this._layoutData.staffLines.lines,
				this._layoutData.clef,
				x,
			);
		} else {
			x += this.staveSpace; // add some padding if bars are not rendered
		}

		/*this._layoutData.staffLines.lines.forEach((staffLine, index) => {
      staffLine.y = staffMargin + this.staveSpace * index;
      staffLine.length = x;
    });*/
		this._layoutData.staffLines.layout(this.staveSpace, staffMargin, x);

		this._layoutData.document.width = x * this.#layoutSettings.scale;
		this._layoutData.document.height =
			(this._layoutData.staffLines.lines[this._layoutData.staffLines.lines.length - 1].y + 50) *
			this.#layoutSettings.scale;

		this.engravingData.document = { ...this._layoutData.document, bBox: this.getBBox() };
		this.engravingData.staffLines = this._layoutData.staffLines.toObject();
		this.engravingData.clef =
			settings.render && settings.render.clef === false ?
				undefined
			:	this._layoutData.clef.toObject();
		this.engravingData.keySignature =
			settings.render && settings.render.keySignature === false ?
				undefined
			:	this._layoutData.key.toObject(this.#layoutSettings);
		this.engravingData.timeSignature =
			settings.render && settings.render.timeSignature === false ?
				undefined
			:	this._layoutData.timeSignature.toObject();
		this.engravingData.bars =
			settings.render && settings.render.bars === false ?
				undefined
			:	this._layoutData.bars.toObject(this.#layoutSettings);

		return this.engravingData;
	}

	getBBox() {
		let bBox: BBox | undefined = undefined;
		if (!this.#layoutSettings.render || this.#layoutSettings.render.clef !== false)
			bBox = this.mergeBBox(bBox, this._layoutData.clef.bBox);
		if (!this.#layoutSettings.render || this.#layoutSettings.render.keySignature !== false)
			this.mergeBBox(bBox, this._layoutData.key.bBox);
		if (!this.#layoutSettings.render || this.#layoutSettings.render.timeSignature !== false)
			this.mergeBBox(bBox, this._layoutData.timeSignature.bBox);
		if (!this.#layoutSettings.render || this.#layoutSettings.render.bars !== false)
			this.mergeBBox(bBox, this.layoutData.bars.bBox);
		if (this._layoutData.staffLines.bBox) this.mergeBBox(bBox, this._layoutData.staffLines.bBox);
		return bBox || new BBox();
	}

	mergeBBox(bBox: BBox | undefined, bBox2: BBox | undefined) {
		if (bBox && bBox2) {
			bBox.merge(bBox2);
		} else if (bBox2) {
			bBox = bBox2.clone();
		}
		return bBox;
	}

	getRhythmElementData(note: LNote | LRest) {
		if (note instanceof LNote) {
			return this.getNoteData(note);
		} else {
			return this.getRestData(note);
		}
	}

	getNoteData(note: LNote) {
		const className = note.constructor.name;
		const { ...lNote } = note;
		const { ...stem } = lNote.stem ? lNote.stem : {};
		return { ...lNote, stem, className };
	}

	getRestData(rest: LRest) {
		const className = rest.constructor.name;
		const { ...tmp } = rest;
		return { ...tmp, className };
	}

	register(callback: (arg0: EngravingData) => void) {
		this.callback = callback;
	}

	unregister() {
		this.callback = undefined;
	}

	/*updateNote(id: string, octave: number) {
		const note = this.score.parts.getPart(0).getVoice(0).getNoteById(id);
		if (!note || !(note instanceof Note)) throw new Error('Note not found');
		console.log('updateNote', note, octave);
		note.octave = octave;
		console.log('updateNote, score:', this.score);
		if (this.callback) this.callback(this.layout(this.#layoutSettings));
	}*/
}
