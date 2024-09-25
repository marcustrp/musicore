<svelte:options namespace="svg" />

<script lang="ts">
	import { getContext } from 'svelte';
	import type { ClefType, KeyAccidental } from '$lib/index.js';
	import EColumnEditor, { type ColumnEditorEvent } from './EColumnEditor.svelte';
	import type { KeySignatureLayout } from '$lib/layout/LKeySignature.js';
	import type { ScoreEngraver } from './scoreEngraver.js';

	const engraver: ScoreEngraver = getContext('engraver');

	type MyProps = {
		keySignature: KeySignatureLayout;
		clef: ClefType;
	};
	const { keySignature, clef }: MyProps = $props();

	function handleEvent(data: ColumnEditorEvent) {
		if (!engraver.settings.events?.keySignature) return;
		const updated = engraver.settings.events.keySignature({
			score: engraver.score,
			settings: engraver.layoutSettings,
			column: data.editorIndex,
			position: data.position,
			accidental: data.data as KeyAccidental,
			clef: clef,
		});
		if (updated) engraver.update();
	}
</script>

{#if keySignature.editors && keySignature.editors.length > 0}
	{#each keySignature.editors as editor, index}
		{#if index < keySignature.accidentals.length && keySignature.accidentals[index].y !== undefined}
			<path
				class="accidental"
				transform="rotate(180, {keySignature.accidentals[index].x},{keySignature.accidentals[index]
					.y}) translate({keySignature.accidentals[index].x},{keySignature.accidentals[index]
					.y}) scale(-1,1)"
				fill="black"
				d={keySignature.accidentals[index].glyph.d}
			/>
		{/if}
		<EColumnEditor columnEditor={editor} editorIndex={index} event={handleEvent} />
	{/each}
{:else}
	{#each keySignature.accidentals as accidental}
		<g>
			{#if accidental.y !== undefined}}
				<path
					class="accidental"
					transform="rotate(180, {accidental.x},{accidental.y}) translate({accidental.x},{accidental.y}) scale(-1,1)"
					fill="black"
					d={accidental.glyph.d}
				/>
			{/if}
		</g>
	{/each}
{/if}
