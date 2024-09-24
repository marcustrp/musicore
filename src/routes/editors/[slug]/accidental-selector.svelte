<script lang="ts">
	import MusicFont from '$lib/engraver/MusicFont.svelte';

	type Props = {
		currentAccidental: string;
		setAccidental: (accidental: string) => void;
	};
	const { currentAccidental, setAccidental }: Props = $props();
</script>

<button
	class="{currentAccidental === '#'
		? 'bg-amber-200'
		: ''} m-2 min-w-8 rounded border-2 border-amber-500 hover:bg-amber-200"
	onclick={() => setAccidental('#')}
>
	<MusicFont char="accidentalSharp" />
</button>
<button
	class="{currentAccidental === 'b'
		? 'bg-amber-200'
		: ''} m-2 min-w-8 rounded border-2 border-amber-500 hover:bg-amber-200"
	onclick={() => setAccidental('b')}
>
	<MusicFont char="accidentalFlat" />
</button>
<button
	class="{currentAccidental === 'n'
		? 'bg-amber-200'
		: ''} m-2 min-w-8 rounded border-2 border-amber-500 hover:bg-amber-200"
	onclick={() => setAccidental('n')}
>
	<MusicFont char="accidentalNatural" />
</button>
