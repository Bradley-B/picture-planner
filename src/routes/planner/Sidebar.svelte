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
        width: 200px;
        height: 100%;
        margin-left: auto !important;
        grid-area: 3;
    }
</style>

<script>
  import { framesById } from './plannerStores.js';
  import { slide } from '../../lib/transitions.js';

  let isNavOpen = false;
</script>

<div id="sidebar">
  <div id="open-button-wrapper">
    <button id="open-button" on:click={() => { isNavOpen = !isNavOpen; }}>{ isNavOpen ? 'X' : '☰' }</button>
  </div>
  {#if isNavOpen}
    <div id="sidebar-body" transition:slide={{ duration: 500 }}>
      <button on:click={() => framesById.addFrame()}>add frame</button>
    </div>
  {/if}
</div>
