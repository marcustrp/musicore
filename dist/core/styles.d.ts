import type { NoteSize } from './rhythmElement.js';
export type Style = {
    color?: string;
    size?: NoteSize;
};
export declare class Styles {
    static processStyles(styleData: string): Style;
    static setStyle(style: Style, key: string, value: string): void;
    static getColor(value: string): string;
    static getSize(value: string): "tiny" | "small" | "normal" | "large";
}
//# sourceMappingURL=styles.d.ts.map