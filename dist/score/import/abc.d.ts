import * as abcjs from 'abcjs';
import { Score } from '../score.js';
import { Scale } from '../../core/scale.js';
import HeaderParser from './abc/header.js';
import { NoteParser } from './abc/note.js';
import { BarParser } from './abc/bar.js';
import { MetaTextParser } from './abc/metatext.js';
export declare class AbcImportState {
    currentScale: Scale;
    scaleNoteNames: {
        [key: string]: string;
    };
    partIndex: number;
    voiceIndex: number;
    errors: string[];
    constructor(currentScale?: Scale, scaleNoteNames?: {
        [key: string]: string;
    }, partIndex?: number, voiceIndex?: number, errors?: string[]);
}
export declare class AbcImporter {
    score: Score;
    state: AbcImportState;
    headerParser: HeaderParser;
    noteParser: NoteParser;
    barParser: BarParser;
    metaTextParser: MetaTextParser;
    parse(abc: string): Score;
    cleanAbc(abc: string): string;
    initScore(tune: abcjs.TuneObject): void;
    /** @todo implement more... */
    parseElement(item: abcjs.VoiceItem): void;
}
//# sourceMappingURL=abc.d.ts.map