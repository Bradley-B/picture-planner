<!--suppress CssUnresolvedCustomProperty -->
<style>
    .frame {
        width: var(--width);
        height: var(--height);

        position: fixed;
        top: 0;
        left: 0;

        cursor: grab;
        border: solid red var(--borderWidth); /* TODO figure out if having a border negatively affects background image size calculation */
        user-select: none;

        z-index: var(--zIndex);
        transform: translateX(var(--left)) translateY(var(--top));
        opacity: var(--opacity);

        display: grid;
        grid-template-rows: min-content min-content auto min-content;
        grid-template-columns: auto min-content;
    }

    @keyframes snap-back {
        from {
            transform: translateX(var(--sourceLeft)) translateY(var(--sourceTop));
        }
        to {
            transform: translateX(var(--destLeft)) translateY(var(--destTop));
        }
    }

    .snap-back {
        animation: snap-back 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .frame button {
        visibility: hidden;
        font-size: x-large;
        font-weight: 1000;
        cursor: pointer;
        grid-column: 2;
        background: none;
        border: none;
        color: red;
    }

    .frame button:active {
        border: 1px solid black;
    }

    .frame button:hover {
        background-color: #c7c7c7;
    }

    .frame span {
        visibility: hidden;
        grid-row: 4;
        width: fit-content;
        height: fit-content;
        background-color: white;
    }

    .frame:hover button, .frame:hover span {
        visibility: visible;
    }
</style>

<script>
  import { onMount } from 'svelte';
  import { settings, imageDetails, framesById } from './plannerStores.js';
  import { removeMaskLayer, updateMaskLayer } from './svgDomFunctions.js';

  let frame;
  let animating = false;

  let left = 0;
  let top = 0;
  let opacity = 1.0;

  export let onDrop = () => true;
  export let onPickup = () => {};

  export let frameObject;
  $: zIndex = frameObject.zIndex;
  $: id = frameObject.id;
  $: width = frameObject.width;
  $: height = frameObject.height;
  $: widthInches = frameObject.widthInches;
  $: heightInches = frameObject.heightInches;

  onMount(() => {
    // updateMaskLayer(id, $imageDetails);
  });

  const onMouseDown = (mouseDownEvent) => {
    if (animating) return false;
    onPickup(id);

    // store the original location in case it needs to be reset
    animationStyles.destLeft = left;
    animationStyles.destTop = top;

    const shiftX = mouseDownEvent.clientX - left;
    const shiftY = mouseDownEvent.clientY - top;

    const onMouseMove = (mouseMoveEvent) => {
      // updateMaskLayer(id, $imageDetails);
      opacity = 0.5;
      left = mouseMoveEvent.pageX - shiftX;
      top = mouseMoveEvent.pageY - shiftY;
      framesById.updateFrame({ id, left, top });
    }

    const onAnimationEnd = () => {
      // set the location back to where it was before we started dragging
      left = animationStyles.destLeft;
      top = animationStyles.destTop;
      framesById.updateFrame({ id, left, top });
      animating = false;
      frame.removeEventListener('animationend', onAnimationEnd);
    }

    const onMouseUp = (mouseUpEvent) => {
      opacity = 1.0;
      // updateMaskLayer(id, $imageDetails);
      const legalPlay = onDrop(mouseUpEvent.clientX, mouseUpEvent.clientY);

      if (!legalPlay) {
        // reject the drop, play the snap back animation
        frame.addEventListener('animationend', onAnimationEnd);
        animating = true;
        animationStyles.sourceLeft = left;
        animationStyles.sourceTop = top;
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  const onRotateClick = () => {
    framesById.updateFrame({ id, width: height, height: width, widthInches: heightInches, heightInches: widthInches, });
    requestAnimationFrame(() => {
      // updateMaskLayer(id, $imageDetails);
    });
  };

  const onCloseClick = () => {
    framesById.removeFrame(id);
    // removeMaskLayer(id);
  }

  const animationStyles = {
    sourceLeft: 0,
    sourceTop: 0,
    destLeft: 0,
    destTop: 0,
  };

  $: frameSize = `${width/$settings.pixelsPerInch}"x${height/$settings.pixelsPerInch}"`; // convert to inches

  $: allStyles = {
    ...animationStyles,
    zIndex,
    opacity,
    left: left + 'px',
    top: top + 'px',
    width: width + 'px',
    height: height + 'px',
    borderWidth: $settings.frameBorderWidth + 'px',
  };

  $: cssVariables = Object.entries(allStyles).map(([key, value]) => `--${key}:${value}`).join(';');

</script>

<div
    bind:this={frame}
    class="frame"
    id="frame-{id}"
    class:snap-back={animating}
    style={cssVariables}
    on:mousedown={onMouseDown}
>
  <button on:click={onCloseClick}>x</button>
  <button on:click={onRotateClick}>⟳</button>
  <span>{frameSize}</span>
</div>
