<script>
  import Modal from "../../shared/Modal.svelte";
  import ModalEditItem from "./ModalEditItem.svelte";

  let showModal = false;
  let selectedItem = null;

  let tableData = [
    {
      id: 1,
      category: "UNIX",
      item: "계정 관리",
      code: "U-01",
      description: "패스워드 최소 길이 설정",
      system: "UNIX",
      criteria: "8자 이상",
      checkItem: "패스워드 길이 체크",
      risk: "상",
      status: "수정",
      isDefault: true,
    },
    // Add more rows as needed
  ];

  function openModal(item) {
    if (!item.isDefault) {
      selectedItem = item;
      showModal = true;
    } else {
      alert("Default settings cannot be changed.");
    }
  }
</script>

<main>
  <div class="header_buttons">
    <button>UNIX</button>
    <button>PC</button>
    <button>NETWORK</button>
    <button>CLOUD</button>
  </div>
  <div class="table_container">
    <table class="table">
      <thead>
        <tr>
          <th></th>
          <th>번호</th>
          <th>항목분류</th>
          <th>점검항목</th>
          <th>항목코드</th>
          <th>설명</th>
          <th>시스템</th>
          <th>기준</th>
          <th>점검항목</th>
          <th>위험도</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        {#each tableData as row}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <tr on:click="{() => openModal(row)}">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <td on:click|stopPropagation><input type="checkbox" /></td>
            <td>{row.id}</td>
            <td>{row.category}</td>
            <td>{row.item}</td>
            <td>{row.code}</td>
            <td>{row.description}</td>
            <td>{row.system}</td>
            <td>{row.criteria}</td>
            <td>{row.checkItem}</td>
            <td>{row.risk}</td>
            <td on:click|stopPropagation>
              {#if !row.isDefault}
                <button class="status-button">{row.status}</button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if showModal}
    <Modal bind:showModal>
      <ModalEditItem {selectedItem} />
    </Modal>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    background-color: #f7f9fb;
    padding: 10px;
    margin-bottom: 40px;
    font-family: "Arial", sans-serif;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-top: 10px;
  }
  .header_buttons {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin: 20px 0;
  }

  .header_buttons button {
    background-color: #007acc;
    color: #ffffff;
    border-radius: 5px;
    height: 36px;
    width: 130px;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    border: none;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .header_buttons button:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .table_container {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
    color: #333;
    background-color: #f7f9fb;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
    color: #333;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 10px 15px;
    text-align: left;
    vertical-align: middle;
  }

  th {
    background-color: #005fa3;
    color: #ffffff;
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 14px;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #e0f7fa;
  }

  tr {
    cursor: pointer;
  }

  .status-button {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .status-button:hover {
    background-color: #388e3c;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
