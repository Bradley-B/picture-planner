<style>
  .frame-settings-container {
      margin: 10px 0 0 10px;
  }

  button {
      font-family: 'Roboto', sans-serif;
      cursor: pointer;
      border: none;
  }

  .mask-container {
      margin-top: 10px;
      margin-left: 10px;
      margin-bottom: 10px;

      display: flex;
      align-items: center;
      gap: 10px;
  }

  .btn-container {
      display: flex;
      justify-content: center;
  }

  .btn-container > button {
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

  .add-container {
      margin-left: 10px;
  }

  .add-container > button {
      background-color: white;
      height: 25px;
  }

  .add-container > button:hover {
      background-color: var(--color-input-background-darken);
      color: white;
  }

  .add-container > button:active {
      background-color: var(--color-primary);
      color: white;
  }

  select {
      height: 20px;
  }

</style>

<script>
  import { settings, framesById } from '../../../routes/planner/plannerStores.js';

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
</div>