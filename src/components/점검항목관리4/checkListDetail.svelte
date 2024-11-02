<script>
  import Modal from "../../shared/Modal.svelte";
  import ModalEditItem from "./ModalEditItem.svelte";
  import { setDeleteChecklistItem } from "../../services/page4/getAllCheckList";
  import { filteredChecklistData } from "../../services/page4/checklistStore";
  import { successAlert } from "../../shared/sweetAlert";

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

  /**********************************************************************/
  $: if (selectedChecklist) {
    // Get the checklist data for the selected category
    let checklistData = selectedChecklist[selectedCategory] || [];

    // If selectedRisk is not "위험도" (which means "all"), filter by ccc_item_level
    if (selectedRisk !== "위험도") {
      checklistData = checklistData.filter(
        (item) => item.ccc_item_level === selectedRisk,
      );
    }

    // Set the filtered data in the store
    filteredChecklistData.set(checklistData);
  }

  // Subscribe to filteredChecklistData store to make it reactive
  let allSelected;
  $: filteredChecklistData.subscribe((data) => {
    allSelected = data.length === selected.length;
  });

  function selectAll() {
    $filteredChecklistData.update((data) => {
      if (allSelected) {
        selected = []; // Deselect all
      } else {
        selected = data.slice(); // Select all
      }
      return data;
    });
  }

  /***********************************************************************************/
  // Function to delete selected items
  async function deleteSelectedItem() {
    if (selected.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }

    const selectedItems = (Array.isArray(selected) ? selected : [selected]).map(
      (item) => item.ccc_index,
    );
    // Now you can proceed with deletion logic
    const mainIndex = Array.isArray(selected)
      ? selected[0]?.ccg_index_id
      : selected.ccg_index_id;

    try {
      const deleteItem = await setDeleteChecklistItem(mainIndex, selectedItems);

      if (deleteItem.success) {
        successAlert(`선택한 항목이 성공적으로 삭제되었습니다!`);

        // Update the filteredChecklistData store
        filteredChecklistData.update((data) => {
          return data.filter((item) => !selectedItems.includes(item.ccc_index));
        });

        // Clear the selected items and reset selectedItem
        selected = [];
        selectedItem = null; // Reset selectedItem to null
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

  /******************************************************************************/
</script>

<section
  style="margin-top: 
10px;"
>
  <article
    class="contentArea"
    style="overflow: auto; height: 80vh;
        top:-10px;  scrollbar-width: none;          
       -ms-overflow-style: none;      
       -webkit-overflow-scrolling: touch;"
  >
    {#if showModalModalEditItem}
      <ModalEditItem
        bind:selectedItem
        {selectedCategory}
        {showSlide}
        {selectedChecklist}
        {swiperContainer}
        {showModalSecond}
        {selectedSlide}
        bind:slides
        {selectedItemNumber}
        {isNewlyCreatedChecklist}
        bind:selected
        {deleteSelectedItem}
      />
    {:else}
      <p style="padding:15px ;  font-size:16px">
        {selectedChecklist.ccg_group} 세부내용
      </p>
      {#if selectedChecklist && selectedChecklist.ccg_provide === 1}
        <div class="control-buttons">
          <div style="display: flex; align-items:center">
            <input
              type="checkbox"
              on:click={selectAll}
              checked={allSelected}
            /><strong> 전체선택 </strong>
          </div>

          <button on:click={deleteSelectedItem}>선택항목삭제</button>
        </div>
      {/if}
      <div class="tableListWrap table2">
        <table class="tableList hdBorder" style="height: 50vh;">
          {#if selectedChecklist && selectedChecklist.ccg_provide === 1}
            <colgroup>
              <col style="width:90px;" />
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
              {#if selectedChecklist && selectedChecklist.ccg_provide === 1}
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
                  on:click={() => {
                    selectedItem = item;
                    selectedItemNumber = item.ccc_item_no;
                    showModalModalEditItem = true;
                    selected = [item];
                  }}
                >
                  {#if selectedChecklist.ccg_provide === 1}
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
                  <td class="text-center line-height">{index + 1}</td>
                  <td class="text-center line-height">{selectedCategory}</td>
                  <td class="text-center line-height">{item.ccc_item_group}</td>
                  <td class="text-center line-height">{item.ccc_item_no}</td>
                  <td class=" line-height">{item.ccc_item_title}</td>
                  <td class="text-center line-height">{item.ccc_item_level}</td>
                  <td>
                    <pre class="line-height">
                      {item.ccc_item_criteria}
                    </pre>
                  </td>
                </tr>
              {/each}
            {:else}
              <tr
                ><td colspan={isNewlyCreatedChecklist ? "8" : "7"}
                  >no data available</td
                ></tr
              >
            {/if}
          </tbody>
        </table>
      </div>
    {/if}
  </article>
</section>

<style>
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
