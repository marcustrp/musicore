<script lang="ts">
	import type { NoteAccidentals } from '$lib/core/note.js';
	import type { GlyphNames } from '$lib/fonts/types.js';
	import GlyphButton from './GlyphButton.svelte';

	type Props = {
		accidentals: NoteAccidentals[];
		defaultAccidental?: NoteAccidentals;
		onclick: (arg0: NoteAccidentals) => void;
	};
	const { accidentals, defaultAccidental, onclick }: Props = $props();

	const accidentalToGlyph: { [key in NoteAccidentals]: GlyphNames } = {
		'#': 'accidentalSharp',
		b: 'accidentalFlat',
		bb: 'accidentalDoubleFlat',
		n: 'accidentalNatural',
		x: 'accidentalDoubleSharp',
		'n#': 'accidentalNaturalSharp',
		nb: 'accidentalNaturalFlat',
	};

	let selectedGlyph: GlyphNames | undefined = $state(
		defaultAccidental ? accidentalToGlyph[defaultAccidental] : accidentalToGlyph[accidentals[0]],
	);

	function onButtonClick(glyphName: GlyphNames) {
		const accidental = Object.keys(accidentalToGlyph).find(
			(key) => accidentalToGlyph[key as NoteAccidentals] === glyphName,
		);
		if (accidental) {
			selectedGlyph = glyphName;
			onclick(accidental as NoteAccidentals);
		}
		console.log('[unknown]', glyphName);
	}
</script>

<div>
	{#each accidentals as accidental}
		<GlyphButton
			selected={selectedGlyph == accidentalToGlyph[accidental]}
			onclick={onButtonClick}
			glyphName={accidentalToGlyph[accidental]}
		/>
	{/each}
</div>
