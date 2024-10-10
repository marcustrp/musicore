import Fraction from 'fraction.js';
import { Bar } from '../../../core/bar.js';
import * as Notations from '../../../core/data/notations.js';
import { Duration } from '../../../core/duration.js';
import { type BeamValue, Note, type Octave, type ScaleNumber } from '../../../core/note.js';
import { Rest } from '../../../core/rest.js';
import { type NoteType, RhythmElement } from '../../../core/rhythmElement.js';
import { dynamics, articulations } from './notations.js';
import { Spacer } from './spacer.js';
import ChordSymbol from '../../../core/chordSymbol.js';
import RomanNumeralAnalysis from '../../../core/romanNumeralAnalysis.js';
import FunctionAnalysis from '../../../core/functionAnalysis.js';
import { type InformationItem } from './information.js';
import { Styles } from '$lib/core/styles.js';

type NoteTypeMusicstring = '_' | '__' | NoteType;

export enum BodyMatch {
	FULL = 0, // full match
	SLUR_START,
	TRIPLETS_P,
	TRIPLETS_Q,
	TRIPLETS_R,
	NOTATION,
	STEP, // step (analysis)
	CHORD_SYMBOL, // Chord symbol
	LYRICS,
	SOLFA, // solfa
	FUNCTION, // function (analysis)
	LENGTH, // length
	CHORD_NOTES, // chord, // [octaveShift and scaleNumber] (string without [], i.e. 13#5+1)
	LENGTH_2, // length
	CHORD_NOTES_2, // chord [octaveShift, scaleNumber] (string without [], i.e. 13#5+1)
	NOTE, // NEW/ NOT USED (octaveShift + scaleNumber + length)
	LENGTH_3, // length
	NOTE_2, // NEW/ NOT USED octaveShift and scaleNumber
	DOTS, // dots
	//REST, // rest
	TIE, // tie
	SLUR_END,
	/*// (prefix)
  NOTATION = 1,
  STEP = 2, // step (analysis)
  CHORD_SYMBOL = 3, // Chord symbol
  LYRICS = 4,
  SOLFA = 5, // solfa
  FUNCTION = 6, // function (analysis)
  //	(scaleNumber only)
  //	6, // NOT USED everything excluding pre- and postfix
  NOTE = 7, // NEW/ NOT USED (octaveShift + scaleNumber + length)
  //OCTAVE_SHIFT =	8, // octaveShift (if length is empty, see group ??)
  //SCALE_NUMBER =	9, // scaleNumber (if length is empty, see group ??)
  //([chord notes only])
  //	10, // NOT USED (octaveShift + scaleNumber + length)
  CHORD_NOTES = 8, // chord, // [octaveShift and scaleNumber] (string without [], i.e. 13#5+1)
  //	12, // NOT USED last octaveShift and scaleNumber i chord
  //	13, // NOT USED last ocaveShift in chord
  //	14, // NOT USED last scaleNumber in chord
  //	(scaleNumber and length)
  //	15, // NOT USED octaveShift, scaleNumber and length
  NOTE_2 = 9, // NEW/ NOT USED octaveShift and scaleNumber
  //OCTAVE_SHIFT_2 = 17, // octaveShift
  //SCLAE_NUMBER_2 = 18, // scaleNumber
  LENGTH = 10, // length
  //	(chord and length)
  //	20, // NOT USED octaveshift, scaleNumbers and length
  CHORD_NOTES_2 = 11, // chord [octaveShift, scaleNumber] (string without [], i.e. 13#5+1)
  //	22, // NOT USED last oct+aveShift and scaleNumber in chord
  //	23, // NOT USED last octaveShift in chord
  //	24, // NOT USED last scaleNumber in chord
  LENGTH_2 = 12, // length
  //	(length only)
  LENGTH_3 = 13, // length
  //	(postfix)
  DOTS = 14, // dots
  REST = 15, // rest
  TIE = 16, // tie*/
}

export type BodyDataTriplet = { p: number; q?: number; r?: number };

