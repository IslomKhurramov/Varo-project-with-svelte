<script>
  import RightContainerMenu from "./RightContainerMenu.svelte";
  import AddPorject from "../AddPorject.svelte";
  import RightConainer from "../RightConainer.svelte";
  import { onMount } from "svelte";
  import { getAllPlanLists } from "../../services/page1/planInfoService";
  import { setDeletePlan } from "../../services/page1/newInspection";
  import { userData } from "../../stores/user.store";
  import Tooltip from "../../shared/Tooltip.svelte";
  import {
    confirmDelete,
    confirmSureDelete,
    errorAlert,
  } from "../../shared/sweetAlert";
  import { navigate } from "svelte-routing";
  import { decryptData } from "../../services/login/loginService";

  let currentView = "default";
  let currentPage = null;
  let activeMenu = null;
  let parentIndex = null;
  let projectData = {};
  let projectArray = [];
  let loading = true;
  let error = null;
  let selectedProjectIndex = null;
  let tabMenu = null;

  let search = {
    page_cnt: "1",
    list_cnt: "10000000000000",
  };

  onMount(async () => {
    try {
      loading = true;
      projectData = await getAllPlanLists(search);
    } catch (err) {
      error = err.message;
      await errorAlert(error);
    } finally {
      loading = false;
    }
  });

  const dataRefetch = async () => {
    try {
      loading = true;
      projectData = await getAllPlanLists(search);
    } catch (error) {
      error = err.message;
      await errorAlert(error);
    } finally {
      loading = false;
    }
  };

  /**********************************/
  let plan_index = "";
  const selectPage = (page, project) => {
    currentPage = page;
    plan_index = project.ccp_index;
    activeMenu = project.ccp_index;
    parentIndex = project?.ccp_index_parent;
    currentView = "pageView";
    selectedProjectIndex = project.ccp_index;
    tabMenu = "no";
  };

  const deleteProject = async () => {
    try {
      const confirm = await confirmDelete();
      if (confirm) {
        await setDeletePlan(selectedProjectIndex);
        navigate(window.location?.pathname == "/" ? "/page1" : "/");
      }
    } catch (err) {}
  };
</script>

{#if loading}
  <div class="loading-overlay">
    <div class="loading-spinner"></div>
  </div>
{/if}

<section>
  <article class="sideMenu" style="height: calc(100vh - 134px);">
    <div class="btnWrap">
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <a
        class={`btn btnPrimary ${activeMenu == "add" ? "buttonActive" : ""}`}
        on:click={() => selectPage(AddPorject, "add")}
      >
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="./assets/images/add.svg" />
        신규점검
      </a>
      <button
        type="button"
        class="btn btnRed"
        on:click={deleteProject}
        disabled={!selectedProjectIndex}
      >
        <img src="./assets/images/delete.svg" />
        점검삭제
      </button>
    </div>
    <ul
      class="prMenuList"
      style="overflow-y: scroll;height: 92%; overlow-x:hidden;"
    >
      {#if projectData?.data && projectData?.data?.length !== 0}
        {#each projectData?.data as project, index}
          <li class={activeMenu === project.ccp_index ? "active" : ""}>
            {#if project?.ccp_index_parent == 0}
              <a
                href="javascript:void(0)"
                on:click={() => selectPage(RightContainerMenu, project)}
                title={project.ccp_title}
              >
                <span
                  style="white-space: nowrap;overflow: hidden; text-overflow: ellipsis;"
                >
                  {project.ccp_title}
                </span>
                <span class="tooltip">{project.ccp_title}</span>
                <span class="arrowIcon"></span></a
              >
            {/if}
            {#if activeMenu === project.ccp_index || parentIndex === project.ccp_index}
              <ul class="submenu" style="background: none;padding-left: 10px;">
                {#each projectData?.data as data}
                  {#if project.ccp_index == data?.ccp_index_parent}
                    <li class="active">
                      <a
                        href="javascript:void(0);"
                        on:click={() => selectPage(RightContainerMenu, data)}
                        style={`background: none; color: #9197b3;font-size: 14px; white-space: nowrap;overflow: hidden; text-overflow: ellipsis; ${activeMenu == data.ccp_index && "color: rgb(0 114 253); font-weight: bold;"}`}
                        >- {data.ccp_title}</a
                      >
                    </li>
                  {/if}
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      {/if}
    </ul>
  </article>

  {#if currentView === "default"}
    <RightConainer selectPageMain={selectPage} bind:activeMenu {dataRefetch} />
  {:else if currentPage}
    <svelte:component
      this={currentPage}
      projectIndex={selectedProjectIndex}
      {currentPage}
      bind:tabMenu
      {plan_index}
      {dataRefetch}
    />
  {/if}
</section>

<style>
  .submenu {
    display: block;
    background-color: #f7fafc;
    padding-left: 50px;
  }
  .submenu .active a {
    color: #0067ff;
    display: block;
    font-size: 14px;
    padding: 10px 12px;
    font-weight: 400;
  }
  .buttonActive {
    background-color: #0067ff;
    color: #fff;
    transition-duration: 0.2s;
  }
  .buttonActive img {
    filter: brightness(0) invert(1);
  }

  a {
    position: relative;
  }
  .btn:hover {
    color: #fff;
    background-color: #0067ff;
  }

  /* Tooltip styling */
  .tooltip {
    visibility: hidden; /* Hidden by default */
    width: 87%; /* Width of the tooltip */
    background-color: rgba(0, 0, 0, 0.7); /* Background color of the tooltip */
    color: #fff; /* Text color */
    text-align: center; /* Center text */
    border-radius: 4px; /* Rounded corners */
    padding: 5px; /* Padding inside tooltip */
    position: absolute; /* Absolute positioning */
    z-index: 1; /* On top of other elements */
    bottom: 125%; /* Position above the button */
    opacity: 0; /* Initial opacity */
    transition: opacity 0.2s ease; /* Transition effect */
    z-index: 9999 !important;
  }

  /* Show the tooltip on hover */
  a:hover .tooltip {
    visibility: visible; /* Show tooltip */
    opacity: 1; /* Fade in the tooltip */
  }

  * {
    font-size: 16px;
  }

  .btn:hover img {
    filter: brightness(0) invert(1);
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
