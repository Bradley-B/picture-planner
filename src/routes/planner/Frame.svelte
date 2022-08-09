<!--suppress CssUnresolvedCustomProperty -->
<style>
    .frame {
        width: var(--width);
        height: var(--height);
        position: absolute;
        cursor: grab;
        border: solid red 5px; /* TODO figure out if having a border negatively affects background image size calculation */
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
  import { imageDetails, framesById, PIXELS_PER_INCH } from './plannerStores.js';
  import { removeMaskLayer, updateMaskLayer } from './svgDomFunctions.js';

  let frame;
  let animating = false;

  export let onDrop = () => true;
  export let onPickup = () => {};

  export let zIndex = 1;
  export let id = 1;
  export let width = 100;
  export let height = 140;

  onMount(() => {
    updateMaskLayer(id, $imageDetails);
  });

  const onMouseDown = (mouseDownEvent) => {
    if (animating) return false;
    onPickup(id);

    // store the original location in case it needs to be reset
    animationStyles.destLeft = styles.left;
    animationStyles.destTop = styles.top;

    const shiftX = mouseDownEvent.clientX - parseInt(styles.left);
    const shiftY = mouseDownEvent.clientY - parseInt(styles.top);

    const onMouseMove = (mouseMoveEvent) => {
      updateMaskLayer(id, $imageDetails);
      styles.opacity = 0.5;
      styles.left = mouseMoveEvent.pageX - shiftX + 'px';
      styles.top = mouseMoveEvent.pageY - shiftY + 'px';
    }

    const onAnimationEnd = () => {
      // set the location back to where it was before we started dragging
      styles.left = animationStyles.destLeft;
      styles.top = animationStyles.destTop;
      animating = false;
      frame.removeEventListener('animationend', onAnimationEnd);
    }

    const onMouseUp = (mouseUpEvent) => {
      styles.opacity = 1.0;
      updateMaskLayer(id, $imageDetails);
      const legalPlay = onDrop(mouseUpEvent.clientX, mouseUpEvent.clientY);

      if (!legalPlay) {
        // reject the drop, play the snap back animation
        frame.addEventListener('animationend', onAnimationEnd);
        animating = true;
        animationStyles.sourceLeft = styles.left;
        animationStyles.sourceTop = styles.top;
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  const onRotateClick = () => {
    framesById.updateFrame({ id, width: height, height: width });
    requestAnimationFrame(() => {
      updateMaskLayer(id, $imageDetails);
    });
  };

  const onCloseClick = () => {
    framesById.removeFrame(id);
    removeMaskLayer(id);
  }

  const styles = {
    left: 0,
    top: 0,
    opacity: 1.0,
  };

  const animationStyles = {
    sourceLeft: 0,
    sourceTop: 0,
    destLeft: 0,
    destTop: 0,
  };

  $: frameSize = `${width/PIXELS_PER_INCH}x${height/PIXELS_PER_INCH}`; // convert to inches

  $: allStyles = { ...styles, ...animationStyles, zIndex, width: width + 'px', height: height + 'px' };
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