export type BodyData = {
	items: string;
	rest?: boolean;
	type: NoteTypeMusicstring;
	typeIsDefault?: boolean;
	dots?: number;
	tie?: boolean;
	step?: string;
	chordSymbol?: string;
	lyrics?: string;
	solfa?: string;
	function?: string;
	notations?: string;
	beam?: BeamValue;
	slurs?: { type: 'start' | 'end'; index: number }[];
	triplet?: BodyDataTriplet;
};

type TripletState = {
	p: number;
	q: number;
	r: number;
};

export type TripletQueue = {
	numerator: number;
	denominator: number;
	noteCount: number;
	notes: (Note | Rest)[];
};

export type BodyItem = {
	item: Note | Rest;
	triplet?: { p: number; q: number; r: number };
};

export class BodyParser {
	duration = new Fraction(0);
	openNotations: { position: Fraction; item: Notations.IDuration }[] = [];
	slurIndex = 0;
	tieState = false;

	constructor(public errors: string[]) {}

	parse(input: string, info: InformationItem, bar: Bar) {
		// convert to
		const data = this.match(input, bar);
		if (!data || data.length === 0) return;
		const items: BodyItem[] = [];
		data.forEach((match) => {
			const item = this.process(match, info);
			if (item) {
				this.duration = this.duration.add(item.item.getDuration());
				items.push(item);
			}
		});
		return items.length === 0 ? undefined : items;
	}

