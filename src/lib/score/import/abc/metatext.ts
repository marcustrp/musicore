import * as abcjs from 'abcjs';
import { AbcImportState } from '../abc.js';
import { Score } from '../../score.js';

export class MetaTextParser {
	constructor(private state: AbcImportState) {}

	parse(metaText: abcjs.MetaText, score: Score) {
		if (metaText.title) score.addWorkInformation('title', metaText.title);
		if (metaText.author) score.addWorkInformation('lyrics', metaText.author);
		if (metaText.composer) score.addWorkInformation('composer', metaText.composer);
		if (metaText.history) score.addWorkInformation('history', metaText.history);

		if (metaText.transcription) score.addInformation('transcription', metaText.transcription);
		if (metaText['abc-copyright'])
			score.addInformation('transcription.copyright', metaText['abc-copyright']);
		if (metaText['abc-creator'])
			score.addInformation('transcription.creator', metaText['abc-creator']);
		if (metaText['abc-edited-by'])
			score.addInformation('transcription.editedBy', metaText['abc-edited-by']);

		if (metaText.book) score.addInformation('books', metaText.book);
		//if (metaText.decorationPlacement) score.addInformation(, metaText.decorationPlacement);
		if (metaText.discography) score.addInformation('discography', metaText.discography);
		//if (metaText.footer) score.addInformation(, metaText.footer);
		if (metaText.group) score.addInformation('group', metaText.group);
		//if (metaText.header) score.addInformation(, metaText.header);
		if (metaText.instruction) score.addInformation('instruction', metaText.instruction);
		//if (metaText.measurebox) score.addInformation(, metaText.measurebox);
		if (metaText.notes) score.addInformation('notes', metaText.notes);
		if (metaText.origin) score.addInformation('origin', metaText.origin);
		if (metaText.partOrder)
			this.state.errors.push('metaText.partOrder not supported: ' + metaText.partOrder); //score.addInformation(, metaText.partOrder);
		if (metaText.rhythm) score.addInformation('type', metaText.rhythm);
		if (metaText.source) score.addInformation('source', metaText.source);
		if (metaText.textBlock) score.addVerse(metaText.textBlock);
		if (metaText.url) score.addInformation('url', metaText.url);

		if (metaText.unalignedWords) {
			metaText.unalignedWords.forEach((verse) => {
				if (typeof verse === 'string') {
					score.addVerse(verse);
				} else {
					score.addVerse(verse.text);
				}
			});
		}
		if (metaText.tempo) {
			this.state.errors.push('metaText.tempo not supported: ' + metaText.tempo);
		}
	}
}
