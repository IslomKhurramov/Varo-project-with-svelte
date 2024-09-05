<script>
  import AssetCardsPage from "./AssetCardsPage.svelte";
  import Modal from "../../shared/Modal.svelte";
  import ModalChasanGroup from "./ModalChasanGroup.svelte";
  import Swiper from "./Swiper.svelte";
  import AssetManagement from "./AssetManagement.svelte";
  import Jongbusujin from "./Jongbusujin.svelte";
  import AssetManagementChasansangButton from "./AssetManagementChasansangButton.svelte";

  let currentView = "default";
  let currentPage = null;
  let activeMenu = null;
  let showModal = false;

  let assets = ["자산그룹 1"];

  const addProject = () => {
    const newProjectNumber = assets.length + 1;
    assets = [...assets, `자산그룹${newProjectNumber}`];
  };

  const deleteProject = () => {
    if (projects.length > 0) {
      projects = projects.slice(0, -1); // Remove the last project
    }
  };

  const selectPage = (page, menu) => {
    console.log("Page selected:", page);
    currentPage = page;
    activeMenu = menu;
  };

  function toggleView() {
    currentView = currentView === "default" ? "newView" : "default";
    currentPage = null;
    console.log("Current View:", currentView);
  }
</script>

<div class="container">
  <div class="container_aside">
    <aside>
      <div class="add_delete_container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p class="menu_button" on:click="{addProject}">신규점검</p>
        <p class="menu_button">이력삭제</p>
      </div>

      <div class="project_container">
        {#each assets as asset, index}
          <dir class="project_button">
            <div class="button_cont">
              <img src="./images/asset.png" alt="project" />
              <!-- svelte-ignore missing-declaration -->
              <!-- svelte-ignore a11y-invalid-attribute -->
              <a
                href="#"
                on:click="{() => selectPage(AssetPage, asset)}"
                class="{activeMenu === asset ? 'active' : ''}"
              >
                <i class="fa fa-user-o" aria-hidden="true"></i>
                {asset}
              </a>
            </div>
            <button
              class="asset_button"
              on:click="{() => selectPage(AssetManagement, '자산관리')}"
              >자산관리</button
            >
          </dir>
        {/each}
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
              <option value="pending">자산그룹명</option>
              <option value="approved">운영체제</option>
              <option value="rejected">에이전트여부</option>
              <option value="rejected">등록승인여부</option>
            </select>
          </div>
          <div class="select_container">
            <select name="asset_group" id="asset_group" class="select_input">
              <option value="network">운영체제</option>
              <option value="endpoint">Endpoint Security</option>
              <option value="cloud">Cloud Security</option>
            </select>
          </div>
          <div class="select_container">
            <select
              name="operating_system"
              id="operating_system"
              class="select_input"
            >
              <option value="windows">에이전트여부</option>
              <option value="linux">Linux</option>
              <option value="macos">macOS</option>
            </select>
          </div>
          <div class="select_container">
            <select name="agent_status" id="agent_status" class="select_input">
              <option value="active">등록승인여부</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </form>
      </div>
      <div class="header_button">
        <p>자산명</p>
        <p>엑셀다운로드</p>
      </div>
    </header>

    <div class="second_line">
      <button
        on:click="{() =>
          selectPage(AssetManagementChasansangButton, '정보수집')}"
      >
        자산상세검색
      </button>
      <button on:click="{() => selectPage(Jongbusujin, '정보수집')}">
        정보수집
      </button>
      <button on:click="{() => (showModal = true)}">자산그룹별등록추세</button>
      <button>요약보고서출력</button>
      <button>상세보고서출력</button>
      <button>목록엑셀저장</button>
    </div>

    <div class="swiper_container">
      {#if currentPage}
        <svelte:component this="{currentPage}" />
      {:else if currentView === "newView"}
        {#key currentView}
          <Swiper />
        {/key}
      {:else}
        <AssetCardsPage />
      {/if}
    </div>
  </div>

  <Modal bind:showModal>
    <ModalChasanGroup />
  </Modal>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Arial", sans-serif;
  }
  /* Container and Layout Styles */
  /* Main container for layout */
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
  }
  /* Right content container */
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

  /* Sidebar Styles */
  /* Sidebar styling */
  aside {
    font-size: 16px;
    width: 100%;
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

  .menu_button:hover {
    text-decoration: underline;
  }
  .button_cont {
    display: flex;
    flex-direction: row;
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
  }

  .project_button:hover {
    transform: translateY(-2px);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Hover effect */
  }

  .project_button img {
    width: 20px; /* Slightly larger project icon */
    height: 20px;
    margin-right: 15px;
  }

  aside a {
    display: block;
    color: #495057;
    font-weight: 600;
    font-size: 16px;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  aside a:hover,
  aside a.active {
    text-decoration: underline; /* Add underline for active/hover */
  }

  .asset_button {
    background-color: #5bc0de;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    padding: 5px 10px;
    color: #ffffff;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .asset_button:hover {
    background-color: #31b0d5;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

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
    align-items: center;
    gap: 40px;
    font-weight: bold;
  }
  /* Project buttons */
  .project_button {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
    cursor: pointer;
  }

  .header_button p {
    color: #333;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .header_button p:hover {
    color: #007acc;
    text-decoration: underline;
  }

  /* Form and Select Styles */
  .form_select {
    display: flex;
    gap: 15px;
  }

  .select_container {
    display: flex;
    flex-direction: column;
  }

  .select_input {
    color: #333;
    padding: 8px 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    background-color: #ffffff;
    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease;
  }

  .select_input:hover {
    border-color: #007acc;
  }

  .select_input:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 122, 204, 0.5);
    border-color: #007acc;
  }

  /* Dropdown Arrow */
  .arrow {
    color: #ffffff;
  }

  /* Toggle Button */
  .toggle_button {
    background-color: #0056b3;
    color: #ffffff;
    padding: 10px;
    border: none;
    height: 30px;
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
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 20px;
  }

  .second_line button {
    background-color: #0056b3;
    color: #ffffff;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .second_line button:hover {
    background-color: #005fa3;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
</style>
