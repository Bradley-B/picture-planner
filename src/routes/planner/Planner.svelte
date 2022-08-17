<style>
  #planner-page {
      width: 100vw;
      height: 100vh;
      display: grid;
      grid-template-columns: auto min-content 50px;
      background-color: #534D41;
      overflow: hidden;
  }

  @media only screen and (orientation: portrait) {
    #planner-page {
        grid-template-columns: auto;
        grid-template-rows: auto min-content 60px;
    }
  }
</style>

<script>
  import Mat from './Mat.svelte';
  import Sidebar from './Sidebar.svelte';
</script>

<div id="planner-page">
  <Mat />
  <Sidebar />
</div>
