<!--suppress CssUnresolvedCustomProperty -->
<style>
    .frame {
        width: var(--width);
        height: var(--height);

        position: fixed;
        top: 0;
        left: 0;

        cursor: grab;
        border: solid var(--borderColor) var(--borderWidth); /* TODO figure out if having a border negatively affects background image size calculation */
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
  import { settings, framesById } from './plannerStores.js';

  let frame;
  let opacity = 1.0;
  export let onPickup = () => {};
  export let frameObject;

  $: zIndex = frameObject.zIndex;
  $: id = frameObject.id;
  $: width = frameObject.width;
  $: height = frameObject.height;
  $: widthInches = frameObject.widthInches;
  $: heightInches = frameObject.heightInches;

  $: left = frameObject.left;
  $: top = frameObject.top;

  const onMouseDown = (mouseDownEvent) => {
    onPickup(id);

    const shiftX = (mouseDownEvent.clientX || mouseDownEvent.targetTouches[0].clientX) - left;
    const shiftY = (mouseDownEvent.clientY || mouseDownEvent.targetTouches[0].clientY) - top;

    const onMouseMove = (mouseMoveEvent) => {
      opacity = 0.5;
      const left = (mouseMoveEvent.pageX || mouseMoveEvent.targetTouches[0].pageX) - shiftX;
      const top = (mouseMoveEvent.pageY || mouseMoveEvent.targetTouches[0].pageY) - shiftY;
      framesById.updateFrame({ id, left, top });
    }

    const onMouseUp = () => {
      opacity = 1.0;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('touchend', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
  }

  const onRotateClick = () => {
    framesById.updateFrame({ id, width: height, height: width, widthInches: heightInches, heightInches: widthInches, });
  };

  const onCloseClick = () => {
    framesById.removeFrame(id);
  }

  $: frameSize = `${widthInches}"x${heightInches}"`;

  $: allStyles = {
    zIndex,
    opacity,
    left: left + 'px',
    top: top + 'px',
    width: width + 'px',
    height: height + 'px',
    borderWidth: $settings.frameBorderWidth + 'px',
    borderColor: $settings.frameBorderColor,
  };

  $: cssVariables = Object.entries(allStyles).map(([key, value]) => `--${key}:${value}`).join(';');

</script>

<div
    bind:this={frame}
    class="frame"
    id="frame-{id}"
    style={cssVariables}
    on:mousedown={onMouseDown}
    on:touchstart={onMouseDown}
>
  <button on:click={onCloseClick}>x</button>
  <button on:click={onRotateClick}>⟳</button>
  <span>{frameSize}</span>
</div>
