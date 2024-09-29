export type Style = {
	color?: string;
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
			case 'color':
				style.color = value;
		}
	}
}
