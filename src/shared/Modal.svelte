<script>
  export let showModal; // boolean
  export let showModalSecond;
  export let showModalRegisteredAdmin;
  export let insertData;

  let dialog; // HTMLDialogElement
  let dialogSecond; // HTMLDialogElement for the second modal
  let dialogThird; // HTMLDialogElement for the third modal

  $: if (dialog && showModal) dialog.showModal();
  $: if (dialogSecond && showModalSecond) dialogSecond.showModal();
  $: if (dialogThird && showModalRegisteredAdmin) dialogThird.showModal();

  // Function to handle the success action, close modal and emit custom event
  function handleSuccessAndClose() {
    // Simulate a successful action
    const successEvent = new CustomEvent("success", {
      detail: { message: "Success!" },
    });
    dialog.close(); // Close the modal
    showModal = false; // Ensure modal doesn't reopen on reactive updates
    dispatchEvent(successEvent); // Emit the success event
  }
</script>

<!-- First Modal -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<dialog
  bind:this={dialog}
  on:close={() => (showModal = false)}
  on:click|self={() => {
    dialog.close();
    insertData = {};
  }}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-autofocus -->
  <div on:click|stopPropagation>
    <slot name="header" />
    <hr />
    <slot />
    <hr />
    <!-- svelte-ignore a11y-autofocus -->
    <button
      autofocus
      on:click={() => {
        dialog.close();
        insertData = {};
      }}>Close</button
    >
  </div>
</dialog>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- Second Modal -->
<dialog
  bind:this={dialogSecond}
  on:close={() => (showModalSecond = false)}
  on:click|self={() => {
    dialogSecond.close();
    insertData = {};
  }}
>
  <div on:click|stopPropagation>
    <slot name="headerSecond" />
    <hr />
    <slot name="contentSecond" />
    <hr />
    <!-- svelte-ignore a11y-autofocus -->
    <button
      autofocus
      on:click={() => {
        dialogSecond.close();
        insertData = {};
      }}>Close</button
    >
  </div>
</dialog>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- Third Modal -->
<dialog
  bind:this={dialogThird}
  on:close={() => (showModalRegisteredAdmin = false)}
  on:click|self={() => {
    dialogThird.close();
    insertData = {};
  }}
>
  <div on:click|stopPropagation>
    <slot name="headerThird" />
    <hr />
    <slot name="contentThird" />
    <hr />
    <!-- svelte-ignore a11y-autofocus -->
    <button
      autofocus
      on:click={() => {
        dialogThird.close();
        insertData = {};
      }}>Close</button
    >
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
