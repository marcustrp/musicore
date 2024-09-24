import Fraction from 'fraction.js';
import { Direction } from './directions.js';

export interface Notation {
  clone(): Notation;
} // tied to single note/rest
export interface IDurationConstructor<T> {
  new (duration?: Fraction): T;
}
export interface IDuration {
  duration?: Fraction | undefined;
}

// This file includes items that impelement both Direction and Notation

/**
 * @todo clone function should be implemented for all classes somehow...
 */

export class Fermata implements Notation, Direction {
  constructor(public inverted?: boolean) {}
  clone() {
    return new Fermata(this.inverted);
  }
}
export class Dynamic implements Notation, Direction {
  constructor(public text: string) {}
  clone() {
    return new Dynamic(this.text);
  }
}
export class Mordent implements Notation {
  constructor(public inverted?: boolean) {}
  clone() {
    return new Mordent(this.inverted);
  }
}
export class Roll implements Notation {
  clone() {
    return new Roll();
  }
}
export class Turn implements Notation {
  constructor(
    public inverted?: boolean,
    public line?: boolean,
    public delayed?: boolean,
    public vertical?: boolean,
  ) {}
  clone() {
    return new Turn(this.inverted, this.line, this.delayed, this.vertical);
  }
}
export class Arpeggio implements Notation {
  clone() {
    return new Arpeggio();
  }
}
// see https://www.w3.org/2021/06/musicxml40/musicxml-reference/elements/articulations/
export type ArticulationType =
  | 'accent'
  | 'marcato'
  | 'staccato'
  | 'tenuto'
  | 'staccatissimo'
  | 'spiccato'
  | 'scoop'
  | 'plop'
  | 'doit'
  | 'falloff'
  | 'breath-mark'
  | 'caesura'
  | 'stress'
  | 'unstress'
  | 'soft-accent';
export class Articulation implements Notation {
  constructor(public type: ArticulationType) {}
  clone() {
    return new Articulation(this.type);
  }
}
/** @todo maybe add OtherArticulation */
export class Fingering implements Notation {
  constructor(public finger: number) {}
  clone() {
    return new Fingering(this.finger);
  }
}
export class Pizzicato implements Notation {
  constructor(public type?: 'snap') {}
  clone() {
    return new Pizzicato(this.type);
  }
}
export class Bow implements Notation {
  constructor(public type: 'up' | 'down') {}
  clone() {
    return new Bow(this.type);
  }
}
export class Scoop implements Notation {
  clone() {
    return new Scoop();
  }
}
/** @todo Implement */
export class Harmonic implements Notation {
  clone() {
    return new Harmonic();
  }
}
export class OpenString implements Notation {
  clone() {
    return new OpenString();
  }
}
export class CelloThumb implements Notation {
  clone() {
    return new CelloThumb();
  }
}
export class BreathMark implements Notation {
  clone() {
    return new BreathMark();
  }
}

export class Trill implements Notation, IDuration {
  constructor(public duration?: Fraction) {}
  clone() {
    return new Trill(this.duration);
  }
}
export class Crescendo implements Notation, IDuration {
  constructor(public duration?: Fraction) {}
  clone() {
    return new Crescendo(this.duration);
  }
}
export class Diminuendo implements Notation, IDuration {
  constructor(public duration?: Fraction) {}
  clone() {
    return new Diminuendo(this.duration);
  }
}

/** @todo maybe add these from abc */
//!shortphrase!
//!mediumphrase!
//!longphrase!
