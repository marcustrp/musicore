import { BBox } from '../utils/bBox.js';
export class LLedgerLines {
    x = 0;
    y = 0;
    bBox;
    ledgerPosition;
    lines;
    constructor(settings, ledgerPosition, count) {
        this.ledgerPosition = ledgerPosition;
        this.lines = this.createLines(settings, count);
        this.bBox = new BBox(0, 0, 0, 0);
    }
    static create(settings, minOrMaxPosition) {
        const count = LLedgerLines.getCount(minOrMaxPosition);
        if (count === 0)
            return undefined;
        return new LLedgerLines(settings, minOrMaxPosition < 0 ? 'above' : 'below', count);
    }
    static getCount(minOrMaxPosition) {
        let count = 0;
        if (minOrMaxPosition < 0) {
            count = Math.max(0, Math.floor(Math.abs(minOrMaxPosition) / 2));
        }
        else if (minOrMaxPosition > 9) {
            count = Math.max(0, Math.floor((minOrMaxPosition - 8) / 2));
        }
        return count;
    }
    createLines(settings, count) {
        const lines = [];
        for (let i = 0; i < count; i++) {
            lines.push({
                x: 0,
                y: 0,
                length: 0,
                width: settings.font.metadata.legerLineThickness,
            });
        }
        return lines;
    }
    layout(settings, glyph, stafflines, x) {
        const length = glyph.horizAdvX + settings.staveSpace / 2;
        this.x = x - (length - glyph.horizAdvX) / 2;
        const startY = this.ledgerPosition === 'above' ?
            stafflines[0].y - settings.staveSpace
            : stafflines[stafflines.length - 1].y + settings.staveSpace;
        const offset = settings.staveSpace * (this.ledgerPosition === 'above' ? -1 : 1);
        this.lines.forEach((line, i) => {
            line.x = x - (length - glyph.horizAdvX) / 2;
            line.y = startY + offset * i;
            line.length = length;
        });
        const topIndex = this.ledgerPosition === 'above' ? this.lines.length - 1 : 0;
        this.bBox = new BBox(this.lines[topIndex].x, this.lines[topIndex].y, this.lines[0].length, this.lines.length * settings.staveSpace);
        this.y = this.lines[topIndex].y;
    }
}
