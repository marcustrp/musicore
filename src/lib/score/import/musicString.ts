import Fraction from 'fraction.js';
import { Direction } from '../../core/data/directions.js';
import { Note } from '../../core/note.js';
import { Rest } from '../../core/rest.js';
import { Score } from '../score.js';
import { BarItem, BarlineParser } from './musicString/bar.js';
import { BodyItem, BodyParser, TripletQueue } from './musicString/body.js';
import { InformationItem, InformationParser } from './musicString/information.js';
import { ModifierItem, ModifierParser } from './musicString/modifiers.js';
import { Spacer } from './musicString/spacer.js';
import ChordSymbol from '../../core/chordSymbol.js';

export class MusicStringImporter {
	score!: Score;
	info: InformationItem = {};
	octave: number = 1;
	//notes: Array<Note | Rest> = []
	musicString: string = '';
	errors = new Array<string>();
	noteBuffer: Note[] = [];
	activeTriplet?: {
		p: number;
		q: number;
		r: number;
		currentIndex: number;
		notes: (Note | Rest)[];
	};

	parse(musicString: string) {
		this.musicString = musicString;
		const informationParser = new InformationParser(this.errors);
		const bodyParser = new BodyParser(this.errors);
		const barlineParser = new BarlineParser(this.errors);
		const modifierParser = new ModifierParser(this.errors);

		// split by space, but not when space within any type of quote
		const items = this.splitMusicString(this.musicString);
		items.forEach((item, index) => {
			item = item.trim();
			let info = informationParser.parse(item, index, this.info);
			if (!this.score) {
				const itemParsed = info !== undefined;
				if (!info) info = {};
				const octaveSet = info.octave !== undefined;
				this.info = informationParser.setDefaults(info);
				this.initScore(this.info);
				if ((!octaveSet && info?.clef?.type === 'f') || info?.clef?.type === 'bass')
					this.info.octave = 3;
				if (itemParsed) return;
			} else if (this.score && info) {
				this.errors.push('Inline information not supported');
			}

			const barItem = barlineParser.parse(item);
			if (barItem) {
				this.handleBarItem(barItem);
				return;
			} else if (barItem === null) {
				// do not continue to parse, might be for example unattached decorator
				return;
			}

			const modifierItem = modifierParser.parse(item);
			if (modifierItem) {
				this.handleModifierItem(modifierItem);
				return;
			}

			const bodyItem = bodyParser.parse(
				item,
				this.info,
				this.score.bars.bars[this.score.bars.bars.length - 1],
			);
			if (bodyItem) {
				this.handleBodyItems(bodyItem);
			}

			if (!bodyItem) this.errors.push(item);
		});
		if (this.score.bars.bars[this.score.bars.bars.length - 1].barline === 'regular')
			this.score.bars.setBarline('light-heavy');

		if (bodyParser.slurIndex !== 0) this.errors.push('Missing end of slur');
		if (this.errors) this.errors.forEach((error) => console.warn('Parser error: ' + error));

		return this.score;
	}