	/**
   * Split musicstring body item into components
		## SYNTAX, VERSION 4 ##
    #### note group
    two or more notes may be grouped to
    - define beams
    AND
    - simplyfy rhythm

    Base length is q for a note, so (disregaring beaming):
    - 12 is equal to 18 28
    - 1.2 is equal to 18. 216
    - 12. is equal to 116 28
    - 1_23 is equal to 18 216 316 (sim. for 12_3 and 123_)
    - 1234 is equal to 116 216 216 416

    #### single note/chord
		[decoration][step][chordSymbol][lyrics][solfa][function][[octaveShift][scaleNumber]][length][dots][rest][tie]
		decorations: between !, zero or more: !>!!ff!
    step: `step` or empty, i.e. `IVm`
    chordSymbol: "text" or empty, "C/E"
    lyrics: 'text' or empty, i.e. 'Lo-'
    solfa: ´text´ or empty, ´re´
    function: *function* or empty, *D7/3*
		octaveShift: **2; - (octave below), + (octave above) or empty. Matches zero to unlimited of -+
		scaleNumber: *1 *2; 1-9 (prefix with accidental #,x,b,bb or empty) or empty. r for rest, z for spacer, i for invisible
		length: *1; __, _, q, d, w, h, q, e or 8, s or 16, t or 32, 64, 128 or empty (_ doubles default, __ quadruples default, q = longa, d = brevis)
		dots: empty, ., ..
		rest: r or empty
		tie: - or empty. If chord, all notes have tie
		*2: both scaleNumber and length may not be left out at the same time!
    *1: octaveShift and scaleNumber can be encased in [], which indicates chord (multiple notes), but shares other elements

		## Groups ##
		- See enum BodyMatch
   * @param item 
   * @returns 
   */
	match(item: string, bar: Bar) {
		const myRegexp =
			/([(]*)?(?:([1-9]):(?:([1-9]):)?(?:([1-9]):)?)?(!(?!(?:!|!!)).*!)*(?:`([^"]*)`)?(?:"([^"]*)")?(?:'([^']*)')?(?:´([^']*)´)?(?:\*([^*]*)\*)?(?:(__|[ldwhqestuv_](?:{[^}]*})?)|(?:\[((?:(?:[+-]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*(?:{[^}]*})?){0,32})\](__|[ldwhqestuv_](?:{[^}]*})?))|(?:\[((?:(?:[+-/])*(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*(?:{[^}]*})?){0,32})\])|(?:((?:[+-/])*(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*(?:{[^}]*})?)(__|[ldwhqestuv_](?:{[^}]*})?))|((?:[+-/])*(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*(?:{[^}]*})?))([.]*)(=)?([)]*)?/g;
		//	/([(]*)?(?:([1-9]):(?:([1-9]):)?(?:([1-9]):)?)?(!(?!(?:!|!!)).*!)*(?:`([^"]*)`)?(?:"([^"]*)")?(?:'([^']*)')?(?:´([^']*)´)?(?:\*([^*]*)\*)?(?:(__|[ldwhqestuv_])|(?:\[((?:(?:[+-]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*){0,32})\](__|[ldwhqestuv_]))|(?:\[((?:(?:[+-/]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*){0,32})\])|(?:((?:[+-/]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*)(__|[ldwhqestuv_]))|((?:[+-/]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*))([.]*)(=)?([)]*)?/g;
		//	/([\(]*)?(?:([1-9]):(?:([1-9]):)?(?:([1-9]):)?)?(!(?!(?:!|!!)).*!)*(?:\`([^\"]*)\`)?(?:\"([^\"]*)\")?(?:'([^']*)')?(?:´([^']*)´)?(?:\*([^\*]*)\*)?(?:(__|[ldwhqestuv_])|(?:\[((?:(?:[+-]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*){0,32})\](__|[ldwhqestuv_]))|(?:\[((?:(?:[+-\/]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*){0,32})\])|(?:((?:[+-\/]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*)(__|[ldwhqestuv_]))|((?:[+-\/]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi][IL]*))([\.]*)(=)?([\)]*)?/g;
		//  /([\(]*)?(?:([1-9]):(?:([1-9]):)?(?:([1-9]):)?)?(!(?!(?:!|!!)).*!)*(?:\`([^\"]*)\`)?(?:\"([^\"]*)\")?(?:'([^']*)')?(?:´([^']*)´)?(?:\*([^\*]*)\*)?(?:(__|[ldwhqestuv_])|(?:\[((?:(?:[+-]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi]){0,32})\](__|[ldwhqestuv_]))|(?:\[((?:(?:[+-\/]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi]){0,32})\])|(?:((?:[+-\/]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi])(__|[ldwhqestuv_]))|((?:[+-\/]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxyi]))([\.]*)(=)?([\)]*)?/g;
		//  /([\(]*)?(?:([1-9]):(?:([1-9]):)?(?:([1-9]):)?)?(!(?!(?:!|!!)).*!)*(?:\`([^\"]*)\`)?(?:\"([^\"]*)\")?(?:'([^']*)')?(?:´([^']*)´)?(?:\*([^\*]*)\*)?(?:(__|[ldwhqestuv_])|(?:\[((?:(?:[+-]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxy]){0,32})\](__|[ldwhqestuv_]))|(?:\[((?:(?:[+-]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxy]){0,32})\])|(?:((?:[+-]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxy])(__|[ldwhqestuv_]))|((?:[+-]){0,2}(?:(?:bb|b|#|x|m)(?!x))?[1-9rxy]))([\.]*)(=)?([\)]*)?/g;
		// /(!(?!(?:!|!!)).*!)*(?:\`([^\"]*)\`)?(?:\"([^\"]*)\")?(?:'([^']*)')?(?:´([^']*)´)?(?:\*([^\*]*)\*)?(?:((?:[+-]*)?(?:[b#x]{0,2}[0-7y]))|(?:\[((?:(?:[+-]*)?(?:[b#x]{0,2}[0-7y])){0,32})\])|(?:((?:[+-]*)?(?:[b#x]{0,2}[0-7y]))([whq]|8|16|32|64|128))|(?:\[((?:(?:[+-]*)?(?:[b#x]{0,2}[0-7y])){0,32})\]([whq]|8|16|32|64|128))|([([whq]|8|16|32|64|128))([\.]*)([r])*(-)?/g;
		//  /^(!(?!(?:!|!!)).*!)*(?:\`([^\"]*)\`)?(?:\"([^\"]*)\")?(?:'([^']*)')?(?:´([^']*)´)?(?:\*([^\*]*)\*)?(?:((?:[+-]*)?(?:[b#x]{0,2}[0-7y]))|(?:\[((?:(?:[+-]*)?(?:[b#x]{0,2}[0-7y])){0,32})\])|(?:((?:[+-]*)?(?:[b#x]{0,2}[0-7y]))([whq]|8|16|32|64|128))|(?:\[((?:(?:[+-]*)?(?:[b#x]{0,2}[0-7y])){0,32})\]([whq]|8|16|32|64|128))|([([whq]|8|16|32|64|128))([\.]*)([r])*(-)?(?=[ ]|$)/g;
		//let items = myRegexp.exec(item);

		const items: string[][] = [];
		let match: string[] | null;
		do {
			match = myRegexp.exec(item);
			if (match) {
				items.push(match);
			}
		} while (match);
		const group: BodyData[] = [];
		items.forEach((item) => {
			group.push(this.matchParse(item, items.length > 1));
		});
		if (group.length > 1) {
			this.processBodyGroup(group, bar);
		}
		return group;
	}

