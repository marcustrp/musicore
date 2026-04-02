import Fraction from 'fraction.js';
import { type Direction } from './directions.js';
export interface Notation {
    clone(): Notation;
}
export interface IDurationConstructor<T> {
    new (duration?: Fraction): T;
}
export interface IDuration {
    duration?: Fraction | undefined;
}
/**
 * @todo clone function should be implemented for all classes somehow...
 */
export declare class Fermata implements Notation, Direction {
    inverted?: boolean | undefined;
    constructor(inverted?: boolean | undefined);
    clone(): Fermata;
}
export declare class Dynamic implements Notation, Direction {
    text: string;
    constructor(text: string);
    clone(): Dynamic;
}
export declare class Mordent implements Notation {
    inverted?: boolean | undefined;
    constructor(inverted?: boolean | undefined);
    clone(): Mordent;
}
export declare class Roll implements Notation {
    clone(): Roll;
}
export declare class Turn implements Notation {
    inverted?: boolean | undefined;
    line?: boolean | undefined;
    delayed?: boolean | undefined;
    vertical?: boolean | undefined;
    constructor(inverted?: boolean | undefined, line?: boolean | undefined, delayed?: boolean | undefined, vertical?: boolean | undefined);
    clone(): Turn;
}
export declare class Arpeggio implements Notation {
    clone(): Arpeggio;
}
export type ArticulationType = 'accent' | 'marcato' | 'staccato' | 'tenuto' | 'staccatissimo' | 'spiccato' | 'scoop' | 'plop' | 'doit' | 'falloff' | 'breath-mark' | 'caesura' | 'stress' | 'unstress' | 'soft-accent';
export declare class Articulation implements Notation {
    type: ArticulationType;
    constructor(type: ArticulationType);
    clone(): Articulation;
}
/** @todo maybe add OtherArticulation */
export declare class Fingering implements Notation {
    finger: number;
    constructor(finger: number);
    clone(): Fingering;
}
export declare class Pizzicato implements Notation {
    type?: "snap" | undefined;
    constructor(type?: "snap" | undefined);
    clone(): Pizzicato;
}
export declare class Bow implements Notation {
    type: 'up' | 'down';
    constructor(type: 'up' | 'down');
    clone(): Bow;
}
export declare class Scoop implements Notation {
    clone(): Scoop;
}
/** @todo Implement */
export declare class Harmonic implements Notation {
    clone(): Harmonic;
}
export declare class OpenString implements Notation {
    clone(): OpenString;
}
export declare class CelloThumb implements Notation {
    clone(): CelloThumb;
}
export declare class BreathMark implements Notation {
    clone(): BreathMark;
}
export declare class Trill implements Notation, IDuration {
    duration?: Fraction | undefined;
    constructor(duration?: Fraction | undefined);
    clone(): Trill;
}
export declare class Crescendo implements Notation, IDuration {
    duration?: Fraction | undefined;
    constructor(duration?: Fraction | undefined);
    clone(): Crescendo;
}
export declare class Diminuendo implements Notation, IDuration {
    duration?: Fraction | undefined;
    constructor(duration?: Fraction | undefined);
    clone(): Diminuendo;
}
/** @todo maybe add these from abc */
//# sourceMappingURL=notations.d.ts.map