<script>
  import Modal from "../../shared/Modal.svelte";
  import ModalEditItem from "./ModalEditItem.svelte";

  export let allChecklistArray;
  export let filteredData = [];
  export let selectedCategory = "UNIX";
  export let selectedChecklist = null;
  export let searchResult;
  export let isSearchActive;

  let showModal = false;
  let formattedDate = "";
  let selectedItem = null;

  // Filter the data according to the selected checklist index
  let filteredChecklistData = [];

  // Ensure selectedChecklist[selectedCategory] is an array
  $: if (selectedChecklist) {
    filteredChecklistData = selectedChecklist[selectedCategory] || [];
    if (!Array.isArray(filteredChecklistData)) {
      filteredChecklistData = [];
    }
  }

  // Convert to a more human-readable format
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const timeOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return `${date.toLocaleDateString("en-US", options)} ${date.toLocaleTimeString("en-US", timeOptions)}`;
  }
</script>

<main>
  <p>점검그룹</p>
  <div class="table1">
    {#if isSearchActive}
      <table>
        <thead>
          <tr>
            <th>남버</th>
            <th>점검대상</th>
            <th>항목그룹</th>
            <th>식별코드</th>
            <th>점검항목</th>
            <th>위험도</th>
            <th>평가기준</th>
          </tr>
        </thead>
        <tbody>
          {#if searchResult.length > 0}
            {#each searchResult as item, index}
              <tr
                on:click="{() => {
                  selectedItem = item;
                  showModal = true;
                }}"
              >
                <td>{index + 1}</td>
                <td>{selectedCategory}</td>
                <td>{item.ccc_index}</td>
                <td>{item.ccc_item_no}</td>
                <td>{item.ccc_item_title}</td>
                <td>{item.ccc_item_level}</td>
                <td>{item.ccc_item_criteria}</td>
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="7">점검대상 선택해 주세요</td>
            </tr>
          {/if}
        </tbody>
      </table>
    {:else}
      <table>
        <tr>
          <th>넘버</th>
          <th>점검항목이름</th>
          <th>분류</th>
          <th>지원대상</th>
          <th>등록일</th>
          <th>삭제</th>
        </tr>
        {#each allChecklistArray as data}
          <tr>
            <td>{data.cgl_index_id}</td>
            <td>{data.ccg_group}</td>
            <td>{data.ccg_checklist_year}</td>
            <td>{data.ccg_support_part}</td>
            <td>{formatDate(data.ccg_createdate)}</td>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <td on:click|stopPropagation>
              <button class="delete_button">삭제</button>
            </td>
          </tr>
        {/each}
      </table>
    {/if}
  </div>

  <p>점검그룹 세부내용</p>
  <div class="table2">
    <table>
      <thead>
        <tr>
          <th>남버</th>
          <th>점검대상</th>
          <th>항목그룹</th>
          <th>식별코드</th>
          <th>점검항목</th>
          <th>위험도</th>
          <th>평가기준</th>
        </tr>
      </thead>
      <tbody>
        {#if filteredChecklistData.length > 0}
          {#each filteredChecklistData as item, index}
            <tr
              on:click="{() => {
                selectedItem = item;
                showModal = true;
              }}"
            >
              <td>{index + 1}</td>
              <td>{selectedCategory}</td>
              <td>{item.ccc_index}</td>
              <td>{item.ccc_item_no}</td>
              <td>{item.ccc_item_title}</td>
              <td>{item.ccc_item_level}</td>
              <td>{item.ccc_item_criteria}</td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan="7">점검대상 선택해 주세요</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>

  <Modal bind:showModal>
    <ModalEditItem {selectedItem} {selectedCategory} />
  </Modal>
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
  main p {
    font-size: 16px;
    font-weight: bold;
  }
  .table1,
  .table2 {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
    color: #333;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f7f9fb;
  }

  .table1 {
    height: 300px;
  }

  .table2 {
    height: 450px;
    margin-bottom: 20px;
  }

  table {
    font-family: "Arial", sans-serif;
    border-collapse: collapse;
    width: 100%;
    font-size: 12px;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 10px;
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
    white-space: nowrap;
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

  .delete_button {
    background-color: #e74c3c;
    color: #ffffff;
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .delete_button:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
