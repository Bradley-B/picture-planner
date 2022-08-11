<style>
  .frame-rect {
      transform: translateX(var(--left)) translateY(var(--top));
  }
</style>

<script>
  import { imageDetails, settings } from './plannerStores.js';

  export let frame;
  export let svgImageBoundingBox;

  $: scale = $imageDetails.width / svgImageBoundingBox.width; // viewBox pixels per real pixel

  $: left = scale * (Math.round(frame.left - svgImageBoundingBox.x) + $settings.frameBorderWidth);
  $: top = scale * (Math.round(frame.top - svgImageBoundingBox.y) + $settings.frameBorderWidth);
  $: width = scale * frame.width;
  $: height = scale * frame.height;

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