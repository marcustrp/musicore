import * as abcjs from 'abcjs';
import { Key } from '../../../core/key.js';
import { TimeSignature } from '../../../core/timeSignature.js';
import { AbcImportState } from '../abc.js';
export default class HeaderParser {
    private state;
    constructor(state: AbcImportState);
    getKey(abcKey: abcjs.KeySignature): Key;
    getKeyRoot(abcKey: abcjs.KeySignature): string;
    getTimeSignature(abcTimeSignature: abcjs.Meter): TimeSignature;
}
//# sourceMappingURL=header.d.ts.map