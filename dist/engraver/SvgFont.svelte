<script lang="ts">
	import type { Glyph } from '../../routes/tools/font/font.js';

	type SvgData = {
		setChar: (char: string) => void;
		svgSetName: string;
		svgData: Glyph[];
	};

	const { setChar, svgData, svgSetName }: SvgData = $props();
	const topMargin = 40;
	const lineHeight = 70;
	const colWidth = 80;
	const itemsPerRow = 12;
</script>

<div style="background-color: gray;height:100px;width:100%">
	<h1>SVG Font {svgSetName}</h1>
</div>
<div>
	<svg
		height={topMargin + (svgData.length / itemsPerRow) * lineHeight}
		width={itemsPerRow * colWidth}
	>
		<g>
			{#each svgData as data, index}
				{#if data.d}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<path
						onclick={() => setChar(data.glyphName)}
						transform="rotate(180, {colWidth * (index % itemsPerRow)},{topMargin +
							lineHeight * Math.floor(index / itemsPerRow)}) translate({colWidth *
							(index % itemsPerRow)},{topMargin +
							lineHeight * Math.floor(index / itemsPerRow)}) scale(-0.05,0.05)"
						d={data.d}
						fill="black"
					/>
				{/if}
			{/each}
		</g>
	</svg>
</div>
