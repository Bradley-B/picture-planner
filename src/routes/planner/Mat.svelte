<style>
  #mat {
      height: 100%;
      width: 100%;
      position: relative;
      isolation: isolate;
      display: grid;
      place-items: center;
  }
  svg {
      user-select: none;
      position: absolute;
      top: 2.5%;
      left: 2.5%;
      width: 95%;
      height: 95%;
  }
</style>

<script>
  import Frame from './Frame.svelte';
  import { framesById } from './plannerStores.js';

  const moveFrameToTop = id => {
    framesById.updateFrame({ id, zIndex: Object.keys($framesById).length + 1 });
    framesById.recalculateZIndexes();
  };

  const frameLocations = {};
  const onFrameMove = (id, frameLocation) => {
    frameLocations[id] = frameLocation;
  };

</script>

<div id="mat">
  <svg width="2484" height="1398" viewBox="0 0 2484 1398">
    <image width="100%" height="100%" xlink:href="testimage.jpg" mask="url(#hole)"/>
    <defs>
      <mask id="hole">
        <rect width="100%" height="100%" fill="white"/>
<!--        <rect x="40" y="40" height="10" width="10" rx="1" fill="black"/>-->
<!--        <rect x="0" y="0" height="10" width="10" rx="1" fill="black"/>-->
      </mask>
    </defs>
  </svg>

  {#each Object.values($framesById) as frame (frame.id)}
    <Frame id={frame.id} zIndex={frame.zIndex} onPickup={moveFrameToTop} onMove={onFrameMove}/>
  {/each}
</div>
