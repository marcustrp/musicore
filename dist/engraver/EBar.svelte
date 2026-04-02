<svelte:options namespace="svg" />

<script lang="ts">
	import type { BarLayout } from '../layout/LBar.js';
	import type { NoteLayout } from '../layout/LNote.js';
	import ENote from './ENote.svelte';
	import ERest from './ERest.svelte';
	import EBarline from './EBarline.svelte';
	import type { ClefType } from '../index.js';

	type MyProps = {
		bar: BarLayout;
		clef: ClefType;
	};
	const { bar, clef }: MyProps = $props();
</script>

<g class="bar">
	{#each bar.notes as note}
		{#if note.objectType === 'note'}
			<ENote note={note as NoteLayout} {clef} />
		{:else}
			<ERest rest={note} />
		{/if}
	{/each}
	{#if bar.barline}
		<EBarline barline={bar.barline} />
	{/if}
</g>
