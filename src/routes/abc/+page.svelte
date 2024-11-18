<script lang="ts">
	import { AbcExporter } from '$lib/index.js';
	import { AbcImporter } from '$lib/score/import/abc.js';
	import abcjs from 'abcjs';

	let abc = $state();
	let abc2 = $state('');
	function parseAbc() {
		const importer = new AbcImporter();
		const score = importer.parse(abc);
		console.log(score);

		const exporter = new AbcExporter();
		abc2 = exporter.export(score);

		const measures = abcjs.extractMeasures(abc);
		console.log(measures);
	}
</script>

<textarea bind:value={abc} style="height: 30rem;width:50rem"></textarea>
<textarea bind:value={abc2} style="height: 30rem;width:50rem"></textarea><br />
<button onclick={parseAbc}>Parse</button>
