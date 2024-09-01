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
    font-family: "Arial", sans-serif;
    color: #333;
    max-width: 400px;
    margin: 0 auto;
  }

  h3 {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    color: #333;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  ul li {
    padding: 15px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition:
      background-color 0.3s ease,
      transform 0.2s ease;
    background-color: #f9f9f9;
  }

  ul li:last-child {
    border-bottom: none;
  }

  ul li:hover {
    background-color: #e0e7ff;
    transform: translateY(-2px);
  }

  ul li.selected {
    background-color: #d0e6f7;
    color: #0056b3;
  }

  ul li.selected:hover {
    background-color: #c2dbe9;
  }

  .button {
    display: block;
    width: 100%;
    text-align: center;
    background-color: #2196f3;
    color: white;
    padding: 12px;
    margin-top: 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition:
      background-color 0.3s ease,
      transform 0.2s ease;
  }

  .button:hover {
    background-color: #1976d2;
    transform: translateY(-2px);
  }

  .button.confirm {
    background-color: #4caf50;
  }

  .button.confirm:hover {
    background-color: #388e3c;
  }

  .confirmation {
    text-align: center;
    padding: 20px;
    border-radius: 8px;
    background-color: #e8f5e9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .confirmation h3 {
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
    color: #388e3c;
  }

  .confirmation p {
    margin: 0;
    color: #333;
  }

  .confirmation p:nth-child(3) {
    margin-top: 5px;
    font-style: italic;
    color: #666;
  }
</style>
