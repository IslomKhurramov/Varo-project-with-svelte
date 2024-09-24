<script>
  export let showModal;
  export let modalWidth;
  export let modalHeight;
  export let showModalSecond;
  export let showModalRegisteredAdmin;

  let dialog;
  let dialogSecond;
  let dialogThird;

  $: {
    console.log("modalWidth: ", modalWidth);
  }

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
  style="width: {modalWidth}%; height: {modalHeight}%"
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => dialog.close()}
>
  <div on:click|stopPropagation>
    <slot name="header" />
    <slot />
    <button on:click={() => dialog.close()}>닫기</button>
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
    display: block;
    float: right;
    background-color: #315e83;
    color: #fff;
  }
</style>