	matchParse(items: string[], inGroup = false) {
		// get length. If not set, default to q (quarternote)
		const type = this.getNoteType(items, inGroup);
		const typeIsDefault: boolean =
			(items[BodyMatch.LENGTH_3] || items[BodyMatch.LENGTH_2] || items[BodyMatch.LENGTH] || '') ===
			'';
		// of not set default to 1
		//const numberOrChord = items[17] || items[12] || items[7] || items[3] || '1';
		const numberOrChord =
			items[BodyMatch.CHORD_NOTES_2] ||
			items[BodyMatch.NOTE_2] ||
			items[BodyMatch.CHORD_NOTES] ||
			items[BodyMatch.NOTE] ||
			'1';
		const data: BodyData = { items: numberOrChord, type };
		if (typeIsDefault) data.typeIsDefault = true;

		if (items[BodyMatch.NOTATION]) data.notations = items[BodyMatch.NOTATION];
		if (items[BodyMatch.STEP]) data.step = items[BodyMatch.STEP];
		if (items[BodyMatch.CHORD_SYMBOL]) data.chordSymbol = items[BodyMatch.CHORD_SYMBOL];
		if (items[BodyMatch.LYRICS]) data.lyrics = items[BodyMatch.LYRICS];
		if (items[BodyMatch.SOLFA]) data.solfa = items[BodyMatch.SOLFA];
		if (items[BodyMatch.FUNCTION]) data.function = items[BodyMatch.FUNCTION];
		if (items[BodyMatch.DOTS]) data.dots = items[BodyMatch.DOTS].length;
		if (items[BodyMatch.TIE]) data.tie = true;
		if (numberOrChord.substring(-1) === 'r') data.rest = true;

		if (items[BodyMatch.SLUR_START])
			this.addSlurs(data, 'start', items[BodyMatch.SLUR_START].length);
		if (items[BodyMatch.SLUR_END]) this.addSlurs(data, 'end', items[BodyMatch.SLUR_END].length);

		if (items[BodyMatch.TRIPLETS_P])
			this.addTriplet(
				data,
				items[BodyMatch.TRIPLETS_P],
				items[BodyMatch.TRIPLETS_Q],
				items[BodyMatch.TRIPLETS_R],
			);
		return data;
	}

	addSlurs(data: BodyData, type: 'start' | 'end', count: number) {
		for (let i = 0; i < count; i++) {
			if (this.slurIndex === 0 && type === 'end') {
				this.errors.push('Missing start of slur');
			} else {
				this.addSlur(data, type, this.slurIndex - (type === 'end' ? 1 : 0));
				this.slurIndex += type === 'start' ? 1 : -1;
			}
		}
	}

	addSlur(data: BodyData, type: 'start' | 'end', index: number) {
		if (!data.slurs) data.slurs = [];
		data.slurs.push({ type, index });
	}

	addTriplet(data: BodyData, p: string, q?: string, r?: string) {
		const triplet: BodyDataTriplet = { p: parseInt(p) };
		if (q) triplet.q = parseInt(q);
		if (r) triplet.r = parseInt(r);

		data.triplet = triplet;
	}

