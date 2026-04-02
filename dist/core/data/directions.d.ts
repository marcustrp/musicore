/** @todo find a solution to this, or remove interface? */
export interface Direction {
}
export declare class Coda implements Direction {
    type: 'from' | 'to';
    index: number;
    constructor(type: 'from' | 'to', index?: number);
}
export declare class Segno implements Direction {
    type: 'from' | 'to';
    index: number;
    private _al?;
    get al(): "coda" | "fine" | undefined;
    set al(text: 'coda' | 'fine' | undefined);
    _extra?: string;
    get extra(): string | undefined;
    set extra(text: string | undefined);
    constructor(type: 'from' | 'to', al?: 'coda' | 'fine', index?: number);
}
export declare class DaCapo implements Direction {
    al?: 'coda' | 'fine';
    extra?: string;
    constructor(al?: 'coda' | 'fine');
}
export declare class Fine implements Direction {
}
//# sourceMappingURL=directions.d.ts.map