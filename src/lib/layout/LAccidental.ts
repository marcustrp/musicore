import { type NoteAccidentals } from '$lib/index.js';
import { type Glyph } from '../fonts/types.js';
import { type LayoutSettingsInternal } from './types.js';
import { BBox } from '../utils/bBox.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';

export class LAccidental implements LayoutObject {
	x: number = 0;
	y: number = 0;
	type?: NoteAccidentals;
	position?;
	glyph: Glyph;
	bBox: BBox;

	/**
	 *
	 * @param settings
	 * @param position if undefined, the accidental is not drawn (probably an editor is active)
	 * @param type
	 */
	constructor(
		settings: LayoutSettingsInternal,
		position: number | undefined,
		type: NoteAccidentals | undefined,
	) {
		this.type = type;
		this.position = position;
		if (!type) type = settings.defaultAccidental;
		this.glyph = LAccidental.getGlyph(settings, type);
		this.bBox = BBox.clone(this.glyph.bBox);
	}

	static getGlyph(settings: LayoutSettingsInternal, type: NoteAccidentals) {
		switch (type) {
			case '#':
				return settings.font.glyphs['accidentalSharp'];
				break;
			case 'b':
				return settings.font.glyphs['accidentalFlat'];
				break;
			case 'n':
				return settings.font.glyphs['accidentalNatural'];
				break;
			default:
				throw new Error(`Unsupported accidental type: ${type}`);
		}
	}

	toObject() {
		return {
			x: this.x,
			y: this.position === undefined ? undefined : this.y, // position undefined = do not draw (probably an editor is active)
			glyph: this.glyph,
			bBox: this.bBox.toObject(),
		};
	}

	layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], x: number) {
		if (!this.type) return x;
		this.x = x;
		if (this.position !== undefined)
			this.y = staffLines[0].y + this.position * (settings.staveSpace / 2);
		x += this.glyph.horizAdvX;
		this.bBox.setXY(this.x + (this.glyph.bBox?.x || 0), this.y + (this.glyph.bBox?.y || 0));
		return x;
	}
}
