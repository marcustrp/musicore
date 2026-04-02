import * as abcjs from 'abcjs';
import { type KeyMode } from '../../../../core/data/modes.js';
import { type ClefType } from '../../../../core/clef.js';
export declare const keyMode: {
    [key: string]: KeyMode;
};
export declare const accidental: {
    [key in abcjs.AccidentalName]: string;
};
export declare const clef: {
    [key in abcjs.Clef]: {
        type: ClefType;
        octave?: 2 | 1 | -1 | -2;
    };
};
//# sourceMappingURL=mappers.d.ts.map