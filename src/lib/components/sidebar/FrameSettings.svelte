<style>
  .frame-settings-container {
      margin: 10px 0 0 10px;
  }

  .mask-container {
      margin-top: 10px;
      margin-left: 10px;
      margin-bottom: 10px;

      font-family: 'Roboto', sans-serif;

      display: flex;
      align-items: center;
      gap: 10px;
  }

  .btn-container {
      display: flex;
      justify-content: center;
  }

  .btn-container > button {
      font-family: 'Roboto', sans-serif;
      border: none;
      cursor: pointer;
      margin: 0;
      width: 40px;
      height: 30px;
  }

  .btn-container > button:not(.btn-chosen):hover {
      background-color: var(--color-input-background-darken);
      color: white;
  }

  .btn-chosen {
      background-color: var(--color-primary);
      color: white;
  }

</style>

<script>
  import { settings, framesById } from '../../../routes/planner/plannerStores.js';

  let selectedFrameSize;

  const onOnClick = () => settings.updateWith({ isMaskEnabled: true });
  const onOffClick = () => settings.updateWith({ isMaskEnabled: false });
</script>

<div class="frame-settings-container">
  <h2>Frames</h2>
  <div class="mask-container">
    Mask
    <div class="btn-container">
      <button class="on-btn" on:click={onOnClick} class:btn-chosen={$settings.isMaskEnabled}>ON</button>
      <button class="off-btn" on:click={onOffClick} class:btn-chosen={!$settings.isMaskEnabled}>OFF</button>
    </div>
  </div>
  <div class="add-container">
    <button on:click={() => framesById.addFrame(selectedFrameSize)}>add frame</button>

    <select bind:value={selectedFrameSize}>
      {#each $settings.frameSizes as frameSize}
        <option value={frameSize}>
          {frameSize[0]}"x{frameSize[1]}"
        </option>
      {/each}
    </select>
  </div>
</div>