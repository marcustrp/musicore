import * as abcjs from 'abcjs';
import { AbcImportState } from '../abc.js';
import { Score } from '../../score.js';
export declare class MetaTextParser {
    private state;
    constructor(state: AbcImportState);
    parse(metaText: abcjs.MetaText, score: Score): void;
}
//# sourceMappingURL=metatext.d.ts.map