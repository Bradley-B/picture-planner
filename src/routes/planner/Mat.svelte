<style>
  #mat {
      height: 100%;
      width: 100%;
      position: relative;
      isolation: isolate;
      display: grid;
      place-items: center;
  }
  #svg-wrapper {
      position: absolute;
      top: 2.5%;
      left: 2.5%;
      width: 95%;
      height: 95%;
  }
  svg {
      user-select: none;
      height: 100%;
      width: 100%;
  }
</style>

<script>
  import Frame from './Frame.svelte';
  import { framesById } from './plannerStores.js';
  import { onMount } from 'svelte';
  import { updateMaskLayer, updateAllMaskLayers } from './svgDomFunctions.js';

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateAllMaskLayers();
    });
    resizeObserver.observe(document.getElementById('svg-wrapper'));
  });

  const moveFrameToTop = id => {
    framesById.updateFrame({ id, zIndex: Object.keys($framesById).length + 1 });
    framesById.recalculateZIndexes();
  };

</script>

<div id="mat">
  <div id="svg-wrapper">
    <svg width="2484" height="1398" viewBox="0 0 2484 1398">
      <image
          xmlns="http://www.w3.org/2000/svg"
          id="svg-image"
          width="100%"
          height="100%"
          xlink:href="testimage.jpg"
          mask="url(#svg-image-mask)"
      />
      <defs>
        <mask id="svg-image-mask">
          <rect width="100%" height="100%" fill="white"/>
        </mask>
      </defs>
    </svg>
  </div>

  {#each Object.values($framesById) as frame (frame.id)}
    <Frame
        id={frame.id}
        zIndex={frame.zIndex}
        height={frame.height}
        width={frame.width}
        onPickup={moveFrameToTop}
        onMove={updateMaskLayer}
    />
  {/each}
</div>
