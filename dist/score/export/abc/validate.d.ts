import { Score } from '../../score.js';
import { type ReportFunction } from '../abc.js';
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
export declare const validateScore: (score: Score, addWarning: ReportFunction, addError: ReportFunction) => void;
//# sourceMappingURL=validate.d.ts.map