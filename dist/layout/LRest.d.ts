import { LRhythmElement } from './LRhythmElement.js';
export type RestLayout = ReturnType<LRest['toObject']>;
export declare class LRest extends LRhythmElement {
    toObject(barIndex: number): {
        objectType: "rest";
        x: number;
        y: number;
        type: import("../index.js").NoteType;
        dots: number | undefined;
        barIndex: number;
    };
}
//# sourceMappingURL=LRest.d.ts.map