<script>
  import RightContainerMenu from "./RightContainerMenu.svelte";
  import AddPorject from "../AddPorject.svelte";
  import RightConainer from "../RightConainer.svelte";

  let currentView = "default";
  let currentPage = null;
  let activeMenu = null;
  let projects = ["프로젝트 1"];

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
    currentView = "pageView"; // Switch the view to indicate a specific page is selected
  };

  const addProject = () => {
    const newProjectNumber = projects.length + 1;
    projects = [...projects, `프로젝트 ${newProjectNumber}`];
  };

  const deleteProject = () => {
    if (projects.length > 0) {
      projects = projects.slice(0, -1); // Remove the last project
    }
  };
</script>

<div class="container">
  <div class="container_aside">
    <aside>
      <div class="add_delete_container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button
          on:click="{() => selectPage(AddPorject, 'add')}"
          class="menu_button primary_button">신규점검</button
        >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button class="menu_button secondary_button" on:click="{deleteProject}"
          >이력삭제</button
        >
      </div>

      {#each projects as asset, index}
        <div class="project_button">
          <!-- svelte-ignore a11y-invalid-attribute -->
          <!-- svelte-ignore missing-declaration -->
          <a
            href="javascript:void(0)"
            on:click="{() => selectPage(RightContainerMenu, asset)}"
            class="{activeMenu === asset ? 'active' : ''}"
          >
            <i class="fa fa-folder-open" aria-hidden="true"></i>
            {asset}
          </a>
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
    {#if currentView === "default"}
      <!-- svelte-ignore missing-declaration -->
      <RightConainer />
    {:else if currentPage}
      <svelte:component this="{currentPage}" />
    {/if}
  </div>
</div>

<style>
  /* General Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Container Layout */
  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100vh;
  }

  .container_aside {
    background-color: #2c3e50;
    padding: 20px;
    width: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .right_menu {
    flex-grow: 1;
    padding: 20px;
    background-color: #f4f4f4;
    overflow-y: auto;
  }

  /* Sidebar */
  aside {
    color: #fff;
    font-size: 16px;
    width: 100%;
  }

  .add_delete_container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
  }

  .project_button {
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

  .menu_button {
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    padding: 10px 15px;
    transition: background-color 0.3s ease;
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

  .social {
    margin-top: 30px;
    text-align: center;
  }

  .social a {
    display: inline-block;
    color: #fff;
    font-size: 24px;
    margin-right: 10px;
    transition: color 0.3s ease;
  }

  .social a:hover {
    color: #0077b5;
  }

  /* Add some padding to the right menu */
  .right_menu {
    padding: 20px;
    background-color: #ecf0f1;
  }

  .right_menu > * {
    margin-bottom: 20px;
  }
</style>
