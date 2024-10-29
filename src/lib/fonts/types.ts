import { BBox } from '../utils/bBox.js';

export interface Font {
	glyphs: { [key in GlyphNames]: Glyph };
	metadata: FontMetadata;
}

export type Glyph = {
	//glyphName: string;
	//unicode?: string;
	horizAdvX: number;
	d: string;
	bBox: BBox;
	anchors?: {
		cutOutNW?: [number, number];
		cutOutSE?: [number, number];
		cutOutNE?: [number, number];
		cutOutSW?: [number, number];
		splitStemDownNE?: [number, number];
		splitStemDownNW?: [number, number];
		splitStemUpSE?: [number, number];
		splitStemUpSW?: [number, number];
		stemDownNW?: [number, number];
		stemUpSE?: [number, number];
	};
};

export const glyphNames = [
	'accidentalNatural',
	'accidentalNaturalSharp',
	'accidentalNaturalFlat',
	'accidentalSharp',
	'accidentalFlat',
	'accidentalDoubleSharp',
	'accidentalDoubleFlat',
	'cClef',
	'fClef',
	'gClef',
	'noteheadBlack',
	'noteheadHalf',
	'noteheadWhole',
	'timeSigCommon',
] as const;
export type GlyphNames = (typeof glyphNames)[number];

export type FontMetadata = {
	arrowShaftThickness: number;
	barlineSeparation: number;
	beamSpacing: number;
	beamThickness: number;
	bracketThickness: number;
	dashedBarlineDashLength: number;
	dashedBarlineGapLength: number;
	dashedBarlineThickness: number;
	hBarThickness: number;
	hairpinThickness: number;
	legerLineExtension: number;
	legerLineThickness: number;
	lyricLineThickness: number;
	octaveLineThickness: number;
	pedalLineThickness: number;
	repeatBarlineDotSeparation: number;
	repeatEndingLineThickness: number;
	slurEndpointThickness: number;
	slurMidpointThickness: number;
	staffLineThickness: number;
	stemThickness: number;
	subBracketThickness: number;
	textEnclosureThickness: number;
	thickBarlineThickness: number;
	thinBarlineThickness: number;
	tieEndpointThickness: number;
	tieMidpointThickness: number;
	tupletBracketThickness: number;
	textFontFamily: string[];
};
