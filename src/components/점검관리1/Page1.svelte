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
  export function goToDefault() {
    currentPage = null;
    activeMenu = null; // Optionally reset the active menu as well
  }
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

<div div class="container">
  <div class="container_aside">
    <aside>
      <div class="add_delete_container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button
          on:click="{() => selectPage(AddPorject, 'add')}"
          class="menu_button">신규점검</button
        >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <button class="menu_button">이력삭제</button>
      </div>

      {#each projects as asset, index}
        <div class="chasanGroup_button">
          <!-- svelte-ignore a11y-invalid-attribute -->
          <!-- svelte-ignore missing-declaration -->
          <a
            href="javascript:void(0)"
            on:click="{() => selectPage(RightContainerMenu, asset)}"
            class="{activeMenu === asset ? 'active' : ''}"
          >
            <i class="fa fa-user-o" aria-hidden="true"></i>
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
      <RightConainer />
    {:else if currentPage}
      <svelte:component this="{currentPage}" />
    {/if}
  </div>
</div>

<style>
  .mainMenuButton {
    width: auto;
    font-size: 12px;
    width: 70px;

    cursor: pointer;
    background-color: #2c3e50;
    color: #fff;
    border: none;
  }
  .mainMenuButton:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }

  .container_aside {
    min-height: 100vh;
    background-image: linear-gradient(30deg, #0048bd, #2c3e50);
    padding: 10px;
  }

  aside {
    color: #fff;
    width: 170px;
    font-size: 16px;
  }

  .add_delete_container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .menu_button {
    background-color: #2c3e50;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    transition: background-color 0.3s ease;
  }

  .menu_button:hover {
    background-color: #003366;
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }

  .chasanGroup_button {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .chasanGroup_button a {
    flex-grow: 1;
    font-size: 14px;
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    -webkit-tap-highlight-color: transparent;
  }

  .social {
    margin-top: 20px;
  }

  .social a {
    display: inline-block;
    color: #fff;
    font-size: 18px;
    margin-right: 10px;
    transition: color 0.3s ease;
  }

  .social a:hover {
    color: #0077b5;
  }
  aside a {
    font-size: 16px;
    color: #fff;
    display: block;
    padding: 12px 10px;
    font-weight: 600;
    -webkit-tap-highlight-color: transparent;
  }

  aside a:hover {
    margin-top: 3px;
    text-decoration: underline;
  }
  aside a:hover,
  aside a.active {
    text-decoration: underline;
    margin-top: 3px;
  }

  aside a i {
    margin-right: 5px;
  }

  aside a:hover::after {
    content: "";
    position: absolute;
    background-color: transparent;
    bottom: 100%;
    right: 0;
    height: 35px;
    width: 35px;
    /* border-bottom-right-radius: 18px; */
    box-shadow: 0 20px 0 0 #fff;
  }

  aside a:hover::before {
    content: "";
    position: absolute;
    background-color: transparent;
    top: 38px;
    right: 0;
    height: 35px;
    width: 35px;
    /* border-top-right-radius: 18px; */
    box-shadow: 0 -20px 0 0 #fff;
  }

  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-left: 20px;
  }

  .right_menu {
    width: 100%;
  }

  .add_delete_container {
    display: flex;
    flex-direction: row;
    z-index: 1000;
    justify-content: space-around;
    width: 100%;
  }
  .add_delete_container button {
    width: auto;
    font-size: 12px;
    width: 70px;

    cursor: pointer;
    background-color: #2c3e50;
    color: #fff;
    border: none;
  }
  .add_delete_container button:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
</style>
