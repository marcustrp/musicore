/**
 * positive = sharps, negative = flats
 */
type KeySignatureData = {
    [key: string]: number;
};
declare const majorKeyAccidentals: KeySignatureData;
/** Offset in number of accidentals, where # are positive and b are negative */
declare const modeOffsets: {
    [key: string]: number;
};
/**
 * Position 0 is at top line
 */
declare const keySignaturePosition: {
    [key: string]: number[];
};
export { keySignaturePosition, majorKeyAccidentals, modeOffsets };
//# sourceMappingURL=keys.d.ts.map