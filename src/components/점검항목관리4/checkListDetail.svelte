<script>
  import Modal from "../../shared/Modal.svelte";
  import ModalEditItem from "./ModalEditItem.svelte";
  import { setDeleteChecklistItem } from "../../services/page4/getAllCheckList";
  import {
    fetchChecklistData,
    filteredChecklistData,
  } from "../../services/page4/checklistStore";
  import { successAlert } from "../../shared/sweetAlert";
  /*************************/
  export let allChecklistArray;
  export let filteredData;
  export let searchResult;
  export let isSearchActive;
  export let activeMenu;
  export let showEdit;
  export let showDataTbale2;
  export let cleanSearch;

  /****************************/
  function check() {
    console.log(filteredData);
    console.log(searchResult);
    console.log(isSearchActive);
    console.log(activeMenu);
    console.log(showSlide);
    console.log(cleanSearch);
    console.log(showModalSecond);
    console.log(selectedSlide);
    console.log(showDataTbale2);
    console.log(showEdit);
    console.log(selectedItem);
    console.log(allChecklistArray);
  }

  export let selectedCategory;
  export let selectedChecklist;
  export let lastCreatedChecklistId;
  export let showSlide;
  export let swiperContainer;
  export let selectedRisk;
  export let selectedSlide;
  export let showModalSecond;
  export let slides = [];

  export let selectedItem = null;
  let selected = [];
  export let showModalModalEditItem;
  export let isNewlyCreatedChecklist;
  let selectedItemNumber = null;

  // Subscribe to filteredChecklistData store
  let allSelected = false;
  let checklistData = [];

  $: if (selectedChecklist) {
    // Get the checklist data for the selected category
    checklistData = selectedChecklist[selectedCategory] || [];

    // Filter by selectedRisk
    if (selectedRisk !== "위험도") {
      checklistData = checklistData.filter(
        (item) => item.ccc_item_level === selectedRisk,
      );
    }

    // Set the filtered data in the store
    filteredChecklistData.set(checklistData);
  }

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

  async function deleteSelectedItem() {
    // Check if there are any items selected for deletion
    if (selected.length === 0 && !selectedItem) {
      alert("삭제할 항목을 선택하세요."); // Alert to select an item to delete
      return;
    }

    // Add selectedItem to the selected array if it's not already included
    if (
      selectedItem &&
      !selected.some((item) => item.ccc_index === selectedItem.ccc_index)
    ) {
      selected.push(selectedItem);
    }

    const selectedItems = selected.map((item) => item.ccc_index); // Get the indices of selected items for deletion
    const mainIndex = selected[0].ccg_index_id; // Assuming the first item has the main index

    try {
      const deleteItem = await setDeleteChecklistItem(mainIndex, selectedItems);

      if (deleteItem.success) {
        successAlert(`선택한 항목이 성공적으로 삭제되었습니다!`);
        await fetchChecklistData();
        // Update the filteredChecklistData store
        filteredChecklistData.update((data) =>
          data.filter((item) => !selectedItems.includes(item.ccc_index)),
        );

        // Update the slides array after deletion
        slides = slides.filter(
          (slide) => !selectedItems.includes(slide.ccc_index),
        );

        // Move to the next slide if there are slides available
        if (slides.length > 0) {
          // Find the next slide
          let nextIndex = slides.findIndex(
            (slide) => slide.ccc_item_no === selectedItem?.ccc_item_no,
          );

          // If the selected item was the last one, move to the previous slide
          if (nextIndex === slides.length - 1) {
            nextIndex = Math.max(0, nextIndex - 1);
          }

          // Update the selectedItem to the next available slide
          selectedItem = slides[nextIndex];

          // If there are no slides left, reset selectedItem
          if (slides.length === 0) {
            selectedItem = null;
          }
        } else {
          // If no slides are left, reset selectedItem
          selectedItem = null;
        }

        // Clear the selected items
        selected = [];
      }
    } catch (error) {
      alert("Error occurred while deleting items.");
    }
  }

  // Mark the newly created checklist as new
  $: isNewlyCreatedChecklist =
    selectedChecklist && selectedChecklist.ccg_index === lastCreatedChecklistId;
</script>

