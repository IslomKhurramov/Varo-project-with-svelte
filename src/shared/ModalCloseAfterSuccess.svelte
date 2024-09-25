<script>
  export let showModal; // Control modal visibility
  let dialog;

  // Automatically open the modal when `showModal` becomes `true`
  $: if (dialog && showModal) dialog.showModal();

  // Emit a success event and close the modal
  function handleSuccessAndClose() {
    const successEvent = new CustomEvent("success", {
      detail: { message: "Group changed successfully!" },
    });
    dispatchEvent(successEvent); // Dispatch success event to the parent
    dialog.close(); // Close the modal
    showModal = false; // Set the reactive variable to false
  }
</script>

<dialog bind:this={dialog} on:close={() => (showModal = false)}>
  <div on:click|stopPropagation>
    <slot></slot>
    <hr />
    <!-- Button to close the modal manually -->
    <button on:click={handleSuccessAndClose}>Close Modal on Success</button>
  </div>
</dialog>

<style>
  dialog {
    max-width: 600px;
    border-radius: 5px;
    padding: 20px;
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }
</style>
