<script>
  export let showModal; // boolean
  export let showModalSecond;

  let dialog; // HTMLDialogElement
  let dialogSecond; // HTMLDialogElement for the second modal
  $: if (dialog && showModal) dialog.showModal();
  $: if (dialogSecond && showModalSecond) dialogSecond.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this="{dialog}"
  on:close="{() => (showModal = false)}"
  on:click|self="{() => dialog.close()}"
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation>
    <slot name="header" />
    <hr />
    <slot />
    <hr />
    <!-- svelte-ignore a11y-autofocus -->
    <button autofocus on:click="{() => dialog.close()}">Close</button>
  </div>
</dialog>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this="{dialogSecond}"
  on:close="{() => (showModalSecond = false)}"
  on:click|self="{() => dialogSecond.close()}"
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div on:click|stopPropagation>
    <slot name="headerSecond" />
    <hr />
    <slot name="contentSecond" />
    <hr />
    <!-- svelte-ignore a11y-autofocus -->
    <button autofocus on:click="{() => dialogSecond.close()}">Close</button>
  </div>
</dialog>

<style>
  dialog {
    max-width: 62em;
    border-radius: 0.2em;
    border: none;
    padding: 0;
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
  }
</style>
