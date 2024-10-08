<script lang="ts">
	/*const data: LayoutData = {
	document: { width: 0, height: 0 },
	staffLines: [],
	clef: new LClef(new Font('bravura'), 'g'),
	key: { x: 0, y: 0, root: 'd', mode: 'major' },
	timeSignature: { x: 0, y: 0, count: 4, unit: 4 },
	bars: []
};
const layoutData = $state(data);
  const scoreLayout = create(layoutData);*/

	//let curChar = $state('uniE1F4');

	//let libTest = $state(score.layoutData);
	//let score = $state(layoutScore.layoutData);
	//let score = $derived(layoutScore.layoutData);

	//let tmp = $state(score.timeSignature.x);
	/*layoutScore.register(() => {
    console.log('layoutScore updated');
    score = layoutScore.layoutData;
  })*/
	//let tmp = $state(0);
	//let tmp2 = $derived(score.bars[0].notes[0].y)
	/*function doUpdate() {
    layoutScore.update();
    tmp = score.bars[0].notes[0].y;
  }*/
	/*
  onDestroy(() => {
    layoutScore.unregister();
  })*/
</script>

<svelte:head>
	<script type="module" src="../dist-js/musicore.js"></script>
</svelte:head>

<a href="/editors">Editors</a>

<br /><br />
<a href="/examples">Examples</a>

<br /><br />
<a href="/webcomponent/default">Web component</a>

<br /><br />
<a href="/tools/font">Create MusicoreFont</a>
