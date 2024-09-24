// todo
// - now using npm install with relative path
// - improve by using npm pack to install file
// https://fireship.io/lessons/how-to-structure-a-large-web-app-project/

import { MusicStringImporter } from './score/import/musicString.js';

export { Score } from './score/score.js';

export { Bar, BarlineStyle } from './core/bar.js';
export { Clef, ClefType } from './core/clef.js';
export { Key, KeyAccidental, KeyAccidentals, CustomKeyAccidental } from './core/key.js';
export { RhythmElement, NoteType } from './core/rhythmElement.js';
export { Rest } from './core/rest.js';
export { Note, NoteAccidentals, NoteName } from './core/note.js';
export { Scale } from './core/scale.js';
export { ScaleType, KeyMode } from './core/data/modes.js';
export { TimeSignature, TimeSignatureSymbol } from './core/timeSignature.js';

export { HarmonyKind } from './core/harmony.js';

export { AbcExporter } from './score/export/abc.js';

export { MusicStringImporter } from './score/import/musicString.js';

/** old musicore-engraver exports */
export { default as Score } from './engraver/Score.svelte';

export { type LayoutSettings } from './types.js';
export { type EngraverSettings } from './engraver/scoreEngraver.js';

export { LNoteHead } from './layout/LNoteHead.js';

export { BBox } from './utils/bBox.js';
export { noteEventHandler } from './engraver/events/note.js';
export { noteAccidentalEventHandler } from './engraver/events/note.js';