	splitMusicString(musicString: string) {
		// split by space, but not when space within any type of quote
		// haven't figured out a single regex for this yet, so replace
		// spaces inside quotes with a placeholder, split, and then
		// replace the placeholder with a space again
		const temp = musicString.replace(/(['"`])(.*?)\1/g, (match, p1, p2) => {
			return p1 + p2.replace(/\s/g, '§§SPACE§§') + p1;
		});
		//let items = this.musicString.split(/\s(?=(?:[^'"`]*(?:['"`])[^'"`]*)*[^'"`]*$)/g);
		let items = temp.split(/\s(?=(?:[^'"`]*(?:['"`])[^'"`]*)*[^'"`]*$)/g);
		items = items.filter((item) => item !== '').map((item) => item.replace(/§§SPACE§§/g, ' '));
		return items;
	}

	initScore(info: InformationItem) {
		this.createScore(info);
		this.score.parts.addPart(info.clef!);
	}

	createScore(info: InformationItem) {
		this.score = new Score(info.key!, info.timeSignature!);
		this.score.scale = info.scale;
		if (info.tempo) this.score.bars.setTempo(info.tempo);
		if (info.title) this.score.addWorkInformation('title', info.title);
		if (info.type) this.score.addInformation('type', info.type);
		if (info.books) info.books.forEach((book) => this.score.addInformation('books', book));
		if (info.discography)
			info.discography.forEach((disc) => this.score.addInformation('discography', disc));
		if (info.notes) this.score.addInformation('notes', info.notes);
		if (info.origin) this.score.addInformation('origin', info.origin);
		if (info.source) this.score.addInformation('source', info.source);
		if (info.transcriptions)
			info.transcriptions.forEach((transcription) =>
				this.score.addInformation('transcription', transcription),
			);
		if (info.composers)
			info.composers.forEach((composer) => this.score.addWorkInformation('composer', composer));
	}

	handleBarItem(item: BarItem) {
		let firstBarVoiceDuration = new Fraction(0);
		this.score.bars
			.getNotes('P1', 'V1', 0)
			.forEach((note) => (firstBarVoiceDuration = firstBarVoiceDuration.add(note.getDuration())));
		if (item.barline && firstBarVoiceDuration < this.score.bars.bars[0].timeSignature.duration) {
			if (this.score.bars.bars.length === 1) {
				if (firstBarVoiceDuration.compare(0) != 0) {
					this.score.bars.convertToPickup();
				} else {
					// barline at the beginning is ignored
					return;
				}
			}
		}

		// for current bar
		if (item.barline && item.barline !== 'regular') this.score.bars.setBarline(item.barline);
		if (item.repeatEnd && firstBarVoiceDuration.compare(0) != 0)
			this.score.bars.setRepeatEnd(item.repeatEnd);
		if (item.directionsCurrent) this.addDirections(item.directionsCurrent);
		if (item.lineBreak) this.addLineBreak();
		// for next bar
		if (item.repeatStart || item.ending || item.directionsNext) {
			this.score.bars.appendBar();
			if (item.repeatStart) this.score.bars.setRepeatStart(item.repeatStart);
			if (item.ending) this.score.bars.setEnding(item.ending);
			if (item.directionsNext) this.addDirections(item.directionsNext);
		}
	}

	addDirections(directions: Direction[]) {
		directions.forEach((dir) => this.score.bars.addDirection(dir));
	}

	addLineBreak() {
		this.score.bars.addLineBreak();
	}

	handleModifierItem(item: ModifierItem) {
		switch (item.type) {
			case 'octave-shift':
				if (item.data == 1) {
					this.info!.octave!++;
				} else if (item.data == -1) {
					this.info!.octave!--;
				} else {
					this.errors.push('Unknown data for modifier octave-shift: ' + item.data);
				}
		}
	}

	handleBodyItems(items: BodyItem[]) {
		items.forEach((item) => {
			if (item.triplet) {
				this.activeTriplet = { currentIndex: 0, notes: [], ...item.triplet };
			} else if (this.activeTriplet) {
				this.activeTriplet.currentIndex++;
			}
			if (this.activeTriplet) {
				this.activeTriplet.notes.push(item.item);
			} else {
				this.handleBodyItem(item.item);
			}

			if (this.activeTriplet && this.activeTriplet.currentIndex === this.activeTriplet.r - 1) {
				this.score.parts
					.getPart(0)
					.getVoice(0)
					.addTriplet(this.activeTriplet.notes, this.activeTriplet.p, this.activeTriplet.q);
				this.activeTriplet = undefined;
			}
		});
	}

	handleBodyItem(item: Note | Rest | Spacer) {
		if (item instanceof Spacer) {
			const note = this.score.parts.getPart(0).getVoice(0).getNote();
			if (!note) throw new Error('Note not found');
			const chordSymbols = item.chordSymbols;
			if (chordSymbols && chordSymbols.length === 1)
				note.setChordSymbol(new ChordSymbol(item.getChordSymbol(0)!.text, item.getDuration()));
		} else {
			this.score.parts.getPart(0).getVoice(0).addNote(item);
		}
		// a new line indicates a new line in abc (if exported to ABC), mark not as new line...
		/*if (index === 0 && rowIndex !== 0) {
        data.abcNewLine = true;
        abcKeepLineBreaks = true;
      }*/
		// add item to pool item
	}
}
