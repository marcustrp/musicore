// For testing, hardcoding imports
//import { maestro } from './maestro/maestro.js';
import { bravura } from './bravura/bravura.js';
//import { ash } from './ash/ash.js';

import { type GlyphNames, glyphNames, type Glyph as MusicoreGlyph } from '$lib/fonts/types.js';
import { glyphNames as bravuraGlyphNames } from './bravura/glyphnames.js';
import { bravuraMetadata } from './bravura/bravura_metadata.js';
import { BBox } from '$lib/utils/bBox.js';

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

export type GlyphData = MusicoreGlyph & { key: GlyphNames };

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

	getGlyph(glyphKey: GlyphNames) {
		const glyphName = 'uni' + bravuraGlyphNames[glyphKey].codepoint.substr(2);
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

	getAllGlyphs() {
		const glyphs: GlyphData[] = [];
		glyphNames.forEach((glyphKey) => {
			const glyph = this.getGlyph(glyphKey);
			const anchors =
				glyphKey in this.metadata.glyphsWithAnchors ?
					// @ts-expect-error: TS doesn't like the type of the object here...
					(this.metadata.glyphsWithAnchors[glyphKey] as { [key: string]: [number, number] }[])
				:	undefined;
			glyphs.push({
				key: glyphKey,
				d: glyph.d || '',
				horizAdvX: glyph.horizAdvX ? parseFloat(glyph.horizAdvX) : 0,
				bBox: glyph.bBox || new BBox(),
				// @ts-expect-error: TS doesn't like the type of the object here...
				anchors: anchors,
			});
		});
		return glyphs;
	}

	getEngravingDefaults() {
		return this.metadata.engravingDefaults;
	}
}
