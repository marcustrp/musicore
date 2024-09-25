<svelte:options namespace="svg" />

<script lang="ts">
	import type { TimeSignatureLayout } from '$lib/layout/LTimeSignature.js';

	/*import { clearSelection } from './score.store';
	import { untrack } from 'svelte';
  $effect(() => {
    clearSelection.subscribe(() => {
      untrack(() => selected = false);
    });
  });*/

	type MyProps = {
		timeSignature: TimeSignatureLayout;
	};
	const { timeSignature }: MyProps = $props();

	var selected = $state(false);

	function doSelect(_e: MouseEvent) {
		/*clearSelection.update(() => {return {}});
    selected = !selected;
    e.stopPropagation();*/
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<path
	onclick={(e) => doSelect(e)}
	transform="rotate(180, {timeSignature.x},{timeSignature.y}) translate({timeSignature.x},{timeSignature.y}) scale(-1,1)"
	fill={selected ? 'green' : 'black'}
	d={timeSignature.glyphs[0].d}
/>
