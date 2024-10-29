<script lang="ts">
	import type { GlyphNames } from '$lib/fonts/types.js';
	import { bravura } from '$lib/fonts/bravura.js';

	type Props = {
		glyphName: GlyphNames;
		selected: boolean;
		onclick: (arg0: GlyphNames) => void;
	};
	let { glyphName, selected, onclick }: Props = $props();

	const glyph = bravura.glyphs[glyphName];
</script>

<button
	onclick={() => onclick(glyphName)}
	aria-label={glyphName}
	class="group size-8 h-20 w-12 rounded-lg border-2 border-gray-500 {selected ? 'bg-orange-300' : (
		''
	)} hover:bg-orange-200"
>
	<svg
		class="mx-auto my-auto"
		style="width: {Math.floor(glyph.bBox.width / 14)}px; height:{Math.floor(
			glyph.bBox.height / 14,
		)}px"
		viewBox="{glyph.bBox.x},{glyph.bBox.y},{glyph.bBox.width},{glyph.bBox.height}"
	>
		<path
			class="group-hover:fill-slate-400"
			transform="rotate(180, 0, 0) scale(-1,1)"
			fill="black"
			d={glyph.d}
		/>
	</svg>
</button>
