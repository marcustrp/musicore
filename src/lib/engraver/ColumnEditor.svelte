<script module lang="ts">
	export type ColumnEditorEvent = {
		editorIndex: number;
		barIndex: number;
		index: number;
		position: number;
		data?: string;
	};
</script>

<script lang="ts">
	import type { EColumnEditor } from '$lib/layout/LColumnEditor.js';

	/** Should be merged with ColumnEditor */
	type MyProps = {
		columnEditor: EColumnEditor;
		editorIndex: number;
		event: (arg0: ColumnEditorEvent) => void;
	};
	const { columnEditor, editorIndex, event }: MyProps = $props();

	console.log('####COLUMNEDITOR', columnEditor);

	let hoverIndex = $state(-1);
</script>

<g class="column-editor">
	<rect
		x={columnEditor.bBox.x}
		y={columnEditor.bBox.y}
		width={columnEditor.bBox.width}
		height={columnEditor.bBox.height}
		fill="silver"
		fill-opacity="0.2"
		stroke="silver"
		stroke-width="10"
		stroke-opacity="0.4"
		rx="50"
	/>

	{#each columnEditor.items as item, index}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<g>
			<!-- svelte-ignore a11y_mouse_events_have_key_events -->
			<rect
				class="peer opacity-0"
				onmouseover={() => {
					hoverIndex = index;
				}}
				onmouseout={() => {
					hoverIndex = -1;
				}}
				onclick={() =>
					event({
						editorIndex,
						index,
						barIndex: columnEditor.barIndex,
						position: item.position,
						data: columnEditor.dataValue,
					})}
				fill="black"
				x={item.x}
				y={item.y - 62.5}
				width={columnEditor.bBox.width}
				height="125"
			/>
			<path
				class="pointer-events-none opacity-0 peer-hover:opacity-50 {hoverIndex === index ?
					'opacity-50'
				:	'opacity-0'}"
				transform="rotate(180, {item.x},{item.y}) translate({item.x},{item.y}) scale(-1,1)"
				fill="black"
				d={columnEditor.glyph.d}
			/>
		</g>
	{/each}

	{#if columnEditor.ledgerLines && (columnEditor.ledgerLines.above.length > 0 || columnEditor.ledgerLines.below.length > 0)}
		<g class="ledger-lines">
			{#if columnEditor.ledgerLines.above.length > 0}
				{#each columnEditor.ledgerLines.above as ledgerLine}
					<line
						class="ledgerLine pointer-events-none opacity-10"
						x1={ledgerLine.x}
						y1={ledgerLine.y}
						x2={ledgerLine.x + ledgerLine.length}
						y2={ledgerLine.y}
						stroke="black"
						stroke-width={ledgerLine.width}
					/>
				{/each}
			{/if}
			{#if columnEditor.ledgerLines.below.length > 0}
				{#each columnEditor.ledgerLines.below as ledgerLine}
					<line
						class="ledgerLine pointer-events-none opacity-10"
						x1={ledgerLine.x}
						y1={ledgerLine.y}
						x2={ledgerLine.x + ledgerLine.length}
						y2={ledgerLine.y}
						stroke="black"
						stroke-width={ledgerLine.width}
					/>
				{/each}
			{/if}
		</g>
	{/if}

	{#if columnEditor.text && hoverIndex >= 0}
		<text
			class="pointer-events-none"
			x={columnEditor.text.x}
			y={columnEditor.text.y}
			text-anchor="middle"
			dominant-baseline="middle"
			font-size="400"
			fill="black"
		>
			{@html columnEditor.items[hoverIndex].text}
		</text>
	{/if}
</g>
