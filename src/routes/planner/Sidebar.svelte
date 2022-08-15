<style>
    #sidebar {
        font-family: 'Roboto', sans-serif;
        color: #F5DFBB;
        background-color: #454036;
        width: 250px;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    hr {
        border: #534D41 2px solid;
        margin: 15px 0 15px 0;
    }
</style>

<script>
  import { settings, imageDetails, framesById } from './plannerStores.js';
  import { download, generateCollectionZip, getCanvasFromBlob, getSvgForDownload } from '../../lib/exportFunctions.js';
  import FrameSettings from '../../lib/components/sidebar/FrameSettings.svelte';
  import ImageSizeSettings from '../../lib/components/sidebar/ImageSizeSettings.svelte';

  const onFileSelect = event => {
    imageDetails.replaceImage(event.target.files[0]);
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

</script>

<div id="sidebar">
  <FrameSettings />
  <hr />
  <ImageSizeSettings />
  <hr />

  <input type="file" accept=".jpg, .jpeg, .png" on:change={onFileSelect}>

  <button disabled={$imageDetails.src === 'default-image.jpg'} on:click={exportSvg}>export as svg</button>
  <button disabled={$imageDetails.src === 'default-image.jpg'} on:click={exportImage}>export as image</button>
  <button disabled={$imageDetails.src === 'default-image.jpg'} on:click={exportCollection}>export as collection</button>
</div>
