<script lang="ts">
	type CharType = keyof typeof charCodes;
	const charCodes = {
		metNoteWhole: 'ECA2',
		metNoteQuarterUp: 'ECA5',
		metNoteQuarterDown: 'ECA6',
		metNoteHalfUp: 'ECA3',
		accidentalSharp: 'E262',
		accidentalFlat: 'E260',
		accidentalNatural: 'E261'
	};

	type Props = {
		char: CharType;
	};
	const { char }: Props = $props();
	const charCode = '&#x' + charCodes[char] + ';';
</script>

<span style="font-family: BravuraText; font-size: 3rem">{@html charCode}</span>
