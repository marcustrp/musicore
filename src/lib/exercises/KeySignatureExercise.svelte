<script lang="ts">
	import { keySignatureEventHandler } from '$lib/engraver/events/key-signature.js';
	import type { EngraverSettings } from '$lib/engraver/scoreEngraver.js';
	import type { LayoutSettings } from '$lib/layout/types.js';
	import { Score } from '$lib/score/score.js';
	import EScore from '$lib/engraver/EScore.svelte';
	import { BBox } from '$lib/utils/bBox.js';
	import type { KeySignatureAccidentalEvent } from '$lib/engraver/events/types.js';
	import AccidentalSelector from './gui/AccidentalSelector.svelte';
	import type { NoteAccidentals } from '$lib/core/note.js';
	import { Key, type KeyAccidental } from '$lib/core/key.js';

	type Props = {
		score: Score;
		/** Editors off, shown on hover or on (always shown) */
		editorStyle?: 'off' | 'hover' | 'on';
		/** Disable edit (but editors otherwise works) */
		editDisabled?: boolean;
		onevent: (arg0: KeySignatureAccidentalEvent) => void;
		/** Staff size in mm, default is 18 */
		staffSize?: number;
	};
	const { score, editorStyle, editDisabled, onevent, staffSize }: Props = $props();

	export const showIncorrect = (questionKey: Key) => {
		const key = score.bars.bars[0].key;
		const clef = score.parts.getPart(0).getClef(0, 0);
		const customAccidentals = key.getCustomAccidentals(clef.type);
		if (customAccidentals.length > 0) {
			customAccidentals.forEach((accidental, index) => {
				const isValid =
					accidental.position !== undefined &&
					accidental.type === questionKey.accidentals.type &&
					index < questionKey.accidentals.count &&
					Key.isAccidentalValid(
						accidental.type as KeyAccidental,
						index,
						accidental.position,
						clef.type,
					);
				key.setColor(index, isValid ? '' : 'red');
			});
		} else {
			for (let i = 0; i < key.accidentals.count; i++) {
				const isValid =
					key.accidentals.type == questionKey.accidentals.type && i < questionKey.accidentals.count;
				key.setColor(i, isValid ? '' : 'red');
			}
		}
		scoreComponent.refresh();
	};

	export const updateKeySignatureColor = (index: number, color: string) => {
		const key = score.bars.bars[0].key;
		key.setColor(index, color);
	};

	let scoreComponent: ReturnType<typeof EScore>;

	const layoutSettings: LayoutSettings = {
		staffSize: staffSize ? staffSize : 25,
		noteSpacing: {
			type: 'fixed',
			value: 4,
		},
		render: {
			barlines: true,
			keySignature: 'editor',
			clef: true,
			timeSignature: false,
			bars: false,
		},
	};
	const settings: EngraverSettings = {
		viewBoxMinimum: new BBox(0, -600, 0, 2100),
		events: {
			keySignature: !editDisabled ? (event) => keySignatureEventHandler(event, onevent) : undefined,
		},
		renderEditorsOnHover: editorStyle === 'hover',
	};

	function onAccidentalSelect(accidental: NoteAccidentals) {
		layoutSettings.defaultAccidental = accidental;
	}
</script>

<div>
	<AccidentalSelector accidentals={['#', 'b']} onclick={onAccidentalSelect} />
	<EScore {score} {settings} {layoutSettings} bind:this={scoreComponent} />
</div>
