import { SheetMusicLayout } from '../layout/scoreLayout.js';
import { Score } from '../index.js';
export class ScoreEngraver {
    score;
    settings;
    layoutSettings;
    scoreLayout;
    subscribed = false;
    callback;
    constructor(score, settings, layoutSettings) {
        this.score = score;
        this.settings = settings;
        this.layoutSettings = layoutSettings;
        this.scoreLayout = new SheetMusicLayout(score);
    }
    updateSettings(settings) {
        this.settings = settings;
        this.update();
    }
    update(triggerCallback = true) {
        const data = this.scoreLayout.layout(this.layoutSettings);
        if (triggerCallback)
            this.onUpdate(data);
        return data;
    }
    onUpdate(data) {
        if (this.callback)
            this.callback(data);
    }
    register(callback) {
        this.callback = callback;
        if (!this.subscribed) {
            this.subscribed = true;
            this.scoreLayout.register((newData) => {
                this.onUpdate(newData);
            });
        }
    }
    unregister() {
        if (this.subscribed)
            this.scoreLayout.unregister();
        this.callback = undefined;
    }
}
