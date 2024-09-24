<svelte:options namespace="svg" />

<script lang="ts">
	import NoteStem from './NoteStem.svelte';
	import { Note, Score, type ClefType, type NoteAccidentals } from '$lib/index.js';
	import { clearSelection, update } from './score.store.js';
	import { untrack, getContext } from 'svelte';
	import ColumnEditor, { type ColumnEditorEvent } from './ColumnEditor.svelte';
	import type { ENote } from '$lib/layout/LNote.js';
	import type { ScoreEngraver } from './scoreEngraver.js';

	$effect(() => {
		clearSelection.subscribe(() => {
			untrack(() => (selected = false));
		});
	});
	type MyProps = {
		note: ENote;
		clef: ClefType;
	};
	const { note, clef }: MyProps = $props();

	const engraver: ScoreEngraver = getContext('engraver');

	var selected = $state(false);
	function doSelect(e: MouseEvent) {
		console.log(note.id);
		clearSelection.update(() => {
			return {};
		});
		selected = !selected;
		e.stopPropagation();
		update.set({});
	}

	function getNote(score: Score, noteIndex: number): Note {
		return score.bars.getNoteByIndex('P1', 'V1', noteIndex) as Note;
	}

	function handleEvent(type: 'note' | 'accidental', data: ColumnEditorEvent, noteIndex: number) {
		console.log('handleEvent', type, data, noteIndex);
		if (type === 'note' && engraver.settings.events?.note) {
			const updated = engraver.settings.events.note({
				score: engraver.score,
				settings: engraver.layoutSettings,
				index: data.editorIndex,
				position: data.position,
				barIndex: data.barIndex,
				clef,
				note: getNote(engraver.score, noteIndex),
			});
			if (updated) engraver.update();
		} else if (type === 'accidental' && engraver.settings.events?.noteAccidental) {
			const updated = engraver.settings.events.noteAccidental({
				score: engraver.score,
				settings: engraver.layoutSettings,
				index: data.editorIndex,
				position: data.position,
				clef,
				barIndex: data.barIndex,
				accidental: data.data as NoteAccidentals,
				note: getNote(engraver.score, note.index),
			});
			if (updated) engraver.update();
		}
	}
</script>

<g class="note">
	{#if note.ledgerLines && note.y !== undefined && (note.ledgerLines.above.length > 0 || note.ledgerLines.below.length > 0)}
		<g class="ledgerLines">
			{#if note.ledgerLines.above.length > 0}
				{#each note.ledgerLines.above as ledgerLine}
					<line
						class="ledgerLine"
						x1={ledgerLine.x}
						y1={ledgerLine.y}
						x2={ledgerLine.x + ledgerLine.length}
						y2={ledgerLine.y}
						stroke="black"
						stroke-width={ledgerLine.width}
					/>
				{/each}
			{/if}
			{#if note.ledgerLines.below.length > 0}
				{#each note.ledgerLines.below as ledgerLine}
					<line
						class="ledgerLine"
						x1={ledgerLine.x}
						y1={ledgerLine.y}
						x2={ledgerLine.x + ledgerLine.length}
						y2={ledgerLine.y}
						stroke="black"
						stroke-width={ledgerLine.width}
					/>
				{/each}
			{/if}
		</g>
	{/if}
	{#each note.notes as notehead, index}
		{#if notehead.accidental && note.y !== undefined}
			{#if notehead.accidental.y !== undefined}}
				<path
					class="accidental"
					transform="rotate(180, {notehead.accidental.x},{notehead.accidental
						.y}) translate({notehead.accidental.x},{notehead.accidental.y}) scale(-1,1)"
					fill="black"
					d={notehead.accidental.glyph.d}
				/>
			{/if}
		{/if}
		{#if notehead.editor && note.y !== undefined}
			<ColumnEditor
				editorIndex={index}
				columnEditor={notehead.editor}
				event={(data) => handleEvent('accidental', data, note.index)}
			/>
		{/if}
		{#if note.y !== undefined}
			<g class="note-head">
				{#if note.type === 'w' || note.type === 'h'}
					<g>
						{#if note.type === 'w'}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<path
								onclick={(e) => doSelect(e)}
								transform="rotate(180, {notehead.x},{notehead.y}) translate({notehead.x},{notehead.y}) scale(-1,1)"
								fill={selected ? 'green'
								: notehead.color ? notehead.color
								: 'black'}
								d={notehead.glyph.d}
							/>
						{:else}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<path
								onclick={(e) => doSelect(e)}
								transform="rotate(180, {notehead.x},{notehead.y}) translate({notehead.x},{notehead.y}) scale(-1,1)"
								fill={selected ? 'green' : 'black'}
								d={notehead.glyph.d}
							/>
						{/if}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<rect
							fill="black"
							opacity="0"
							onclick={(e) => doSelect(e)}
							x={notehead.x + notehead.glyph.bBox!.x}
							y={notehead.y - notehead.glyph.bBox!.y}
							width={notehead.glyph.bBox!.width}
							height={notehead.glyph.bBox!.height}
						/>
					</g>
				{:else}
					<!--<path onclick={(e) => doSelect(e)} transform="scale(0.1,-0.1) translate({note.x}, {note.y})" fill="{selected ? 'green' : 'black'}" d="M14.75,3.58c.57,2.7-2.24,5.59-6.3,6.45S.65,9.4.07,6.69,2.32,1.11,6.37.24s7.8.63,8.38,3.33Z"/>-->

					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<path
						onclick={(e) => doSelect(e)}
						transform="rotate(180, {notehead.x},{notehead.y}) translate({notehead.x},{notehead.y}) scale(-1,1)"
						fill={selected ? 'green' : 'black'}
						d={note.notes[0].glyph.d}
					/>
				{/if}
			</g>
		{/if}
	{/each}
	{#if note.stem && note.y !== undefined}
		<NoteStem stem={note.stem} />
	{/if}
	{#if note.editor && (engraver.settings.renderEditorsOnHover !== true || engraver.settings.hoverState === true)}
		<ColumnEditor
			columnEditor={note.editor}
			editorIndex={0}
			event={(data) => handleEvent('note', data, note.index)}
		/>
	{/if}
</g>
