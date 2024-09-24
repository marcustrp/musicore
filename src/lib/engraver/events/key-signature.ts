import type { KeySignatureAccidentalEvent } from './types.js';

export const keySignatureEventHandler = (event: KeySignatureAccidentalEvent): boolean => {
	event.score.bars.bars[0].key.toggleAccidental(
		event.column,
		event.position,
		event.accidental,
		event.clef
	);
	return true;
};
