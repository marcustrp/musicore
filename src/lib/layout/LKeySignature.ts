import {
	type KeyMode,
	type CustomKeyAccidental,
	Key,
	type KeyAccidentals,
	type ClefType,
} from '$lib/index.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
import { LAccidental } from './LAccidental.js';
import { type LayoutSettingsInternal } from './types.js';
import { LColumnEditor } from './LColumnEditor.js';
import { type Glyph } from '../fonts/types.js';
import { BBox } from '../utils/bBox.js';
export type KeySignatureLayout = ReturnType<LKeySignature['toObject']>;

export class LKeySignature implements LayoutObject {
	x: number = 0;
	y: number = 0;
	width: number = 0;
	clef: ClefType;
	root: string;
	mode: KeyMode;
	accidentals: LAccidental[] = [];
	editors: LColumnEditor[] = [];
	editorGlyph?: Glyph;
	bBox = new BBox();

	constructor(
		settings: LayoutSettingsInternal,
		clef: ClefType,
		root: string,
		mode: KeyMode,
		accidentals: KeyAccidentals,
		customAccidentals: CustomKeyAccidental[],
		colors: string[] | undefined,
	) {
		this.clef = clef;
		this.root = root;
		this.mode = mode;
		let columnCount = 0;
		if (settings.render?.keySignature === 'editor')
			this.editorGlyph = LAccidental.getGlyph(settings, settings.defaultKeyAccidential);
		if (customAccidentals.length > 0) {
			/* Custom accidentals are used when the accidentals present do not conform to any known key
         This is to support exercises for key signatures */
			for (let i = 0; i < customAccidentals.length; i++) {
				if (settings.render?.keySignature === 'editor') {
					this.editors.push(
						new LColumnEditor(
							settings,
							this.editorGlyph!,
							-1,
							9,
							false,
							undefined,
							settings.defaultAccidentalEditorWidth,
						),
					);
				}
				this.accidentals.push(
					new LAccidental(
						settings,
						customAccidentals[i].position,
						customAccidentals[i].type,
						colors && i <= colors.length ? colors[i] : undefined,
					),
				);
			}
			columnCount = customAccidentals.length;
		} else {
			for (let i = 0; i < accidentals.count; i++) {
				const type = accidentals.type ? accidentals.type : settings.defaultKeyAccidential;
				const position = Key.getAccidentalPosition(type, i, clef);
				if (settings.render?.keySignature === 'editor') {
					this.editors.push(
						new LColumnEditor(
							settings,
							this.editorGlyph!,
							-1,
							9,
							false,
							undefined,
							settings.defaultAccidentalEditorWidth,
						),
					);
				}
				this.accidentals.push(
					new LAccidental(
						settings,
						position,
						accidentals.type,
						colors && i <= colors.length ? colors[i] : undefined,
					),
				);
			}
			columnCount = accidentals.count;
		}

		if (settings.render?.keySignature === 'editor' && columnCount < 7) {
			this.editors.push(
				new LColumnEditor(
					settings,
					this.editorGlyph!,
					-1,
					9,
					false,
					undefined,
					settings.defaultAccidentalEditorWidth,
				),
			);
		}
	}

	toObject(settings: LayoutSettingsInternal) {
		return {
			x: this.x,
			y: this.y,
			root: this.root,
			mode: this.mode,
			accidentals: this.accidentals.map((accidental) => accidental.toObject()),
			editors: this.editors.map((editor) => editor.toObject(0, settings.defaultKeyAccidential)),
		};
	}

	layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], x: number) {
		x += settings.staveSpace / 4;
		this.x = x;
		const aLength = this.accidentals.length;
		const eLength = this.editors.length;
		let editorX = 0;
		for (let i = 0; i < Math.max(aLength, eLength); i++) {
			x += settings.staveSpace / 4;
			if (settings.render?.keySignature === 'editor') {
				editorX = this.editors[i].layout(settings, staffLines, x);
			}
			if (i < this.accidentals.length) {
				x = this.accidentals[i].layout(settings, staffLines, x);
			} else {
				x = editorX;
			}
		}
		this.accidentals.forEach((accidental) => {
			if (accidental.y !== undefined) this.bBox.merge(accidental.bBox);
		});
		return x;
	}
}
