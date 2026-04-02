import { type Direction } from '../../core/data/directions.js';
import { Note } from '../../core/note.js';
import { Rest } from '../../core/rest.js';
import { Score } from '../score.js';
import { type BarItem } from './musicString/bar.js';
import { type BodyItem } from './musicString/body.js';
import { type InformationItem } from './musicString/information.js';
import { type ModifierItem } from './musicString/modifiers.js';
import { Spacer } from './musicString/spacer.js';
export declare class MusicStringImporter {
    score: Score;
    info: InformationItem;
    octave: number;
    musicString: string;
    errors: string[];
    noteBuffer: Note[];
    activeTriplet?: {
        p: number;
        q: number;
        r: number;
        currentIndex: number;
        notes: (Note | Rest)[];
    };
    parse(musicString: string): Score;
    splitMusicString(musicString: string): string[];
    initScore(info: InformationItem): void;
    createScore(info: InformationItem): void;
    handleBarItem(item: BarItem): void;
    addDirections(directions: Direction[]): void;
    addLineBreak(): void;
    handleModifierItem(item: ModifierItem): void;
    handleBodyItems(items: BodyItem[]): void;
    handleBodyItem(item: Note | Rest | Spacer): void;
}
//# sourceMappingURL=musicString.d.ts.map