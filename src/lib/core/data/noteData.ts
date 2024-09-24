import { Accidentals, NoteAccidentals } from '../note.js';

/**
 *
 * @param offset number of halv steps from natural note
 * @param withFormatting
 * @returns
 * @example 1 is '#', -1 is 'b', 0 is ''
 * @example 2 is 'x', -2 is 'bb'
 *
 * @todo should this function really support formatting?
 */
function getAccidental(step: number, withFormatting = false) {
	switch (step) {
		case -2:
			return withFormatting == true ? '<sup>bb</sup>' : 'bb';
		case -1:
			return withFormatting == true ? '<sup>b</sup>' : 'b';
		case 0:
			return '';
		case 1:
			return withFormatting == true ? '<sup>#</sup>' : '#';
		case 2:
			return withFormatting == true ? '<sup>x</sup>' : 'x';
		default:
			return '';
	}
}

export const stepToAccidental: { [key: number]: NoteAccidentals } = {
	'-2': 'bb',
	'-1': 'b',
	'1': '#',
	'2': 'x',
	'0': 'n',
};

export const accidentalToStep: { [key in NoteAccidentals]: number } = {
	bb: -2,
	b: -1,
	'#': 1,
	x: 2,
	n: 0,
	nb: -1,
	'n#': 1,
};

// used to get base notename form number (0-7)
// also used in calculation of scale note names
let naturalNoteNames = [
	{ name: 'c', stepsFromPrevious: 1 },
	{ name: 'd', stepsFromPrevious: 2 },
	{ name: 'e', stepsFromPrevious: 2 },
	{ name: 'f', stepsFromPrevious: 1 },
	{ name: 'g', stepsFromPrevious: 2 },
	{ name: 'a', stepsFromPrevious: 2 },
	{ name: 'b', stepsFromPrevious: 2 },
];
/**
 * All 7 natural note names, with number of halv steps from previous natural note
 * @example naturalNoteNames[0] is {name: 'c', stepsFromPrevious: 1}
 */
export { naturalNoteNames };

// see export for documentation
let nameToNoteIndex: { [key: string]: number } = {};
let noteNumberToNoteIndex: { [key: string]: number } = {};
let curStep = 0;
// loop through natural notes
for (var i = 0; i < 7; i++) {
	// do bb, b, natural, # and x for all natural notes
	for (var j = 0; j < 5; j++) {
		const number = (12 + curStep + j - 2) % 12;
		nameToNoteIndex[naturalNoteNames[i].name + getAccidental(j - 2)] = number;
		noteNumberToNoteIndex[getAccidental(j - 2) + (i + 1)] = number;
	}
	curStep += naturalNoteNames[(i + 1) % 7].stepsFromPrevious;
}

/**
 * Object with noteName to note number for all notes with up to two accidentals
 * @example nameToNoteIndex['c'] is 0
 * @example nameToNoteIndex['bbb'] is 9
 * @example nameToNoteIndex['bb'] is 10
 * @example nameToNoteIndex['b'] is 11
 * @example nameToNoteIndex['b#'] is 0
 * @example nameToNoteIndex['bx'] is 1
 * @todo variable might need to be renamed
 */
export { nameToNoteIndex };
/**
 * Object with scaleNumber to note number for all notes with up to two accidentals
 * @example noteNumberToNoteIndex['1'] is 0
 * @example noteNumberToNoteIndex['b2'] is 1)
 * @example noteNumberToNoteIndex['7'] is 11
 * @todo variable might need to be renamed
 */
export { noteNumberToNoteIndex };

/*
	Create names for all notes in an octave (12) for 36 root notes (scales)
*/
let noteIndexToNameInScale: { [key: string]: { [key: number]: { text: string; html: string } } } =
	{};
//let noteIndexToNameInScaleGerman = new Object();
let stepsToNumber = [1, 1, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7];

curStep = 0;
let scaleStep = 0;
let lastScaleNumber = 1;
for (var i = 0; i < 7; i++) {
	// loop through white notes
	for (var j = 0; j < 3; j++) {
		// do b, # and natural for all white notes
		curStep = j - 1;
		lastScaleNumber = 1;
		scaleStep = 0;
		// set scale object name, like c# or eb
		let scaleName = naturalNoteNames[i].name + getAccidental(curStep, false);
		noteIndexToNameInScale[scaleName] = {};
		//noteIndexToNameInScaleGerman[scaleName] = new Object();
		for (var k = 0; k < stepsToNumber.length; k++) {
			if (lastScaleNumber != stepsToNumber[k]) {
				lastScaleNumber = stepsToNumber[k];
				scaleStep += naturalNoteNames[(i + lastScaleNumber - 1) % 7].stepsFromPrevious;
			}
			noteIndexToNameInScale[scaleName][k] = {
				text:
					naturalNoteNames[(i + lastScaleNumber - 1) % 7].name +
					getAccidental(curStep - scaleStep, false),
				html:
					naturalNoteNames[(i + lastScaleNumber - 1) % 7].name + getAccidental(curStep - scaleStep),
			};
			/*let germanPlain = noteIndexToNameInScale[scaleName][k].text;
			let germanHtml = noteIndexToNameInScale[scaleName][k].html;
			if (germanPlain == 'b') {
				germanPlain = 'h';
				germanHtml = 'h';
			} else if (germanPlain == 'bb') {
				germanPlain = 'b';
				germanHtml = 'b';
			}
			noteIndexToNameInScaleGerman[scaleName][k] = {
				text: germanPlain,
				html: germanHtml
			};*/
			curStep++;
		}
	}
}
/**
 * Default note names for all notes in a standard major scale.
 * Used alterations are #1, b3, #4, b6 and b7.
 * @example noteIndexToNameInScale['c#'][0] is {text: 'c#', ...}
 * @example noteIndexToNameInScale['a'][3] is {text: 'c', ...}
 * @todo remove html from this object
 */
export { noteIndexToNameInScale as noteIndexToNameInScale };
//, noteIndexToNameInScaleGerman};
