<script lang="ts">
	import { Font } from '$lib/fonts/font.js';
	import SvgChar from '../lib/engraver/SvgChar.svelte';
	import SvgFont from '../lib/engraver/SvgFont.svelte';

	const maestro = new Font('maestro');
	const bravura = new Font('bravura');
	const ash = new Font('ash');

	let curChar = $state('uniE1F4');
	function setChar(char: string) {
		curChar = char;
	}
</script>

<SvgChar char={curChar} svgData={[maestro.fontData, bravura.fontData, ash.fontData]} />

<SvgFont setChar={(char) => setChar(char)} svgSetName="ash" svgData={ash.fontData} />
<SvgFont setChar={(char) => setChar(char)} svgSetName="mestro" svgData={maestro.fontData} />
<SvgFont setChar={(char) => setChar(char)} svgSetName="bravura" svgData={bravura.fontData} />
