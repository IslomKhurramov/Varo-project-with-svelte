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

<main class="container">
  <div class="container_aside">
    <aside>
      <div class="add_delete_container">
        <button class="menu_button add_button" on:click="{addProject}"
          >신규점검</button
        >
        <button class="menu_button delete_button">이력삭제</button>
      </div>

      {#each assets as asset, index}
        <div class="chasanGroup_button">
          <!-- svelte-ignore missing-declaration -->
          <a
            href="#"
            on:click="{() => selectPage(AssetPage, asset)}"
            class="{activeMenu === asset ? 'active' : ''}"
          >
            <i class="fa fa-user-o" aria-hidden="true"></i>
            {asset}
          </a>
          <button
            class="asset_button"
            on:click="{() => selectPage(AssetManagement, '자산관리')}"
            >자산관리</button
          >
        </div>
      {/each}

      <div class="social">
        <a
          href="https://www.linkedin.com/in/florin-cornea-b5118057/"
          target="_blank"
        >
          <i class="fa fa-linkedin"></i>
        </a>
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
</main>

<style>
  /* Container and Layout Styles */
  .container_aside {
    min-height: 100vh;
    background-color: #2c3e50;
    padding: 20px;
  }

  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
  }

  .right_menu {
    width: 100%;
    min-height: 500px;
    display: flex;
    flex-direction: column;
    background-color: #f7f8fa;
    padding: 20px;
    box-sizing: border-box;
    border-left: 1px solid #e0e0e0;
  }

  /* Sidebar Styles */
  aside {
    color: #ffffff;
    width: 200px;
    font-size: 16px;
  }

  .add_delete_container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
  }

  .add_button {
    background-color: #2980b9;
  }

  .delete_button {
    background-color: #e74c3c;
  }
  .add_button:hover {
    background-color: #1f6391;
  }

  .delete_button:hover {
    background-color: #c0392b;
  }

  .menu_button {
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    padding: 10px 15px;
    color: #ffffff;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
  }

  .menu_button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .chasanGroup_button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  aside a {
    font-size: 14px;
    color: #ffffff;
    display: block;
    font-weight: 600;
    text-decoration: none;
    padding: 10px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  aside a:hover,
  aside a.active {
    background-color: #53677a;
  }

  aside a i {
    margin-right: 10px;
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

  /* Social Links */
  .social {
    margin-top: 30px;
  }

  .social a {
    display: inline-block;
    color: #ffffff;
    font-size: 20px;
    margin-right: 10px;
    transition: color 0.3s ease;
  }

  .social a:hover {
    color: #0077b5;
  }

  /* Header Styles */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: #ffffff;
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
    background-color: #007acc;
    color: #ffffff;
    padding: 10px;
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
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-bottom: 20px;
  }

  .second_line button {
    background-color: #007acc;
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
