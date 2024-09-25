import { type Font } from './types.js';
import { BBox } from '$lib/utils/bBox.js';

/**
 * to update this file
 * - add desired glyps to glyphNames in src/lib/fonts/types.ts
 * - then go to src/routes/tools/font, copy the output from the textarea and paste it here
 */

export const bravura: Font = {
	glyphs: {
		accidentalFlat: {
			horizAdvX: 226,
			d: `M12 -170c-8 10 -12 581 -12 581c1 18 17 28 31 28c10 0 19 -6 19 -17c0 -20 -6 -260 -7 -282c0 -7 4 -14 11 -17c2 -1 3 -1 5 -1c5 0 16 9 22 14c14 9 38 17 55 17c46 -3 90 -39 90 -96c0 -46 -31 -107 -120 -169c-25 -17 -49 -44 -79 -61c0 0 -3 -2 -6 -2s-6 1 -9 5z
      M47 -81c0 -5 2 -15 11 -15c3 0 6 1 10 3c43 27 89 81 89 135c0 25 -12 58 -41 58c-23 0 -63 -29 -70 -49c-1 -4 -2 -16 -2 -32c0 -40 3 -100 3 -100z`,
			bBox: new BBox(0, -439, 226, 614),
			anchors: { cutOutNE: [63, 164], cutOutSE: [126, -119] },
		},
		accidentalNatural: {
			horizAdvX: 168,
			d: `M141 181l15 5c1 1 3 1 4 1c4 0 8 -3 8 -8v-502c0 -7 -6 -12 -12 -12h-13c-7 0 -12 5 -12 12v149c0 8 -7 11 -17 11c-29 0 -85 -24 -99 -30c-1 -1 -3 -1 -4 -1l-2 -1c-6 0 -9 3 -9 9v515c0 7 5 12 12 12h13c6 0 12 -5 12 -12v-167c0 -4 4 -5 10 -5c26 0 90 23 90 23
      c1 0 2 1 4 1zM37 39v-103c0 -4 5 -6 12 -6c25 0 82 23 82 41v103c0 4 -3 5 -9 5c-24 0 -85 -26 -85 -40z`,
			bBox: new BBox(0, -341, 168, 676),
			anchors: { cutOutNE: [48, 194], cutOutSW: [119, -207] },
		},
		accidentalSharp: {
			horizAdvX: 249,
			d: `M237 118l-26 -10c-8 -3 -13 -22 -13 -29v-93c0 -12 7 -18 13 -18l26 10c2 1 3 1 5 1c4 0 7 -3 7 -8v-71c0 -6 -5 -14 -12 -17c0 0 -21 -8 -28 -11s-11 -15 -11 -23v-142c0 -6 -6 -11 -17 -11c-7 0 -13 5 -13 11v125c0 6 -5 18 -14 18l-2 -1h-1l-61 -25
      c-5 -2 -10 -9 -10 -22v-139c0 -6 -7 -11 -17 -11c-7 0 -13 5 -13 11v123c0 5 -5 16 -12 16c-1 0 -2 0 -3 -1c-9 -3 -23 -9 -24 -9l-2 -1c-6 0 -9 3 -9 9v71c0 6 5 14 12 16c0 0 21 9 27 11c6 3 11 12 11 23v99c0 8 -6 18 -14 18l-1 -1c-8 -4 -23 -10 -24 -10l-2 -1
      c-6 0 -9 3 -9 9v71c0 6 5 14 12 16c0 0 20 8 26 11s12 13 12 27v135c0 6 6 11 16 11c7 0 14 -5 14 -11v-120c0 -8 3 -20 12 -20c17 4 51 18 63 25c9 6 12 19 13 29v130c0 6 6 11 16 11c8 0 14 -5 14 -11v-122c0 -8 7 -13 14 -13c5 1 25 9 25 9c2 1 3 1 5 1c4 0 7 -3 7 -8
      v-71c0 -6 -5 -14 -12 -17zM168 -45c2 9 4 37 4 64s-2 52 -4 57c-2 4 -8 6 -15 6c-25 0 -71 -21 -73 -38c-2 -8 -3 -43 -3 -74c0 -24 1 -46 3 -50c1 -3 6 -5 12 -5c23 0 70 20 76 40z`,
			bBox: new BBox(0, -350, 249, 698),
			anchors: {
				cutOutNE: [210, 224],
				cutOutNW: [36, 142],
				cutOutSE: [210, -149],
				cutOutSW: [36, -224],
			},
		},
		cClef: {
			horizAdvX: 699,
			d: `M230 482v-438c0 -8 5 -7 9 -6c26 7 68 33 89 146c3 16 9 25 19 25c11 0 16 -10 21 -27c13 -44 36 -93 107 -93c65 0 83 64 83 195s-23 190 -106 190c-14 0 -85 -6 -85 -27c0 -5 16 -11 27 -15c20 -7 40 -27 40 -65c0 -44 -29 -69 -68 -69c-43 0 -77 29 -77 82
      c0 63 55 126 174 126c164 0 236 -115 236 -219c0 -138 -76 -234 -209 -234c-29 0 -48 5 -61 9c-10 3 -20 5 -29 -1c-14 -9 -36 -41 -36 -61s22 -52 36 -61c9 -6 19 -4 29 -1c13 4 32 9 61 9c133 0 209 -96 209 -234c0 -104 -72 -219 -236 -219c-119 0 -174 63 -174 126
      c0 53 34 82 77 82c39 0 68 -25 68 -69c0 -38 -20 -58 -40 -65c-11 -4 -27 -10 -27 -15c0 -21 71 -27 85 -27c83 0 106 59 106 190s-18 195 -83 195c-71 0 -94 -49 -107 -93c-5 -17 -10 -27 -21 -27c-10 0 -16 9 -19 25c-21 113 -63 139 -89 146c-4 1 -9 2 -9 -6v-438
      c0 -14 -7 -21 -21 -21h-1c-14 0 -21 7 -21 21v964c0 14 7 21 21 21h1c14 0 21 -7 21 -21zM21 503h86c14 0 21 -7 21 -21v-964c0 -14 -7 -21 -21 -21h-86c-14 0 -21 7 -21 21v964c0 14 7 21 21 21z`,
			bBox: new BBox(0, -506, 699, 1012),
		},
		fClef: {
			horizAdvX: 684,
			d: `M252 262c173 0 279 -116 279 -290c0 -304 -260 -482 -506 -602c-6 -3 -12 -5 -17 -5c-9 0 -13 6 -13 12c0 8 6 13 15 18c233 133 371 289 371 568c0 157 -46 261 -152 261c-102 0 -162 -73 -162 -113c0 -10 3 -18 16 -18s23 7 50 7c49 0 96 -40 96 -104
      c0 -62 -43 -106 -106 -106c-81 0 -123 69 -123 149c0 96 78 223 252 223zM629 180c31 0 55 -24 55 -55s-24 -55 -55 -55s-55 24 -55 55s24 55 55 55zM630 -71c31 0 54 -23 54 -54s-23 -54 -54 -54s-54 23 -54 54s23 54 54 54z`,
			bBox: new BBox(-5, -262, 689, 897),
		},
		gClef: {
			horizAdvX: 671,
			d: `M376 415l25 -145c3 -18 3 -18 29 -18c147 0 241 -113 241 -241c0 -113 -67 -198 -168 -238c-14 -6 -15 -5 -13 -17c11 -62 29 -157 29 -214c0 -170 -130 -200 -197 -200c-151 0 -190 98 -190 163c0 62 40 115 107 115c61 0 96 -47 96 -102c0 -58 -36 -85 -67 -94
      c-23 -7 -32 -10 -32 -17c0 -13 26 -29 80 -29c59 0 159 18 159 166c0 47 -15 134 -27 201c-2 12 -4 11 -15 9c-20 -4 -46 -6 -69 -6c-245 0 -364 165 -364 339c0 202 153 345 297 464c12 10 11 12 9 24c-7 41 -14 106 -14 164c0 104 24 229 98 311c20 22 51 48 65 48
      c11 0 37 -28 52 -50c41 -60 65 -146 65 -233c0 -153 -82 -280 -190 -381c-6 -6 -8 -7 -6 -19zM470 943c-61 0 -133 -96 -133 -252c0 -32 2 -66 6 -92c2 -13 6 -14 13 -8c79 69 174 159 174 270c0 55 -27 82 -60 82zM361 262l-21 128c-2 11 -4 12 -14 4
      c-47 -38 -93 -75 -153 -142c-83 -94 -93 -173 -93 -232c0 -139 113 -236 288 -236c20 0 40 2 56 5c15 3 16 3 14 14l-50 298c-2 11 -4 12 -20 8c-61 -17 -100 -60 -100 -117c0 -46 30 -89 72 -107c7 -3 15 -6 15 -13c0 -6 -4 -11 -12 -11c-7 0 -19 3 -27 6
      c-68 23 -115 87 -115 177c0 85 57 164 145 194c18 6 18 5 15 24zM430 103l49 -285c2 -12 4 -12 16 -6c56 28 94 79 94 142c0 88 -67 156 -148 163c-12 1 -13 -2 -11 -14z`,
			bBox: new BBox(0, -1098, 671, 1756),
		},
		noteheadBlack: {
			horizAdvX: 295,
			d: `M97 -125c-54 0 -97 31 -97 83c0 86 88 167 198 167c57 0 97 -32 97 -83c0 -85 -109 -167 -198 -167z`,
			bBox: new BBox(0, -125, 295, 250),
			anchors: {
				cutOutNW: [52, 75],
				cutOutSE: [235, -74],
				splitStemDownNE: [242, -62],
				splitStemDownNW: [30, -104],
				splitStemUpSE: [273, 98],
				splitStemUpSW: [78, 89],
				stemDownNW: [0, -42],
				stemUpSE: [295, 42],
			},
		},
		noteheadHalf: {
			horizAdvX: 295,
			d: `M97 -125c-55 0 -97 30 -97 83c0 52 47 167 196 167c58 0 99 -32 99 -83c0 -33 -33 -167 -198 -167zM75 -87c48 0 189 88 189 131c0 7 -3 13 -6 19c-7 12 -18 21 -37 21c-47 0 -192 -79 -192 -128c0 -7 3 -14 6 -20c7 -12 19 -23 40 -23z`,
			bBox: new BBox(0, -125, 295, 250),
			anchors: {
				cutOutNW: [51, 74],
				cutOutSE: [245, -75],
				splitStemDownNE: [239, -75],
				splitStemDownNW: [32, -107],
				splitStemUpSE: [277, 93],
				splitStemUpSW: [82, 95],
				stemDownNW: [0, -42],
				stemUpSE: [295, 42],
			},
		},
		noteheadWhole: {
			horizAdvX: 422,
			d: `M216 125c93 0 206 -52 206 -123c0 -70 -52 -127 -216 -127c-149 0 -206 60 -206 127c0 68 83 123 216 123zM111 63c-2 -8 -3 -16 -3 -24c0 -32 15 -66 35 -89c21 -28 58 -52 94 -52c10 0 21 1 31 4c33 8 46 36 46 67c0 60 -55 134 -124 134c-31 0 -68 -5 -79 -40z`,
			bBox: new BBox(0, -125, 422, 250),
			anchors: { cutOutNW: [43, 83], cutOutSE: [383, -91] },
		},
		timeSigCommon: {
			horizAdvX: 424,
			d: `M233 251c19 0 170 -12 170 -143c0 -83 -76 -86 -76 -86c-28 0 -77 18 -77 75c0 31 23 74 63 74c15 0 18 13 18 22c0 10 -21 34 -73 34c-54 0 -130 -34 -130 -199s43 -244 124 -244c32 0 142 30 142 159c0 17 7 18 15 18c4 0 15 0 15 -22c0 -29 -26 -188 -201 -188
      c-60 0 -115 21 -153 67c-41 50 -65 107 -65 172c0 135 86 261 228 261z`,
			bBox: new BBox(5, -251, 419, 500),
		},
	},
	metadata: {
		arrowShaftThickness: 40,
		barlineSeparation: 100,
		beamSpacing: 62.5,
		beamThickness: 125,
		bracketThickness: 125,
		dashedBarlineDashLength: 125,
		dashedBarlineGapLength: 62.5,
		dashedBarlineThickness: 40,
		hBarThickness: 250,
		hairpinThickness: 40,
		legerLineExtension: 100,
		legerLineThickness: 40,
		lyricLineThickness: 40,
		octaveLineThickness: 40,
		pedalLineThickness: 40,
		repeatBarlineDotSeparation: 40,
		repeatEndingLineThickness: 40,
		slurEndpointThickness: 25,
		slurMidpointThickness: 55,
		staffLineThickness: 32.5,
		stemThickness: 30,
		subBracketThickness: 40,
		textEnclosureThickness: 40,
		textFontFamily: ['Academico', 'Century Schoolbook', 'Edwin', 'serif'],
		thickBarlineThickness: 125,
		thinBarlineThickness: 40,
		tieEndpointThickness: 25,
		tieMidpointThickness: 55,
		tupletBracketThickness: 40,
	},
};