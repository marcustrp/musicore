import { Score } from '../index.js';
import { LStaffLines } from './LStaffLines.js';
import { LClef } from './LClef.js';
import { LKeySignature } from './LKeySignature.js';
import { LTimeSignature } from './LTimeSignature.js';
import { LBars } from './LBars.js';
import { LNote } from './LNote.js';
import { LRest } from './LRest.js';
import LayoutDocument from './LayoutDocument.js';
import {} from '../fonts/types.js';
import { LAccidental } from './LAccidental.js';
import { BBox } from '../utils/bBox.js';
import {} from './types.js';
// currently font is always bravura
import { bravura } from '../fonts/bravura.js';
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
    score;
    #layoutSettings;
    staffSize = 7; // size of stave in mm (5 line staff, from top to bottom line)
    staveSpace = 250; // space between staves, staffSize 7mm gives 250 units per stave-space
    font;
    document;
    testValue = { a: 1 };
    _layoutData;
    get layoutData() {
        return this._layoutData;
    }
    set layoutData(value) {
        this._layoutData = value;
    }
    engravingData = { document: { scale: 1, bBox: new BBox() } };
    callback;
    constructor(score, 
    //data: LayoutData,
    document = new LayoutDocument()) {
        this.score = score;
        this.font = bravura;
        this.document = document;
    }
    setup(score) {
        if (this.#layoutSettings.render?.notes?.editorAccidental ||
            this.#layoutSettings.render?.keySignature === 'editor') {
            const horizAdvX = LAccidental.getGlyph(this.#layoutSettings, '#').horizAdvX;
            this.#layoutSettings.defaultAccidentalEditorWidth = horizAdvX;
        }
        score.updatePrintedAccidentals();
        const staffLines = new LStaffLines(this.#layoutSettings, 5, this.document.margin.left);
        const clef = new LClef(this.font, score.parts.getPart(0).staves[0].clef.type);
        const key = new LKeySignature(this.#layoutSettings, clef.type, score.bars.bars[0].key.root, score.bars.bars[0].key.mode, score.bars.bars[0].key.accidentals, score.bars.bars[0].key.getCustomAccidentals(clef.type), score.bars.bars[0].key.colors);
        const timeSignature = new LTimeSignature(this.font, score.bars.bars[0].timeSignature.count, score.bars.bars[0].timeSignature.unit);
        const bars = new LBars(this.#layoutSettings, score);
        /*data.staffLines = staffLines;
    data.clef = clef;
    data.key = key;
    data.timeSignature = timeSignature;
    data.bars = bars;
    this._layoutData = data;*/
        this._layoutData = {
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
    layout(settings) {
        if (!settings)
            settings = { staffSize: 7 };
        this.staffSize = settings.staffSize ? settings.staffSize : 7;
        this.calculateStaveSpace();
        this.#layoutSettings = {
            ...settings,
            staffSize: settings.staffSize,
            defaultAccidental: settings.defaultAccidental || '#',
            defaultKeyAccidential: settings.defaultAccidental === '#' || settings.defaultAccidental === 'b' ?
                settings.defaultAccidental
                : '#',
            staveSpace: this.staveSpace,
            font: this.font,
            scale: this.staffSize / 7,
        };
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
            x = this._layoutData.timeSignature.layout(this.staveSpace, this._layoutData.staffLines.lines, x);
        if (!settings.render || settings.render.bars !== false) {
            x = this._layoutData.bars.layout(this.#layoutSettings, this._layoutData.staffLines.lines, this._layoutData.clef, x);
        }
        else {
            x += this.staveSpace; // add some padding if bars are not rendered
        }
        /*this._layoutData.staffLines.lines.forEach((staffLine, index) => {
      staffLine.y = staffMargin + this.staveSpace * index;
      staffLine.length = x;
    });*/
        this._layoutData.staffLines.layout(this.staveSpace, staffMargin, x);
        this.engravingData.document = { scale: this.#layoutSettings.scale, bBox: this.getBBox() };
        this.engravingData.staffLines = this._layoutData.staffLines.toObject();
        this.engravingData.clef =
            settings.render && settings.render.clef === false ?
                undefined
                : this._layoutData.clef.toObject();
        this.engravingData.keySignature =
            settings.render && settings.render.keySignature === false ?
                undefined
                : this._layoutData.key.toObject(this.#layoutSettings);
        this.engravingData.timeSignature =
            settings.render && settings.render.timeSignature === false ?
                undefined
                : this._layoutData.timeSignature.toObject();
        this.engravingData.bars =
            settings.render && settings.render.bars === false ?
                undefined
                : this._layoutData.bars.toObject(this.#layoutSettings);
        return this.engravingData;
    }
    getBBox() {
        let bBox = undefined;
        if (!this.#layoutSettings.render || this.#layoutSettings.render.clef !== false)
            bBox = this.mergeBBox(bBox, this._layoutData.clef.bBox);
        if (!this.#layoutSettings.render || this.#layoutSettings.render.keySignature !== false)
            this.mergeBBox(bBox, this._layoutData.key.bBox);
        if (!this.#layoutSettings.render || this.#layoutSettings.render.timeSignature !== false)
            this.mergeBBox(bBox, this._layoutData.timeSignature.bBox);
        if (!this.#layoutSettings.render || this.#layoutSettings.render.bars !== false)
            this.mergeBBox(bBox, this.layoutData.bars.bBox);
        if (this._layoutData.staffLines.bBox)
            this.mergeBBox(bBox, this._layoutData.staffLines.bBox);
        return bBox || new BBox();
    }
    mergeBBox(bBox, bBox2) {
        if (bBox && bBox2) {
            bBox.merge(bBox2);
        }
        else if (bBox2) {
            bBox = bBox2.clone();
        }
        return bBox;
    }
    getRhythmElementData(note) {
        if (note instanceof LNote) {
            return this.getNoteData(note);
        }
        else {
            return this.getRestData(note);
        }
    }
    getNoteData(note) {
        const className = note.constructor.name;
        const { ...lNote } = note;
        const { ...stem } = lNote.stem ? lNote.stem : {};
        return { ...lNote, stem, className };
    }
    getRestData(rest) {
        const className = rest.constructor.name;
        const { ...tmp } = rest;
        return { ...tmp, className };
    }
    register(callback) {
        this.callback = callback;
    }
    unregister() {
        this.callback = undefined;
    }
}
