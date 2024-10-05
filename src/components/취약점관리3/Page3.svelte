<script>
  import {
    getVulnsOfAsset,
    getVulnsOfPlan,
  } from "./../../services/vulns/vulnsService.js";
  import MainPageProject from "./MainPageProject.svelte";
  import MainPageAsset from "./MainPageAsset.svelte";
  import WholePage from "./WholePage.svelte";
  import { onMount } from "svelte";
  import { each } from "svelte/internal";
  import { get } from "svelte/store";

  let currentView = "default";
  let setView = "plan";
  let currentPage = null;
  let activeMenu = null;
  let showProject = true;
  let tableData;
  let vulnerabilityStatusValue;
  let vulnerabilityStatus;
  let actionStatusValue;
  let actionStatus;

  let search = {
    plan_index: "",
    asset_target_uuid: "",
  };

  // DATA
  let plans = [];
  let assets = [];

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
    currentView = "pageView";
  };

  function toggleView() {
    currentView = currentView === "default" ? "newView" : "default";
    currentPage = null;
    console.log("Current View:", currentView);
  }

  function toggleList(view) {
    showProject = view === "project";
  }

  let activePlan = null; // Track which plan is expanded

  function toggleAccordion(plan) {
    activePlan = activePlan === plan ? null : plan; // Toggle accordion
  }

  onMount(async () => {
    plans = await getVulnsOfPlan();
    tableData = plans?.vulns;

    assets = await getVulnsOfAsset(search);
  });

  const getPlanDataSearch = async () => {
    plans = await getVulnsOfPlan(search);
    tableData = plans?.vulns;
    vulnerabilityStatus = vulnerabilityStatusValue;
    actionStatus = actionStatusValue;
  };
</script>

