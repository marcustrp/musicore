export type ClefType =
	| 'g'
	| 'f'
	| 'c'
	| 'treble'
	| 'bass'
	| 'baritone'
	| 'tenor'
	| 'alto'
	| 'mezzosoprano'
	| 'soprano'
	| 'perc'
	| 'none';

export type ClefSymbol = 'g' | 'f' | 'c' | 'perc' | 'none';

export class Clef {
	octaveChange?: 2 | 1 | -1 | -2;
	/** The line which the clef is positioned on, first line is top line */
	clefLine?: number;
	/** Number of staff lines */
	staffLines?: number;
	symbol!: ClefSymbol;
	name?: string;
	type: ClefType;

	constructor(type: ClefType = 'g', line?: number, octaveChange?: 2 | 1 | -1 | -2) {
		this.type = type;
		this.setType(type, line);
		if (octaveChange) this.octaveChange = octaveChange;
	}

	setType(type: ClefType, line?: number) {
		switch (type) {
			case 'treble':
				this.name = 'treble';
				this.symbol = 'g';
				break;
			case 'g':
				this.symbol = 'g';
				if (line) this.clefLine = line;
				break;
			case 'bass':
				this.name = 'bass';
				this.symbol = 'f';
				break;
			case 'f':
				this.symbol = 'f';
				if (line) this.clefLine = line;
				break;
			case 'baritone':
				this.name = 'baritone';
				this.symbol = 'f';
				this.clefLine = 3;
				break;
			case 'tenor':
				this.name = 'tenor';
				this.symbol = 'c';
				this.clefLine = 4;
				break;
			case 'alto':
				this.name = 'alto';
				this.symbol = 'c';
				this.clefLine = 3;
				break;
			case 'mezzosoprano':
				this.name = 'mezzosoprano';
				this.symbol = 'c';
				this.clefLine = 2;
				break;
			case 'soprano':
				this.name = 'soprano';
				this.symbol = 'c';
				this.clefLine = 1;
				break;
			case 'c':
				this.symbol = 'c';
				if (line) this.clefLine = line;
				break;
			case 'perc':
				this.symbol = 'perc';
				break;
			case 'none':
				this.symbol = 'none';
				break;
			default:
				this.symbol = 'g';
		}
	}
}
