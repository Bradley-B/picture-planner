<style type="text/scss">
  h4 {
    margin: 10px 0 5px 10px;
  }

  input[type=number] {
    height: 15px;
    width: 30px;
    margin-top: 10px;
  }

  input[type=color] {
    opacity: 0;
    width: 100%;
    height: 100%;
  }

  .example-frame {
    box-sizing: border-box;
    margin-top: 10px;
    border: clamp(1px, var(--border-width), 15px) var(--border-color) solid;
    height: 40px;
    width: 70px;

    & > div {
      height: 20px;
      width: 20px;
      background-color: transparent;
      border-radius: 50%;
      border: #F5DFBB solid 2px;
      position: relative;

      &::before {
        content: '';
        display: inline-block;
        background-color: #F5DFBB;
        height: 1px;
        position: relative;
      }
    }
  }

  .circle1 {
    left: calc(-10px - var(--border-width));
    top: calc(-10px - var(--border-width));
    &::before {
      width: 40px;
      left: -41px;
      top: -8px;
      transform: rotate(5deg);
    }
  }

  .circle2 {
    left: calc(56px - var(--border-width));
    top: calc(-14px - var(--border-width));
    &::before {
      width: 130px;
      left: -131px;
      top: 5px;
      transform: rotate(-5deg);
    }
  }

  .color-wrapper {
    background-color: var(--border-color);
    border-radius: 5px;
    border: 1px solid gray;
    position: relative;
    width: 50px;
    left: 15px;
  }

  .border-container {
    overflow-x: hidden;

    & > div {
      display: flex;
      justify-content: space-around;

      & > div {
        display: flex;
        flex-direction: column;
      }
    }
  }

  @media only screen and (orientation: portrait) {
    #example-frame {
      display: none;
    }
    .content-wrapper {
      display: block;
    }
    .color-wrapper {
      position: static;
    }
    #controls-wrapper {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;
      justify-content: space-around;
    }
    input[type=number] {
      margin-top: 0;
      height: 100%;
    }
  }
</style>

<script>
  import { settings } from '../../../routes/planner/plannerStores.js';

  $: styles = `--border-color: ${$settings.frameBorderColor}; --border-width: ${$settings.frameBorderWidth || 1}px;`;
</script>

<div style={styles} class="border-container">
  <h4>Style</h4>
  <div class="content-wrapper">
    <div id="controls-wrapper">
      <div class="color-wrapper">
        <input type="color" bind:value={$settings.frameBorderColor} />
      </div>
      <input bind:value={$settings.frameBorderWidth} min="1" max="15" type="number"/>
    </div>
    <div class="example-frame" id="example-frame">
      <div class="circle1"></div>
      <div class="circle2"></div>
    </div>
  </div>
</div>