<main class="container">
  <div class="container_aside">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <aside>
      <div class="add_delete_container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p
          class="menu_button"
          on:click={() => {
            toggleList("project");
            tableData = plans?.vulns;
            search = {
              plan_index: "",
              asset_target_uuid: "",
            };
            setView = "plan";
          }}
        >
          프로젝트별
        </p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p
          class="menu_button"
          on:click={() => {
            toggleList("asset");
            tableData = assets?.vulns;
            search = {
              plan_index: "",
              asset_target_uuid: "",
            };
            setView = "plan";
          }}
        >
          자산별
        </p>
      </div>
      <!-- <div>
        <p
          class="switch_button1"
          on:click={() => selectPage(WholePage, "전체")}
        >
          전체
        </p>
      </div> -->

      {#if showProject}
        <div class="project_container">
          {#if plans && plans?.plans && plans?.plans?.length !== 0}
            {#each plans?.plans as plan, index}
              <div class="project_button">
                <div
                  class="accordion_header"
                  on:click={() => {
                    toggleAccordion(plan);
                    selectPage(MainPageProject, plan);
                  }}
                >
                  <img src="./images/projectGray.png" alt="project" />
                  <a
                    href="javascript:void(0)"
                    class={activeMenu === plan ? "active" : ""}
                  >
                    <i class="fa fa-folder-open" aria-hidden="true"></i>
                    {plan?.plan_title}
                  </a>
                  <span class="arrow">{activePlan === plan ? "▲" : "▼"}</span>
                </div>

                {#if activePlan === plan}
                  {#each plan?.plan_target as target}
                    <div class="accordion_content">
                      {#each Object.entries(target) as [osType, hosts]}
                        <div class="main_accordion">- {osType}</div>
                        {#each hosts as host}
                          <div class="second_accordion">
                            - {host.ast_uuid__ass_uuid__ast_hostname}
                          </div>
                        {/each}
                      {/each}
                    </div>
                  {/each}
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      {:else}
        <div class="project_container">
          {#if assets && assets?.plans && assets?.plans?.length !== 0}
            {#each assets?.plans as asset, index}
              {#each asset?.plan_target as target}
                {#each Object.entries(target) as [osType, hosts]}
                  {#each hosts as host}
                    <div class="project_button asset">
                      <img src="./images/projectGray.png" alt="project" />
                      <!-- svelte-ignore missing-declaration -->
                      <!-- svelte-ignore a11y-invalid-attribute -->
                      <a
                        href="javascript:void(0)"
                        on:click={() => selectPage(MainPageAsset, asset)}
                        class={activeMenu === asset ? "active" : ""}
                      >
                        <i class="fa fa-database" aria-hidden="true"></i>
                        {host?.ast_uuid__ass_uuid__ast_hostname}
                      </a>
                    </div>
                  {/each}
                {/each}
              {/each}
            {/each}
          {/if}
        </div>
      {/if}
    </aside>
  </div>

  <div class="right_menu">
    <header class="header">
      <div class="header_option">
        <button on:click={toggleView} class="toggle_button">
          <span class="arrow">&#9662;</span>
        </button>
        <form action="/action_page.php" class="form_select">
          <div class="select_container">
            <select
              name="approval_status"
              id="approval_status"
              class="select_input"
              bind:value={search["plan_index"]}
            >
              <option value="" selected>프로젝트</option>
              {#if plans && plans?.plans && plans?.plans?.length !== 0}
                {#each plans?.plans as plan, index}
                  <option value={plan?.plan_index}> {plan?.plan_title}</option>
                {/each}
              {/if}
            </select>
          </div>
          <div class="select_container">
            <select
              name="asset_group"
              id="asset_group"
              class="select_input"
              bind:value={vulnerabilityStatusValue}
            >
              <option value="" selected>취약점현황</option>
              <option value="양호">양호</option>
              <option value="취약">취약</option>
              <option value="수동점검">수동점검</option>
              <option value="인터뷰">인터뷰</option>
            </select>
          </div>
          <div class="select_container">
            <select
              name="operating_system"
              id="operating_system"
              class="select_input"
              bind:value={actionStatusValue}
            >
              <option value="" selected>조치상태별</option>
              <option value="조치전">조치전</option>
              <option value="조치계획등록">조치계획등록</option>
              <option value="조치계획승인">조치계획승인</option>
              <option value="조치계획반려">조치계획반려</option>
              <option value="조치결과등록">조치결과등록</option>
              <option value="조치결과승인">조치결과승인</option>
              <option value="조치결과반려">조치결과반려</option>
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
        <button on:click={getPlanDataSearch}>조회</button>
        <p>엑셀다운로드</p>
      </div>
    </header>

    <div class="swiper_container">
      {#if currentView === "default"}
        <MainPageProject
          bind:tableData
          bind:vulnerabilityStatus
          bind:actionStatus
          bind:setView
        />
      {:else if currentPage}
        <svelte:component this={currentPage} />
      {/if}
    </div>
  </div>
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Arial", sans-serif;
  }

  .accordion_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    padding: 10px;
    background-color: #f1f1f1;
    transition: background-color 0.3s ease;
  }

  .accordion_header:hover {
    background-color: #e0e0e0;
  }

  .accordion_content {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    border: 1px solid #ccc;
    border-top: none;
  }

  .main_accordion {
  }

  .second_accordion {
    padding-left: 20px;
  }

  .arrow {
    font-size: 14px;
    margin-left: auto;
  }

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

  /* Sidebar styling */
  aside {
    font-size: 16px;
    width: 100%;
  }

  /* Project buttons */
  .project_button {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: auto;
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
    cursor: pointer;
  }

  .project_button.asset {
    padding: 10px 20px;
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

  .header_button {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .header_button button {
    margin-right: 15px;
    background-color: #0056b3;
    color: #ffffff;
    border: 1px solid #ffffff;
    border-radius: 5px;
    height: 30px;
    width: 120px;
    cursor: pointer;
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
  .switch_button1 {
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
  }
  .switch_button1:hover {
    text-decoration: underline;
  }
</style>
