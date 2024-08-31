<script>
  export let closeModal;

  let selectedAccounts = [];
  let accounts = [
    { id: 1, name: "Admin1", role: "Administrator" },
    { id: 2, name: "Admin2", role: "Administrator" },
    { id: 3, name: "User1", role: "User" },
    { id: 4, name: "User2", role: "User" },
  ];

  let isConfirmed = false;

  function handleAccountSelection(account) {
    if (selectedAccounts.includes(account.id)) {
      selectedAccounts = selectedAccounts.filter((id) => id !== account.id);
    } else {
      selectedAccounts = [...selectedAccounts, account.id];
    }
  }

  function confirmSelection() {
    console.log("Selected accounts:", selectedAccounts);
    isConfirmed = true;

    setTimeout(() => {
      if (typeof closeModal === "function") {
        closeModal(); // Close the modal after showing confirmation
      }
    }, 2000);
  }
</script>

<main>
  {#if !isConfirmed}
    <h3>등록된 운영/관리자 계정</h3>
    <ul>
      {#each accounts as account}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <li
          class:selected="{selectedAccounts.includes(account.id)}"
          on:click="{() => handleAccountSelection(account)}"
        >
          <span>{account.name} - {account.role}</span>
          {#if selectedAccounts.includes(account.id)}
            <span>&#10003;</span> <!-- Checkmark for selected -->
          {/if}
        </li>
      {/each}
    </ul>
    <button class="button confirm" on:click="{confirmSelection}">
      Confirm Selection
    </button>
  {:else}
    <div class="confirmation">
      <h3>Selection Confirmed!</h3>
      <p>선택이 성공적으로 저장되었습니다.</p>
      <p style="font-style: italic;">
        Your selection has been saved successfully.
      </p>
    </div>
  {/if}
</main>

<style>
  main {
    padding: 20px;
  }
  h3 {
    margin: 0 0 10px;
    font-size: 18px;
    text-align: center;
  }
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  ul li {
    padding: 10px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  ul li:last-child {
    border-bottom: none;
  }

  ul li:hover {
    background-color: #f0f0f0;
  }

  ul li.selected {
    background-color: #d0e6f7;
  }

  ul li.selected:hover {
    background-color: #c2dbe9;
  }
  .button {
    background-color: #2196f3;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  .button:hover {
    background-color: #1976d2;
  }

  .button.confirm {
    background-color: #4caf50;
  }

  .button.confirm:hover {
    background-color: #388e3c;
  }
</style>
