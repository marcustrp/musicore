import { TimeSignature } from '../../../core/timeSignature.js';
import { Score } from '../../score.js';
import { ReportFunction } from '../abc.js';

/**
 * Validate a score before exporting
 * - add a warning if the score includes unsupported features
 * - throw an error if the score is not valid (e.g. no bars or no parts)
 * @param score
 * @param addWarning
 * @param addError
 *
 * @todo Add check for key change
 * @todo Add check for missing key
 */
export const validateScore = (
	score: Score,
	addWarning: ReportFunction,
	addError: ReportFunction,
) => {
	if (score.bars.bars.length === 0) throw new Error('No bars in score');
	let previousTimeSignature: TimeSignature;
	if (
		score.bars.bars.filter((bar) => {
			let diff = false;
			if (
				!bar.pickup &&
				(!previousTimeSignature ||
					!(
						bar.timeSignature.count === previousTimeSignature.count &&
						bar.timeSignature.unit === previousTimeSignature.unit
					))
			) {
				diff = true;
			}
			previousTimeSignature = bar.timeSignature;
			return diff;
		}).length > 1
	)
		throw new Error('TimeSignature change not supported');

	//if (score.key.length > 1) throw new Error('Key change not supported');
	//if (score.key.length === 0) throw new Error('No key was set');

	if (score.parts.getPartCount() === 0) addError('No part in score');
	if (score.parts.getPartCount() > 1) addWarning('Only first part will be exported');
	if (score.parts.getPart(0).getStaffCount() === 0) addError('No stave in score');
	if (score.parts.getPart(0).getStaffCount() > 1) addWarning('Only first stave will be exported');
	if (score.parts.getPart(0).getVoiceCount() > 1) addWarning('Only first voice will be exported');
	//if (score.parts.getPart(0).getClefCount(0) === 0) addError('No clef in score');
	//if (score.parts.getPart(0).getClefCount(0) > 1) addError('Clef change is not supported');
};
