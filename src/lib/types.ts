import { type NoteAccidentals, type KeyAccidental } from '$lib/index.js';
import { Font } from './fonts/font.js';

export type LayoutSettings = {
	staffSize?: number;
	noteSpacing?: {
		type: 'fixed' | 'proportional' | 'standard'; // proportional is proportional to note length, standard reduces space of longer notes
		value: number; // in stave-space units, used for fixed and proportional. For standard, value is ratio where default is 1.0
	};
	defaultAccidental?: NoteAccidentals;
	render?: {
		stafflines?: boolean;
		clef?: boolean;
		keySignature?: boolean | 'editor';
		timeSignature?: boolean;
		bars?: boolean;
		notes?: {
			render?: boolean;
			editorNote?: { positionFrom: number; positionTo: number; showNoteName?: boolean };
			editorAccidental?: { types: NoteAccidentals[] };
		};
		barlines?: boolean;
	};
};
export type LayoutSettingsInternal = LayoutSettings & {
	staffSize: number;
	staveSpace: number;
	defaultAccidental: NoteAccidentals;
	defaultKeyAccidential: KeyAccidental;
	defaultAccidentalEditorWidth?: number; // only set if an accidental editor is present
	font: Font;
	scale: number;
};
