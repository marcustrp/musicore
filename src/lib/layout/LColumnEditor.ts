import { type Glyph } from '../fonts/types.js';
import { type LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
import { LLedgerLines } from './LLedgerLines.js';
import { LStaffLine } from './LStaffLine.js';
import { type LayoutObject } from './LayoutObject.js';

export type ColumnEditorItemLayout = {
	x: number;
	y: number;
	position: number;
	text?: string;
};
export type ColumnEditorLayout = ReturnType<LColumnEditor['toObject']>;

export class LColumnEditor implements LayoutObject {
	x = 0;
	y = 0;
	bBox: BBox;
	#width: number;
	#text?: {
		x: number;
		y: number;
	};

	private items: ColumnEditorItemLayout[] = [];
	private _fromPosition: number; // position 0 is on the top line of the staff
	private _toPosition: number;
	private _getText?: (position: number) => string;
	private highlightBBox = new BBox();
	glyph: Glyph;
	ledgerLines?: {
		above?: LLedgerLines;
		below?: LLedgerLines;
	};

	/**
	 *
	 * @param settings
	 * @param glyph
	 * @param fromPosition
	 * @param toPosition
	 * @param width If not set, the width of the glyph is used
	 */
	constructor(
		settings: LayoutSettingsInternal,
		glyph: Glyph,
		fromPosition: number,
		toPosition: number,
		drawLedgerLines: boolean,
		getText?: (position: number) => string,
		width?: number,
	) {
		this.glyph = glyph;
		this._fromPosition = fromPosition;
		this._toPosition = toPosition;
		this.#width = width ? width : glyph.horizAdvX;
		this.bBox = new BBox();
		this._getText = getText;
		if (drawLedgerLines) this.createLedgerLines(settings);
	}

	createLedgerLines(settings: LayoutSettingsInternal) {
		const above = LLedgerLines.create(settings, this._fromPosition);
		const below = LLedgerLines.create(settings, this._toPosition);
		if (above || below) {
			this.ledgerLines = { above, below };
		}
	}

	toObject(barIndex: number, dataValue?: string) {
		const data = {
			items: this.items,
			glyph: this.glyph,
			bBox: this.highlightBBox,
			dataValue,
			barIndex: barIndex,
			text: this.#text,
			ledgerLines:
				this.ledgerLines ?
					{ above: this.ledgerLines.above?.lines || [], below: this.ledgerLines.below?.lines || [] }
				:	undefined,
		};
		return data;
	}

	calculateHighlightBBox(settings: LayoutSettingsInternal) {
		this.highlightBBox = BBox.fromObject({
			x: this.items[0].x,
			y: this.items[0].y - settings.staveSpace / 2,
			width: this.#width,
			height: this.items[this.items.length - 1].y - this.items[0].y + settings.staveSpace,
		});
	}

	layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], x: number) {
		this.x = x;
		for (let i = this._fromPosition + 1; i <= this._toPosition + 1; i++) {
			//if (accidental.position !== i - 1)
			this.items.push({
				x: x,
				y: staffLines[0].y - settings.staveSpace / 2 + i * (settings.staveSpace / 2),
				position: i - 1,
				text: this._getText ? this._getText(i - 1) : undefined,
			});
		}

		this.layoutLedgerLines(settings, staffLines);

		if (this._getText) {
			this.#text = {
				x: this.items[0].x + this.#width / 2,
				y:
					(this.ledgerLines?.below?.y ?
						this.ledgerLines?.below?.y
					:	staffLines[staffLines.length - 1].y) +
					settings.staveSpace * 3,
			};
		}

		this.calculateHighlightBBox(settings);
		this.bBox.setXY(this.highlightBBox.x, this.highlightBBox.y);
		this.bBox.width = this.highlightBBox.width;
		/** @todo include upper part of top accidental and lower part of low accidental which is outside highlightbox */
		/** @todo bbox height when this.#text is set is only an approximation (can't get text bbox right now...) */
		this.bBox.height =
			this.#text ?
				this.#text.y - this.highlightBBox.y + settings.staveSpace
			:	this.highlightBBox.height;

		x += this.highlightBBox.width;
		return x;
	}

	layoutLedgerLines(settings: LayoutSettingsInternal, staffLines: LStaffLine[]) {
		if (!this.ledgerLines) return;
		if (this.ledgerLines.above) {
			this.ledgerLines.above.layout(settings, this.glyph, staffLines, this.x);
		}
		if (this.ledgerLines.below) {
			this.ledgerLines.below.layout(settings, this.glyph, staffLines, this.x);
		}
	}
}
