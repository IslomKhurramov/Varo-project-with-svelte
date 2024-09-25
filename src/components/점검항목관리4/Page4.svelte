<script>
  import ItemPage from "./ItemPage.svelte";
  import { onMount, afterUpdate } from "svelte";
  import { getAllCheckList } from "../../services/page4/getAllCheckList";
  import { setNewChecklistGroup } from "../../services/page4/getAllCheckList";
  import { getChecklistItemBySearch } from "../../services/page4/getAllCheckList";
  import AddedChecklist from "./AddedChecklist.svelte";
  import Modal from "../../shared/Modal.svelte";
  import Modal2 from "../../shared/Modal2.svelte";
  import { setDeleteChecklistGroup } from "../../services/page4/getAllCheckList";
  import { setUpdateGroupName } from "../../services/page4/getAllCheckList";
  import { Swiper, Navigation, Pagination } from "swiper";
  import "swiper/swiper-bundle.min.css";
  import ModalSwiper from "./ModalSwiper.svelte";
  import { tick } from "svelte";
  import {
    checklistStore,
    fetchChecklistData,
  } from "../../services/page4/checklistStore";

  let currentView = "default";
  let currentPage = ItemPage;
  let selectedCategory = "UNIX"; // Default to UNIX
  let loading = true;
  let error = null;
  let allChecklistArray = [];
  let filteredData = [];
  let selectedChecklist = null;
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
  let showSlide = false;
  let showModalSecond = false;
  let selectedSlide = null;
  let selectedRisk = "위험도";
  let item_no = "";
  let searchResult = [];
  let isSearchActive = false;
  let activeChecklistElement = null;
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
  // Fetching data on component mount
  // Subscribe to checklistStore
  checklistStore.subscribe(
    ({ loading: storeLoading, data, error: storeError }) => {
      loading = storeLoading;
      allChecklistArray = data;
      error = storeError;
    },
  );

  // Fetch the checklist data once
  onMount(() => {
    if (!allChecklistArray.length) {
      fetchChecklistData();
    }
  });
  /*****************************************************************************/

  async function createNewChecklistGroup() {
    try {
      const response = await setNewChecklistGroup(
        selectedChecklistForCopyId,
        newChecklistName,
      );

      if (response.success) {
        // Fetch the updated checklist data
        showModal = false;
        sweetAlert("Checklist created successfully!");
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
        showModal = false;
      } else {
        throw new Error("Failed to create checklist.");
      }
    } catch (err) {
      alert(`Failed to create new checklist group: ${err.message}`);
    }
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

  async function refreshChecklistData() {
    try {
      const allCheckList = await getAllCheckList();
      allChecklistArray = Object.values(allCheckList); // Convert to array

      // Automatically set the newly created checklist as the active one
      if (allChecklistArray.length > 0) {
        selectedChecklist = allChecklistArray[allChecklistArray.length - 1];
        activeMenu = selectedChecklist;
        console.log("Refreshed data:", selectedChecklist);
      }
    } catch (error) {
      console.error("Error fetching checklist data:", error);
    }
  }

  /*********************************************************************************/
  // Delete a checklist (only for the last created checklist)
  async function deleteChecklist(checklistId) {
    try {
      const response = await setDeleteChecklistGroup(checklistId);

      if (response.success) {
        alert("Checklist deleted successfully!");

        // Update local state without re-fetching
        allChecklistArray = allChecklistArray.filter(
          (checklist) => checklist.ccg_index !== checklistId,
        );
        createdChecklists = createdChecklists.filter(
          (checklist) => checklist.ccg_index !== checklistId,
        );

        // Reset the last created checklist ID after deletion
        lastCreatedChecklistId = null;
      } else {
        throw new Error("Deletion failed.");
      }
    } catch (err) {
      alert(`Failed to delete checklist group: ${err.message}`);
    }
  }

  /************************************************************************/
  // Filter data based on selected category
  function filterData() {
    if (selectedCategory && allChecklistArray.length > 0) {
      // Flatten the checklist array and filter by category
      filteredData = allChecklistArray.flatMap(
        (item) => item[selectedCategory] || [],
      );

      // Map the filtered data to extract `ccc_item_no`
      slides = filteredData.map((item) => item);
      showSlide = slides.length > 0;
      // Initialize or update Swiper only when the data is ready
      initializeSwiper();
    } else {
      showSlide = false;
    }
  }

  /************************************************************************/
  // Run filterData every time `selectedCategory` or `allChecklistArray` updates
  $: filterData();

  /************************************************************************/
  // After component updates (e.g., after DOM updates), ensure Swiper is properly initialized
  afterUpdate(() => {
    if (slides.length > 0) {
      initializeSwiper();
    }
  });
  /*************************************************************/

  /**********************************************/

  const addProject = () => {
    const newProjectNumber = assets.length + 1;
    assets = [...assets, `자산그룹${newProjectNumber}`];
    editingIndex = assets.length - 1;
  };
  /***********************************************************/
  // Edit checklist function (to be defined)
  async function editChecklist(checklistId, editedName) {
    try {
      const response = await setUpdateGroupName(checklistId, editedName);
      if (response.success) {
        // Update the checklist locally
        allChecklistArray = allChecklistArray.map((checklist) =>
          checklist.ccg_index === checklistId
            ? { ...checklist, ccg_group: editedName }
            : checklist,
        );

        window.location.reload();
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
  async function searchItem(
    selectedChecklist,
    selectedCategory,
    item_no,
    selectedRisk,
  ) {
    // Check if selectedChecklist is null or undefined before proceeding
    if (!selectedChecklist) {
      alert("Please select a checklist item.");
      return;
    }

    const ccg_index = selectedChecklist.ccg_index;
    const category = selectedCategory;
    const item_number = item_no;
    const riskLevel = selectedRisk;

    // Check for empty fields before making the search request
    if (!ccg_index) {
      alert("Please select a valid checklist item.");
      return;
    }

    if (category === "점검대상") {
      alert("Please choose a category.");
      return;
    }

    if (!item_number) {
      alert("Please input the item number.");
      return;
    }

    if (riskLevel === "위험도") {
      alert("Please choose a risk level.");
      return;
    }

    try {
      const response = await getChecklistItemBySearch(
        ccg_index,
        category,
        item_number,
        riskLevel,
      );

      console.log("SEARCH RESPONSE:", response);

      if (response.RESULT === "OK" && Array.isArray(response.CODE)) {
        if (response.CODE.length > 0) {
          console.log("SEARCH SUCCEED:", response.CODE);
          searchResult = response.CODE;
          isSearchActive = true;
        } else {
          alert("No results found for your search.");
        }
      } else {
        throw new Error(`Search failed: ${response.CODE}`);
      }
    } catch (err) {
      console.error("ERROR searching checklistItem:", err.message);
      alert(`ERROR searching checklistItem: ${err.message}`);
    }
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
</script>

<main class="container">
  <div class="container_aside">
    <aside>
      <div class="add_delete_container">
        <button class="menu_button" on:click={addProject}>그룹추가</button>
        <button class="menu_button">그룹삭제</button>
      </div>

      <div class="project_container">
        {#if loading}
          <p>Loading...</p>
        {:else if error}
          <p>Error: {error}</p>
        {:else}
          {#each allChecklistArray as checkList (checkList.ccg_index)}
            <div class="project_button" bind:this={activeChecklistElement}>
              <div class="icon_title">
                <img src="./images/file.png" alt="project" />
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a
                  href="#"
                  on:click|preventDefault={() =>
                    selectPage(ItemPage, checkList)}
                  class={activeMenu === checkList ? "active" : ""}
                  title={checkList.ccg_group}
                >
                  <i class="fa fa-user-o" aria-hidden="true"></i>
                  <span class="truncate-text">
                    {checkList.ccg_group
                      ? checkList.ccg_group
                      : "No group info"}</span
                  >
                </a>
              </div>
              <div style="display: flex; flex-direction:column">
                <button
                  class="menu_button1 copy"
                  on:click={() => {
                    showModal = true;
                    selectedChecklistForCopyId = checkList.ccg_index;
                  }}>복사</button
                >
              </div>
            </div>
          {/each}

          <!-- Render newly created checklists with Edit/Delete buttons -->
          {#each createdChecklists as checklist (checklist.ccg_index)}
            <div class="project_button new-project">
              <div class="icon_title">
                <img src="./images/file.png" alt="new project" />

                {#if editingChecklistId === checklist.ccg_index}
                  <!-- Edit mode: render input field -->
                  <input
                    type="text"
                    bind:value={editedChecklistName}
                    placeholder="Edit name"
                  />
                {:else}
                  <!-- Normal mode: render the checklist name -->
                  <!-- svelte-ignore a11y-invalid-attribute -->
                  <a href="#">
                    {checklist.ccg_group}
                  </a>
                {/if}
              </div>

              <div style="display: flex; flex-direction:column">
                {#if editingChecklistId === checklist.ccg_index}
                  <!-- Show Save/Cancel buttons in edit mode -->
                  <button
                    class="menu_button1 save"
                    on:click={() =>
                      editChecklist(checklist.ccg_index, editedChecklistName)}
                  >
                    Save
                  </button>
                  <button class="menu_button1 cancel" on:click={cancelEditing}>
                    Cancel
                  </button>
                {:else}
                  <!-- Normal mode: show Edit, Copy, Delete buttons -->
                  <button
                    class="menu_button1 edit"
                    on:click={() =>
                      startEditing(checklist.ccg_index, checklist.ccg_group)}
                  >
                    Edit
                  </button>
                  <button
                    class="menu_button1 delete"
                    on:click={() => deleteChecklist(checklist.ccg_index)}
                  >
                    Delete
                  </button>
                {/if}
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </aside>
  </div>
  <div class="right_menu">
    <header class="header">
      <div class="header_option">
        <form action="/action_page.php" class="form_select">
          <div class="select_container">
            <select
              name="asset_group"
              id="asset_group"
              class="select_input"
              bind:value={selectedCategory}
              on:change={filterData}
            >
              <option value="점검대상">점검대상</option>
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
          </div>
          <div class="select_container">
            <input
              placeholder="입력 점검항목"
              type="text"
              class="select_input"
              bind:value={item_no}
            />
          </div>
          <div class="select_container">
            <select
              bind:value={selectedRisk}
              name="agent_status"
              id="agent_status"
              class="select_input"
            >
              <option value="위험도">위험도</option>
              <option value="상">상</option>
              <option value="중">중</option>
              <option value="하">하</option>
            </select>
          </div>
        </form>
      </div>
      <div class="header_button">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p
          on:click={() =>
            searchItem(
              selectedChecklist,
              selectedCategory,
              item_no,
              selectedRisk,
            )}
        >
          조회
        </p>

        <p>엑셀저장</p>
      </div>
    </header>
    {#if showSlide}
      <div class="swiper_container1">
        <img src="./images/left.png" alt="left" />
        <div bind:this={swiperContainer} class="swiper-container">
          <div class="swiper-wrapper">
            {#each slides as slide}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <div
                class="swiper-slide"
                on:click={() => {
                  showModalSecond = true;
                  selectedSlide = slide;
                }}
              >
                {slide.ccc_item_no}
              </div>
            {/each}
          </div>
          <div class="swiper-pagination"></div>
          <div class="swiper-button-prev"></div>
          <div class="swiper-button-next"></div>
        </div>
        <img
          src="./images/left.png"
          style="transform: rotate(180deg);"
          alt="right"
        />
      </div>
    {/if}
    <div class="swiper_container">
      <div class="swiper_container">
        <svelte:component
          this={currentPage}
          {allChecklistArray}
          {filteredData}
          {selectedCategory}
          {selectedChecklist}
          {searchResult}
          {isSearchActive}
          {activeMenu}
          {lastCreatedChecklistId}
        />
      </div>
    </div>
  </div>

  <Modal2 bind:showModalSecond>
    <ModalSwiper {selectedSlide} {selectedCategory} />
  </Modal2>
  {#if showModal}
    <dialog open on:close={() => (showModal = false)}>
      <div class="modal-content">
        <div class="modal">
          <h3>새로운 진단 그룹 생성</h3>
          <div>
            <label for="source-group">복사 대상:</label>
            <select bind:value={selectedChecklistForCopyId} id="source-group">
              {#each allChecklistArray as checklist}
                <option value={checklist.ccg_index}
                  >{checklist.ccg_group}</option
                >
              {/each}
            </select>
          </div>
          <div>
            <label for="new-group">신규 그룹명:</label>
            <input
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
  {/if}
</main>

<style>
  .right_menu {
    flex-grow: 1;
    margin: 10px 20px;
    width: 80%;
  }

  /* Scrollbar styling */
  .right_menu::-webkit-scrollbar {
    width: 8px;
  }

  .right_menu::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .right_menu::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 8px;
  }

  .right_menu::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  /* General Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Arial", sans-serif;
  }

  /* Main container for layout */
  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
    border-radius: 20px;
    padding: 10px;
    min-height: 100vh;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  }

  /* Sidebar container */
  .container_aside {
    background-color: #f7f9fb; /* Use white background for cleanliness */
    color: #343a40;
    padding: 20px;
    width: 250px;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    top: 0;
    bottom: 0;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; /* Soft shadow for depth */
    border-right: 1px solid #e0e0e0; /* Subtle border for separation */
    height: 110vh;
  }

  /* Sidebar styling */
  aside {
    font-size: 16px;
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  .icon_title {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  /* Project buttons */
  .project_button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: auto;
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
    cursor: pointer;
    margin-top: 15px;
    border-radius: 15px;
    border-bottom: 1px solid #cbcbcb;
  }

  .project_container {
    display: flex;
    flex-direction: column;
    background-color: #f7f9fb; /* Soft background color */
    border-radius: 8px; /* Smooth rounded corners */
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
    box-shadow:
      rgba(50, 50, 93, 0.2) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.2) 0px 1px 3px -1px;
    overflow-y: auto; /* Enables vertical scrolling */
    overflow-x: hidden; /* Prevents horizontal overflow */
    height: 100vh; /* Adjust height to fit inside sidebar */
    margin-right: 5px;
  }

  .project_button:hover {
    transform: translateY(-2px);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Hover effect */
  }

  .project_button img {
    width: 30px; /* Slightly larger project icon */
    height: auto;
  }

  aside a {
    display: block;
    color: #495057;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    transition: all 0.3s ease;
    margin-top: 5px;
    margin-right: 5px;
  }

  aside a:hover,
  aside a.active {
    text-decoration: underline;
    color: #3498db; /* Add underline for active/hover */
  }

  /* Add/Delete buttons */
  .add_delete_container {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    justify-content: space-between;

    background-color: #f7f9fb; /* Soft background color */
    border-radius: 8px; /* Smooth rounded corners */
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
    cursor: pointer;
    box-shadow:
      rgba(50, 50, 93, 0.2) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.2) 0px 1px 3px -1px;
  }

  .menu_button {
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    padding: 6px;
    transition: all 0.3s ease;
    font-weight: bold;
    color: #495057;
    text-align: center;
    width: 110px; /* Slightly wider button */
  }
  .menu_button1 {
    border-radius: 5px;
    cursor: pointer;
    font-size: 10px;
    padding: 2px;
    transition: all 0.3s ease;
    font-weight: bold;
    color: #495057;
    text-align: center;
    width: 60px;
  }
  .menu_button:hover,
  .menu_button1:hover {
    text-decoration: underline;
    box-shadow:
      rgba(50, 50, 93, 0.2) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.2) 0px 1px 3px -1px;
  }

  /***edit delete copy buttons*/
  /* Edit Button - Light Blue */
  .menu_button1.edit {
    background-color: #3498db;
    color: #ffffff;
  }

  .menu_button1.edit:hover {
    background-color: #2980b9;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  /* Delete Button - Red */
  .menu_button1.delete {
    background-color: #e74c3c;
    color: #ffffff;
  }

  .menu_button1.delete:hover {
    background-color: #c0392b;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  /* Copy Button - Green */
  .menu_button1.copy {
    background-color: #2ecc71;
    color: #ffffff;
  }

  .menu_button1.copy:hover {
    background-color: #27ae60;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  /* Save Button - Green */
  .menu_button1.save {
    background-color: #2ecc71;
    color: white;
  }

  .menu_button1.save:hover {
    background-color: #27ae60;
  }

  /* Cancel Button - Red */
  .menu_button1.cancel {
    background-color: #e74c3c;
    color: white;
  }

  .menu_button1.cancel:hover {
    background-color: #c0392b;
  }
  /* Header Styles */
  /* Header Styles */
  .header {
    display: flex;
    gap: 20px;
    align-items: center;
    padding: 10px 20px;
    background-color: #f7f9fb;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin-bottom: 20px;
  }

  .header_option {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .header_button {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 40px;
  }

  /* Form Select */
  .form_select {
    display: flex;
    gap: 15px;
  }

  .select_container {
    display: flex;
    flex-direction: column;
  }

  .select_input {
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease;
  }

  .select_input:hover {
    background-color: #e9ecef;
    border-color: #007acc;
  }

  .select_input:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 122, 204, 0.5);
    border-color: #007acc;
  }

  /* Header Buttons */
  .header_button p {
    color: #34495e;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .header_button p:hover {
    color: #3498db;
    text-decoration: underline;
  }

  /* Swiper Styles */
  .swiper-container {
    width: 100%;
    margin: 20px auto;
    padding: 10px 0;
    background-color: #f0f0f0;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    position: relative;
  }
  .swiper_container1 {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .swiper_container1 img {
    width: 50px;
    height: auto;
  }
  .swiper-wrapper {
    display: flex;
  }

  .swiper-slide {
    height: 50px;
    max-width: 300px;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    background: #fff;
    border-radius: 10px;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    cursor: pointer;
  }

  .swiper-slide:hover {
    transform: scale(1.1);
    box-shadow:
      0 4px 8px rgba(0, 0, 0, 0.2),
      0 8px 16px rgba(0, 0, 0, 0.2);
  }

  .swiper-pagination {
    color: #007acc;
  }

  /* Move the left and right navigation buttons outside the swiper container */
  .swiper-button-prev,
  .swiper-button-next {
    color: #007acc;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }

  .swiper-button-prev {
    left: -50px;
  }

  .swiper-button-next {
    right: -50px;
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

  /* Styled select dropdown */
  select {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f5f5f5;
    transition: border 0.2s ease;
  }

  select:focus {
    outline: none;
    border-color: #54b3d6;
  }
  .modal-content input {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f5f5f5;
    transition: border 0.2s ease;
  }

  /* Paragraph showing the selected group */
  p {
    font-size: 1em;
    color: #666;
    margin-bottom: 20px;
  }

  /* Modal buttons */
  .modal-buttons {
    display: flex;
    justify-content: space-between;
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
  /* Truncate text with ellipsis */
  .truncate-text {
    display: inline-block;
    max-width: 100px; /* Adjust as per your layout */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
  }

  /* Tooltip styling */
  .project_button a[title] {
    position: relative;
    cursor: pointer;
  }

  /* Tooltip on hover */
  .project_button a[title]:hover::after {
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
  .project_button a[title]:hover::before {
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
</style>
