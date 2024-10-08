<script lang="ts">
	import KeySignatureExercise from './KeySignatureExercise.svelte';
	import NoteExercise from './NoteExercise.svelte';
	import ScaleExercise from './ScaleExercise.svelte';
	type Props = {
		data: { slug: string };
	};
	const { data }: Props = $props();

	const musicString = `1 [24{c:r}] 5{c:b}h`;
</script>

<svelte:head>
	<script type="module" src="../dist-js/musicore.js"></script>
</svelte:head>

<div>
	<a href="note-exercise">Note exercise</a>
	<a href="keysignature-exercise">Key signature exercise</a>
	<a href="scale-exercise">Scale exercise</a>
</div>
{#if data.slug === 'note-exercise'}
	<NoteExercise></NoteExercise>
{:else if data.slug === 'keysignature-exercise'}
	<KeySignatureExercise></KeySignatureExercise>
{:else if data.slug === 'scale-exercise'}
	<ScaleExercise></ScaleExercise>
{:else}
	<music-score music-string={musicString}></music-score>
{/if}
