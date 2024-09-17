<script>
  import ItemPage from "./ItemPage.svelte";
  import { onMount } from "svelte";
  import { getAllCheckList } from "../../services/page4/getAllCheckList";
  import { setNewChecklistGroup } from "../../services/page4/getAllCheckList";
  import AddedChecklist from "./AddedChecklist.svelte";
  import Modal from "../../shared/Modal.svelte";
  import { setDeleteChecklistGroup } from "../../services/page4/getAllCheckList";
  import { setUpdateGroupName } from "../../services/page4/getAllCheckList";

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
  /*****************************************************************************/
  // Fetching data on component mount
  async function fetchChecklists() {
    loading = true;
    try {
      const allCheckList = await getAllCheckList();
      allChecklistArray = Object.values(allCheckList); // Convert to array
      if (allChecklistArray.length > 0) {
        selectedChecklist = allChecklistArray[0]; // Select the first checklist
        activeMenu = allChecklistArray[0];
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  onMount(fetchChecklists); // Fetch checklists on component mount
  /*****************************************************************************/
  // Create a new checklist group
  async function createNewChecklistGroup() {
    try {
      const response = await setNewChecklistGroup(
        selectedChecklistForCopyId,
        newChecklistName
      );

      if (response.success) {
        // Generate a new ID locally and update the state
        const existingIds = allChecklistArray
          .map((item) => Number(item.ccg_index))
          .filter((id) => !isNaN(id));

        const maxId = existingIds.length ? Math.max(...existingIds) : 0;
        const newChecklistId = maxId + 1;

        const newChecklist = {
          ccg_group: newChecklistName,
          ccg_index: newChecklistId.toString(),
        };

        // Update local state without re-fetching
        allChecklistArray = [...allChecklistArray, newChecklist];
        createdChecklists = [...createdChecklists, newChecklist];
        lastCreatedChecklistId = newChecklistId;

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

  /*********************************************************************************/
  // Delete a checklist (only for the last created checklist)
  async function deleteChecklist(checklistId) {
    try {
      const response = await setDeleteChecklistGroup(checklistId);

      if (response.success) {
        alert("Checklist deleted successfully!");

        // Update local state without re-fetching
        allChecklistArray = allChecklistArray.filter(
          (checklist) => checklist.ccg_index !== checklistId
        );
        createdChecklists = createdChecklists.filter(
          (checklist) => checklist.ccg_index !== checklistId
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
      // Filter the checklist array based on the selected category
      filteredData = allChecklistArray.flatMap(
        (item) => item[selectedCategory] || []
      );
    }
  }

  // Trigger when category changes
  $: filterData();
  /**********************************************************************/
  // When a checklist is selected, pass it to the second component
  const selectPage = (page, checklist) => {
    selectedChecklist = checklist; // Store the selected checklist
    currentPage = page;
    activeMenu = checklist;
    currentView = "pageView";
    console.log("INDEX:", selectedChecklist);
  };
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
            : checklist
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
        <button class="menu_button" on:click="{addProject}">그룹추가</button>
        <button class="menu_button">그룹삭제</button>
      </div>

      <div class="project_container">
        {#if loading}
          <p>Loading...</p>
        {:else if error}
          <p>Error: {error}</p>
        {:else}
          {#each allChecklistArray as checkList (checkList.ccg_index)}
            <div class="project_button">
              <div class="icon_title">
                <img src="./images/file.png" alt="project" />
                <a
                  href="#"
                  on:click="{() => selectPage(ItemPage, checkList)}"
                  class="{activeMenu === checkList ? 'active' : ''}"
                >
                  {checkList.ccg_group ? checkList.ccg_group : "No group info"}
                </a>
              </div>
              <div style="display: flex; flex-direction:column">
                <button
                  class="menu_button1 copy"
                  on:click="{() => {
                    showModal = true;
                    selectedChecklistForCopyId = checkList.ccg_index;
                  }}">복사</button
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
                    bind:value="{editedChecklistName}"
                    placeholder="Edit name"
                  />
                {:else}
                  <!-- Normal mode: render the checklist name -->
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
                    on:click="{() =>
                      editChecklist(checklist.ccg_index, editedChecklistName)}"
                  >
                    Save
                  </button>
                  <button
                    class="menu_button1 cancel"
                    on:click="{cancelEditing}"
                  >
                    Cancel
                  </button>
                {:else}
                  <!-- Normal mode: show Edit, Copy, Delete buttons -->
                  <button
                    class="menu_button1 edit"
                    on:click="{() =>
                      startEditing(checklist.ccg_index, checklist.ccg_group)}"
                  >
                    Edit
                  </button>
                  <button
                    class="menu_button1 copy"
                    on:click="{() => {
                      showModal = true;
                      selectedChecklistForCopyId = checklist.ccg_index;
                    }}"
                  >
                    Copy
                  </button>
                  <button
                    class="menu_button1 delete"
                    on:click="{() => deleteChecklist(checklist.ccg_index)}"
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
              name="approval_status"
              id="approval_status"
              class="select_input"
            >
              <option value="pending">점검그룹</option>
              <option value="approved">운영체제</option>
              <option value="rejected">에이전트여부</option>
              <option value="rejected">등록승인여부</option>
            </select>
          </div>
          <div class="select_container">
            <select
              name="asset_group"
              id="asset_group"
              class="select_input"
              bind:value="{selectedCategory}"
              on:change="{filterData}"
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
            <select
              name="operating_system"
              id="operating_system"
              class="select_input"
            >
              <option value="windows">점검항목</option>
              <option value="linux">Linux</option>
              <option value="macos">macOS</option>
            </select>
          </div>
          <div class="select_container">
            <select name="agent_status" id="agent_status" class="select_input">
              <option value="active">위험도</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </form>
      </div>
      <div class="header_button">
        <p>조회</p>
        <p>엑셀저장</p>
      </div>
    </header>

    <div class="swiper_container">
      <div class="swiper_container">
        <svelte:component
          this="{currentPage}"
          {allChecklistArray}
          {filteredData}
          {selectedCategory}
          {selectedChecklist}
        />
      </div>
    </div>
  </div>
  <Modal bind:showModal>
    <AddedChecklist
      {createNewChecklistGroup}
      {allChecklistArray}
      bind:newChecklistName
      bind:selectedChecklistForCopyId
    />
  </Modal>
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
    width: 300px;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    top: 0;
    bottom: 0;
    box-shadow:
      rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
      rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; /* Soft shadow for depth */
    border-right: 1px solid #e0e0e0; /* Subtle border for separation */
    flex-shrink: 0;
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
    margin-top: 5px;
    border-radius: 15px;
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
    min-height: 100vh; /* Adjust height to fit inside sidebar */
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
    text-decoration: underline; /* Add underline for active/hover */
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

  /* Dropdown Arrow */
  .arrow {
    color: #ffffff;
  }

  /* Toggle Button */
  .toggle_button {
    background-color: #007acc;
    color: #ffffff;
    padding: 10px;
    height: 30px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .toggle_button:hover {
    background-color: #005fa3;
  }

  /* Second Line Styles */
  .second_line {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
    padding-right: 20px;
  }

  .second_line button {
    background-color: #007acc;
    color: #ffffff;
    border-radius: 5px;
    height: 36px;
    width: 140px;
    cursor: pointer;
    font-size: 14px;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .second_line button:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
</style>
