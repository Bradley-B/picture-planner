<style>
  .image-settings-container {
      margin-left: 10px;
  }

  .input-container {
      margin: 10px 0 5px 10px;
  }

  label {
      margin-left: 30px;
  }

  input[type=number] {
      width: 55px;
  }
</style>

<script>
  import { imageDetails, settings } from '../../../routes/planner/plannerStores.js';

  $: displayWidthInches = $imageDetails.displayBoundingBox.width / $settings.pixelsPerInch;
  $: displayHeightInches = $imageDetails.displayBoundingBox.height / $settings.pixelsPerInch;

  const onDisplayWidthInput = event => {
    const input = event.target.value;
    if (input === '' || input === 0) return;
    const newPixelsPerInch = $imageDetails.displayBoundingBox.width / input;
    settings.updatePixelsPerInch(newPixelsPerInch);
  };

  const onDisplayHeightInput = event => {
    const input = event.target.value;
    if (input === '' || input === 0) return;
    const newPixelsPerInch = $imageDetails.displayBoundingBox.height / input;
    settings.updatePixelsPerInch(newPixelsPerInch);
  };

  const onPixelsPerInchInput = event => {
    const input = event.target.value;
    if (input === '' || input === 0) return;
    settings.updatePixelsPerInch(input);
  };
</script>

<div class="image-settings-container">
  <h3>Image Size</h3>
  <div class="input-container">
    <input type="number" step="any" value={displayWidthInches} on:input={onDisplayWidthInput} min="1" />" x
    <input type="number" step="any" value={displayHeightInches} on:input={onDisplayHeightInput} min="1" />"
  </div>
  <label>at <input type="number" step="any" value={$settings.pixelsPerInch} on:input={onPixelsPerInchInput} min="1"> pixels per inch</label>
</div>
