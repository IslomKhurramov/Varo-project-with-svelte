<script>
  import RightContainerMenu from "./RightContainerMenu.svelte";
  import AddPorject from "../AddPorject.svelte";
  import RightConainer from "../RightConainer.svelte";
  import { onMount } from "svelte";
  import { getAllPlanLists } from "../../services/page1/planInfoService";
  import { setDeletePlan } from "../../services/page1/newInspection";

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
    console.log("+currentView:", currentView);
  }

  /**********************************/

  const selectPage = (page, project) => {
    console.log("+selectPage Running!!");
    currentPage = page;
    activeMenu = project;
    currentView = "pageView";
    selectedProjectIndex = project.ccp_index;
    tabMenu = "no";
  };

  const deleteProject = async () => {
    try {
      if (projectArray.length > 0) {
        const lastProject = projectArray[projectArray.length - 1];
        await setDeletePlan(lastProject.ccp_index);
        projectArray = projectArray.slice(0, -1);
      }
    } catch (err) {
      console.log("ERROR deleteProject:", err);
    }
  };

  $: {
    console.log("TAB PAGE: ", tabMenu);
  }
</script>

<div class="container">
  <div class="container_aside">
    <aside>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="add_delete_container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <p on:click={() => selectPage(AddPorject, "add")} class="menu_button">
          신규점검
        </p>
        <p class="menu_button" on:click={deleteProject}>이력삭제</p>
      </div>

      <div class="project_container">
        {#if loading}
          <p>Loading...</p>
        {:else if error}
          <p>Error: {error}</p>
        {:else if projectArray}
          {#each projectArray as asset, index}
            <div class="project_button">
              <img src="./images/projectGray.png" alt="project" />
              <!-- svelte-ignore a11y-invalid-attribute -->
              <a
                href="javascript:void(0)"
                on:click={() => selectPage(RightContainerMenu, asset)}
                class={activeMenu === asset ? "active" : ""}
              >
                <i class="fa fa-folder-open" aria-hidden="true"></i>
                {asset.ccp_title}
              </a>
            </div>
          {/each}
        {/if}
      </div>
    </aside>
  </div>
  <div class="right_menu">
    {#if currentView === "default"}
      <RightConainer />
    {:else if currentPage}
      <svelte:component
        this={currentPage}
        projectIndex={selectedProjectIndex}
        {currentPage}
        bind:tabMenu
      />
    {/if}
  </div>
</div>

<style>
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
    align-items: center;
    height: 40px;
    transition:
      box-shadow 0.3s ease,
      transform 0.3s ease;
    cursor: pointer;
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

  /* Right content container */
  .right_menu {
    flex-grow: 1;
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
</style>
