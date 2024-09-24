import { Note } from '../../../core/note.js';
import { Scale } from '../../../core/scale.js';
import { Score } from '../../score.js';

export class BodyExporter {
  export(score: Score) {
    let musicstring = '';
    let scale = new Scale(score.bars.bars[0].key.root, score.bars.bars[0].key.mode);
    score.bars.bars.forEach((bar, barIndex) => {
      Object.entries(bar.notes).forEach(([id, part], pIndex) => {
        Object.entries(part).forEach(([id, notes], vIndex) => {
          if (pIndex === 0 && vIndex === 0) {
            notes.forEach((note) => {
              if (note instanceof Note) {
                musicstring += this.getNote(note, scale);
              } else {
              }
            });
          }
        });
      });
    });
    return musicstring.trim();
  }

  private getNote(note: Note, scale: Scale) {
    let musicstring = '';
    musicstring += scale.getScaleNumberFromNote(note.root, note.accidental);
    if (note.type !== 'q') musicstring += note.type;
    if (!note.beam || note.beam.value === 'end') musicstring += ' ';
    return musicstring;
  }
}