	getNoteType(items: string[], inGroup: boolean) {
		let noteType =
			items[BodyMatch.LENGTH_3] || items[BodyMatch.LENGTH_2] || items[BodyMatch.LENGTH] || 'q';
		switch (noteType) {
			case 'd':
				noteType = 'b';
				break;
			case 'e':
				noteType = '8';
				break;
			case 's':
				noteType = '16';
				break;
			case 't':
				noteType = '32';
				break;
			case 'u':
				noteType = '32';
				break;
			case 'v':
				noteType = '32';
				break;
			case '_':
				if (!inGroup) noteType = 'h';
				break;
			case '__':
				if (!inGroup) noteType = 'w';
				break;
		}
		return noteType as NoteTypeMusicstring;
	}

	processBodyGroup(group: BodyData[], bar: Bar) {
		this.processBodyGroupBeams(group);
		let hasDefaultType = false;
		group.forEach((item) => {
			if (item.typeIsDefault) hasDefaultType = true;
		});
		if (hasDefaultType) this.processBodyGroupDuration(group, bar);
	}
	processBodyGroupBeams(group: BodyData[]) {
		let beamStarted = false;
		group.forEach((item, index) => {
			if (item.rest) return;
			if (!beamStarted && index !== group.length - 1) {
				item.beam = 'start';
				beamStarted = true;
			} else if (beamStarted && index === group.length - 1) {
				item.beam = 'end';
			} else if (index !== group.length - 1) {
				item.beam = 'continue';
			}
		});
	}
	/**
	 * handle beaming and automatic length of notes in group
	 * @todo support irregular beam groups
	 */
	processBodyGroupDuration(group: BodyData[], bar: Bar) {
		let duration = new Fraction(0);
		const durations: Fraction[] = [];
		bar.timeSignature.beamGroupDurations.forEach((beamGroup, index) => {
			if (index > 0 && beamGroup.compare(bar.timeSignature.beamGroupDurations[0]) !== 0) {
				this.errors.push('Irregular beam groups is not supported');
			}
		});
		const defaultNoteDuration = bar.timeSignature.beamGroupDurations[0].div(group.length);
		let tripletState: TripletState | undefined;
		let excludeTripletCount = 0;
		// if a note in group has _, but is not part of triplet in group, we
		// need to add one to the total group note count. Example 1_3:123
		let tripletNoteCountAdd = 0;
		group.forEach((item) => {
			let itemDuration: Fraction;
			if (item.typeIsDefault) {
				if (item.dots === 1) {
					itemDuration = defaultNoteDuration.mul(3);
				} else if (item.dots === 2) {
					itemDuration = defaultNoteDuration.mul(7);
				} else {
					itemDuration = defaultNoteDuration;
				}
			} else {
				if (item.type === '_') {
					tripletNoteCountAdd++;
					if (item.dots === 1) {
						itemDuration = defaultNoteDuration.mul(6);
					} else if (item.dots === 2) {
						itemDuration = defaultNoteDuration.mul(14);
					} else {
						itemDuration = defaultNoteDuration.mul(2);
					}
				} else if (item.type === '__') {
					itemDuration = defaultNoteDuration.mul(4);
				} else {
					itemDuration = Duration.getFraction(item.type, item.dots, new Fraction(1));
				}
			}

			if (item.triplet) {
				tripletState = this.startTriplet(item);
				excludeTripletCount += tripletState.r - tripletState.q;
			}
			durations.push(itemDuration);
			duration = duration.add(durations[durations.length - 1]);
		});

		/**
		 * xx
		 * default: 1/(4*2) = 1/8
		 * 1/8 1/8 = 1/4
		 * change: 2 / (1/4 / 1/8) = 1 (multiply with above gets below)
		 * 1/8 1/8
		 *
		 * x_xx
		 * default: 1/(4*3) = 1/12
		 * 1/6 + 1/12 + 1/12 = 1/3
		 * change: 3 / (1/3 / 1/12) = 3/4
		 * 1/8 1/16 1/16
		 *
		 * x.x
		 * default 1/(4*2) = 1/8
		 * 3/8 1/8 = 1/2
		 * change: 2 / (1/2 / 1/8) = 1/2
		 * 3/16 1/16
		 *
		 * x..x
		 * default 1/(4*2) = 1/8
		 * 7/8 1/8 = 1
		 * change: 2 / (1 / 1/8) = 1/4
		 * 7/32 1/32
		 *
		 * x??xx
		 * default 1/(4*3) = 1/12
		 * 6/12 1/12 + 1/12 = 4/3
		 * change: 3 / (4/3 / 1/12) = 3/16
		 * 6/32 1/32 1/32
		 *
		 * x_..xx
		 * default 1/(4*3) = 1/12
		 * 14/12 1/12 + 1/12 = 4/3
		 * change: 3 / (4/3 / 1/12) = 3/16
		 * 14/64 1/64 1/64
		 *
		 * xxx (triol)
		 * default: 1/(4*3) = 1/12
		 * 1/12 + 1/12 + 1/12 = 1/4
		 * change 3 / (1/4 / 1/12) = ?
		 * triol: 1/8 1/8 1/8
		 *
		 * ----
		 * default: 1/(4*antal noter)
		 * [noternas beräknade värde] = [totalt]
		 * change: antal noter / (total längd / genomsnittlig längd) * (antal noter / antal noter - noter att exkludera från trioler o dyl (r - q i p:q:r:))
		 * [noternas verkliga värde], beräknat värde * förändring
		 */
		const change = new Fraction(group.length)
			.div(duration.div(defaultNoteDuration))
			.mul(
				new Fraction(
					group.length + (excludeTripletCount > 0 ? tripletNoteCountAdd : 0),
					group.length - excludeTripletCount + (excludeTripletCount > 0 ? tripletNoteCountAdd : 0),
				),
			);
		durations.forEach((dur, index) => {
			const data = Duration.getTypeAndDotsFromFraction(dur.mul(change));
			group[index].type = data.type;
			if (data.dots) group[index].dots = data.dots;
		});

		return group;
	}

