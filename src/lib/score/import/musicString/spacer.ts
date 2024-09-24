import { Note } from '../../../core/note.js';
import { NoteType } from '../../../core/rhythmElement.js';

export class Spacer extends Note {
  get name() {
    return 'y';
  }
  constructor(type: NoteType, dots?: number) {
    super(type, 'b', undefined, 5, dots);
  }
}
