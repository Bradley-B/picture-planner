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
  import { settings, imageDetails, framesById } from './plannerStores.js';
  import { onMount } from 'svelte';
  import { updateAllMaskLayers } from './svgDomFunctions.js';

  $: src = $imageDetails.src;
  $: width = $imageDetails.width;
  $: height = $imageDetails.height;
  $: isMaskEnabled = $settings.isMaskEnabled;

  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateAllMaskLayers($imageDetails);
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
    <svg id="svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
      <image
          xmlns="http://www.w3.org/2000/svg"
          id="svg-image"
          width="100%"
          height="100%"
          href="{src}"
          mask="url(#svg-image-mask)"
      />
      <defs>
        <mask id="svg-image-mask">
          <rect width="100%" height="100%" fill="{isMaskEnabled ? 'black' : 'white'}"/>
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
        heightInches={frame.heightInches}
        widthInches={frame.widthInches}
        onPickup={moveFrameToTop}
    />
  {/each}
</div>