	/*
    Notes for developement...
    - whole group: 3:123
    - whole group, different length: 3:2:4:1_2_34
    - part of group (single): 123:321
    - part of group (multiple) 3:1235:4:54321
    - single notes: 3:1 2 3
    - single notes, different length: 3:2:21h 2
    - single and group: 3:2:4:1 2 32
  */
	startTriplet(item: BodyData) {
		if (!item.triplet) throw new Error('No triplet data');
		const q = item.triplet.q ? item.triplet.q : this.getTripletDefaultQ(item.triplet.p);
		const r = item.triplet.r ? item.triplet.r : this.getTripletDefaultR(item.triplet.p);
		const state: TripletState = {
			p: item.triplet.p,
			q: q,
			r: r,
		};
		return state;
	}

	getTripletDefaultQ(_p: number) {
		return 2;
	}

	getTripletDefaultR(_p: number) {
		return 3;
	}

	/**
   * Split array of octaveShift and scaleNumber and process one at a time
			0: full match
			1: octaveShift
			2: scaleNumber
			3: note properties
			4: styles
   * @param data 
   * @returns 
   */
	process(data: BodyData, info: InformationItem) {
		const numberRegExp = /([+\-/]*)?([b#xm]{0,2}[0-9ryi])([IL]*)(?:{([^}]*)})?/g;
		data.type = data.type as NoteType;
		// get scaleNumber (1, 2, b3 etc). If not set, default to 1
		//let scaleNumber = items[5] || items[9] || '1';
		let pitch;
		let item: BodyItem | undefined = undefined;
		let noteOctaveShift = 0;
		while ((pitch = numberRegExp.exec(data.items)) !== null) {
			if (data.rest) {
				// it's a rest
				item = { item: new Rest(data.type, data.dots) };
				this.setChordSymbol(item.item, data.chordSymbol);
			} else {
				// check if we should change octave
				noteOctaveShift = 0;
				const octaveShifts = pitch[1] || '';
				if (octaveShifts) {
					for (let i = 0; i < octaveShifts.length; i++) {
						if (octaveShifts[i] === '+') {
							info.octave!++;
						} else if (octaveShifts[i] === '-') {
							info.octave!--;
						} else if (octaveShifts[i] === '/') {
							noteOctaveShift--;
						}
					}
				}
				// create note
				if (!item) {
					if (pitch[2] === 'y') {
						item = { item: new Spacer(data.type, data.dots) };
					} else {
						item = {
							item: Note.fromScaleNumber(
								(pitch[2] && pitch[2] !== 'i' ? pitch[2] : '1') as ScaleNumber,
								(info.octave! + noteOctaveShift) as Octave,
								info.scale!,
								data.type,
								data.dots,
								true,
							),
						};
						this.checkTie(data, item.item as Note);
						this.checkTriplet(data, item);
						if (data.beam) (item.item as Note).beam = { value: data.beam };
						if (data.slurs) (item.item as Note).slurs = data.slurs;
						if (pitch[2] === 'i' || pitch[3].includes('I')) (item.item as Note).invisible = true;
						if (pitch[3].includes('L')) (item.item as Note).locked = true;
						if (pitch[4]) {
							const styles = Styles.processStyles(pitch[4]);
							if (styles.color) (item.item as Note).color = { notehead: styles.color };
						}
					}
				} else {
					const chordNote = Note.fromScaleNumber(
						(pitch[2] && pitch[2] !== 'i' ? pitch[2] : '1') as ScaleNumber,
						(info.octave! + noteOctaveShift) as Octave,
						info.scale!,
						data.type,
						data.dots,
						true,
					);
					if ((item.item as Note).tie) chordNote.tie = (item.item as Note).tie;
					(item.item as Note).addChordNote(chordNote);
					if (pitch[2] === 'i' || pitch[3].includes('I')) (item.item as Note).invisible = true;
					if (pitch[3].includes('L')) chordNote.locked = true;
					if (pitch[4]) {
						const styles = Styles.processStyles(pitch[4]);
						if (styles.color) (chordNote as Note).color = { notehead: styles.color };
					}
				}
				this.addData(item.item as Note, data);
				if (data.notations) this.processNotation(item.item as Note | Spacer, data.notations);
				// TODO: make this change automatic when isRest is set
				//if (note.isRest) note.velocity = 0;

				// convert rhythm note (q, 16, h. etc) to integer value (milliseconds at bmp 75 quarternote)
				//note.lengthMs = noteData.durationMap.get(note.lengthString);
			}
		}
		/*if (notes.length > 1) {
			const chord = new Chord(notes);
			return chord;
		} else {
			return notes[0];
		}*/
		return item;
	}

	checkTie(data: BodyData, note: Note) {
		if (this.tieState) {
			if (data.tie) {
				note.tie = 'continue';
			} else {
				note.tie = 'end';
				this.tieState = false;
			}
		} else {
			if (data.tie) {
				note.tie = 'start';
				this.tieState = true;
			}
		}
	}

	checkTriplet(data: BodyData, item: BodyItem) {
		if (data.triplet) {
			const q = data.triplet.q ? data.triplet.q : this.getTripletDefaultQ(data.triplet.p);
			item.triplet = {
				p: data.triplet.p,
				q: q,
				r: data.triplet.r ? data.triplet.r : data.triplet.p,
			};
		}
	}

	addData(item: Note | Spacer, data: BodyData) {
		if (data.step) item.analysis = { romanNumeral: [{ step: data.step } as RomanNumeralAnalysis] };
		this.setChordSymbol(item, data.chordSymbol);
		if (data.lyrics) item.lyrics = [{ text: data.lyrics }];
		if (data.solfa) item.solfege = data.solfa;
		if (data.function) {
			if (!item.analysis) {
				item.analysis = {};
			}
			item.analysis!.function = [{ function: data.function } as FunctionAnalysis];
		}
	}

	private setChordSymbol(note: RhythmElement, chordSymbol?: string, offset?: number) {
		if (offset) {
			this.errors.push('Chord offset not implemented');
			return;
		}
		if (chordSymbol) note.setChordSymbol(new ChordSymbol(chordSymbol));
	}

	processNotation(note: Note | Spacer, item: string) {
		if (!item) return;
		let articulation: string[] | undefined;
		const items = item.slice(1, item.length - 1).split('!!');
		items.forEach((item) => {
			let notation: Notations.Notation | undefined | null;
			if (item === 'fermata' || item === 'invertedfermata') {
				notation = new Notations.Fermata(item === 'invertedfermata');
			} else if (dynamics.includes(item)) {
				notation = new Notations.Dynamic(item);
			} else if (item === 'mordent' || item === 'invertedmordent') {
				notation = new Notations.Mordent(item === 'invertedmordent' ? true : undefined);
			} else if (item === 'roll') {
				notation = new Notations.Roll();
			} else if (
				item === 'turn' ||
				item === 'turnx' ||
				item === 'invertedturn' ||
				item === 'invertedturnx'
			) {
				notation = new Notations.Turn(
					item === 'invertedturn' || item === 'invertedturnx',
					item === 'turnx' || item === 'invertedturnx',
				);
			} else if (item === 'arpeggio') {
				notation = new Notations.Arpeggio();
			} else if ((articulation = articulations.find((a) => a[0] === item))) {
				notation = new Notations.Articulation(articulation[1] as Notations.ArticulationType);
			} else if (['1', '2', '3', '4', '5'].includes(item)) {
				notation = new Notations.Fingering(+item);
			} else if (item === '+' || item === 'snap') {
				notation = new Notations.Pizzicato(item === 'snap' ? 'snap' : undefined);
			} else if (item === 'scoop') {
				notation = new Notations.Scoop();
			} else if (item === 'upbow' || item === 'downbow') {
				notation = new Notations.Bow(item === 'upbow' ? 'up' : 'down');
			} else if (item === 'open') {
				notation = new Notations.OpenString();
			} else if (item === 'thumb') {
				notation = new Notations.CelloThumb();
			} else if (item === 'breath') {
				notation = new Notations.BreathMark();
			} else if (item.slice(0, 5) === 'trill') {
				notation = this.processNotationDuration<Notations.Trill>(Notations.Trill, 'trill', item);
			} else if (item.slice(0, 5) === 'cresc') {
				notation = this.processNotationDuration<Notations.Crescendo>(
					Notations.Crescendo,
					'crescendo',
					item,
				);
			} else if (item.slice(0, 3) === 'dim') {
				notation = this.processNotationDuration<Notations.Diminuendo>(
					Notations.Diminuendo,
					'diminuendo',
					item,
				);
			} else if (item === 'editorial') {
				if (!note.printedAccidental) note.printedAccidental = { value: note.accidental! };
				note.printedAccidental.editorial = true;
			} else if (item === 'courtesy') {
				if (!note.printedAccidental) note.printedAccidental = { value: note.accidental! };
				note.printedAccidental.parentheses = true;
			}

			if (notation) {
				note.addNotation(notation);
			} else if (notation === undefined) {
				// only undefined, null means it was processed but no new notation added
				this.errors.push('Unknown notation ' + item);
			}
		});
	}

	processNotationDuration<T extends Notations.IDuration>(
		type: Notations.IDurationConstructor<T>,
		name: string,
		item: string,
	) {
		if (item.length <= name.length) {
			return new type();
		} else if (item.slice(name.length) === '(') {
			const notationDuration = new type();
			this.openNotations.push({ position: new Fraction(this.duration), item: notationDuration });
			return notationDuration;
		} else if (item.slice(name.length) === ')') {
			const index = this.openNotations.findIndex((obj) => obj.item instanceof type);
			if (index >= 0) {
				const obj = this.openNotations[index];
				const duration = this.duration.sub(obj.position);
				obj.item.duration = duration;
				this.openNotations.splice(index, 1);
				return null;
			}
		}
	}
}
