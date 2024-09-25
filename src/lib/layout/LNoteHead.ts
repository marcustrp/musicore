import {
	type ClefType,
	Note,
	type NoteAccidentals,
	type NoteName,
	type NoteType,
} from '$lib/index.js';
import { type Glyph } from '../fonts/font.js';
import { type GlyphKey } from '../fonts/glyphKey.js';
import { type LayoutSettingsInternal } from '../types.js';
import { LAccidental } from './LAccidental.js';
import { type LayoutObject } from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
import { notePosition } from './noteData.js';
import { LColumnEditor } from './LColumnEditor.js';
import { BBox } from '../utils/bBox.js';
import type { RhythmElementTypeLayout } from './types.js';

export class LNoteHead implements LayoutObject {
	x: number = 0;
	y: number = 0;
	bBox = new BBox();
	type: NoteType;
	dots?: number;
	root: NoteName;
	accidental?: LAccidental;
	editor?: LColumnEditor;
	editorGlyph?: Glyph;
	octave: number;
	glyph: Glyph;
	glyphName: GlyphKey;
	clef: ClefType;
	locked: boolean;
	color?: string;

	constructor(settings: LayoutSettingsInternal, note: Note, clef: ClefType) {
		this.type = note.type;
		this.dots = note.dots;
		this.root = note.root;
		this.octave = note.octave;
		this.clef = clef;
		this.locked = note.locked || false;
		if (note.color?.notehead) this.color = note.color.notehead;

		switch (note.type) {
			case 'w':
				this.glyphName = 'noteheadWhole';
				break;
			case 'h':
				this.glyphName = 'noteheadHalf';
				break;
			default:
				this.glyphName = 'noteheadBlack';
				break;
		}
		this.glyph = settings.font.getGlyph(this.glyphName);

		/*const pitchDiff = scale.getNotePitchDiffFromScale(note.root, note.accidental);
		let addAccidental = '';
		switch (pitchDiff) {
			case -2:
				addAccidental = 'bb';
				break;
			case -1:
				addAccidental = 'b';
				break;
			case 0:
				addAccidental = '';
				break;
			case 1:
				addAccidental = '#';
				break;
			case 2:
				addAccidental = 'x';
				break;
			default:
				addAccidental = '';
		}
		const printedAccidental = pitchDiff
			? (Note.systemNameAddAccidentals(note.name, addAccidental).substring(1) as NoteAccidentals) ||
				'n'
			: undefined;
		console.log('PRINTACC', printedAccidental, pitchDiff, note.name, addAccidental);*/
		if (note.printedAccidental?.value || settings.render?.notes?.editorAccidental)
			this.setAccidental(settings, note.printedAccidental?.value, clef);
	}

	setAccidental(
		settings: LayoutSettingsInternal,
		type: NoteAccidentals | undefined,
		clef: ClefType,
	) {
		const position = this.getPosition(clef);
		if (settings.render?.notes?.editorAccidental) {
			this.editor = new LColumnEditor(
				settings,
				LAccidental.getGlyph(settings, settings.defaultAccidental),
				this.getPosition(clef),
				this.getPosition(clef),
				false,
				undefined,
				settings.defaultAccidentalEditorWidth,
			);
		}
		if (type) {
			this.accidental = new LAccidental(settings, position, type);
		}
	}

	getPosition(clef: ClefType) {
		return LNoteHead.getPositionFromRoot(this.root, this.octave, clef);
	}

	static getPositionFromRoot(root: NoteName, octave: number, clef: ClefType) {
		const position = notePosition[root];
		if (clef === 'treble' || clef === 'g') {
			const temp = position - 7 * (octave - 5);
			return temp;
		} else if (clef === 'bass' || clef === 'f') {
			return position - 7 * (octave - 3) + 2;
		} else if (clef === 'alto') {
			return position - 7 * (octave - 4) + 1;
		}
		return 0;
	}

	static rootAndOctaveFromPosition(position: number, clef?: ClefType) {
		if (clef === 'bass' || clef === 'f') {
			position += 12;
		} else if (clef === 'alto') {
			position += 6;
		}
		const octave = 5 - Math.floor((position - 4) / 7);
		while (position < 0) {
			position += 7;
		}
		position = position % 7;
		if (position < 4) position += 7;
		const root = Object.entries(notePosition).find(([_, value]) => {
			return value === position;
		});
		const data = root ? { root: root[0] as NoteName, octave: octave } : null;
		return data;
	}

	toObject(barIndex: number) {
		const objectType: RhythmElementTypeLayout = 'note';
		return {
			objectType: objectType,
			type: this.type,
			root: this.root,
			accidental: this.accidental ? this.accidental.toObject() : undefined,
			octave: this.octave,
			dots: this.dots,
			x: this.x,
			y: this.y,
			bBox: this.bBox.toObject(),
			glyph: this.glyph,
			editor: this.editor ? this.editor.toObject(barIndex) : undefined,
			color: this.color,
		};
	}

	layout(settings: LayoutSettingsInternal, staffLines: LStaffLine[], x: number) {
		if (this.accidental || (settings.render?.notes?.editorAccidental && !this.locked)) {
			let accidentalX = 0,
				editorX = 0;
			if (this.accidental) accidentalX = this.accidental.layout(settings, staffLines, x);
			if (settings.render?.notes?.editorAccidental) {
				editorX = this.editor!.layout(settings, staffLines, x);
			}
			x = Math.max(accidentalX, editorX);
			// Spacing between accidental and note head
			x += settings.staveSpace / 3;
		}
		this.x = x;
		this.y = staffLines[0].y + this.getPosition(this.clef) * (settings.staveSpace / 2);

		this.bBox = this.glyph.bBox?.clone() || new BBox();
		this.bBox.setXY(this.x, this.y);
		if (this.accidental) this.bBox.merge(this.accidental.bBox);
		if (settings.render?.notes?.editorAccidental) this.bBox.merge(this.editor!.bBox);
	}

	static getMinMaxPosition(notes: LNoteHead[], clef: ClefType) {
		let min = 0,
			max = 0;
		notes.forEach((note) => {
			min = Math.min(min, note.getPosition(clef));
			max = Math.max(max, note.getPosition(clef));
		});
		return [min, max];
	}
}
