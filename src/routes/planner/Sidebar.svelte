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

    hr:last-child {
        margin-bottom: 50px;
    }

    .import-export-container {
        width: 100%;
    }

    h3 {
        margin-left: 10px;
        margin-bottom: 10px;
    }

    input[type=file] {
        margin-left: 20px;
        width: calc(100% - 20px);
    }

    @media only screen and (orientation: portrait) {
        #sidebar {
            flex-direction: row;
            overflow-x: auto;
            width: 100%;
            height: 200px;
        }
        hr {
            margin: 0;
        }
        .portrait-hidden {
            display: none;
        }
        .import-export-container {
            width: 150px;
        }
        input[type=file] {
            color: transparent;
            display: block;
            margin: 0 auto 0 auto;
        }
        h3 {
            margin-top: 10px;
        }
    }
</style>

<script>
  import { imageDetails } from './plannerStores.js';
  import FrameSettings from '../../lib/components/sidebar/FrameSettings.svelte';
  import ImageSizeSettings from '../../lib/components/sidebar/ImageSizeSettings.svelte';
  import ExportButtons from '../../lib/components/sidebar/ExportButtons.svelte';

  const onFileSelect = event => {
    imageDetails.replaceImage(event.target.files[0]);
  };
</script>

<div id="sidebar">
  <FrameSettings />
  <hr />
  <ImageSizeSettings />
  <hr />
  <div class="import-export-container">
    <h3>Import</h3>
    <input type="file" accept=".jpg, .jpeg, .png" on:change={onFileSelect}>
    <hr class="portrait-hidden"/>
    <ExportButtons />
  </div>
  <hr />
</div>
