<script lang="ts">
	let editorStyles = ['off', 'hover', 'on'];
	let editorStyleIndex = $state(1);

	const methods: string[] = ['showIncorrect']; //['showAnswer', 'showNoteName', 'disableEdit'];

	function triggerMethod(name: string, param1?: string, param2?: string) {
		const musicScore = document.querySelector('#musicore');
		if (musicScore) musicScore[name](param1, param2);
	}
</script>

<svelte:head>
	<script>
		/** Regular (non-svelte) javascript to test/showcase web component music-score */
		window.addEventListener('DOMContentLoaded', () => {
			const musicScore = document.querySelector('#musicore');
			let showNoteName = false;
			let disableEdit = false;

			musicScore.addEventListener('scoreupdate', (e) => {
				document.querySelector('#events').innerHTML += 'Event: ' + e.detail.eventType + '<br />';
			});
		});
	</script>
</svelte:head>

<div>
	<h1>musicore key signature exercise test</h1>
	<div>
		<div style="text-align: center">
			<b>Methods:<br /></b>
			{#each methods as method}
				<button class="m-1" onclick={() => triggerMethod(method, 'g', 'major')} id={method}
					>{method}</button
				>
			{/each}
		</div>
		<div style="text-align: center">
			<b>Properties (note: toggling doesn't work at the moment...):<br /></b>
			<button id="showAnswer" onclick={() => (editorStyleIndex = (editorStyleIndex + 1) % 3)}
				>editorStyle={editorStyles[editorStyleIndex]}
			</button>
		</div>
		<div>
			<music-score
				id="musicore"
				exercise="KeySignatureExercise"
				music-string="@Ka 1"
				editor-from="c5"
				editor-to="g6"
				editor-style={editorStyles[editorStyleIndex]}
				style="display: flex; justify-content: center"
			></music-score>
		</div>
		<div id="events" style="text-align: center">
			<b>Events</b> <i>(see console for details)</i><br />
		</div>
	</div>
</div>
