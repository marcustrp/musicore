import { type BarlineStyle } from '$lib/index.js';
import { Font } from '../fonts/font.js';
import { type LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';

export type BarlineLayout = ReturnType<LBarline['toObject']>;

export type RepeatDotsLayout = {
	x: number;
	y1: number;
	y2: number;
	r: number;
};

export type BarlineLineLayout = {
	x: number;
	y: number;
	height: number;
	width: number;
	style: BarlineLineStyleLayout;
	startAtBarline: number;
	lengthStyle: 'full' | 'short' | 'tick';
};

export type BarlineLineStyleLayout = 'solid' | 'dashed' | 'dotted' | 'none' | 'heavy';

export class LBarline implements LayoutObject {
	x: number = 0;
	y: number = 0;
	bBox = new BBox();
	endRepeat?: RepeatDotsLayout;
	lines: BarlineLineLayout[];
	startRepeat?: RepeatDotsLayout;

	constructor(
		font: Font,
		barline: BarlineStyle,
		startRepeat?: number | string,
		endRepeat?: number | string,
	) {
		this.startRepeat = startRepeat ? this.createRepeatDots(startRepeat) : undefined;
		this.endRepeat = endRepeat ? this.createRepeatDots(endRepeat) : undefined;
		this.lines = this.createLines(font, barline);
	}

	/** @todo implement */
	private createRepeatDots(_repeat: number | string): RepeatDotsLayout {
		return { x: 0, y1: 0, y2: 0, r: 0 };
	}

	private createLines(font: Font, barline: BarlineStyle): BarlineLineLayout[] {
		const lines = barline.split('-');
		return lines.map((line) => {
			let style: BarlineLineStyleLayout = 'solid';
			switch (line) {
				case 'dashed':
					style = 'dashed';
					break;
				case 'dotted':
					style = 'dotted';
					break;
				case 'heavy':
					style = 'heavy';
					break;
				case 'none':
					style = 'none';
					break;
			}
			let startAtBarline = 0;
			let lengthStyle: 'full' | 'short' | 'tick' = 'full';
			if (line === 'short') {
				startAtBarline = 1;
				lengthStyle = 'short';
			} else if (line === 'tick') {
				lengthStyle = 'tick';
			}
			return {
				x: 0,
				y: 0,
				height: 0,
				width: 0,
				style: style,
				startAtBarline: startAtBarline,
				lengthStyle: lengthStyle,
			};
		});
	}

	toObject() {
		return {
			x: this.x,
			y: this.y,
			bBox: this.bBox.toObject(),
			startRepeat: this.startRepeat,
			endRepeat: this.endRepeat,
			lines: this.lines,
		};
	}

	layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], x: number) {
		if (settings.render && !settings.render.barlines) return x;
		this.bBox.setXY(x, staffLines[0].y);
		x += settings.staveSpace / 2;
		this.x = x;
		this.y = staffLines[0].y;

		if (this.startRepeat)
			x = LBarline.layoutRepeat(
				settings.font,
				this.startRepeat,
				settings.staveSpace,
				staffLines,
				x,
			);
		this.lines.forEach((line, index) => {
			if (index === 1) x += settings.font.metadata.engravingDefaults.barlineSeparation * 250;
			x = LBarline.layoutLine(settings.font, line, settings.staveSpace, staffLines, x);
		});
		if (this.endRepeat)
			x = LBarline.layoutRepeat(settings.font, this.endRepeat, settings.staveSpace, staffLines, x);

		this.bBox.width = x - this.bBox.x;
		/** @todo This is not always correct, differs for style short and tick */
		this.bBox.height = staffLines[4].y - staffLines[0].y;
		return x;
	}

	static layoutRepeat(
		font: Font,
		repeat: RepeatDotsLayout,
		staveSpace: number,
		staffLines: LStaffLine[],
		x: number,
	) {
		repeat.x = x;
		repeat.y1 = staffLines[1].y + staveSpace / 2;
		repeat.y2 = staffLines[2].y + staveSpace / 2;
		repeat.r = staveSpace / 2;
		return x + font.metadata.engravingDefaults.barlineSeparation * 250;
	}

	static layoutLine(
		font: Font,
		line: BarlineLineLayout,
		staveSpace: number,
		staffLines: LStaffLine[],
		x: number,
	) {
		line.x = x;

		line.width = font.metadata.engravingDefaults.thinBarlineThickness;
		if (line.style === 'heavy') {
			line.width = font.metadata.engravingDefaults.thickBarlineThickness;
		} else if (line.style === 'none') {
			line.width = 0;
		}
		line.width *= 250;

		line.height = staffLines[4].y - staffLines[0].y;
		line.y = staffLines[0].y;
		if (line.lengthStyle === 'short') {
			line.height = staffLines[3].y - staffLines[1].y;
			line.y = staffLines[1].y;
		} else if (line.lengthStyle === 'tick') {
			line.height = staffLines[1].y - staffLines[0].y;
			line.y = staffLines[0].y;
		}
		return x + line.width / 2;
	}
}
