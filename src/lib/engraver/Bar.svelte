<svelte:options namespace="svg" />

<script lang="ts">
	import type { EBar } from '$lib/layout/LBar.js';
	import type { ENote } from '$lib/layout/LNote.js';
	import Note from './Note.svelte';
	import Rest from './Rest.svelte';
	import Barline from './Barline.svelte';
	import type { ClefType } from '$lib/index.js';

	type MyProps = {
		bar: EBar;
		clef: ClefType;
	};
	const { bar, clef }: MyProps = $props();
</script>

<g class="bar">
	{#each bar.notes as note}
		{#if note.objectType === 'note'}
			<Note note={note as ENote} {clef} />
		{:else}
			<Rest rest={note} />
		{/if}
	{/each}
	{#if bar.barline}
		<Barline barline={bar.barline} />
	{/if}
</g>
