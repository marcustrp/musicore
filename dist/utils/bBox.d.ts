export declare class BBox {
    x: number;
    y: number;
    height: number;
    width: number;
    constructor(x?: number, y?: number, width?: number, height?: number);
    setXY(x: number, y: number): void;
    merge(bbox: BBox): this;
    toObject(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    static fromObject(obj: {
        x: number;
        y: number;
        width: number;
        height: number;
    }): BBox;
    clone(): BBox;
    static clone(bbox: BBox | undefined): BBox;
}
//# sourceMappingURL=bBox.d.ts.map