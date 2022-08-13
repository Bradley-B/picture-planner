<style>
  .frame-rect {
      transform: translateX(var(--left)) translateY(var(--top));
  }
</style>

<script>
  import { imageDetails, settings } from './plannerStores.js';

  export let frame;

  $: scale = $imageDetails.sourceWidth / $imageDetails.displayBoundingBox.width; // viewBox pixels per real pixel

  $: left = scale * (frame.left - $imageDetails.displayBoundingBox.x + $settings.frameBorderWidth - 1);
  $: top = scale * (frame.top - $imageDetails.displayBoundingBox.y + $settings.frameBorderWidth - 1);
  $: width = scale * (frame.width + 2);
  $: height = scale * (frame.height + 2);

  $: style = `--left: ${left}px; --top: ${top}px`;
</script>

<rect
    xmlns="http://www.w3.org/2000/svg"
    style="{style}"
    width="{width}"
    height="{height}"
    id="frame-rect-${frame.id}"
    data-id="{frame.id}"
    class="frame-rect"
    fill="white">
</rect>