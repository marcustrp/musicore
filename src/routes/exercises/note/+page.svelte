<script lang="ts">
    import { MusicStringImporter, Note, Score } from "$lib";
    import NoteExercise from "$lib/exercises/NoteExercise.svelte";

	const importer = new MusicStringImporter();

    let noteExercise = <NoteExercise | undefined>$state()

	let score = importer.parse("iw 1ILw");

    function onEvent(e) {
        console.log(e)
    }
</script>
<NoteExercise
    {score}
    onevent={onEvent}
    bind:this={noteExercise}
></NoteExercise>

<button onclick={() => noteExercise?.showNoteName(true)} >Show notename</button>
<button onclick={() => noteExercise?.showAnswer()} >Show answer</button>
