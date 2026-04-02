import Fraction from 'fraction.js';
import {} from './directions.js';
// This file includes items that impelement both Direction and Notation
/**
 * @todo clone function should be implemented for all classes somehow...
 */
export class Fermata {
    inverted;
    constructor(inverted) {
        this.inverted = inverted;
    }
    clone() {
        return new Fermata(this.inverted);
    }
}
export class Dynamic {
    text;
    constructor(text) {
        this.text = text;
    }
    clone() {
        return new Dynamic(this.text);
    }
}
export class Mordent {
    inverted;
    constructor(inverted) {
        this.inverted = inverted;
    }
    clone() {
        return new Mordent(this.inverted);
    }
}
export class Roll {
    clone() {
        return new Roll();
    }
}
export class Turn {
    inverted;
    line;
    delayed;
    vertical;
    constructor(inverted, line, delayed, vertical) {
        this.inverted = inverted;
        this.line = line;
        this.delayed = delayed;
        this.vertical = vertical;
    }
    clone() {
        return new Turn(this.inverted, this.line, this.delayed, this.vertical);
    }
}
export class Arpeggio {
    clone() {
        return new Arpeggio();
    }
}
export class Articulation {
    type;
    constructor(type) {
        this.type = type;
    }
    clone() {
        return new Articulation(this.type);
    }
}
/** @todo maybe add OtherArticulation */
export class Fingering {
    finger;
    constructor(finger) {
        this.finger = finger;
    }
    clone() {
        return new Fingering(this.finger);
    }
}
export class Pizzicato {
    type;
    constructor(type) {
        this.type = type;
    }
    clone() {
        return new Pizzicato(this.type);
    }
}
export class Bow {
    type;
    constructor(type) {
        this.type = type;
    }
    clone() {
        return new Bow(this.type);
    }
}
export class Scoop {
    clone() {
        return new Scoop();
    }
}
/** @todo Implement */
export class Harmonic {
    clone() {
        return new Harmonic();
    }
}
export class OpenString {
    clone() {
        return new OpenString();
    }
}
export class CelloThumb {
    clone() {
        return new CelloThumb();
    }
}
export class BreathMark {
    clone() {
        return new BreathMark();
    }
}
export class Trill {
    duration;
    constructor(duration) {
        this.duration = duration;
    }
    clone() {
        return new Trill(this.duration);
    }
}
export class Crescendo {
    duration;
    constructor(duration) {
        this.duration = duration;
    }
    clone() {
        return new Crescendo(this.duration);
    }
}
export class Diminuendo {
    duration;
    constructor(duration) {
        this.duration = duration;
    }
    clone() {
        return new Diminuendo(this.duration);
    }
}
/** @todo maybe add these from abc */
//!shortphrase!
//!mediumphrase!
//!longphrase!
