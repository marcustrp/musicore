export type ModifierItem = {
    type: 'octave-shift';
    data: string | number;
};
export declare class ModifierParser {
    private errors;
    constructor(errors: string[]);
    parse(item: string): ModifierItem | undefined;
}
//# sourceMappingURL=modifiers.d.ts.map