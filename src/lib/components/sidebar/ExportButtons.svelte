<style>
    h3 {
        margin: 0 0 10px 10px;
    }

    .buttons-container {
        display: flex;
        flex-flow: wrap;
        justify-content: center;
        width: 100%;
    }

    button {
        font-family: 'Roboto', sans-serif;
        margin: 2px;
        cursor: pointer;
        border: 1px gray solid;
        border-radius: 3px;
        height: 25px;
    }

    :disabled {
        cursor: auto;
    }

    button:not(:disabled):hover {
        background-color: var(--color-input-background);
    }

    button:not(:disabled):active {
        background-color: var(--color-primary);
        color: white;
    }
</style>

<script>
  import { framesById, imageDetails, settings } from '../../../routes/planner/plannerStores.js';
  import { download, generateCollectionZip, getCanvasFromBlob, getSvgForDownload } from '../../exportFunctions.js';

  $: buttonsDisabled = $imageDetails.src === 'default-image.jpg';

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
</script>

<h3>Export</h3>
<div class="buttons-container">
  <button disabled={buttonsDisabled} on:click={exportSvg}>export as svg</button>
  <button disabled={buttonsDisabled} on:click={exportImage}>export as image</button>
  <button disabled={buttonsDisabled} on:click={exportCollection}>export as collection</button>
</div>