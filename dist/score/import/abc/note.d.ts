import * as abcjsTypes from '../../../utils/abcjs-types.js';
import { Score } from '../../score.js';
import { AbcImportState } from '../abc.js';
export declare class NoteParser {
    private state;
    private tripletState?;
    private beamActive;
    constructor(state: AbcImportState);
    parse(item: abcjsTypes.VoiceItemNote_FIX, score: Score): void;
    private getNote;
    private getRest;
    private createChordSymbol;
    private tripletStart;
    private tripletContinue;
}
//# sourceMappingURL=note.d.ts.map