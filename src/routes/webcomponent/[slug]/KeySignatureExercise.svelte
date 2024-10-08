<script lang="ts">
	let editorsOnHover = $state(true);

	const methods: string[] = []; //['showAnswer', 'showNoteName', 'disableEdit'];
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
				console.log('scoreupdate', e);
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
				<button class="m-1" id={method}>{method}</button>
			{/each}
		</div>
		<div style="text-align: center">
			<b>Properties (note: toggling doesn't work at the moment...):<br /></b>
			<button id="showAnswer" onclick={() => (editorsOnHover = !editorsOnHover)}
				>editorsOnHover={editorsOnHover ? 'true' : 'false'}
			</button>
		</div>
		<div>
			<music-score
				id="musicore"
				exercise="KeySignatureExercise"
				music-string="1"
				editor-from="c5"
				editor-to="g6"
				editors-on-hover={editorsOnHover ? 'true' : 'false'}
				style="display: flex; justify-content: center"
			></music-score>
		</div>
		<div id="events" style="text-align: center">
			<b>Events</b> <i>(see console for details)</i><br />
		</div>
	</div>
</div>
