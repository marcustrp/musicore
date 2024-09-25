<script lang="ts">
	import type { Glyph } from '../../routes/tools/font/font.js';

	type SvgData = {
		char: string;
		svgData: Glyph[][];
	};
	const { svgData, char }: SvgData = $props();
	const topMargin = 60;
	const leftMargin = 40;
	const lineHeight = 70;
	const colWidth = 80;
	const itemsPerRow = 12;
</script>

<div style="background-color: gray;height:100px;width:100%">
	<h1>SVG Char: {char}</h1>
</div>
<div>
	<svg height="200" width="800">
		<g>
			{#each svgData as item, index}
				{#each item as data}
					{#if data.glyphName === char}
						<path
							transform="rotate(180, {leftMargin + colWidth * (index % itemsPerRow)},{topMargin +
								lineHeight * Math.floor(index / itemsPerRow)}) translate({leftMargin +
								colWidth * (index % itemsPerRow)},{topMargin +
								lineHeight * Math.floor(index / itemsPerRow)}) scale(-0.05,0.05)"
							d={data.d}
							fill="black"
						/>
					{/if}
				{/each}
			{/each}
		</g>
	</svg>
</div>
