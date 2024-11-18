<script lang="ts">
	import { AbcExporter, MusicStringImporter, Note } from '$lib/index.js';
	import abcjs from 'abcjs';

	let musicstring = $state(`@KDM3 <4>3 45 <5>+1 <1>-5`);
	let abc = $derived.by(() => {
		const importer = new MusicStringImporter();
		const score = importer.parse(musicstring);
		try {
			console.log(score.bars.bars[0].notes['P1']['V1'][0] as Note);
			console.log((score.bars.bars[0].notes['P1']['V1'][0] as Note).graceNotes);
			console.log((score.bars.bars[0].notes['P1']['V1'][0] as Note).graceType);
			const exporter = new AbcExporter();
			const abcData = exporter.export(score);
			return abcData;
		} catch (e) {
			console.warn(e);
		}
	});

	$effect(() => {
		if (!abc) return;
		try {
			abcjs.renderAbc('sheetmusic', abc, { responsive: 'resize' });
		} catch (e) {
			console.error(e);
		}
	});
</script>

<textarea bind:value={musicstring} style="height: 30rem;width:50rem"></textarea>
<textarea value={abc} style="height: 30rem;width:50rem"></textarea><br />
<div id="sheetmusic"></div>
