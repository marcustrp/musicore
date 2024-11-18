// in the future, might want to split this into multiple files:
// https://dev.to/receter/organize-your-library-with-subpath-exports-4jb9

export { Score } from './score/score.js';

export { Bar, type BarlineStyle } from './core/bar.js';
export { Clef, type ClefType } from './core/clef.js';
export {
	Key,
	type KeyAccidental,
	type KeyAccidentals,
	type CustomKeyAccidental,
} from './core/key.js';
export { RhythmElement, type NoteType } from './core/rhythmElement.js';
export { Rest } from './core/rest.js';
export { Note, type NoteAccidentals, type NoteName } from './core/note.js';
export { Scale } from './core/scale.js';
export { type ScaleType, type KeyMode } from './core/data/modes.js';
export { TimeSignature, type TimeSignatureSymbol } from './core/timeSignature.js';

export { type HarmonyKind } from './core/harmony.js';

export { AbcExporter } from './score/export/abc.js';
export { PitchStreamExporter } from './score/export/pitchStream.js';

export { MusicStringImporter } from './score/import/musicString.js';

/** old musicore-engraver exports */
export { default as SheetMusic } from './engraver/EScore.svelte';

export { type LayoutSettings } from './layout/types.js';
export { type EngraverSettings } from './engraver/scoreEngraver.js';

export { LNoteHead } from './layout/LNoteHead.js';

export { BBox } from './utils/bBox.js';
export { noteEventHandler, noteAccidentalEventHandler } from './engraver/events/note.js';

export { default as NoteExercise } from './exercises/NoteExercise.svelte';
export { default as EScore } from './engraver/EScore.svelte';

export type { NoteAccidentalEvent, NoteEvent } from './engraver/events/types.js';
