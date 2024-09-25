import * as abcjs from 'abcjs';
import { type KeyMode } from '../../../core/data/modes.js';
import { Key } from '../../../core/key.js';
import { TimeSignature } from '../../../core/timeSignature.js';
import { AbcImportState } from '../abc.js';
import * as mappers from './data/mappers.js';

export default class HeaderParser {
	constructor(private state: AbcImportState) {}

	getKey(abcKey: abcjs.KeySignature) {
		const root = this.getKeyRoot(abcKey);
		const mode: KeyMode = abcKey.mode in mappers.keyMode ? mappers.keyMode[abcKey.mode] : 'major';
		return new Key(root, mode);
	}

	getKeyRoot(abcKey: abcjs.KeySignature) {
		let root = '';
		switch (abcKey.root) {
			case 'HP':
			case 'Hp':
			case 'none':
				this.state.errors.push(`Unsupported key root '${abcKey.root}, defaulting to c`);
				root = 'c';
				break;
			default:
				root = abcKey.root.toLowerCase();
		}
		root += abcKey.acc;
		return root;
	}

	getTimeSignature(abcTimeSignature: abcjs.Meter) {
		switch (abcTimeSignature.type) {
			case 'common_time':
				return new TimeSignature('common');
			case 'cut_time':
				return new TimeSignature('cut');
			case 'specified':
				if (abcTimeSignature.value) {
					if (abcTimeSignature.value.length > 1)
						this.state.errors.push('Multiple timeSignature.value, only using first!');
					return new TimeSignature(
						+abcTimeSignature.value[0].num,
						abcTimeSignature.value[0].den ? +abcTimeSignature.value[0].den : undefined,
					);
				} else {
					throw new Error('No value for timeSignature specified');
				}
				break;
			case 'tempus_imperfectum':
			case 'tempus_imperfectum_prolatio':
			case 'tempus_perfectum':
			case 'tempus_perfectum_prolatio':
				throw new Error(`Unsupported timeSignature '${abcTimeSignature.type}`);
		}
	}
}
