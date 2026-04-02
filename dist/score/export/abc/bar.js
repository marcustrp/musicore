import { Bar } from '../../../core/bar.js';
import { Coda, DaCapo, Fine, Segno } from '../../../core/data/directions.js';
import {} from '../abc.js';
export class BarGenerator {
    addWarning;
    addError;
    constructor(addWarning, addError) {
        this.addWarning = addWarning;
        this.addError = addError;
    }
    /**
     * Convert MusiCore bar to ABC bar (barlines, repeat signs, directions, endings, line breaks)
     * @param bar
     * @param index
     * @returns
     */
    getBarAbc(bar, index, onNewLine = false) {
        const abc = { start: '', end: '', lineBreak: false };
        if (index !== 0) {
            if (bar.directions)
                abc.end += this.getBarDirections(bar.directions);
            if (bar.ending && bar.ending.start)
                abc.start += '[' + bar.ending.number;
            if (bar.startRepeat)
                abc.start += (onNewLine ? '|' : '') + ':';
            if (bar.endRepeat)
                abc.end += ':';
        }
        abc.end += this.getBarline(bar.barline);
        if (bar.lineBreak)
            abc.lineBreak = true;
        return abc;
    }
    /**
     * Convert MusiCore barline to ABC barline
     * @param barline
     * @returns
     */
    getBarline(barline) {
        switch (barline) {
            case 'regular':
                return '|';
            case 'heavy-heavy':
                return '|][|';
            case 'heavy-light':
                return '[|';
            case 'light-heavy':
                return '|]';
            case 'light-light':
                return '||';
            case 'none':
                return '[|]';
            case 'dotted':
                return '.|';
            default:
                this.addWarning('Unsupported barline ' + barline);
                return '';
        }
    }
    /**
     * Converts MusiCore directions to ABC directions (e.g. coda, segno, fine)
     * @param directions
     * @returns
     */
    getBarDirections(directions) {
        let abc = '';
        directions.forEach((direction) => {
            if (direction instanceof Coda) {
                abc += '!coda!';
            }
            else if (direction instanceof Segno) {
                if (direction.type === 'to') {
                    abc += '!segno!';
                }
                else {
                    if (direction.extra)
                        this.addWarning('Unsupported extra on segno: ' + direction.extra);
                    abc += `!D.S.${direction.al ? 'al' + direction.al : ''}!`;
                }
            }
            else if (direction instanceof DaCapo) {
                if (direction.extra)
                    this.addWarning('Unsupported extra on dacapo: ' + direction.extra);
                abc += `!D.C.${direction.al ? 'al' + direction.al : ''}!`;
            }
            else if (direction instanceof Fine) {
                abc += '!fine!';
            }
            else {
                this.addWarning('Unsupported bar direction ' + direction);
            }
        });
        return abc;
    }
}
