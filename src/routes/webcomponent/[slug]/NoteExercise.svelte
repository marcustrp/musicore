<script lang="ts">
	let editorStyles = ['off', 'hover', 'on'];
	let editorStyleIndex = $state(1);

	const methods = ['showAnswer', 'showNoteName', 'disableEdit'];
</script>

<svelte:head>
	<script>
		/** Regular (non-svelte) javascript to test/showcase web component music-score */
		window.addEventListener('DOMContentLoaded', () => {
			const musicScore = document.querySelector('#musicore');
			let showNoteName = false;
			let disableEdit = false;

			document.querySelector('#showAnswer').addEventListener('click', (e) => {
				musicScore.showAnswer();
			});
			document.querySelector('#showNoteName').addEventListener('click', (e) => {
				showNoteName = !showNoteName;
				musicScore.showNoteName(showNoteName);
				e.target.textContent = showNoteName ? 'hideNoteName' : 'showNoteName';
			});
			document.querySelector('#disableEdit').addEventListener('click', (e) => {
				disableEdit = !disableEdit;
				musicScore.disableEdit(disableEdit);
				e.target.textContent = disableEdit ? 'enableEdit' : 'disableEdit';
			});

			musicScore.addEventListener('scoreupdate', (e) => {
				document.querySelector('#events').innerHTML +=
					'Event: ' +
					e.detail.eventType +
					' ' +
					e.detail.note.name +
					' (octave: ' +
					e.detail.note.octave +
					')<br />';
			});
		});
	</script>
</svelte:head>

<div>
	<h1>musicore note exercise test</h1>
	<div>
		<div style="text-align: center">
			<b>Methods:<br /></b>
			{#each methods as method}
				<button class="m-1" id={method}>{method}</button>
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
				exercise="NoteExercise"
				exercise-settings="accidentals:#,b,x,bb,n"
				music-string="iw 1ILw"
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
