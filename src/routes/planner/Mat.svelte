<style>
  #mat {
      height: 100%;
      width: 90%;
      position: relative;
      isolation: isolate;
      display: grid;
      place-items: center;
  }
  img {
      user-select: none;
      max-width: 100%;
      max-height: 100%;
  }
</style>

<script>
  import Frame from './Frame.svelte';
  import { framesById } from './plannerStores.js';

  const moveFrameToTop = id => {
    framesById.updateFrame({ id, zIndex: Object.keys($framesById).length + 1});
    framesById.recalculateZIndexes();
  };

</script>

<div id="mat">
  <img src="testimage.jpg" alt="planning">
  {#each Object.values($framesById) as frame (frame.id)}
    <Frame id={frame.id} zIndex={frame.zIndex} onPickup={moveFrameToTop}/>
  {/each}
</div>

<button on:click={() => framesById.addFrame()}>add frame</button>