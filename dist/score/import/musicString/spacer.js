import { Note } from '../../../core/note.js';
import {} from '../../../core/rhythmElement.js';
export class Spacer extends Note {
    get name() {
        return 'y';
    }
    constructor(type, dots) {
        super(type, 'b', undefined, 5, dots);
    }
}
