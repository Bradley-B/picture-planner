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

  let svgImage;
  let imageRect;
  let mask;

  onMount(() => {
    imageRect = svgImage.getBoundingClientRect();
  });

  const moveFrameToTop = id => {
    framesById.updateFrame({ id, zIndex: Object.keys($framesById).length + 1 });
    framesById.recalculateZIndexes();
  };

  const onFrameMove = (id, frameRect) => {
    updateMaskLayer(id, frameRect);
  };

  const updateMaskLayer = (id, frameRect) => {
    let rect = document.getElementById(`frame-rect-${id}`);
    const scale = 2484 / imageRect.width;
    const x = Math.round(frameRect.x - imageRect.x);
    const y = Math.round(frameRect.y - imageRect.y);

    if (rect === null) {
      rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('width', scale * frameRect.width);
      rect.setAttribute('height', scale * frameRect.height);
      rect.setAttribute('fill', 'black');
      rect.setAttribute('id', `frame-rect-${id}`);
      rect.setAttribute('class', 'frame-rect');
      mask.appendChild(rect);
    }

    rect.setAttribute('x', scale * x);
    rect.setAttribute('y', scale * y);
  };

</script>

<div id="mat">
  <div id="svg-wrapper">
    <svg width="2484" height="1398" viewBox="0 0 2484 1398">
      <image
          xmlns="http://www.w3.org/2000/svg"
          bind:this={svgImage}
          id="inner-image"
          width="100%"
          height="100%"
          xlink:href="testimage.jpg"
          mask="url(#hole)"
      />
      <defs>
        <mask bind:this={mask} id="hole">
          <rect width="100%" height="100%" fill="white"/>
        </mask>
      </defs>
    </svg>
  </div>

  {#each Object.values($framesById) as frame (frame.id)}
    <Frame id={frame.id} zIndex={frame.zIndex} onPickup={moveFrameToTop} onMove={onFrameMove}/>
  {/each}
</div>
