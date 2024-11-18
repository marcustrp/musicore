import type { NoteSize } from './rhythmElement.js';

export type Style = {
	color?: string;
	size?: NoteSize;
};

export class Styles {
	static processStyles(styleData: string) {
		const styles: Style = {};
		const items = styleData.split(';');
		items.forEach((item) => {
			const data = item.split(':');
			Styles.setStyle(styles, data[0], data[1]);
		});
		return styles;
	}

	static setStyle(style: Style, key: string, value: string) {
		switch (key) {
			case 'c':
			case 'color':
				style.color = Styles.getColor(value);
				break;
			case 's':
			case 'size':
				style.size = Styles.getSize(value);
				break;
		}
	}

	static getColor(value: string) {
		switch (value) {
			case 'r':
				return 'red';
			case 'g':
				return 'green';
			case 'b':
				return 'blue';
			case 'w':
				return 'white';
			case 's':
				return 'silver';
			case 'p':
				return 'purple';
			case 'l':
				return 'lime';
			case 'y':
				return 'yellow';
			case 't':
				return 'teal';
			case 'a':
				return 'aqua';
			case 'm':
				return 'maroon';
			case 'f':
				return 'fuchsia';
			case 'o':
				return 'orange';
			case 'n':
				return 'navy';
			default:
				return value;
		}
	}

	static getSize(value: string) {
		switch (value) {
			case 't':
			case 'tiny':
			case 'tiny':
				return 'tiny';
			case 's':
			case 'small':
				return 'small';
			case 'n':
			case 'normal':
				return 'normal';
			case 'l':
			case 'large':
				return 'large';
			default:
				console.warn(`Unknown size: ${value}`);
				return 'normal';
		}
	}
}
