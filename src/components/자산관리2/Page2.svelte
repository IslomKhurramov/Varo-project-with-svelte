<script>
  import AssetCardsPage from "./AssetCardsPage.svelte";
  import Modal from "../../shared/Modal.svelte";
  import ModalChasanGroup from "./ModalChasanGroup.svelte";
  import Swiper from "./Swiper.svelte";
  import AssetManagement from "./AssetManagement.svelte";
  import Jongbusujin from "./Jongbusujin.svelte";

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
  }
</script>

<main class="container">
  <div class="container_aside">
    <aside>
      <div class="add_delete_container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button
          class="menu_button"
          on:click="{() => {
            addProject();
          }}">신규점검</button
        >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button class="menu_button">이력삭제</button>
      </div>

      {#each assets as asset, index}
        <div class="chasanGroup_button">
          <!-- svelte-ignore a11y-invalid-attribute -->
          <!-- svelte-ignore missing-declaration -->
          <a
            href="javascript:void(0)"
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
      <button>자산상세검색</button>
      <button on:click="{() => selectPage(Jongbusujin, '정보수집')}"
        >정보수집</button
      >
    </div>
    <div class="second_line">
      <button on:click="{() => (showModal = true)}">자산그룹별등록추세</button>
      <button>요약보고서출력</button>
      <button>상세보고서출력</button>
      <button>목록엑셀저장</button>
    </div>

    <div class="swiper_container">
      {#if currentPage}
        <svelte:component this="{currentPage}" />
      {:else if currentView === "newView"}
        <Swiper />
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
    background-color: #1e1e2f; /* Darker background for the sidebar */
    padding: 15px;
    border-radius: 5px;
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
    justify-content: flex-start;
    box-sizing: border-box;
    /* padding: 20px; */
    background-color: #f5f5f5; /* Light background for main content area */
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

  .chasanGroup_button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  /* Sidebar Links */
  aside a {
    font-size: 14px;
    color: #ffffff;
    display: block;
    padding: 12px 15px;
    font-weight: 600;
    text-decoration: none;
    background-color: #1e1e2f; /* Matching sidebar color */
    border-radius: 5px;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
    margin-bottom: 10px;
  }

  aside a:hover,
  aside a.active {
    color: #1e1e2f;
    background-color: #ffffff;
    text-decoration: underline;
  }

  aside a i {
    margin-right: 10px;
  }

  /* Buttons */
  .menu_button,
  .asset_button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    transition:
      background-color 0.3s ease,
      transform 0.3s ease;
    background-color: #007acc;
    color: #ffffff;
  }

  .menu_button:hover,
  .asset_button:hover {
    background-color: #005fa3;
    transform: translateY(-2px);
  }

  .asset_button {
    background-color: #d9534f;
    padding: 5px 10px;
    font-size: 12px;
    margin-left: 10px;
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
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #2c3e50; /* Blue background for the header */
    color: #ffffff;
    border-radius: 5px;
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

  /* Form and Select Styles */
  .form_select {
    display: flex;
    gap: 20px;
  }

  .select_container {
    display: flex;
    flex-direction: column;
  }

  .select_input {
    background-color: #1e1e2f;
    color: #ffffff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .select_input:hover {
    background-color: #27293d;
  }

  .select_input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #007acc;
  }

  /* Header Buttons */
  .header_button p {
    color: #ffffff;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .header_button p:hover {
    color: #003366;
    text-decoration: underline;
  }

  /* Dropdown Arrow */
  .arrow {
    color: #ffffff;
  }

  /* Toggle Button */
  .toggle_button {
    background-color: #1e1e2f;
    color: #ffffff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }

  .toggle_button:hover {
    background-color: #27293d;
  }

  /* Second Line Styles */
  .second_line {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 20px;
    margin-top: 15px;
  }

  .second_line button {
    background-color: #007acc;
    color: #ffffff;
    border-radius: 5px;
    height: 40px;
    width: 150px;
    cursor: pointer;
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .second_line button:hover {
    background-color: #005fa3;
    transform: translateY(-2px);
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>
