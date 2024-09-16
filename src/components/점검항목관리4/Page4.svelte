<script>
  import AddChecklistButton4 from "./AddChecklistButton4.svelte";
  import EditItem from "./EditItem.svelte";
  import ItemPage from "./ItemPage.svelte";
  import { onMount } from "svelte";
  import { getAllCheckList } from "../../services/page4/getAllCheckList";

  let selectedCategory = "UNIX"; // Default to UNIX
  let loading = true;
  let error = null;
  let allChecklistArray = [];
  let filteredData = [];

  // Fetching data on mount
  onMount(async () => {
    try {
      const allCheckList = await getAllCheckList();
      allChecklistArray = Object.values(allCheckList); // Convert to array
      filterData(); // Filter data on mount
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

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

  /**********************************************/
  let currentView = "default";
  let currentPage = null;
  let activeMenu = null;
  let assets = ["주요정보통신기반시설 (2021) (520개)"];
  let editingIndex = null;

  const addProject = () => {
    const newProjectNumber = assets.length + 1;
    assets = [...assets, `자산그룹${newProjectNumber}`];
    editingIndex = assets.length - 1;
  };

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
    currentView = "pageView";
    selectedProjectIndex = allChecklistArray[0].ccg_index;
    console.log("INDEX::", selectedProjectIndex);
  };

  function toggleView() {
    currentView = currentView === "default" ? "newView" : "default";
    currentPage = null;
  }

  function finishEditing(index, event) {
    editingIndex = null;
    assets[index] = event.target.value || assets[index];
  }

  function handleKeydown(event, index) {
    if (event.key === "Enter") {
      finishEditing(index, event);
    }
  }
</script>

<main class="container">
  <div class="container_aside">
    <aside>
      <div class="add_delete_container">
        <button class="menu_button" on:click="{addProject}">항목추가</button>
        <button class="menu_button">항목삭제</button>
      </div>

      <div class="project_container">
        {#if loading}
          <p>Loading...</p>
        {:else if error}
          <p>Error: {error}</p>
        {:else}
          <!-- Render the allChecklistArray -->
          {#each allChecklistArray as checkList, index}
            <div class="project_button">
              <div class="icon_title">
                <img src="./images/file.png" alt="project" />
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a
                  href="#"
                  on:click="{() => selectPage(ItemPage, checkList)}"
                  class="{activeMenu === checkList ? 'active' : ''}"
                >
                  <i class="fa fa-user-o" aria-hidden="true"></i>
                  {#if editingIndex === index}
                    <input
                      type="text"
                      value="{checkList.ccg_group}"
                      on:blur="{(event) => finishEditing(index, event)}"
                      on:keydown="{(event) => handleKeydown(event, index)}"
                    />
                  {:else}
                    <!-- Display ccg_group and other relevant info -->
                    {checkList.ccg_group
                      ? checkList.ccg_group
                      : "No group info"}
                    <p>{checkList.ccg_checklist_year}</p>
                    <!-- Example of another property -->
                  {/if}
                </a>
              </div>
              <div style="display: flex; flex-direction:column">
                <button
                  class="menu_button1 edit"
                  on:click="{() => selectPage(EditItem, '항목편집')}"
                  >편집</button
                >
                <button
                  class="menu_button1 copy"
                  on:click="{() => selectPage(EditItem, '항목편집')}"
                  >복사</button
                >
                <button
                  class="menu_button1 delete"
                  on:click="{() => selectPage(EditItem, '항목편집')}"
                  >삭제</button
                >
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
        <button on:click="{toggleView}" class="toggle_button">
          <span class="arrow">&#9662;</span>
        </button>
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
      </div>
    </header>

    <div class="swiper_container">
      {#if currentView === "default"}
        <ItemPage {allChecklistArray} {filteredData} {selectedCategory} />
      {:else if currentPage}
        <svelte:component this="{currentPage}" />
      {/if}
    </div>
  </div>
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
  }

  /* Sidebar styling */
  aside {
    font-size: 16px;
    width: 100%;
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
    height: 98vh; /* Adjust height to fit inside sidebar */
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
  /* Header Styles */
  /* Header Styles */
  .header {
    display: flex;
    justify-content: space-between;
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
