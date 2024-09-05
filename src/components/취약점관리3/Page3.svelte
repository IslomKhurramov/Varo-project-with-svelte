<script>
  import MainPageProject from "./MainPageProject.svelte";
  import Swiper from "../자산관리2/Swiper.svelte";
  import AssetCardsPage from "../자산관리2/AssetCardsPage.svelte";
  import Modal from "../../shared/Modal.svelte";
  import ModalChasanGroup from "../자산관리2/ModalChasanGroup.svelte";
  import MainPageAsset from "./MainPageAsset.svelte";
  import WholePage from "./WholePage.svelte";

  let currentView = "default";
  let currentPage = null;
  let activeMenu = null;
  let showModal = false;

  let Project = ["프로젝트 1", "프로젝트 2", "프로젝트 3"];
  let Asset = ["자산 1", "자산 2", "자산 3"];

  let showProject = true; // Initially show Project by default

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

  function toggleList(view) {
    showProject = view === "project";
  }
</script>

<main class="container">
  <div class="container_aside">
    <aside>
      <div class="project_asset_container_buttons">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button
          class="switch_button primary_button"
          on:click="{() => toggleList('project')}"
        >
          프로젝트별
        </button>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button
          class="switch_button secondary_button"
          on:click="{() => toggleList('asset')}"
        >
          자산별
        </button>
      </div>
      <div>
        <button
          class="switch_button1"
          on:click="{() => selectPage(WholePage, '전체')}"
        >
          전체
        </button>
      </div>

      {#if showProject}
        {#each Project as project, index}
          <div class="chasanGroup_button">
            <!-- svelte-ignore missing-declaration -->
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a
              href="javascript:void(0)"
              on:click="{() => selectPage(MainPageProject, project)}"
              class="{activeMenu === project ? 'active' : ''}"
            >
              <i class="fa fa-folder-open" aria-hidden="true"></i>
              {project}
            </a>
          </div>
        {/each}
      {:else}
        {#each Asset as asset, index}
          <div class="chasanGroup_button">
            <!-- svelte-ignore missing-declaration -->
            <!-- svelte-ignore a11y-invalid-attribute -->
            <a
              href="javascript:void(0)"
              on:click="{() => selectPage(MainPageAsset, asset)}"
              class="{activeMenu === asset ? 'active' : ''}"
            >
              <i class="fa fa-database" aria-hidden="true"></i>
              {asset}
            </a>
          </div>
        {/each}
      {/if}

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
              <option value="pending">프로젝트</option>
              <option value="approved">운영체제</option>
              <option value="rejected">에이전트여부</option>
              <option value="rejected">등록승인여부</option>
            </select>
          </div>
          <div class="select_container">
            <select name="asset_group" id="asset_group" class="select_input">
              <option value="network">취약점현황</option>
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
              <option value="windows">조치상태별</option>
              <option value="linux">Linux</option>
              <option value="macos">macOS</option>
            </select>
          </div>
          <div class="select_container">
            <select name="agent_status" id="agent_status" class="select_input">
              <option value="active">담당자별</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </form>
      </div>
      <div class="header_button">
        <p>엑셀다운로드</p>
      </div>
    </header>

    <div class="swiper_container">
      <svelte:component this="{currentPage}" />
    </div>
  </div>
</main>

<style>
  /* General Container and Layout */
  .container {
    display: flex;
    width: 100%;
  }

  .container_aside {
    min-height: 100vh;
    background-color: #2c3e50;
    padding: 20px;
    width: 220px;
    box-sizing: border-box;
  }

  .right_menu {
    width: calc(100% - 220px);
    min-height: 100vh;
    background-color: #f2f3f4;
    padding: 20px;
    display: flex;
    flex-direction: column;
  }

  /* Sidebar Styles */
  aside {
    color: #ffffff;
    font-size: 16px;
  }

  .project_asset_container_buttons {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
  }
  .primary_button {
    background-color: #2980b9;
    color: #fff;
  }

  .primary_button:hover {
    background-color: #1f6391;
  }

  .secondary_button {
    background-color: #e74c3c;
    color: #fff;
  }

  .secondary_button:hover {
    background-color: #c0392b;
  }

  .switch_button {
    flex-grow: 1;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease;
  }

  .switch_button:hover {
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .switch_button1 {
    flex-grow: 1;
    background-color: #003366;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
    transition:
      background-color 0.3s ease,
      box-shadow 0.3s ease;
  }

  .switch_button1:hover {
    background-color: #05498e;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .chasanGroup_button {
    margin-bottom: 15px;
  }

  aside a {
    font-size: 14px;
    color: #fff;
    display: block;
    padding: 10px 15px;
    font-weight: 600;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  aside a:hover,
  aside a.active {
    background-color: #34495e;
  }

  aside a i {
    margin-right: 10px;
  }

  /* Social Links */
  .social {
    margin-top: 30px;
  }

  .social a {
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
    background-color: #ffffff;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .header_option {
    display: flex;
    gap: 20px;
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
    padding: 10px;
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
    color: #003366;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s ease;
  }

  .header_button p:hover {
    color: #005ea3;
    text-decoration: underline;
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

  /* Content Container */
  .swiper_container {
    flex-grow: 1;
    margin-top: 20px;
  }
</style>
