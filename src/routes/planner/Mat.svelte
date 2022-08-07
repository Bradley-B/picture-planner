<style>
  #mat {
      position: relative;
      isolation: isolate;
  }
</style>

<script>
  import Frame from './Frame.svelte';

  let frames = [
    { id: 1, zIndex: 1 },
    { id: 2, zIndex: 2 },
    { id: 3, zIndex: 3 }
  ];

  const moveFrameToTop = id => {
    frames.find(frame => frame.id === id).zIndex = frames.length + 1;
    frames = frames
      .sort((a, b) => a.zIndex - b.zIndex)
      .map((e, i) => ({ ...e, zIndex: i }));
  };

</script>

<div id="mat">
  {#each frames as { id, zIndex } (id)}
    <Frame id={id} zIndex={zIndex} onPickup={moveFrameToTop}/>
  {/each}
</div>