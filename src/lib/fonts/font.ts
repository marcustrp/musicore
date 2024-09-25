// For testing, hardcoding imports
//import { maestro } from './maestro/maestro.js';
import { bravura } from './bravura/bravura.js';
//import { ash } from './ash/ash.js';

import { type GlyphKey } from './glyphKey.js';
import { glyphNames } from './bravura/glyphnames.js';
import { bravuraMetadata } from './bravura/bravura_metadata.js';
import { BBox } from '../utils/bBox.js';

//type GlyphNames = typeof glyphNames;
//type GlyphsWithAnchorsData = typeof bravuraMetadata.glyphsWithAnchors;
//type GlyphsWithAnchorsName = keyof GlyphsWithAnchorsData;
export type Glyph = {
	glyphName: string;
	unicode?: string;
	horizAdvX?: string;
	d?: string;
	bBox?: BBox;
};

export class Font {
	fontData: Glyph[];
	readonly metadata = bravuraMetadata;
	constructor(public readonly fontName: string) {
		switch (fontName) {
			/*case 'maestro':
				this.fontData = maestro;
				break;*/
			case 'bravura':
				this.fontData = bravura;
				break;
			/*case 'ash':
				this.fontData = ash;
				break;*/
			default:
				throw new Error(`Font ${fontName} not found`);
		}
	}

	getMetadata(glyphKey: string) {
		return this.metadata.glyphBBoxes[glyphKey];
	}

	getGlyph(glyphKey: GlyphKey) {
		const glyphName = 'uni' + glyphNames[glyphKey].codepoint.substr(2);
		const glyph = this.fontData.find((g) => g.glyphName === glyphName);
		if (!glyph) {
			throw new Error(`Glyph ${glyphKey} not found in font ${this.fontName}`);
		}
		const metadata = this.getMetadata(glyphKey);
		if (metadata) {
			glyph.bBox = BBox.fromObject({
				x: metadata['bBoxSW'][0] * 250,
				y: metadata['bBoxNE'][1] * -250,
				width: metadata['bBoxNE'][0] * 250 - metadata['bBoxSW'][0] * 250,
				height: metadata['bBoxNE'][1] * 250 - metadata['bBoxSW'][1] * 250,
			});
		}
		return glyph;
	}
}
