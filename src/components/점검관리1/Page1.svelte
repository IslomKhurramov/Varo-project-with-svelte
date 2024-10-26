<script>
  import RightContainerMenu from "./RightContainerMenu.svelte";
  import AddPorject from "../AddPorject.svelte";
  import RightConainer from "../RightConainer.svelte";
  import { onMount } from "svelte";
  import { getAllPlanLists } from "../../services/page1/planInfoService";
  import { setDeletePlan } from "../../services/page1/newInspection";
  import { userData } from "../../stores/user.store";
  import Tooltip from "../../shared/Tooltip.svelte";
  import { confirmSureDelete } from "../../shared/sweetAlert";

  let currentView = "default";
  let currentPage = null;
  let activeMenu = null;
  let projectData = {};
  let projectArray = [];
  let loading = true;
  let error = null;
  let selectedProjectIndex = null;
  let tabMenu = null;

  onMount(async () => {
    try {
      projectData = await getAllPlanLists();
      projectArray = Object.values(projectData); // Convert object to array
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  $: {
    console.log("$userData2:", $userData);
    console.log("projectData:", projectData);
    console.log("projectArray:", projectArray);
  }

  /**********************************/

  const selectPage = (page, project) => {
    console.log("+selectPage Running!!");
    currentPage = page;
    activeMenu = project.ccp_index;
    currentView = "pageView";
    selectedProjectIndex = project.ccp_index;
    tabMenu = "no";
  };

  const deleteProject = async () => {
    try {
      const confirm = await confirmSureDelete();
      console.log("+confirm:", confirm);
      if (confirm) {
        if (projectArray.length > 0) {
          const lastProject = projectArray[projectArray.length - 1];
          await setDeletePlan(lastProject.ccp_index);
          projectArray = projectArray.slice(0, -1);
        }
      }
    } catch (err) {
      console.log("ERROR deleteProject:", err);
    }
  };

  $: {
    console.log("activeMenu:", activeMenu);
  }
</script>

<section>
  <article
    class="sideMenu"
    style="overflow: auto; height: calc(100vh - 134px);"
  >
    <div class="btnWrap">
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <a
        class={`btn btnPrimary ${activeMenu == "add" ? "buttonActive" : ""}`}
        on:click={() => selectPage(AddPorject, "add")}
      >
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="./assets/images/icon/add.svg" />
        신규점검
      </a>
      <button type="button" class="btn btnRed" on:click={deleteProject}>
        <img src="./assets/images/icon/delete.svg" />
        점검삭제
      </button>
    </div>
    <ul class="prMenuList">
      {#if projectArray && projectArray?.length !== 0}
        {#each projectArray as project, index}
          <li class={activeMenu === project.ccp_index ? "active" : ""}>
            <!-- <Tooltip text={project.ccp_title}> -->
            <a
              href="javascript:void(0)"
              on:click={() => selectPage(RightContainerMenu, project)}
            >
              <span
                style="white-space: nowrap;overflow: hidden; text-overflow: ellipsis;"
              >
                {project.ccp_title}
              </span>
              <span class="tooltip">{project.ccp_title}</span>
              <span class="arrowIcon"></span></a
            >
            <!-- </Tooltip> -->
          </li>
        {/each}
      {/if}
    </ul>
  </article>

  {#if currentView === "default"}
    <RightConainer selectPageMain={selectPage} bind:activeMenu />
  {:else if currentPage}
    <svelte:component
      this={currentPage}
      projectIndex={selectedProjectIndex}
      {currentPage}
      bind:tabMenu
    />
  {/if}
</section>

<style>
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
</style>
