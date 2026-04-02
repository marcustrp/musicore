import { Score } from '../score.js';
import { BodyExporter } from './musicString/body.js';
export class MusicStringExporter {
    export(score) {
        let musicstring = '';
        const bodyExporter = new BodyExporter();
        musicstring += bodyExporter.export(score);
        return musicstring;
    }
}
