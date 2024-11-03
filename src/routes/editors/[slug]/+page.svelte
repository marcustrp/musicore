<script lang="ts">
	import KeySignature from './key-signature.svelte';
	import Chord from './chord.svelte';
	import Scale from './scale.svelte';
	import Note from './note.svelte';
	import ChordKey from './chord-key.svelte';

	type Props = {
		data: { slug: string };
	};
	const { data }: Props = $props();
	let showBBoxes = $state(false);

	let display: Record<string, boolean> = $state({
		keySignature: true,
		chord: false,
		scale: false,
		note: false,
		chordKey: false,
	});
	function showAll() {
		Object.keys(display).forEach((key) => {
			display[key] = true;
		});
	}
	function show(key: string) {
		Object.keys(display).forEach((key2) => {
			display[key2] = key2 === key;
		});
	}
	$effect(() => {
		show(data.slug);
	});
	show(data.slug);
</script>

<div>
	<a class={display.keySignature ? 'font-bold' : ''} href="keySignature">Key signature</a>
	<a class={display.note ? 'font-bold' : ''} href="note">Note</a>
	<a class={display.scale ? 'font-bold' : ''} href="scale">Scale</a><br />
	<a class={display.chord ? 'font-bold' : ''} href="chord">Chord</a>
	<a class={display.chordKey ? 'font-bold' : ''} href="chordKey">Chord with key signature</a>

	<button onclick={showAll}>Show all</button>
</div>
<div>
	<button onclick={() => (showBBoxes = !showBBoxes)}>
		{showBBoxes ? 'Hide' : 'Show'} BBoxes
	</button>
</div>
{#if display.keySignature}
	<KeySignature />
{/if}
{#if display.chord}
	<Chord />
{/if}
{#if display.scale}
	<Scale />
{/if}
{#if display.note}
	<Note />
{/if}
{#if display.chordKey}
	<ChordKey />
{/if}
