<script>
  export let text = "";
  let visible = false;
</script>

<div
  class="tooltip"
  on:mouseenter={() => (visible = true)}
  on:mouseleave={() => (visible = false)}
>
  <slot></slot>
  {#if visible}
    <span class="tooltiptext">{text}</span>
  {/if}
</div>

<style>
  .tooltip {
    width: 100%;
    position: relative;
    display: inline-block;
  }
  .tooltip .tooltiptext {
    visibility: hidden;
    width: 100%;
    height: auto;
    background-color: rgba(0, 0, 0, 0.723);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    z-index: 1;
    bottom: 100%;
    left: 0%;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
</style>
