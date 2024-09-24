<svelte:options namespace="svg" />

<script lang="ts">
	import { setContext } from 'svelte';
	import { Score, Note } from '$lib/index.js';
	import StaffLine from './StaffLine.svelte';
	import { ScoreEngraver, type EngraverSettings } from './scoreEngraver.js';

	import { clearSelection, update } from './score.store.js';
	import Clef from './Clef.svelte';
	import Bar from './Bar.svelte';
	import TimeSignature from './TimeSignature.svelte';
	import KeySignature from './KeySignature.svelte';
	import type { LayoutSettings } from '$lib/types.js';
	import type { BBox } from '$lib/utils/bBox.js';
	import type { EngravingData } from '$lib/sheetMusicLayout.js';
	import type { ScoreEvent } from './events/types.js';
	const clearSignal = $clearSelection;

	type MyProps = {
		score: Score;
		settings: EngraverSettings;
		layoutSettings: LayoutSettings;
	};
	const { score, settings, layoutSettings }: MyProps = $props();
	const clef = score.parts.getPart(0).getClef(0, 0).type;

	export const showNote = (index: number) => {
		const note = scoreEngraver.score.bars.getNoteByIndex('P1', 'V1', index);
		if (note) note.invisible = false;
	};

	export const lockNote = (index: number) => {
		const note = scoreEngraver.score.bars.getNoteByIndex('P1', 'V1', index);
		if (note) note.locked = true;
	};

	export const setNoteHeadColor = (index: number, color: string) => {
		const note = scoreEngraver.score.bars.getNoteByIndex('P1', 'V1', index);
		if (note && note instanceof Note) note.color = { notehead: color };
	};

	export const refresh = () => {
		scoreEngraver.update();
	};

	$effect(() => {
		console.log('settings updated', settings);
		scoreEngraver.updateSettings(settings);
	});
	$effect(() => {
		console.log('SVELTE SCORE updated', score);
	});
	$effect(() => {
		return () => {
			scoreEngraver.unregister();
		};
	});
	const scoreEngraver = new ScoreEngraver(score, settings, layoutSettings);
	setContext('engraver', scoreEngraver);

	scoreEngraver.register((newData: EngravingData) => {
		console.log('SVELTE EngravingData updated', newData);
		engravingData = newData;
	});
	// first render (disable callback on this update), settings initial state with returned data
	const eData = scoreEngraver.update(false);
	console.log('engravingData', eData);
	let engravingData = $state(eData);

	type DebugBBox = {
		path: String;
		color: string;
		bBox: BBox;
	};

	function findBBoxes(object: { [key: string]: any }, path: string) {
		if (!settings.showBBoxes) return [];
		let value: DebugBBox[] = [];
		Object.keys(object).forEach((key) => {
			if (key === 'bBox') {
				value.push({
					path: path,
					bBox: object[key] as BBox,
					color: path.substr(-6) === 'editor' ? 'stroke-red-500' : 'stroke-yellow-500',
				});
			} else if (key !== 'glyph' && typeof object[key] === 'object') {
				value = [...findBBoxes(object[key], path + (path ? '.' : '') + key), ...value];
			}
		});
		return value;
	}

	let bBoxes: DebugBBox[] = $derived.by(() => {
		return findBBoxes(engravingData, '').sort((a, b) => {
			return a.path > b.path ? 1 : -1;
		});
	});

	let viewBox = $derived.by(() => {
		// if document changes size, make sure svg viewBox is updated
		if (!settings.viewBoxMinimum) return engravingData.document.bBox;
		return settings.viewBoxMinimum.clone().merge(engravingData.document.bBox);
	});

	function doClear() {
		clearSelection.update(() => clearSignal);
	}

	function svgHover(hover: boolean) {
		console.log('hover', hover);
		scoreEngraver.settings.hoverState = hover;
		/** @TODO should do layout (which update does), only rerun engraver... */
		scoreEngraver.update();
	}
</script>

<svelte:document onclick={doClear} />

{#snippet bbox(item: DebugBBox)}
	<rect
		x={item.bBox.x}
		y={item.bBox.y}
		height={item.bBox.height}
		width={item.bBox.width}
		class="pointer-events-none fill-transparent {item.color} stroke-20"
		style="stroke-dasharray: 100"
		data-path={item.path}
	/>
	<rect
		x={item.bBox.x}
		y={item.bBox.y}
		height="150"
		width="150"
		class="stroke-20 fill-yellow-500 stroke-yellow-500 hover:bg-yellow-300 hover:opacity-70"
		style="stroke-dasharray: 25; fill-opacity: 20%"
	/>
{/snippet}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svg
	style="width: {Math.floor(viewBox.width / 10)}px; height:{Math.floor(viewBox.height / 10)}px"
	viewBox="{viewBox.x},{viewBox.y},{viewBox.width},{viewBox.height}"
	onmouseenter={() => svgHover(true)}
	onmouseleave={() => svgHover(false)}
>
	<g class="score" transform="scale(1,1)">
		{#if engravingData.staffLines}
			<g class="stafflines">
				{#each engravingData.staffLines.lines as staffLine}
					<StaffLine {staffLine} />
				{/each}
			</g>
		{/if}
		{#if engravingData.clef}
			<Clef clef={engravingData.clef} />
		{/if}
		{#if engravingData.keySignature && engravingData.clef}
			<KeySignature keySignature={engravingData.keySignature} clef={engravingData.clef.type} />
		{/if}
		{#if engravingData.timeSignature}
			<TimeSignature timeSignature={engravingData.timeSignature} />
		{/if}
		{#if engravingData.bars?.bars}
			{#each engravingData.bars.bars as bar}
				<Bar {bar} {clef} />
			{/each}
		{/if}
	</g>

	{#if settings.showBBoxes}
		{#each bBoxes as bBox}
			{@render bbox(bBox)}
		{/each}
	{/if}
</svg>

{#if settings.showBBoxes}
	<ul>
		{#each bBoxes as bBox}
			<li>{bBox.path}</li>
		{/each}
	</ul>
{/if}
<!--
<p style="font-size: 1.5rem">
	Notes:
	<span style="font-family: BravuraText; font-size: 3rem">&#xECA2;</span>
	<span style="font-family: BravuraText; font-size: 3rem">&#xECA3;</span>
	<span style="font-family: BravuraText; font-size: 3rem">&#xECA5;</span>
	<span style="font-family: BravuraText; font-size: 3rem">&#xECA6;</span>
</p>

<style>
	@font-face {
		font-family: 'BravuraText';
		src:
			url('/fonts/BravuraText.woff2') format('woff2'),
			url('/fonts/BravuraText.woff') format('woff');
	}
</style>-->
