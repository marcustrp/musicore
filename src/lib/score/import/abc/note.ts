import * as abcjs from 'abcjs';
import Fraction from 'fraction.js';
import * as abcjsTypes from '../../../utils/abcjs-types.js';
import { Duration } from '../../../core/duration.js';
import { Note } from '../../../core/note.js';
import { Score } from '../../score.js';
import { AbcImportState } from '../abc.js';
import * as mappers from './data/mappers.js';
import ChordSymbol from '../../../core/chordSymbol.js';

export class NoteParser {
	private tripletState?: {
		numerator: number;
		denominator: number;
		noteCount: number;
		currentCount: number;
		notes: Note[];
	};
	private beamActive = false;

	constructor(private state: AbcImportState) {}

	parse(item: abcjsTypes.VoiceItemNote_FIX, score: Score) {
		const noteType = Duration.getTypeAndDotsFromFraction(new Fraction(item.duration));
		let notes: Note[] = [];
		/** @abcjs incomplete type */
		item.pitches.forEach((pitch) => {
			let name = pitch.name.charAt(0).toLocaleLowerCase();
			if (pitch.accidental) {
				name += mappers.accidental[pitch.accidental];
			} else {
				name = this.state.scaleNoteNames[name];
			}
			const octave = 5 + Math.floor(pitch.pitch / 7);
			const note = new Note(
				noteType.type,
				Note.nameToNatural(name),
				Note.nameToAccidental(name),
				octave,
				noteType.dots,
			);
			if (pitch.startTie) note.tie = 'start';
			if (pitch.endTie) note.tie = 'end';
			if (pitch.startSlur) {
				note.slurs = [];
				pitch.startSlur.forEach((_) => note.slurs!.push({ type: 'start' }));
			}
			if (pitch.endSlur) {
				if (!note.slurs) note.slurs = [];
				pitch.endSlur.forEach((_) => note.slurs!.push({ type: 'end' }));
			}
			notes.push(note);
		});
		notes = notes.sort((a, b) => {
			return a.midiNumber < b.midiNumber ? 1 : -1;
		});
		const note = notes[0];
		for (let i = 1; i < notes.length; i++) {
			note.addChordNote(notes[i]);
		}
		if (item.chord)
			item.chord.forEach((chord) => note.setChordSymbol(this.createChordSymbol(chord.name)));
		if (item.startBeam) {
			note.beam = { value: 'start' };
			this.beamActive = true;
		} else if (item.endBeam) {
			note.beam = { value: 'end' };
			this.beamActive = false;
		} else if (this.beamActive) {
			note.beam = { value: 'continue' };
		}

		if (item.startTriplet) {
			this.tripletStart(item, note);
		} else if (this.tripletState) {
			if (this.tripletContinue(item, note)) {
				score.parts
					.getPart(this.state.partIndex)
					.getVoice(this.state.voiceIndex)
					.addTriplet(
						this.tripletState.notes,
						this.tripletState.numerator,
						this.tripletState.denominator,
					);
				this.tripletState = undefined;
			}
		} else {
			score.parts.getPart(this.state.partIndex).getVoice(this.state.voiceIndex).addNote(note);
		}
	}

	private createChordSymbol(name: string) {
		name = name.replace(/♯/g, '#');
		name = name.replace(/♭/g, 'b');
		return new ChordSymbol(name);
	}

	private tripletStart(item: abcjs.VoiceItemNote, note: Note) {
		this.tripletState = {
			numerator: item.startTriplet!,
			denominator: Math.round(item.tripletMultiplier! * item.startTriplet!),
			noteCount: item.tripletR!,
			currentCount: 1,
			notes: [note],
		};
	}

	private tripletContinue(item: abcjs.VoiceItemNote, note: Note) {
		if (!this.tripletState) throw new Error('Not in triplet!');
		this.tripletState.notes.push(note);
		this.tripletState.currentCount++;
		if (item.endTriplet) {
			if (this.tripletState.currentCount !== this.tripletState.noteCount)
				throw new Error('Triplet not count error');
			return true;
		}
		return false;
	}
}
