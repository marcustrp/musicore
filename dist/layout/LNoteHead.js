import { Note, } from '../index.js';
import {} from '../fonts/types.js';
import {} from '../fonts/glyphKey.js';
import {} from './types.js';
import { LAccidental } from './LAccidental.js';
import {} from './LayoutObject.js';
import { LStaffLine } from './LStaffLine.js';
import { notePosition } from './noteData.js';
import { LColumnEditor } from './LColumnEditor.js';
import { BBox } from '../utils/bBox.js';
export class LNoteHead {
    x = 0;
    y = 0;
    bBox = new BBox();
    type;
    dots;
    root;
    accidental;
    editor;
    editorGlyph;
    octave;
    glyph;
    glyphName;
    clef;
    locked;
    color;
    constructor(settings, note, clef) {
        this.type = note.type;
        this.dots = note.dots;
        this.root = note.root;
        this.octave = note.octave;
        this.clef = clef;
        this.locked = note.locked || false;
        if (note.color?.notehead)
            this.color = note.color.notehead;
        switch (note.type) {
            case 'w':
                this.glyphName = 'noteheadWhole';
                break;
            case 'h':
                this.glyphName = 'noteheadHalf';
                break;
            default:
                this.glyphName = 'noteheadBlack';
                break;
        }
        this.glyph = settings.font.glyphs[this.glyphName];
        if (note.printedAccidental?.value || settings.render?.notes?.editorAccidental)
            this.setAccidental(settings, note.printedAccidental?.value, clef);
    }
    setAccidental(settings, type, clef) {
        const position = this.getPosition(clef);
        if (settings.render?.notes?.editorAccidental) {
            this.editor = new LColumnEditor(settings, LAccidental.getGlyph(settings, settings.defaultAccidental), this.getPosition(clef), this.getPosition(clef), false, undefined, settings.defaultAccidentalEditorWidth);
        }
        if (type) {
            this.accidental = new LAccidental(settings, position, type);
        }
    }
    getPosition(clef) {
        return LNoteHead.getPositionFromRoot(this.root, this.octave, clef);
    }
    static getPositionFromRoot(root, octave, clef) {
        const position = notePosition[root];
        if (clef === 'treble' || clef === 'g') {
            const temp = position - 7 * (octave - 5);
            return temp;
        }
        else if (clef === 'bass' || clef === 'f') {
            return position - 7 * (octave - 3) + 2;
        }
        else if (clef === 'alto') {
            return position - 7 * (octave - 4) + 1;
        }
        return 0;
    }
    static rootAndOctaveFromPosition(position, clef) {
        if (clef === 'bass' || clef === 'f') {
            position += 12;
        }
        else if (clef === 'alto') {
            position += 6;
        }
        const octave = 5 - Math.floor((position - 4) / 7);
        while (position < 0) {
            position += 7;
        }
        position = position % 7;
        if (position < 4)
            position += 7;
        const root = Object.entries(notePosition).find(([_, value]) => {
            return value === position;
        });
        const data = root ? { root: root[0], octave: octave } : null;
        return data;
    }
    toObject(barIndex) {
        const objectType = 'note';
        return {
            objectType: objectType,
            type: this.type,
            root: this.root,
            accidental: this.accidental ? this.accidental.toObject() : undefined,
            octave: this.octave,
            dots: this.dots,
            x: this.x,
            y: this.y,
            bBox: this.bBox.toObject(),
            glyph: this.glyph,
            editor: this.editor ? this.editor.toObject(barIndex) : undefined,
            color: this.color,
        };
    }
    layout(settings, staffLines, x) {
        if (this.accidental || (settings.render?.notes?.editorAccidental && !this.locked)) {
            let accidentalX = 0, editorX = 0;
            if (this.accidental)
                accidentalX = this.accidental.layout(settings, staffLines, x);
            if (settings.render?.notes?.editorAccidental) {
                editorX = this.editor.layout(settings, staffLines, x);
            }
            x = Math.max(accidentalX, editorX);
            // Spacing between accidental and note head
            x += settings.staveSpace / 3;
        }
        this.x = x;
        this.y = staffLines[0].y + this.getPosition(this.clef) * (settings.staveSpace / 2);
        this.bBox = this.glyph.bBox?.clone() || new BBox();
        this.bBox.setXY(this.x, this.y);
        if (this.accidental)
            this.bBox.merge(this.accidental.bBox);
        if (settings.render?.notes?.editorAccidental)
            this.bBox.merge(this.editor.bBox);
    }
    static getMinMaxPosition(notes, clef) {
        let min = 0, max = 0;
        notes.forEach((note) => {
            min = Math.min(min, note.getPosition(clef));
            max = Math.max(max, note.getPosition(clef));
        });
        return [min, max];
    }
}
