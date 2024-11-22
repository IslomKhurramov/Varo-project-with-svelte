<script>
  import ItemPage from "./ItemPage.svelte";
  import { onMount, afterUpdate } from "svelte";
  import { getAllCheckList } from "../../services/page4/getAllCheckList";
  import { setNewChecklistGroup } from "../../services/page4/getAllCheckList";
  import { setDeleteChecklistGroup } from "../../services/page4/getAllCheckList";
  import { setUpdateGroupName } from "../../services/page4/getAllCheckList";
  import { Swiper, Navigation, Pagination } from "swiper";
  import "swiper/swiper-bundle.min.css";
  import { tick } from "svelte";
  import {
    checklistStore,
    fetchChecklistData,
  } from "../../services/page4/checklistStore";
  import CheckListDetail from "./checkListDetail.svelte";
  import { filteredChecklistData } from "../../services/page4/checklistStore";
  import {
    confirmDelete,
    confirmDeleteLast,
    errorAlert,
    successAlert,
  } from "../../shared/sweetAlert";
  import { derived } from "svelte/store";

  let currentView = "default";
  let currentPage = ItemPage;
  let selectedCategory = "UNIX"; // Default to UNIX
  let loading = true;
  let error = null;
  let allChecklistArray = [];
  let filteredData = [];
  let selectedChecklist = "";
  let activeMenu = null;
  let newChecklistName = "";
  let showModal = false;
  let selectedChecklistForCopyId = null;
  let createdChecklists = [];
  let lastCreatedChecklistId = null;
  let editingChecklistId = null;
  let editedChecklistName = "";
  let swiperContainer;
  let swiperInstance;
  let slides = [];
  let showSlide = true;
  let showModalSecond = false;
  let selectedSlide = null;
  let selectedRisk = "위험도";
  let searchResult = [];
  let isSearchActive = false;
  let activeChecklistElement = null;
  let isNewlyCreatedChecklist = false;
  let showDataTbale2 = false;
  let showModalModalEditItem = false;
  let selectedItem = null;

  // Create a local variable to hold the filtered checklist data
  let filteredChecklists = [];

  // Subscribe to the store
  filteredChecklistData.subscribe((value) => {
    filteredChecklists = value;
  });
  $: if (
    selectedChecklist &&
    selectedChecklist.ccg_index === lastCreatedChecklistId
  ) {
    isNewlyCreatedChecklist = true;
  } else {
    isNewlyCreatedChecklist = false;
  }
  /****************************************************************************/
  // Swiper

  function initializeSwiper() {
    if (swiperInstance) {
      swiperInstance.destroy(true, true); // Destroy previous instance before re-initializing
    }

    // Initialize Swiper only when we have slides
    if (swiperContainer && slides.length > 0) {
      swiperInstance = new Swiper(swiperContainer, {
        modules: [Navigation, Pagination],
        loop: false,
        slidesPerView: 8,
        spaceBetween: 15,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
    }
  }

  /*****************************************************************************/

  // Subscribe to checklistStore
  checklistStore.subscribe(
    ({ loading: storeLoading, data, error: storeError }) => {
      loading = storeLoading;
      allChecklistArray = data;
      error = storeError;
    },
  );

  // Fetch the checklist data once
  // onMount(() => {
  //   if (!allChecklistArray.length) {
  //     fetchChecklistData();
  //   }
  // });
  /*****************************************************************************/

  async function createNewChecklistGroup() {
    // Check if a valid checklist is selected for copying (either via selectedChecklistForCopyId or anotherChecklistId)
    const sourceChecklistId = generalCopy
      ? anotherChecklistId
      : selectedChecklistForCopyId;

    if (!sourceChecklistId) {
      errorAlert("복사할 유효한 체크리스트를 선택하세요!");
      return; // Prevent further execution if no valid source checklist is selected
    }
    if (newChecklistName === "") {
      errorAlert("제목을 입력해주세요!");
      return; // Prevent further execution if the checklist name is empty
    }

    // Proceed with creating the new checklist group
    try {
      const response = await setNewChecklistGroup(
        sourceChecklistId,
        newChecklistName,
      );

      if (response.success) {
        // Fetch the updated checklist data
        showModal = false;
        showEdit = true;
        successAlert("체크리스트가 성공적으로 생성되었습니다!");
        await refreshChecklistData();
        lastCreatedChecklistId = selectedChecklist.ccg_index;

        // Add the new checklist to createdChecklists
        createdChecklists = [
          ...createdChecklists,
          {
            ccg_index: lastCreatedChecklistId,
            ccg_group: newChecklistName,
          },
        ];
        showDataTbale2 = true;
        // Scroll to the newly created checklist
        await tick(); // Wait for DOM updates
        if (activeChecklistElement) {
          activeChecklistElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }

        // Reset the form and modal
        newChecklistName = "";
        selectedChecklistForCopyId = null;
        anotherChecklistId = null; // Reset the other checklist ID as well
        showModal = false;
      } else {
        throw new Error("Failed to create checklist.");
      }
    } catch (err) {
      throw err;
    }
  }

  async function refreshChecklistData() {
    try {
      const allCheckList = await getAllCheckList();
      allChecklistArray = Object.values(allCheckList); // Convert to array

      // Automatically set the newly created checklist as the active one
      if (allChecklistArray.length > 0) {
        selectedChecklist = allChecklistArray[allChecklistArray.length - 1];
        activeMenu = selectedChecklist;
      }
    } catch (error) {}
  }

  // Ensure that the selected page scrolls into view
  const selectPage = (page, checklist) => {
    selectedChecklist = checklist; // Store the selected checklist
    currentPage = page;
    activeMenu = checklist;
    currentView = "pageView";

    // Scroll to the active checklist
    tick().then(() => {
      if (activeChecklistElement) {
        activeChecklistElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    });
  };

  /**************************************************************************************/
  const deleteProject = async () => {
    try {
      const isConfirmed = await confirmDeleteLast(); // Wait for confirmation

      if (isConfirmed && selectedChecklist) {
        // Get the index of the selected checklist
        const selectedChecklistIndex = selectedChecklist.ccg_index;

        // Attempt to delete the selected checklist group
        const response = await setDeleteChecklistGroup(selectedChecklistIndex);

        if (response.success) {
          // Update the checklist arrays by filtering out the deleted checklist
          currentPage = ItemPage;
          allChecklistArray = allChecklistArray.filter(
            (checklist) => checklist.ccg_index !== selectedChecklistIndex,
          );
          createdChecklists = createdChecklists.filter(
            (checklist) => checklist.ccg_index !== selectedChecklistIndex,
          );

          // Reset the selected checklist and active menu after deletion
          selectedChecklist = null;
          activeMenu = null;
          lastCreatedChecklistId = null;

          // Show a success message
          successAlert("체크리스트가 성공적으로 삭제되었습니다!");

          // Refresh checklist data to update UI
          await fetchChecklistData();
        } else {
          throw new Error("Failed to delete checklist.");
        }
      }
    } catch (err) {}
  };

  /************************************************************************/
  let isCategoryManuallySelected = false; // Track if the category is manually selected
  async function handleCategorySelection(event) {
    selectedCategory = event.target.value;
    isCategoryManuallySelected = true;
    await tick(); // Wait for `selectedCategory` to update fully
    filterData(); // Run the filter function immediately after
  }

  function handleChecklistSelect(checkList) {
    return function () {
      selectPage(CheckListDetail, checkList);
      isCategoryManuallySelected = false;
      filterData();
    };
  }
  // Reactive statement to trigger filterData on any of the dependencies change
  $: selectedRisk,
    selectedCategory,
    selectedChecklist,
    allChecklistArray,
    filterData();

  function filterData() {
    if (selectedChecklist) {
      let filteredData = [];

      // If a category is manually selected
      if (isCategoryManuallySelected) {
        // Check if the selected category has data
        if (
          selectedCategory &&
          selectedChecklist[selectedCategory] &&
          selectedChecklist[selectedCategory].length > 0
        ) {
          filteredData = selectedChecklist[selectedCategory];
        } else if (selectedCategory) {
          // If the selected category has no data
          console.log("No data available for the selected category.");
        }
      } else {
        // If no category is selected (default case), find the first available category with data
        const categories = [
          "UNIX",
          "WINDOWS",
          "PC",
          "NETWORK",
          "DBMS",
          "WEB",
          "WAS",
          "CLOUD",
          "SECURITY",
        ];
        for (let category of categories) {
          if (
            selectedChecklist[category] &&
            selectedChecklist[category].length > 0
          ) {
            filteredData = selectedChecklist[category];
            selectedCategory = category; // Set to the first category with data
            console.log(
              `Switched to ${category} as it contains available data.`,
            );
            break; // Exit loop once we find valid data
          }
        }
      }

      // Apply risk level filter if selectedRisk is valid
      if (selectedRisk && selectedRisk !== "위험도") {
        filteredData = filteredData.filter(
          (item) => item.ccc_item_level === selectedRisk,
        );
      }

      // Update slides and selected item
      slides = filteredData;
      selectedItem = slides.length > 0 ? slides[0] : null; // Select first item if available
      showSlide = slides.length > 0; // Show slides if there's data

      // Initialize Swiper if there are slides to show
      if (showSlide) {
        initializeSwiper();
      }
    } else {
      // Handle case where the selected checklist is not defined
      slides = [];
      selectedItem = null;
      showSlide = false;
    }
  }

  onMount(async () => {
    try {
      const responseERR = await fetchChecklistData(); // Wait for the data to be fetched
      console.log("444444", responseERR);

      filterData(); // Run the filter after the data is fetched
    } catch (error) {
      console.log("error part", error);
      errorAlert(error?.message);
    }
  });
  /************************************************************************/
  // Run filterData every time `selectedCategory` or `allChecklistArray` updates

  /************************************************************************/
  // After component updates (e.g., after DOM updates), ensure Swiper is properly initialized
  $: afterUpdate(() => {
    if (slides.length > 0) {
      initializeSwiper();
    }
  });
  /*************************************************************/
  $: {
    if (selectedChecklist) {
      selectedChecklistForCopyId = selectedChecklist?.ccg_index;
    } else if (generalCopy) {
      selectedChecklistForCopyId = anotherChecklistId?.ccg_index;
    }
  }
  /***********************************************************/
  // Edit checklist function (to be defined)
  async function editChecklist(checklistId, editedName) {
    try {
      if (!editedName) {
        alert("Please enter a valid checklist name.");
        return;
      }

      const response = await setUpdateGroupName(checklistId, editedName);
      console.log("Edit Checklist Response:", response);

      if (response.success) {
        // Update the checklist locally without refreshing
        allChecklistArray = allChecklistArray.map((checklist) =>
          checklist.ccg_index === checklistId
            ? { ...checklist, ccg_group: editedName }
            : checklist,
        );

        // Clear editing state
        editingChecklistId = null;
        editedChecklistName = "";
      } else {
        throw new Error("Failed to update checklist.");
      }
    } catch (err) {
      alert(`Error on editing checklist name: ${err.message}`);
    }
  }

  /*********************************************************************/
  //Search

  function cleanSearch() {
    selectedCategory = "UNIX"; // Reset to default category
    selectedRisk = "위험도"; // Reset to default risk level
    showDataTbale2 = false; // Reset any UI flags

    filterData();
  }

  // Trigger edit mode
  function startEditing(checklistId, currentName) {
    editingChecklistId = checklistId;
    editedChecklistName = currentName;
  }
  // Cancel edit mode
  function cancelEditing() {
    editingChecklistId = null;
    editedChecklistName = "";
  }

  let showEdit = false;

  function resetEditAndModalState() {
    // If currently editing, save the changes
    if (editingChecklistId !== null) {
      editChecklist(editingChecklistId, editedChecklistName);
    }
    selectedChecklist = "";
    // Reset all relevant states
    editingChecklistId = null;
    editedChecklistName = "";
    showModalModalEditItem = false;
    showEdit = false; // Reset showEdit state as well
  }
  let generalCopy = false;
  let anotherChecklistId = null;
  function generalcopy() {
    generalCopy = true;
    showModal = true;
  }
  // async function deleteLastCreatedChecklist() {
  //   try {
  //     if (!lastCreatedChecklistId) {
  //       alert("마지막으로 생성된 체크리스트가 없습니다."); // Alert if no checklist to delete
  //       return;
  //     }

  //     // Find the last created checklist
  //     const lastCreatedChecklist = allChecklistArray.find(
  //       (checklist) => checklist.ccg_index === lastCreatedChecklistId,
  //     );

  //     if (!lastCreatedChecklist) {
  //       alert("마지막으로 생성된 체크리스트를 찾을 수 없습니다."); // Alert if not found
  //       return;
  //     }

  //     // Confirm deletion
  //     const isConfirmed = await confirmDeleteLast(
  //       lastCreatedChecklist.ccg_group,
  //     );
  //     if (!isConfirmed) return;

  //     // Call the delete API
  //     const response = await setDeleteChecklistGroup(lastCreatedChecklistId);

  //     if (response.success) {
  //       // Remove the deleted checklist from the arrays
  //       allChecklistArray = allChecklistArray.filter(
  //         (checklist) => checklist.ccg_index !== lastCreatedChecklistId,
  //       );
  //       createdChecklists = createdChecklists.filter(
  //         (checklist) => checklist.ccg_index !== lastCreatedChecklistId,
  //       );

  //       // Reset state related to the last created checklist
  //       lastCreatedChecklistId = null;
  //       selectedChecklist = null;
  //       activeMenu = null;

  //       // Success message
  //       successAlert(
  //         "마지막으로 생성된 체크리스트가 성공적으로 삭제되었습니다!",
  //       );
  //     } else {
  //       throw new Error("체크리스트 삭제에 실패했습니다.");
  //     }
  //   } catch (error) {
  //     alert(`체크리스트 삭제 중 오류가 발생했습니다: ${error.message}`);
  //   }
  // }
</script>

<section>
  <article class="sideMenu" style=" height: calc(100vh - 141px);">
    <div class="btnWrap">
      <a class="btn btnPrimary" on:click={generalcopy}>
        <img src="./assets/images/icon/add.svg" />그룹추가
      </a>
      <a class="btn btnRed" on:click={deleteProject}>
        <img src="./assets/images/icon/delete.svg" alt="createGroup" />그룹삭제
      </a>
    </div>

    {#if loading}
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    {:else if error}
      <p>Error: {error}</p>
    {:else}
      <ul
        class="prMenuList"
        style="overflow-y: scroll;height: 92%; overlow-x:hidden;"
      >
        {#each [...allChecklistArray].sort((a, b) => new Date(b.ccg_createdate) - new Date(a.ccg_createdate)) as checkList (checkList?.ccg_index)}
          <li class={activeMenu === checkList ? "active" : ""}>
            <a
              href="#"
              on:click|preventDefault={handleChecklistSelect(checkList)}
              title="{checkList.ccg_group}({checkList.ccg_checklist_year})"
            >
              <span
                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"
              >
                {checkList.ccg_group ? checkList.ccg_group : "No group info"} ({checkList.ccg_checklist_year})
              </span>
              <span class="arrowIcon"></span>
            </a>
          </li>
        {/each}

        <!-- Render newly created checklists with Edit/Delete buttons -->
        {#if selectedChecklist && selectedChecklist.ccg_provide === 0}
          <li>
            <div class="project_button">
              <div class="new_input">
                {#if editingChecklistId === selectedChecklist.ccg_index}
                  <!-- Edit mode: render input field -->
                  <input
                    type="text"
                    bind:value={editedChecklistName}
                    placeholder="Edit name"
                    class="editable_input"
                  />
                {/if}
              </div>
            </div>
          </li>
        {/if}
      </ul>
    {/if}
  </article>

  <div
    class="contentsWrap logWrap inspectionitems"
    style="width: calc(100% - 280px);"
  >
    <article class="contentArea mt-0">
      <section class="filterWrap">
        <div>
          <select
            name="asset_group"
            id="asset_group"
            bind:value={selectedCategory}
            on:change={handleCategorySelection}
            style="width: 150px;"
          >
            <option value="UNIX">점검대상</option>
            <option value="UNIX">UNIX</option>
            <option value="WINDOWS">WINDOWS</option>
            <option value="PC">PC</option>
            <option value="NETWORK">NETWORK</option>
            <option value="DBMS">DBMS</option>
            <option value="WEB">WEB</option>
            <option value="WAS">WAS</option>
            <option value="CLOUD">CLOUD</option>
            <option value="SECURITY">SECURITY</option>
          </select>

          <select
            bind:value={selectedRisk}
            name="agent_status"
            id="agent_status"
            style="width: 120px;"
          >
            <option value="위험도">위험도</option>
            <option value="상">상</option>
            <option value="중">중</option>
            <option value="하">하</option>
          </select>

          <!-- svelte-ignore a11y-click-events-have-key-events -->

          <button
            style="padding: 15px;"
            class="btn btnPrimary"
            on:click={cleanSearch}
          >
            <img src="./assets/images/reset.png" alt="search" />초기화
          </button>

          {#if selectedChecklist}
            <button
              style="padding: 15px;"
              class="btn btnPrimary"
              on:click={() => {
                showModal = true;
                generalCopy = false; // Change to false if you want specific behavior
                console.log("Open modal for selected checklist");
              }}
            >
              복사
            </button>
          {/if}

          {#if selectedChecklist && selectedChecklist.ccg_provide === 0}
            <!-- If the checklist is in edit mode, show Save/Cancel buttons -->
            {#if editingChecklistId === selectedChecklist.ccg_index}
              <button
                style="padding: 15px;"
                class="btn btnPrimary save"
                on:click={() => {
                  editChecklist(
                    selectedChecklist.ccg_index,
                    editedChecklistName,
                  );
                  resetEditAndModalState();
                }}
              >
                구하다
              </button>
              <button
                style="padding: 15px;"
                class="btn btnPrimary cancel"
                on:click={() => {
                  cancelEditing();
                  resetEditAndModalState();
                }}
              >
                취소
              </button>
            {:else}
              <!-- Show Edit/Delete buttons in normal mode -->
              <button
                style="padding: 15px;"
                class="btn btnPrimary edit"
                on:click={() => {
                  startEditing(
                    selectedChecklist.ccg_index,
                    selectedChecklist.ccg_group,
                  );
                  showEdit = true;
                }}
              >
                그룹명변경
              </button>
              <button
                style="padding: 15px;"
                class="btn btnPrimary delete btnRed"
                on:click={deleteProject}
              >
                점검그룹삭제
              </button>
            {/if}
          {/if}
          {#if showModalModalEditItem}
            <button
              style="padding: 15px;"
              class="btn btnPrimary"
              on:click={() => {
                console.log("Closing modal");
                showEdit = false;
                showModalModalEditItem = false;
              }}
            >
              돌아가기
            </button>
          {:else if currentPage === CheckListDetail}
            <button
              style="padding: 15px;"
              class="btn btnPrimary"
              on:click={() => {
                console.log("Going back to ItemPage");
                selectPage(ItemPage);

                resetEditAndModalState();
              }}
            >
              돌아가기
            </button>
          {/if}
        </div>
      </section>
    </article>

    <div class="flex col detail">
      <svelte:component
        this={currentPage}
        {allChecklistArray}
        {filteredData}
        {selectedRisk}
        {selectedCategory}
        {selectedChecklist}
        {searchResult}
        {isSearchActive}
        {activeMenu}
        {lastCreatedChecklistId}
        {showSlide}
        {swiperContainer}
        {showModalSecond}
        {selectedSlide}
        {cleanSearch}
        bind:selectedItem
        bind:showEdit
        bind:showDataTbale2
        bind:slides
        bind:showModalModalEditItem
        {isNewlyCreatedChecklist}
        on:projectDeleted={(event) => {
          const id = event.detail;
          allChecklistArray = allChecklistArray.filter(
            (checklist) => checklist.ccg_index !== id,
          );
        }}
      />
    </div>
  </div>

  {#if showModal}
    <div class="modal-open-wrap">
      <dialog open on:close={() => (showModal = false)}>
        <div class="modal-content">
          <div class="modal">
            <h3>새로운 진단 그룹 생성</h3>
            <div class="first_line">
              <label for="source-group">복사 대상:</label>
              {#if generalCopy}
                <select
                  class="first_line_input"
                  bind:value={anotherChecklistId}
                  id="source-group"
                >
                  {#each allChecklistArray as checklist}
                    <option value={checklist.ccg_index}>
                      {checklist.ccg_group}
                    </option>
                  {/each}
                </select>
              {:else}
                <select
                  class="first_line_input"
                  bind:value={selectedChecklistForCopyId}
                  id="source-group"
                >
                  {#each allChecklistArray as checklist}
                    <option value={checklist.ccg_index}>
                      {checklist.ccg_group}
                    </option>
                  {/each}
                </select>
              {/if}
            </div>
            <div class="second_line">
              <label for="new-group">신규 그룹명:</label>
              <input
                class="second_line_input"
                type="text"
                bind:value={newChecklistName}
                id="new-group"
                placeholder="새로운 진단 그룹명을 입력하세요"
              />
            </div>
            <div class="modal-buttons">
              <button class="primary-button" on:click={createNewChecklistGroup}
                >저장하기</button
              >
              <button
                class="secondary-button"
                on:click={() => (showModal = false)}>Cancel</button
              >
            </div>
          </div>
        </div>
      </dialog>
    </div>
  {/if}
</section>

<style>
  .sideMenu .btnWrap .btn:hover img {
    filter: brightness(0) invert(1);
  }
  /* General Reset */
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
  .edit {
    background-color: rgba(0, 255, 140, 0.06);
    color: #27ae60;
  }
  .active {
    color: #ffffff;
    background-color: #0067ff;
  }

  .btn:hover {
    color: #fff;
    background-color: #0067ff;
  }

  .first_line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .second_line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  dialog {
    position: fixed;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
    width: 400px;
    border: none;
    border-radius: 10px;
    background-color: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s ease;
    z-index: 100;
  }
  /***MODAL */
  /* Modal content container */
  .modal-content {
    text-align: center;
  }
  .modal {
    margin-top: 10px;
  }
  /* Paragraph showing the selected group */
  p {
    font-size: 1em;
    color: #666;
    margin-bottom: 20px;
  }
  h3 {
    margin-bottom: 10px;
  }

  /* Modal buttons */
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .first_line_input {
    width: 250px;
    padding: 5px;
  }
  .second_line_input {
    width: 250px;
    padding: 5px;
  }
  .primary-button {
    background-color: #54b3d6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .primary-button:hover {
    background-color: #48a2bf;
  }

  .secondary-button {
    background-color: #f0f0f0;
    color: #666;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .secondary-button:hover {
    background-color: #e0e0e0;
  }

  /* Modal backdrop */
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
    animation: fadeInBackdrop 0.3s ease;
  }

  /* Fade-in animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -60%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }

  @keyframes fadeInBackdrop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  /***************************************/
  /* Tooltip styling */
  .prMenuList a[title] {
    position: relative;
    cursor: pointer;
  }

  /* Tooltip on hover */
  .prMenuList a[title]:hover::after {
    content: attr(title); /* The full text from the title attribute */
    position: absolute;
    bottom: 100%; /* Position the tooltip above the text */
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: #fff;
    padding: 5px;
    font-size: 12px;
    white-space: nowrap;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  /* Tooltip arrow */
  .prMenuList a[title]:hover::before {
    content: "";
    position: absolute;
    bottom: 100%;
    z-index: 1000;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #333 transparent;
  }

  * {
    font-size: 16px;
  }
  .project_button {
    display: flex;
    flex-direction: row;
  }

  .editable_input {
    border: 1px solid #555;
    height: 40px;
    width: 100%;
  }
  .filterWrap select,
  input {
    padding: 0 32px 0 15px;
    height: 40px;
    background-size: 8px;
    color: #626677;
    border: 1px solid rgba(98, 102, 119, 0.2);
    border-radius: 6px;
    box-sizing: border-box;
    background-size: 10px;
    font-weight: 400;
    font-size: 16px;
  }
  .active:hover {
    color: #fff; /* Change text color to white on hover */
  }
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(167, 167, 167, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000; /* Ensure it sits above other content */
  }

  .loading-spinner {
    border: 8px solid #f3f3f3; /* Light grey */
    border-top: 8px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 1s linear infinite;
  }

  /* Spinner animation */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
