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
        <button class="project_button" on:click="{() => toggleList('project')}"
          >프로젝트별</button
        >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button class="asset_button" on:click="{() => toggleList('asset')}"
          >자산별</button
        >
      </div>
      <div>
        <button
          class="project_button"
          on:click="{() => selectPage(WholePage, '전체')}">전체</button
        >
      </div>

      {#if showProject}
        {#each Project as project, index}
          <div class="chasanGroup_button">
            <!-- svelte-ignore a11y-invalid-attribute -->
            <!-- svelte-ignore missing-declaration -->
            <a
              href="javascript:void(0)"
              on:click="{() => selectPage(MainPageProject, project)}"
              class="{activeMenu === project ? 'active' : ''}"
            >
              <i class="fa fa-user-o" aria-hidden="true"></i>
              {project}
            </a>
          </div>
        {/each}
      {:else}
        {#each Asset as asset, index}
          <div class="chasanGroup_button">
            <!-- svelte-ignore a11y-invalid-attribute -->
            <!-- svelte-ignore missing-declaration -->
            <a
              href="javascript:void(0)"
              on:click="{() => selectPage(MainPageAsset, asset)}"
              class="{activeMenu === asset ? 'active' : ''}"
            >
              <i class="fa fa-user-o" aria-hidden="true"></i>
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
  /* Container and Layout Styles */
  .container_aside {
    min-height: 100vh;
    background-color: #2c3e50;
    padding: 10px;
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
    background-color: #f2f3f4; /* Light background for main content area */
  }

  /* Sidebar Styles */
  aside {
    color: #ffffff;
    width: 170px;
    font-size: 16px;
  }

  .project_asset_container_buttons {
    display: flex;
    flex-direction: row;
    gap: 10px;
    margin-bottom: 30px;
  }

  .chasanGroup_button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  /* Sidebar Links */
  aside a {
    font-size: 14px;
    color: #fff;
    display: block;
    /* padding: 12px 10px; */
    font-weight: 600;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }

  aside a:hover,
  aside a.active {
    margin-top: 3px;
    text-decoration: underline;
  }

  aside a i {
    margin-right: 10px;
  }

  /* Buttons */
  .project_button,
  .asset_button {
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    transition: background-color 0.3s ease;
    background-color: #2c3e50;
    color: #fff;
  }

  .project_button:hover,
  .asset_button:hover {
    background-color: #003366;
    box-shadow: 0.5px 1px 0.5px 1px #161515;
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

    color: #000000;
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
    color: #000000;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .select_input:hover {
    background-color: #b0b0b0;
  }

  .select_input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #007acc;
  }

  /* Header Buttons */
  .header_button p {
    color: #000000;
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
    background-color: #003366;
    color: #ffffff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    height: 30px;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }

  .toggle_button:hover {
    background-color: #27293d;
  }
</style>
