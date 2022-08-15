<style>
  #planner-page {
      width: 100vw;
      height: 100vh;
      display: grid;
      grid-template-columns: auto min-content 50px;
      background-color: #534D41;
      overflow: hidden;
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