<section style="margin-top: 10px;">
  <article
    class="contentArea"
    style="height: 80vh; top:-10px; scrollbar-width: none; -ms-overflow-style: none; -webkit-overflow-scrolling: touch;"
  >
    {#if showModalModalEditItem}
      <ModalEditItem
        bind:selectedItem
        {selected}
        {selectedCategory}
        {showSlide}
        {selectedChecklist}
        {swiperContainer}
        {selectedSlide}
        {slides}
        {selectedItemNumber}
        {isNewlyCreatedChecklist}
        {deleteSelectedItem}
        {allChecklistArray}
        {showEdit}
        {showDataTbale2}
        {cleanSearch}
      />
    {:else}
      <div
        style="display: flex; flex-direction:row; width:100%; justify-content:space-between"
      >
        <div style="display: flex; align-items:center">
          {#if selectedChecklist && selectedChecklist.ccg_provide === 0}
            <input
              class="center-align"
              type="checkbox"
              on:click={selectAll}
              checked={allSelected}
            /><strong> 전체선택 </strong>
          {/if}
          <p style="padding:15px; font-size:16px">
            {selectedChecklist.ccg_group} 세부내용
          </p>
        </div>
        {#if selectedChecklist && selectedChecklist.ccg_provide === 0}
          <button class="deleteBtn" on:click={deleteSelectedItem}
            >선택항목삭제</button
          >
        {/if}
      </div>
      <div
        class="tableListWrap table2"
        style="margin-bottom: 20px; height:78vh;"
      >
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
              <col />
              <col />
              <col />
              <col />
              <col style="width:90px;" />
              <col style="width:40%;" />
            </colgroup>
          {/if}
          <thead>
            <tr>
              {#if selectedChecklist && selectedChecklist?.ccg_provide === 0}
                <th on:click|stopPropagation></th>
              {/if}
              <th class="text-center">남버</th>
              <th class="text-center">점검대상</th>
              <th class="text-center">항목그룹</th>
              <th class="text-center">식별코드</th>
              <th class="text-center">점검항목</th>
              <th class="text-center">위험도</th>
              <th class="text-center">평가기준</th>
            </tr>
          </thead>
          <tbody>
            {#if $filteredChecklistData.length > 0}
              {#each $filteredChecklistData as item, index}
                <tr
                  class="height"
                  style="height: 98px;"
                  on:click={() => {
                    selectedItem = item;
                    selectedItemNumber = item.ccc_item_no;
                    showModalModalEditItem = true;
                  }}
                >
                  {#if selectedChecklist && selectedChecklist?.ccg_provide === 0}
                    <td>
                      <input
                        class="center-align"
                        type="checkbox"
                        bind:group={selected}
                        value={item}
                        name={item}
                        on:click|stopPropagation
                      />
                    </td>
                  {/if}
                  <td class="text-center line-height"
                    >{$filteredChecklistData.length - index}</td
                  >
                  <td class="text-center line-height">{selectedCategory}</td>
                  <td class="text-center line-height">{item.ccc_item_group}</td>
                  <td class="text-center line-height">{item.ccc_item_no}</td>
                  <td class="line-height">{item.ccc_item_title}</td>
                  <td class="text-center line-height">{item.ccc_item_level}</td>
                  <td>
                    <pre class="line-height">{item.ccc_item_criteria}</pre>
                  </td>
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
          </tbody>
        </table>
      </div>
    {/if}
  </article>
</section>

<style>
  .tableListWrap .hdBorder td {
    font-size: 16px;
  }
  .tableListWrap table tbody tr.height {
    height: 98px !important;
  }
  .tableListWrap table {
    border-collapse: separate; /* Or 'collapse', depending on your design */
    table-layout: fixed; /* Fix column widths for consistent row heights */
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
  .line-height {
    line-height: 23px;
  }
  .nodata {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #666666; /* Subtle gray text */
    font-size: 1.2em; /* Slightly larger font */
    font-weight: 500;
    padding: 20px;
    border: 1px solid #cccccc; /* Light border */
    border-radius: 8px;
    background-color: #f9f9f9; /* Light background for visibility */
    margin: 20px auto; /* Center within container */
    width: 80%; /* Reduce width for better design */
    text-align: center;
  }

  .table2 {
    width: 100%;
    font-size: 16px;
    overflow-y: auto;
    overflow-x: hidden;
    height: 70vh;
    margin-bottom: 25px;
  }
  tr:hover {
    background-color: rgba(242, 242, 242, 1);
    cursor: pointer;
  }
  th,
  td {
    font-size: 16px;
  }
  .table2 {
    max-height: 75vh;
    padding-bottom: 20px;
  }

  table {
    width: 100%;
  }

  tr {
    cursor: pointer;
  }
  pre {
    white-space: pre-line; /* Preserves newlines but collapses multiple spaces */
  }
  thead {
    position: sticky; /* Make the header sticky */
    top: 0; /* Stick the header to the top */
    z-index: 10; /* Ensure the header is above the scrolling content */
    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.4); /* Shadow effect for separation */
  }
  .control-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 10px;
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
