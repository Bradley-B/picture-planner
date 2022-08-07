<!--suppress CssUnresolvedCustomProperty -->
<style>
    .frame {
        width: var(--width);
        height: var(--height);
        position: absolute;
        cursor: grab;
        border: solid red 5px;
        /*box-sizing: border-box;*/

        background-color: var(--color);
        z-index: var(--zIndex);
        transform: translateX(var(--left)) translateY(var(--top));
        opacity: var(--opacity);

        display: flex;
        flex-direction: row;
        align-items: flex-end;
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
</style>

<script>
  import { onMount } from 'svelte';
  import { FRAME_SIZE_MULTIPLIER } from './plannerStores.js';

  let frame;
  let animating = false;

  export let onDrop = () => true;
  export let onPickup = () => {};
  export let onMove = () => {};
  export let zIndex = 1;
  export let id = 1;
  export let width = 100;
  export let height = 140;

  onMount(() => {
    onMove(id, frame.getBoundingClientRect());
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
      onMove(id, frame.getBoundingClientRect());
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

  const innerText = `${width/FRAME_SIZE_MULTIPLIER}x${height/FRAME_SIZE_MULTIPLIER}`;

  $: allStyles = { ...styles, ...animationStyles, zIndex, width: width + 'px', height: height + 'px' };
  $: cssVariables = Object.entries(allStyles).map(([key, value]) => `--${key}:${value}`).join(';');

</script>

<div
    bind:this={frame}
    class="frame"
    class:snap-back={animating}
    style={cssVariables}
    on:mousedown={onMouseDown}
>
  <span style="user-select: none; background-color: white">{innerText}</span>
</div>
