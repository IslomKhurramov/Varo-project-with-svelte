<script>
  import RightContainerMenu from "./RightContainerMenu.svelte";
  import AddPorject from "../AddPorject.svelte";
  import RightConainer from "../RightConainer.svelte";
  let currentPage = null;
  let activeMenu = null;
  let projects = ["프로젝트 1"];

  const selectPage = (page, menu) => {
    currentPage = page;
    activeMenu = menu;
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

<div div class="container">
  <div class="MainPage">
    <div class="container_aside">
      <aside>
        <div class="add_delete_container">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <button on:click="{() => selectPage(AddPorject, 'add')}"
            >신규점검</button
          >
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <button>이력삭제</button>
        </div>
        <div>
          <button
            class="mainMenuButton"
            on:click="{() => selectPage(RightConainer, 'RightConainer')}"
            >점검관리</button
          >
        </div>

        {#each projects as project, index}
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a
            href="javascript:void(0)"
            on:click="{() => selectPage(RightContainerMenu, project)}"
            class="{activeMenu === project ? 'active' : ''}"
          >
            <i class="fa fa-user-o" aria-hidden="true"></i>
            {project}
          </a>
        {/each}
      </aside>

      <div class="social">
        <a
          href="https://www.linkedin.com/in/florin-cornea-b5118057/"
          target="_blank"
        >
          <i class="fa fa-linkedin"></i>
        </a>
      </div>
    </div>
  </div>

  {#if currentPage}
    <div class="right_menu">
      <svelte:component this="{currentPage}" />
    </div>
  {/if}
</div>

<style>
  .mainMenuButton {
    width: auto;
    font-size: 12px;
    width: 130px;

    cursor: pointer;
    background-color: #2c3e50;
    color: #fff;
    border: none;
  }
  .mainMenuButton:hover {
    box-shadow: 0.5px 1px 0.5px 1px #161515;
  }
  .container_aside {
    margin-left: 10px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  }
  aside {
    color: #fff;
    width: 130px;
    font-size: 16px;
    height: 130vh;
    background-color: #2c3e50;
    /* background-image: linear-gradient(30deg, #a2c5fe, #2c3e50); */
  }
  .add_delete_container {
    padding-bottom: 10px;
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
  }

  .right_menu {
    width: 100%;
  }

  .add_delete_container {
    display: flex;
    flex-direction: row;

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
  .MainPage {
    display: flex;
    flex-direction: row;
  }
</style>
