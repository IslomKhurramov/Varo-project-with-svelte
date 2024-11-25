<script>
  export let showModal;
  export let modalWidth;
  export let modalHeight;
  export let showModalSecond = null;
  export let showModalRegisteredAdmin = null;
  export let modalData;

  let dialog;
  let dialogSecond;
  let dialogThird;

  function scrollToTop(dialogElement) {
    if (dialogElement) {
      dialogElement.scrollTop = 0; // Reset scroll position
    }
  }

  $: if (dialog && showModal) {
    dialog.showModal();
    scrollToTop(dialog);
  }
  $: if (dialogSecond && showModalSecond) dialogSecond.showModal();
  $: if (dialogThird && showModalRegisteredAdmin) dialogThird.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  style="width: {modalWidth}%; height: {modalHeight}px; overflow: hidden;"
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => {
    dialog.close();
    modalData = [];
  }}
>
  <div style="height: 100%; overflow: auto;" on:click|stopPropagation>
    <slot name="header" />
    <slot />
    <button
      on:click={() => {
        dialog.close();
        modalData = [];
      }}>닫기</button
    >
  </div>
</dialog>

<style>
  dialog {
    border-radius: 0.2em;
    border: none;
    padding: 20px;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
  dialog > div {
    padding: 1em;
  }
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.2s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  button {
    display: flex;
    float: right;
    margin-top: 20px;
    background-color: #4caf50;
    color: white;
    display: flex;
    height: 40px;
    justify-content: space-around;
    align-items: center;
    outline: none;
    padding: 0 12px;
    font-size: 14px;
    font-weight: 500;
    border-radius: 6px;
    border: 1px solid transparent;
    box-sizing: border-box;
    cursor: pointer;
    transition-duration: 0.3s;
  }
</style>
