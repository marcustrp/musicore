import { Note } from '../../core/note.js';
import { RhythmElement } from '../../core/rhythmElement.js';
import { Scale } from '../../core/scale.js';
import { Score } from '../score.js';
import { FormAnalyser } from '../../tools/formAnalyser.js';
export class PitchStreamExporter {
    export(score, settings) {
        const formAnalyzer = new FormAnalyser();
        const formData = formAnalyzer.parse(score);
        let pitchStream;
        switch (settings.type) {
            case 'name':
                pitchStream = this.getNames(score, formData.barSequence, settings);
                break;
            case 'natural':
                pitchStream = this.getNaturals(score, formData.barSequence, settings);
                break;
            case 'scaleNumber':
                pitchStream = this.getScaleNumbers(score, formData.barSequence, settings);
                break;
            case 'diffClosest':
            case 'diffClosestPositive':
            case 'diffClosest-ignoreRepeating':
            case 'diffClosestPositive-ignoreRepeating':
                pitchStream = this.getScaleNumberChangeClosest(score, formData.barSequence, settings);
                break;
            default:
                throw new Error('Unknown type ' + settings.type);
        }
        switch (settings?.returnType) {
            case 'array':
                return pitchStream;
            case 'string':
            default:
                return pitchStream.join('');
        }
    }
    includeNote(note) {
        return note instanceof Note && note.tie !== 'end' && note.tie !== 'continue';
    }
    getNames(score, barIndexSequence, settings) {
        const pitchStream = [];
        barIndexSequence.forEach((barIndex) => {
            const notes = score.parts.getPart(settings.part).getVoice(settings.voice).getNotes(barIndex);
            notes.forEach((note) => {
                if (this.includeNote(note))
                    pitchStream.push(note.name);
            });
        });
        return pitchStream;
    }
    getNaturals(score, barIndexSequence, settings) {
        const pitchStream = [];
        barIndexSequence.forEach((barIndex) => {
            const notes = score.parts.getPart(settings.part).getVoice(settings.voice).getNotes(barIndex);
            notes.forEach((note) => {
                if (this.includeNote(note))
                    pitchStream.push(note.name.charAt(0));
            });
        });
        return pitchStream;
    }
    getScaleNumbers(score, barIndexSequence, settings) {
        const pitchStream = [];
        const scaleRoot = score.bars.bars[0].key.root;
        const scaleType = score.bars.bars[0].key.mode;
        const scale = new Scale(scaleRoot, scaleType);
        barIndexSequence.forEach((barIndex) => {
            const notes = score.parts.getPart(settings.part).getVoice(settings.voice).getNotes(barIndex);
            notes.forEach((note) => {
                if (this.includeNote(note)) {
                    let scaleNumber = scale.getScaleNumberFromNote(note.root, note.accidental, settings.scaleNumberRelativeTo !== 'scale');
                    if (settings.scaleNumberRelativeTo === 'ignore')
                        scaleNumber = scaleNumber.substring(scaleNumber.length - 1);
                    pitchStream.push(scaleNumber);
                }
            });
        });
        return pitchStream;
    }
    /**
     * returns -3 to 3, where 0 is no change (positive adds 3 to all values).
     * Ignores octave, so a fifth up is regarded as (the smaller) fourth down
     */
    getScaleNumberChangeClosest(score, barIndexSequence, settings) {
        const pitchStream = [];
        const nameToNumber = { c: 0, d: 1, e: 2, f: 3, g: 4, a: 5, b: 6 };
        let firstIndex = 0;
        let previous = -1;
        do {
            const note = score.parts
                .getPart(settings.part)
                .getVoice(settings.voice)
                .getNoteByIndex(firstIndex);
            if (note && this.includeNote(note))
                previous = nameToNumber[note.name.charAt(0)];
            firstIndex++;
            if (firstIndex > 10) {
                throw new Error('No note found in first 10 notes');
            }
        } while (previous === -1);
        barIndexSequence.forEach((barIndex) => {
            const notes = score.parts.getPart(settings.part).getVoice(settings.voice).getNotes(barIndex);
            notes.forEach((note) => {
                if (firstIndex === 0 && this.includeNote(note)) {
                    const current = nameToNumber[note.name.charAt(0)];
                    const diff = current - previous;
                    if (diff === 0 &&
                        (settings.type === 'diffClosest-ignoreRepeating' ||
                            settings.type === 'diffClosestPositive-ignoreRepeating'))
                        return;
                    let change = diff < -3 ? diff + 7
                        : diff > 3 ? diff - 7
                            : diff;
                    if (settings.type === 'diffClosestPositive' ||
                        settings.type === 'diffClosestPositive-ignoreRepeating')
                        change += 3;
                    pitchStream.push(change);
                    previous = current;
                }
                else {
                    if (firstIndex !== 0)
                        firstIndex--;
                }
            });
        });
        return pitchStream;
    }
}
