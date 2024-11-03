import { SheetMusicLayout, type EngravingData } from '$lib/layout/scoreLayout.js';
import type { LayoutSettings } from '$lib/layout/types.js';
import type { BBox } from '$lib/utils/bBox.js';
import { Score } from '$lib/index.js';
import type {
	KeySignatureAccidentalEvent,
	NoteAccidentalEvent,
	NoteEvent,
} from './events/types.js';

/**
 * showBBoxes
 * viewBoxMinimum: Set default minimums for viewbox. It is for example useful to set
 * viewBoxMinimum to (0, -1000, 0, 0) to force a minimum y of -1000, to avoid rescaling
 * when adding b accidental to a note on the second ledger line in a note editor
 */
export type EngraverSettings = {
	showBBoxes?: boolean;
	viewBoxMinimum?: BBox;
	events?: {
		keySignature?: (event: KeySignatureAccidentalEvent) => boolean;
		note?: (event: NoteEvent) => boolean;
		noteAccidental?: (event: NoteAccidentalEvent) => boolean;
	};
	renderEditorsOnHover?: boolean;
	hoverState?: boolean;
};

export class ScoreEngraver {
	score: Score;
	settings: EngraverSettings;
	layoutSettings: LayoutSettings;
	scoreLayout: SheetMusicLayout;
	subscribed = false;
	callback?: (arg0: EngravingData) => void;

	constructor(score: Score, settings: EngraverSettings, layoutSettings: LayoutSettings) {
		this.score = score;
		this.settings = settings;
		this.layoutSettings = layoutSettings;
		this.scoreLayout = new SheetMusicLayout(score);
	}

	updateSettings(settings: EngraverSettings) {
		this.settings = settings;
		this.update();
	}

	update(triggerCallback = true) {
		const data = this.scoreLayout.layout(this.layoutSettings);
		if (triggerCallback) this.onUpdate(data);
		return data;
	}

	private onUpdate(data: EngravingData) {
		if (this.callback) this.callback(data);
	}

	register(callback: (arg0: EngravingData) => void) {
		this.callback = callback;

		if (!this.subscribed) {
			this.subscribed = true;
			this.scoreLayout.register((newData: EngravingData) => {
				this.onUpdate(newData);
			});
		}
	}

	unregister() {
		if (this.subscribed) this.scoreLayout.unregister();
		this.callback = undefined;
	}
}
