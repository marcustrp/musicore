// See also notations.ts for more directions
export class Coda {
    type;
    index;
    constructor(type, index = 0) {
        this.type = type;
        this.index = index;
    }
}
export class Segno {
    type;
    index;
    _al;
    get al() {
        return this._al;
    }
    set al(text) {
        if (this.type !== 'from')
            throw new Error('cannot set al on type ' + this.type);
        this._al = text;
    }
    _extra;
    get extra() {
        return this._extra;
    }
    set extra(text) {
        if (this.type !== 'from')
            throw new Error('cannot set extra on type ' + this.type);
        this._extra = text;
    }
    constructor(type, al, index = 0) {
        this.type = type;
        this.index = index;
        if (al)
            this.al = al;
    }
}
export class DaCapo {
    al;
    extra;
    constructor(al) {
        if (al)
            this.al = al;
    }
}
export class Fine {
}
