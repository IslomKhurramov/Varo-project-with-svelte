<script>
  import Modal from "../../shared/Modal.svelte";
  import ModalEditItem from "./ModalEditItem.svelte";
  import {
    setDeleteChecklistGroup,
    setDeleteChecklistItem,
  } from "../../services/page4/getAllCheckList";
  import {
    checklistStore,
    filteredChecklistData,
  } from "../../services/page4/checklistStore";
  import { successAlert } from "../../shared/sweetAlert";
  export let allChecklistArray;
  export let selectedCategory = "UNIX";
  export let searchResult;
  export let isSearchActive;
  export let selectedChecklist;
  export let lastCreatedChecklistId;
  let selectedItem = null;
  let selected = [];
  let showModal = false;
  let isNewlyCreatedChecklist = false;
  let selectedGroup = null;

  /**********************************************************************/
  $: if (selectedChecklist) {
    filteredChecklistData.set(selectedChecklist[selectedCategory] || []);
  }

  // Subscribe to filteredChecklistData store to make it reactive
  let allSelected;
  $: filteredChecklistData.subscribe((data) => {
    allSelected = data.length === selected.length;
  });

  function selectAll() {
    $filteredChecklistData.update((data) => {
      selected = allSelected ? [] : [...data];
      return data;
    });
  }

  // Extract ccc_index from selected items
  function arrayOfDeletedItem() {
    return selected.map((item) => item.ccc_index);
  }

  /***********************************************************************************/
  // Function to delete selected items
  async function deleteSelectedItem() {
    const selectedItems = $filteredChecklistData.filter((item) =>
      selected.includes(item),
    );

    if (selectedItems.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }

    const mainIndex = selected[0].ccg_index_id;
    const arrayIndexes = arrayOfDeletedItem();

    try {
      const deleteItem = await setDeleteChecklistItem(mainIndex, arrayIndexes);

      if (deleteItem.success) {
        successAlert(`선택한 항목이 성공적으로 삭제되었습니다!`);

        // Update filteredChecklistData by removing deleted items
        filteredChecklistData.update((data) =>
          data.filter((item) => !arrayIndexes.includes(item.ccc_index)),
        );

        // Clear the selected array
        selected = [];
      }
    } catch (error) {
      console.error("Error deleting items:", error);
      alert("Error occurred while deleting items.");
    }
  }
  /************************************************************************/
  // Mark the newly created checklist as new
  $: if (
    selectedChecklist &&
    selectedChecklist.ccg_index === lastCreatedChecklistId
  ) {
    isNewlyCreatedChecklist = true;
  } else {
    isNewlyCreatedChecklist = false;
  }

  /******************************************************************************/
  // Convert to a more human-readable format
  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true, // This ensures that we get "오후" or "오전" for AM/PM in Korean.
    };

    return `${date.toLocaleDateString("ko-KR", options)} ${date.toLocaleTimeString("ko-KR", timeOptions)}`;
  }
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  async function deleteProject(id) {
    console.log("delete", id);
    try {
      const response = await setDeleteChecklistGroup(id);

      if (response.success) {
        // Dispatch an event to notify the parent of the deletion
        dispatch("projectDeleted", id);
      } else {
        alert("Failed to delete the project."); // Provide user feedback
      }
    } catch (err) {
      console.log("ERROR deleteProject:", err);
      alert("An error occurred while deleting the project."); // Provide user feedback
    }
  }
</script>

