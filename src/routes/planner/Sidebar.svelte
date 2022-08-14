<style>
    #sidebar {
        background-color: wheat;
        width: 300px;
        height: 100%;
    }

    input[type=checkbox] {
        margin-right: 5px;
    }

    input[type=number] {
        margin-left: 5px;
        width: 55px;
    }
</style>

<script>
  import { settings, imageDetails, framesById } from './plannerStores.js';
  import { download, generateCollectionZip, getCanvasFromBlob, getSvgForDownload } from '../../lib/exportFunctions.js';

  let selectedFrameSize;

  const onFileSelect = event => {
    imageDetails.replaceImage(event.target.files[0]);
  };

  const onPixelsPerInchInput = event => {
    const input = event.target.value;
    if (input === '' || input === 0) return;
    settings.updatePixelsPerInch(input);
  };

  const exportImage = () => {
    const blobUrl = getSvgForDownload();
    getCanvasFromBlob(blobUrl, $imageDetails).then(([canvas]) => {
      download(canvas.toDataURL($imageDetails.type), `collage.${$imageDetails.type.split('/')[1]}`, blobUrl);
    });
  };

  const exportSvg = () => {
    download(getSvgForDownload(), 'collage.svg');
  }

  const exportCollection = () => {
    const blobUrl = getSvgForDownload();

    getCanvasFromBlob(blobUrl, $imageDetails).then(([, sourceCanvasContext]) => {
      return generateCollectionZip($framesById, $imageDetails, $settings, sourceCanvasContext);
    }).then(content => {
      URL.revokeObjectURL(blobUrl);
      const contentUrl = URL.createObjectURL(content);
      download(contentUrl, 'collage.zip');
    });
  };

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

  $: displayWidthInches = $imageDetails.displayBoundingBox.width / $settings.pixelsPerInch;
  $: displayHeightInches = $imageDetails.displayBoundingBox.height / $settings.pixelsPerInch;

</script>

<div id="sidebar">
  <label><input type="checkbox" bind:checked={$settings.isMaskEnabled}>Toggle Mask</label><br/>
  <label>Pixels per inch<input type="number" value={$settings.pixelsPerInch} on:input={onPixelsPerInchInput} min="1"></label>
  <input type="file" accept=".jpg, .jpeg, .png" on:change={onFileSelect}>
  <button on:click={() => framesById.addFrame(selectedFrameSize)}>add frame</button>

  <select bind:value={selectedFrameSize}>
    {#each $settings.frameSizes as frameSize}
      <option value={frameSize}>
        {frameSize[0]}"x{frameSize[1]}"
      </option>
    {/each}
  </select><br/>

  <button disabled={$imageDetails.src === 'default-image.jpg'} on:click={exportSvg}>export as svg</button>
  <button disabled={$imageDetails.src === 'default-image.jpg'} on:click={exportImage}>export as image</button>
  <button disabled={$imageDetails.src === 'default-image.jpg'} on:click={exportCollection}>export as collection</button>

  <p>
    total size is
    <input type="number" value={displayWidthInches} on:input={onDisplayWidthInput} min="1" />" x
    <input type="number" value={displayHeightInches} on:input={onDisplayHeightInput} min="1" />"
  </p>
</div>
