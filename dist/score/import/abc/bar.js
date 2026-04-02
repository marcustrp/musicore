import * as abcjs from 'abcjs';
import { Score } from '../../score.js';
import { AbcImportState } from '../abc.js';
import * as direction from '../../../core/data/directions.js';
export class BarParser {
    state;
    constructor(state) {
        this.state = state;
    }
    parse(item, score) {
        if (this.state.partIndex !== 0 || this.state.voiceIndex !== 0) {
            this.state.errors.push('Info: skip bar info for part/voice');
            return;
        }
        if (item.chord) {
            this.state.errors.push('Chord on barline not supported');
            return;
        }
        this.parseDecoration(item.decoration, score);
        this.parseBarline(item, score);
        this.parseEnding(item, score);
    }
    parseDecoration(item, score) {
        if (item && item.length > 0) {
            item.forEach((decoration) => {
                switch (decoration) {
                    case 'D.C.':
                        return score.bars.addDirection(new direction.DaCapo());
                    case 'D.C.alcoda':
                        return score.bars.addDirection(new direction.DaCapo('coda'));
                    case 'D.C.alfine':
                        return score.bars.addDirection(new direction.DaCapo('fine'));
                    case 'D.S.':
                        return score.bars.addDirection(new direction.Segno('from'));
                    case 'D.S.alcoda':
                        return score.bars.addDirection(new direction.Segno('from', 'coda'));
                    case 'D.S.alfine':
                        return score.bars.addDirection(new direction.Segno('from', 'fine'));
                    case 'fine':
                        return score.bars.addDirection(new direction.Fine());
                    case 'segno':
                        return score.bars.addDirection(new direction.Segno('to'));
                    default:
                        this.state.errors.push('Unsupported decoration on barline: ' + item);
                }
            });
        }
    }
    parseEnding(item, score) {
        if (item.startEnding) {
            score.bars.appendBar();
            score.bars.setEnding(item.startEnding);
        }
        //if (item.endEnding) score.bars.setEnding(item.startEnding)
    }
    parseBarline(item, score) {
        /** @abcjs incomplete type */
        const type = item.type;
        switch (type) {
            case 'bar_thin':
                score.bars.setBarline('regular', item.barNumber);
                break;
            case 'bar_thin_thin':
                score.bars.setBarline('light-light', item.barNumber);
                break;
            case 'bar_thick_thin':
                score.bars.setBarline('heavy-light', item.barNumber);
                break;
            case 'bar_thin_thick':
                score.bars.setBarline('light-heavy', item.barNumber);
                break;
            case 'bar_invisible':
                score.bars.setBarline('none', item.barNumber);
                break;
            case 'bar_dbl_repeat':
            case 'bar_right_repeat':
                /** @todo: check if repeat is in middle of bar */
                score.bars.setBarline('light-heavy', item.barNumber);
                score.bars.setRepeatEnd(1);
                if (type === 'bar_right_repeat')
                    break;
            // falls through
            case 'bar_left_repeat':
                score.bars.appendBar();
                score.bars.setBarline('heavy-light', item.barNumber);
                score.bars.setRepeatStart(1);
                break;
            /** @todo: dotted barline missing from abcjs */
            default:
                throw new Error('Unsupported barline type ' + type);
        }
    }
}