<div style="margin-top: 20px;">
  <article class="contentArea mt-0">
    <p style="padding:15px; font-size:12px">점검그룹</p>
    {#if isSearchActive}
      <div class="tableListWrap table1">
        <table class="tableList hdBorder">
          <colgroup>
            <col style="width:90px;" />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col style="width:40%;" />
          </colgroup>
          <thead>
            <tr>
              <th class="text-center">남버</th>
              <th class="text-center">점검대상</th>
              <th class="text-center">항목그룹</th>
              <th class="text-center">식별코드</th>
              <th>점검항목</th>
              <th class="text-center">위험도</th>
              <th>평가기준</th>
            </tr>
          </thead>
          <tbody>
            {#if searchResult.length > 0}
              {#each searchResult as item, index}
                <tr
                  on:click={() => {
                    selected = item;
                    showModal = true;
                  }}
                >
                  <td class="text-center">{index + 1}</td>
                  <td class="text-center">{selectedCategory}</td>
                  <td class="text-center">{item.ccc_item_group}</td>
                  <td class="text-center">{item.ccc_item_no}</td>
                  <td class="text-center">{item.ccc_item_title}</td>
                  <td class="text-center">{item.ccc_item_level}</td>
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
        <div class="reset">
          <button
            class="reset_button"
            on:click={() => {
              isSearchActive = false;
            }}>테이블 재설정</button
          >
        </div>
      </div>
    {:else}
      <div class="tableListWrap table1">
        <table class="tableList hdBorder">
          <colgroup>
            <col style="width:90px;" />
            <col />
            <col style="width:90px;" />
            <col style="width:30%;" />
            <col style="width:20%;" />
            <col style="width:120px;" />
          </colgroup>
          <thead>
            <tr>
              <th class="text-center">넘버</th>
              <th class="text-center">점검항목이름</th>
              <th class="text-center">분류</th>
              <th>지원대상</th>
              <th class="text-center">등록일</th>
              <th class="text-center">삭제</th>
            </tr>
          </thead>
          <tbody>
            {#each allChecklistArray as data}
              <tr>
                <td class="text-center">{data.cgl_index_id}</td>
                <td class="text-center">{data.ccg_group}</td>
                <td class="text-center">{data.ccg_checklist_year}</td>
                <td class="text-center">{data.ccg_support_part}</td>
                <td class="text-center">{formatDate(data.ccg_createdate)}</td>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <td class="text-center" on:click|stopPropagation>
                  <button
                    class="btn btnRed"
                    on:click={() => deleteProject(data.ccg_index)}
                    ><img
                      src="./assets/images/icon/delete.svg"
                      alt="createGroup"
                    />삭제</button
                  >
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}

    <p style="padding:15px ; margin-top:15px; font-size:12px">
      점검그룹 세부내용
    </p>
    {#if isNewlyCreatedChecklist}
      <div class="control-buttons">
        <input
          type="checkbox"
          on:click={selectAll}
          checked={allSelected}
        /><strong> 전체선택 </strong>

        <button on:click={deleteSelectedItem}>선택항목삭제</button>
      </div>
    {/if}
    <div class="tableListWrap table2">
      <table class="tableList hdBorder">
        {#if isNewlyCreatedChecklist}
          <colgroup>
            <col style="width:90px;" />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col style="width:40%;" />
          </colgroup>
        {:else}
          <colgroup>
            <col style="width:90px;" />
            <col />
            <col />
            <col />
            <col />
            <col />
            <col style="width:40%;" />
          </colgroup>
        {/if}
        <thead>
          <tr>
            {#if isNewlyCreatedChecklist}
              <th on:click|stopPropagation></th>
            {/if}
            <th class="text-center">남버</th>
            <th class="text-center">점검대상</th>
            <th class="text-center">항목그룹</th>
            <th class="text-center">식별코드</th>
            <th>점검항목</th>
            <th class="text-center">위험도</th>
            <th>평가기준</th>
          </tr>
        </thead>
        <tbody>
          {#if $filteredChecklistData.length > 0}
            {#each $filteredChecklistData as item, index}
              <tr
                on:click={() => {
                  selectedItem = item;
                  showModal = true;
                }}
              >
                {#if isNewlyCreatedChecklist}
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <td on:click|stopPropagation
                    ><input
                      type="checkbox"
                      bind:group={selected}
                      value={item}
                      name={item}
                    /></td
                  >
                {/if}
                <td class="text-center">{index + 1}</td>
                <td class="text-center">{selectedCategory}</td>
                <td class="text-center">{item.ccc_item_group}</td>
                <td class="text-center">{item.ccc_item_no}</td>
                <td class="text-center">{item.ccc_item_title}</td>
                <td class="text-center">{item.ccc_item_level}</td>
                <td>{item.ccc_item_criteria}</td>
              </tr>
            {/each}
          {:else}
            <tr
              ><td colspan={isNewlyCreatedChecklist ? "8" : "7"}
                >점검대상 선택해 주세요</td
              ></tr
            >
          {/if}
        </tbody>
      </table>
    </div>

    <Modal bind:showModal>
      <ModalEditItem {selectedItem} {selectedCategory} />
    </Modal>
  </article>
</div>

<style>
  .table1,
  .table2 {
    width: 100%;
    font-size: 12px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .table1 {
    height: 300px;
  }

  .table2 {
    height: 450px;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
  }

  /* th,
  td {
    padding: 10px;
    text-align: center;
    vertical-align: middle;
  } */
  /* 
  th {
    background-color: #005fa3;
    color: #ffffff;
    position: sticky;
    top: 0;
    z-index: 1;
    font-size: 14px;
    white-space: nowrap;
  } */

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
  .reset_button {
    justify-content: end;
    background-color: #ff6b6b; /* Red background color */
    color: #ffffff; /* White text color */
    border: none; /* Remove default border */
    border-radius: 5px; /* Rounded corners */
    padding: 5px 10px; /* Padding around the text */
    font-size: 12px; /* Font size for the button text */
    font-weight: bold; /* Make text bold */
    cursor: pointer; /* Change cursor to pointer on hover */
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease; /* Smooth transition */
    margin-right: 15px;
  }

  .reset_button:hover {
    background-color: #e74c3c; /* Darker red on hover */
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Add shadow on hover */
  }
  .reset {
    display: flex;
    width: 100%;
    justify-content: end;
    margin-top: 10px;
  }
  .control-buttons {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }

  .control-buttons button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    margin-left: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .control-buttons button:hover {
    background-color: #0056b3;
  }
  input[type="checkbox"] {
    cursor: pointer;
  }
</style>
