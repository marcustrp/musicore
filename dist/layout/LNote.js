import { Note } from '../index.js';
import { LNoteStem } from './LNoteStem.js';
import { LRhythmElement } from './LRhythmElement.js';
import { LStaffLine } from './LStaffLine.js';
import {} from './types.js';
import { LNoteHead } from './LNoteHead.js';
import { LColumnEditor } from './LColumnEditor.js';
import { LLedgerLines } from './LLedgerLines.js';
export class LNote extends LRhythmElement {
    stem;
    id;
    notes = [];
    ledgerLines;
    editor;
    invisible;
    constructor(clef, index, settings, note) {
        super(clef, index, note.type, note.getDuration(), note.dots);
        this.dots = note.dots;
        this.id = note.id;
        this.notes.push(new LNoteHead(settings, note, clef));
        if (note.chord) {
            note.chord.forEach((note) => {
                this.notes.push(new LNoteHead(settings, note, clef));
            });
        }
        if (note.invisible === true) {
            this.invisible = true;
        }
        else {
            this.createLedgerLines(settings);
        }
        if (settings.render?.notes?.editorNote && !note.locked) {
            const onHover = settings.render.notes.editorNote.showNoteName ?
                (position) => this.getNoteName(position, clef)
                : undefined;
            this.editor = new LColumnEditor(settings, this.notes[0].glyph, settings.render.notes.editorNote.positionFrom, settings.render.notes.editorNote.positionTo, true, onHover);
        }
    }
    getNoteName(position, clef) {
        const data = LNoteHead.rootAndOctaveFromPosition(position, clef);
        if (!data)
            return '';
        const octaveString = data.octave >= 5 ?
            '<tspan font-size="200" style="baseline-shift: super">' + (data.octave - 4) + '</tspan>'
            : data.octave <= 2 ?
                '<tspan font-size="200" style="baseline-shift: sub">' +
                    Math.abs(data.octave - 4) +
                    '</tspan>'
                : '';
        // vertical-align: sub/super
        return data ? (data.octave <= 3 ? data.root.toUpperCase() : data.root) + octaveString : '';
    }
    createLedgerLines(settings) {
        const [min, max] = LNoteHead.getMinMaxPosition(this.notes, this.clef);
        const above = LLedgerLines.create(settings, min);
        const below = LLedgerLines.create(settings, max);
        if (above || below) {
            this.ledgerLines = { above, below };
        }
    }
    toObject(barIndex) {
        const objectType = 'note';
        return {
            id: this.id,
            objectType: objectType,
            index: this.index,
            type: this.type,
            dots: this.dots,
            x: this.x,
            y: this.invisible ? undefined : this.y, // undefined y means note is invicible
            bBox: this.bBox.toObject(),
            stem: this.stem ? this.stem.toObject() : undefined,
            notes: this.notes.map((note) => note.toObject(barIndex)),
            ledgerLines: this.ledgerLines ?
                { above: this.ledgerLines.above?.lines || [], below: this.ledgerLines.below?.lines || [] }
                : undefined,
            editor: this.editor ? this.editor.toObject(barIndex) : undefined,
        };
    }
    layout(settings, staffLines, x) {
        this.notes.forEach((note) => {
            note.layout(settings, staffLines, x);
        });
        // hack, in future needs to take into account notes with interval 1 or 2, where noteheads are shuffled to the side
        // also, do not include accidental width here, see below
        x += this.notes[0].glyph.horizAdvX;
        if (this.stem)
            this.stem.layout(settings, this.notes, this.clef);
        this.layoutLedgerLines(settings, staffLines);
        if (this.editor) {
            x = this.editor.layout(settings, staffLines, this.notes[0].x);
        } /* else if (this.notes[0].accidental) {
            x += this.notes[0].accidental.glyph.horizAdvX
                ? parseInt(this.notes[0].accidental.glyph.horizAdvX)
                : 0;
        }*/
        this.paddingRight = this.getSpacing(settings);
        this.calculateBBox(x);
        x += this.paddingRight;
        return x;
    }
    calculateBBox(x) {
        this.bBox.setXY(x, this.notes[0].y);
        if (this.invisible !== false) {
            this.notes.forEach((note) => {
                this.bBox.merge(note.bBox);
            });
        }
        // TODO: include ledger lines (move to separate class)
        if (this.stem)
            this.bBox.merge(this.stem.bBox);
        if (this.editor)
            this.bBox.merge(this.editor.bBox);
        this.bBox.width += this.paddingRight;
    }
    layoutLedgerLines(settings, staffLines) {
        if (!this.ledgerLines)
            return;
        if (this.ledgerLines.above) {
            this.ledgerLines.above.layout(settings, this.notes[0].glyph, staffLines, this.notes[0].x);
        }
        if (this.ledgerLines.below) {
            this.ledgerLines.below.layout(settings, this.notes[0].glyph, staffLines, this.notes[0].x);
        }
    }
    static create(clef, index, settings, note) {
        const lNote = new LNote(clef, index, settings, note);
        if (note.type !== 'w')
            lNote.stem = new LNoteStem(settings.font, 0, 0, settings.staveSpace * 3.5);
        return lNote;
    }
}
