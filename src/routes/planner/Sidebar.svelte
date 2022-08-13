<style>
    #open-button-wrapper {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }
    #open-button {
        height: 87px;
        width: 70px;
        user-select: none;
        background-color: transparent;
        border: none;
        font-size: 4rem;
        cursor: pointer;
    }
    #open-button:hover {
        background-color: darkgray;
    }
    #open-button:active {
        border: 1px solid black;
    }

    #sidebar {
        width: auto;
        height: 100%;
        background-color: wheat;
        display: grid;
        grid-template-rows: min-content 10px auto;
    }
    #sidebar-body {
        width: 300px;
        height: 100%;
        margin-left: auto !important;
        grid-area: 3;
    }

    input[type=checkbox] {
        margin-right: 5px;
    }

    input[type=number] {
        margin-left: 5px;
        width: 40px;
    }
</style>

<script>
  import { settings, imageDetails, framesById } from './plannerStores.js';
  import { slide } from '../../lib/transitions.js';
  import { download, downloadImageFromBlob, getSvgHtmlForDownload } from '../../lib/utilityFunctions.js';

  let isNavOpen = true;
  let selectedFrameSize;

  const onFileSelect = event => {
    imageDetails.replaceImage(event.target.files[0]);
  };

  const onPixelsPerInchInput = event => {
    framesById.recalculateFrameSizes(event.target.value);
  };

  const exportImage = () => {
    const svg = getSvgHtmlForDownload();
    const blob = new Blob([svg.outerHTML],{ type: 'image/svg+xml;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    downloadImageFromBlob(blobUrl, $imageDetails);
  };

  const exportSvg = () => {
    const svg = getSvgHtmlForDownload();
    const blob = new Blob(['<?xml version="1.0" standalone="no"?>\r\n', svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(blob);
    download(svgUrl, 'collage.svg');
  }

  $: displayWidthInches = Math.round($imageDetails.displayBoundingBox.width * (1/$settings.pixelsPerInch) * 100) / 100;
  $: displayHeightInches = Math.round($imageDetails.displayBoundingBox.height * (1/$settings.pixelsPerInch) * 100) / 100;

</script>

<div id="sidebar">
  <div id="open-button-wrapper">
    <button id="open-button" on:click={() => { isNavOpen = !isNavOpen; }}>{ isNavOpen ? 'X' : '☰' }</button>
  </div>

  {#if isNavOpen}
    <div id="sidebar-body" transition:slide={{ duration: 500 }}>

      <label><input type="checkbox" bind:checked={$settings.isMaskEnabled}>Toggle Mask</label><br/>
      <label>Pixels per inch<input type="number" bind:value={$settings.pixelsPerInch} on:input={onPixelsPerInchInput}></label>
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
      <p>image is currently {displayWidthInches}"x{displayHeightInches}"</p>
    </div>
  {/if}
</div>
