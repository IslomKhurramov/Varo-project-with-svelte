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
  import { confirmDelete, successAlert } from "../../shared/sweetAlert";
  import { onMount, onDestroy } from "svelte";

  export let allChecklistArray;
  export let selectedCategory = "UNIX";

  export let selectedChecklist;
  export let lastCreatedChecklistId;
  export let showDataTbale2;
  export let selectedRisk;
  export let slides = [];
  export let showEdit;
  let selectedItem = null;
  let selected = [];
  let showModal = false;
  export let isNewlyCreatedChecklist = false;
  let selectedGroup = null;
  $: filteredChecklistData;
  /**********************************************************************/
  $: {
    if (selectedChecklist) {
      let checklistData = selectedChecklist[selectedCategory] || [];

      // If selectedRisk is not "위험도", filter by ccc_item_level
      if (selectedRisk !== "위험도") {
        checklistData = checklistData.filter(
          (item) => item.ccc_item_level === selectedRisk,
        );
      }

      // Update the filteredChecklistData store with the newly filtered data
      filteredChecklistData.set(checklistData);
    }
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
        slides = slides.filter(
          (slide) => !selectedItems.includes(slide.ccc_index),
        );

        // Ensure the next slide is selected if slides are available
        if (slides.length > 0) {
          let nextIndex = slides.findIndex(
            (slide) => slide.ccc_item_no === selectedItem?.ccc_item_no,
          );

          // If the selected item was the last one, move to the previous slide
          if (nextIndex === slides.length - 1) {
            nextIndex = Math.max(0, nextIndex - 1);
          }
          // Update the selectedItem to the next available slide
          selectedItem = slides[nextIndex];
        }
        // Clear the selected array
        selected = [];
      }
    } catch (error) {
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
  // Subscribe to filteredChecklistData store to make it reactive
  let allSelected = false; // Indicates if all items are selected

  // Subscribe to filteredChecklistData and update allSelected accordingly
  $: filteredChecklistData.subscribe((data) => {
    allSelected = data.length > 0 && selected.length === data.length;
  });

  // Function to select or deselect all items
  function selectAll() {
    filteredChecklistData.update((data) => {
      if (allSelected) {
        selected = []; // Deselect all
      } else {
        selected = data.slice(); // Select all
      }
      return data; // Return unchanged data
    });
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
  import ModalPopUpDetail from "./ModalPopUpDetail.svelte";

  const dispatch = createEventDispatcher();

  async function deleteProject(id) {
    try {
      const isConfirmed = await confirmDelete();

      if (isConfirmed) {
        const response = await setDeleteChecklistGroup(id);

        if (response.success) {
          // Dispatch an event to notify the parent of the deletion
          successAlert("체크리스트가 성공적으로 삭제되었습니다!");
          dispatch("projectDeleted", id);
          selectedChecklist = "";
          showDataTbale2 = false;
          showEdit = false;
          selected = []; // Clear selection
          allSelected = false;
        } else {
          alert("Failed to delete the project."); // Provide user feedback
        }
      }
    } catch (err) {
      alert("An error occurred while deleting the project."); // Provide user feedback
    }
  }
  $: console.log("selectedItem", selectedItem);

  function handleProjectData(data) {
    selectedChecklist = data;
    showDataTbale2 = true;
  }
  function closeShowModal() {
    showModal = false;
  }

  // Close modal when Esc key is pressed
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      closeShowModal();
    }
  }

  onMount(() => {
    // Listen for keydown event when the modal is open
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Remove the event listener when the component is destroyed
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
</script>

<div class="contentArea" style="height: calc(-236px + 100vh); ">
  <article
    class="contentArea"
    style=" height: calc(100vh - 134px); padding-left:0px; padding-top:0px; padding-right:0px; margin-bottom:15px;"
  >
    <p style="padding-bottom:15px; ">점검그룹</p>

    <div class="tableListWrap table1" style="margin-bottom: 20px;">
      <table class="tableList hdBorder font-size: 16px;">
        <colgroup>
          <col style="width:50px;" />
          <col style="width:150px" />
          <col style="width:90px;" />
          <col style="width:35%;" />
          <col style="width:20%;" />
          <col style="width:120px;" />
        </colgroup>
        <thead>
          <tr>
            <th class="text-center">넘버</th>
            <th class="text-center">점검항목이름</th>
            <th class="text-center">분류</th>
            <th class="text-center">지원대상</th>
            <th class="text-center">등록일</th>
            <th class="text-center">삭제</th>
          </tr>
        </thead>
        <tbody>
          {#each [...allChecklistArray].sort((a, b) => new Date(b.ccg_createdate) - new Date(a.ccg_createdate)) as data, index}
            <tr on:click={() => handleProjectData(data)}>
              <td class="text-center">{allChecklistArray.length - index}</td>
              <td class="text-center">{data.ccg_group}</td>
              <td class="text-center">{data.ccg_checklist_year}</td>
              <td
                class="text-center"
                style="word-break: normal; white-space: pre-wrap; overflow-wrap: break-word;"
              >
                {data?.ccg_support_part?.replace(/\|/g, ",")}
              </td>

              <td class="text-center">{formatDate(data.ccg_createdate)}</td>
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <td class="text-center delete-column" on:click|stopPropagation>
                <!-- Show the button but make it invisible if not needed -->
                <button
                  class="btn btnRed"
                  on:click={() => deleteProject(data.ccg_index)}
                  style="visibility: {data && data.ccg_provide === 0
                    ? 'visible'
                    : 'hidden'}"
                >
                  <img
                    src="./assets/images/icon/delete.svg"
                    alt="createGroup"
                  />삭제
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <div
      style="display: flex; flex-direction:row; width:100%; justify-content:space-between; margin-bottom:10px"
    >
      <div style="display: flex; align-items:center; ;">
        {#if selectedChecklist && selectedChecklist.ccg_provide === 0}
          <input
            class="center-align"
            style="margin-right: 10px;"
            type="checkbox"
            on:click={selectAll}
            checked={allSelected}
          /><strong style="margin-right: 10px;"> 전체선택 </strong>
        {/if}
        {#if selectedChecklist && selectedChecklist.ccg_group}
          {#if selectedChecklist && selectedChecklist.ccg_group}
            {selectedChecklist.ccg_group}
          {/if}
        {/if}
      </div>
      {#if selectedChecklist && selectedChecklist.ccg_provide === 0}
        <button class="deleteBtn" on:click={deleteSelectedItem}
          >선택항목삭제</button
        >
      {/if}
    </div>
    <div class="tableListWrap table2" style="margin-bottom: 20px; height:45vh;">
      <table class="tableList hdBorder font-size: 16px;">
        {#if selectedChecklist && selectedChecklist.ccg_provide === 0}
          <colgroup>
            <col style="width:50px;" />
            <col style="width:90px;" />
            <col />
            <col />
            <col />
            <col />
            <col style="width:90px;" />
            <col style="width:40%;" />
          </colgroup>
        {:else}
          <colgroup>
            <col style="width:90px;" />
            <col style="width:120px;" />
            <col />
            <col />
            <col />
            <col style="width:90px;" />
            <col style="width:40%;" />
          </colgroup>
        {/if}
        <thead>
          <tr>
            {#if selectedChecklist && selectedChecklist.ccg_provide === 0}
              <th on:click|stopPropagation></th>
            {/if}
            <th class="text-center">넘버</th>
            <th class="text-center">점검대상</th>
            <th class="text-center">항목그룹</th>
            <th class="text-center">식별코드</th>
            <th class="text-center">점검항목</th>
            <th class="text-center">위험도</th>
            <th class="text-center">평가기준</th>
          </tr>
        </thead>
        <tbody>
          {#if showDataTbale2}
            {#if $filteredChecklistData.length > 0}
              {#each $filteredChecklistData as item, index}
                <tr
                  class="clickLine"
                  on:click={() => {
                    selectedItem = item;
                    showModal = true;
                  }}
                >
                  {#if selectedChecklist && selectedChecklist.ccg_provide === 0}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <td on:click|stopPropagation
                      ><input
                        class="center-align"
                        type="checkbox"
                        bind:group={selected}
                        value={item}
                        name={item}
                      /></td
                    >
                  {/if}
                  <td class="text-center line-height"
                    >{$filteredChecklistData.length - index}</td
                  >
                  <td class="text-center line-height">{selectedCategory}</td>
                  <td class="text-center line-height">{item.ccc_item_group}</td>
                  <td class="text-center line-height">{item.ccc_item_no}</td>
                  <td class=" line-height">{item.ccc_item_title}</td>
                  <td class="text-center line-height">{item.ccc_item_level}</td>
                  <td class="line-height"
                    >{@html item.ccc_item_criteria.replace(/\n/g, "<br/>")}</td
                  >
                </tr>
              {/each}
            {:else}
              <tr>
                {#if selectedChecklist && selectedChecklist.ccg_provide === 0}
                  <td
                    colspan={isNewlyCreatedChecklist ? "9" : "8"}
                    class="text-center no-data-message"
                    >{selectedCategory}에서 사용 가능한 데이터가 없습니다.</td
                  >
                {:else}
                  <td
                    colspan={isNewlyCreatedChecklist ? "8" : "7"}
                    class="text-center no-data-message"
                    >{selectedCategory}에서 사용 가능한 데이터가 없습니다.</td
                  >
                {/if}
              </tr>
            {/if}
          {:else if selectedChecklist && selectedChecklist.ccg_provide === 0}
            <tr>
              <td
                colspan={isNewlyCreatedChecklist ? "9" : "8"}
                class="text-center no-data-message">차산그룹을 선택해주세요.</td
              >
            </tr>
          {:else}
            <tr>
              <td
                colspan={isNewlyCreatedChecklist ? "8" : "7"}
                class="text-center no-data-message">차산그룹을 선택해주세요.</td
              >
            </tr>
          {/if}
        </tbody>
      </table>
    </div>

    {#if showModal}
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div
        class="modal-open-wrap"
        on:click={() => (showModal = false)}
        on:keydown={handleKeyDown}
        tabindex="0"
      >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <dialog
          open
          on:close={() => (showModal = false)}
          on:click|stopPropagation
        >
          <ModalPopUpDetail
            {selectedItem}
            {selectedCategory}
            {isNewlyCreatedChecklist}
            {closeShowModal}
          />
        </dialog>
      </div>
    {/if}
  </article>
</div>

<style>
  td.delete-column {
    position: relative;
    text-align: center; /* Centers horizontally */
    vertical-align: middle; /* Centers vertically */
    line-height: normal; /* Ensures line height doesn't affect centering */
  }

  td.delete-column button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(
      -50%,
      -50%
    ); /* Moves the button exactly to the center */
  }

  .no-data-message {
    text-align: center; /* Center the text */
    font-style: italic; /* Italicize the text for emphasis */
    color: #777; /* Light gray color for the message */
    padding: 20px; /* Add some padding around the text */
    background-color: #f9f9f9; /* Light background color for contrast */
    border: 1px solid #ddd; /* Optional: Add a border for definition */
    border-radius: 5px; /* Slightly round the corners */
    margin: 20px 0; /* Margin above and below the message */
  }
  .deleteBtn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    margin-left: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    height: 30px;
  }
  .clickLine:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  .modal-open-wrap {
    display: block;
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(167, 167, 167, 0.6);
  }
  .tableListWrap .hdBorder td {
    font-size: 16px;
  }
  * {
    font-size: 16px;
  }
  .line-height {
    line-height: 23px;
  }
  /****Modal Container*/
  dialog {
    position: fixed;
    /* height: 600px; */
    /* overflow-y: auto;
    overflow-x: hidden; */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1103px;
    border: none;
    border-radius: 10px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: svelte-s7onsa-fadeIn 0.3s ease;
    z-index: 100;
  }

  /* Modal backdrop */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }

  .table1,
  .table2 {
    width: 100%;
    font-size: 16px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  th,
  td {
    font-size: 16px;
  }

  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  .table1 {
    max-height: 382px;
  }

  .table2 {
    height: 70vh;
    margin-bottom: 25px;
  }
  tr:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  table {
    width: 100%;
  }

  tr {
    cursor: pointer;
  }

  .control-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    width: 100%;
    align-items: center;
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
