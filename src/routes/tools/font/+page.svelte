<script lang="ts">
	import { Font } from './font.js';

	const font = new Font('bravura');

	let data = `import { type Font } from './types.js';
import { BBox } from '$lib/utils/bBox.js';

/**
 * to update this file
 * - add desired glyps to glyphNames in src/lib/fonts/types.ts
 * - then go to src/routes/tools/font, copy the output from the textarea and paste it here
 */

export const bravura: Font = {
glyphs: {`;
	data += font
		.getAllGlyphs()
		.map((glyph) => {
			let str = `'${glyph.key}': {
  horizAdvX: ${glyph.horizAdvX},
  d: \`${glyph.d}\`,
  bBox: new BBox(${glyph.bBox.x}, ${glyph.bBox.y}, ${glyph.bBox.width}, ${glyph.bBox.height}),`;
			if (glyph.anchors) {
				str += `anchors: {`;
				Object.keys(glyph.anchors).map((anchor) => {
					// @ts-expect-error: TS doesn't like the type of the object here...
					str += `${anchor}: [${glyph.anchors[anchor][0] * 250}, ${glyph.anchors[anchor][1] * 250}],`;
				});
				str += `},`;
			}
			return str + '},';
		})
		.join('\n');

	data += `}, metadata: {`;
	data +=
		Object.entries(font.getEngravingDefaults())
			.map(([key, value]) => {
				let procValue: string;

				if (Array.isArray(value)) {
					procValue = `['${value.join("', '")}']`;
				} else {
					procValue = (value * 250).toString();
				}
				return `${key}: ${procValue},`;
			})
			.join('\n') + `}}`;
</script>

Bravura:
<textarea class="h-96 w-full">{data}</textarea>
