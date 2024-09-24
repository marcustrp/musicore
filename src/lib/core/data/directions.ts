export interface Direction {} // not tied to single note/rest

// See also notations.ts for more directions

export class Coda implements Direction {
	constructor(
		public type: 'from' | 'to',
		public index = 0,
	) {}
}
export class Segno implements Direction {
	private _al?: 'coda' | 'fine';
	get al() {
		return this._al;
	}
	set al(text: 'coda' | 'fine' | undefined) {
		if (this.type !== 'from') throw new Error('cannot set al on type ' + this.type);
		this._al = text;
	}
	_extra?: string;
	get extra() {
		return this._extra;
	}
	set extra(text: string | undefined) {
		if (this.type !== 'from') throw new Error('cannot set extra on type ' + this.type);
		this._extra = text;
	}
	constructor(
		public type: 'from' | 'to',
		al?: 'coda' | 'fine',
		public index = 0,
	) {
		if (al) this.al = al;
	}
}
export class DaCapo implements Direction {
	al?: 'coda' | 'fine';
	extra?: string;
	constructor(al?: 'coda' | 'fine') {}
}
export class Fine implements Direction {}
