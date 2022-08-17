<style type="text/scss">
  .frame-settings-container {
    margin: 10px 0 0 10px;

    & > div {
      margin-left: 10px;
    }
  }

  button {
    font-family: 'Roboto', sans-serif;
    cursor: pointer;
    border: none;
  }

  .mask-container {
    margin-top: 10px;
    margin-bottom: 10px;

    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn-container {
    display: flex;
    justify-content: center;

    & > button {
      margin: 0;
      width: 40px;
      height: 30px;

      &:not(.btn-chosen):hover {
        background-color: var(--color-input-background);
      }
    }
  }

  .btn-chosen {
      background-color: var(--color-primary);
      color: white;
  }

  .add-container {
    & > button {
      background-color: white;
      height: 25px;
      border: 1px gray solid;
      border-radius: 3px;

      &:hover {
        background-color: var(--color-input-background);
      }

      &:active {
        background-color: var(--color-primary);
        color: white;
      }
    }
  }

  input[type=number] {
    width: 50px;
  }

  select {
      height: 20px;
  }

  @media only screen and (orientation: portrait) {
    .frame-settings-container {
      margin-right: 10px;
    }
  }
</style>

<script>
  import { settings, framesById } from '../../../plannerStores.js';
  import FrameBorderSettings from './FrameBorderSettings.svelte';

  let selectedFrameSize;

  const onOnClick = () => settings.updateWith({ isMaskEnabled: true });
  const onOffClick = () => settings.updateWith({ isMaskEnabled: false });
  const onFrameAdd = () => framesById.addFrame(selectedFrameSize);
</script>

<div class="frame-settings-container">
  <h3>Frames</h3>
  <div class="mask-container">
    Mask
    <div class="btn-container">
      <button class="on-btn" on:click={onOnClick} class:btn-chosen={$settings.isMaskEnabled}>ON</button>
      <button class="off-btn" on:click={onOffClick} class:btn-chosen={!$settings.isMaskEnabled}>OFF</button>
    </div>
  </div>
  <div class="add-container">
    <button on:click={onFrameAdd}>add frame</button>
    <select bind:value={selectedFrameSize}>
      {#each $settings.frameSizes as frameSize}
        <option value={frameSize}>
          {frameSize[0]}"x{frameSize[1]}"
        </option>
      {/each}
    </select>
  </div>
  <FrameBorderSettings />
</div>