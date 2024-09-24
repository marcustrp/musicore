import * as abcjs from 'abcjs';

/**
 * Fixes missing types in abcjs, until they are fixed upstream.
 */

export type VoiceItemNote_FIX = {
	// marcustrp
	averagePitch: number;
	chord?: { name: string; position: string }[];
	duration: number;
	endBeam?: boolean;
	endTriplet?: boolean;
	lyric?: Lyric_m_FIX;
	maxpitch: number;
	minpitch: number;
	pitches: NotePitch_m_FIX[];
	startBeam?: boolean;
	startTriplet?: number;
	tripletMultiplier?: number;
	tripletR?: number;
	el_type: 'note';
	startChar: number;
	endChar: number;
};

export type NotePitch_m_FIX = {
	accidental?: abcjs.AccidentalName;
	pitch: number;
	name: string;
	startSlur?: Array<{ label: number }>;
	endSlur?: Array<number>;
	startTie?: {};
	endTie?: boolean;
	verticalPos: number;
	highestVert: number;
};

export type Lyric_m_FIX = {
	syllable: string;
	divider: ' ' | '-' | '_';
};
