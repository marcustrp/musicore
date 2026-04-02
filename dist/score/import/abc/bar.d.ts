import * as abcjs from 'abcjs';
import { Score } from '../../score.js';
import { AbcImportState } from '../abc.js';
export declare class BarParser {
    private state;
    constructor(state: AbcImportState);
    parse(item: abcjs.VoiceItemBar, score: Score): void;
    private parseDecoration;
    private parseEnding;
    private parseBarline;
}
//# sourceMappingURL=bar.d.ts.map